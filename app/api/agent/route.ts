import { NextResponse } from 'next/server';
import {
  nvidiaChatCompletion,
  type ChatMessage,
} from '@/lib/nvidia';
import { AGENT_SYSTEM_PROMPT, AGENT_TOOLS } from '@/lib/agent/tools';
import {
  toolCallToAction,
  parseToolArguments,
  type AgentAction,
} from '@/lib/agent/actions';
import type { ResumeData } from '@/types/resume';

const MAX_TOOL_ROUNDS = 5;

type HistoryMessage = { role: 'user' | 'assistant'; content: string };

function compactResume(data: ResumeData) {
  return {
    templateId: data.templateId,
    accentColor: data.accentColor,
    sectionOrder: data.sectionOrder,
    sectionVisibility: data.sectionVisibility,
    personalInfo: data.personalInfo,
    summary: data.summary,
    experience: data.experience.map((e) => ({
      id: e.id,
      company: e.company,
      role: e.role,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: e.bullets,
    })),
    education: data.education.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      startDate: e.startDate,
      endDate: e.endDate,
      gpa: e.gpa,
    })),
    skills: data.skills.map((s) => ({
      id: s.id,
      category: s.category,
      skills: s.skills,
    })),
    projects: data.projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      techStack: p.techStack,
      link: p.link,
      bullets: p.bullets,
    })),
    certifications: data.certifications,
    languages: data.languages,
    awards: data.awards,
    customSections: data.customSections,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const resumeData = body.resumeData as ResumeData | undefined;
    const history = (Array.isArray(body.history) ? body.history : []) as HistoryMessage[];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (!resumeData) {
      return NextResponse.json({ error: 'resumeData is required' }, { status: 400 });
    }

    const snapshot = compactResume(resumeData);
    const messages: ChatMessage[] = [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      {
        role: 'system',
        content: `Current resume snapshot (JSON):\n${JSON.stringify(snapshot)}`,
      },
      ...history
        .slice(-8)
        .filter((m) => m.content && (m.role === 'user' || m.role === 'assistant'))
        .map((m) => ({ role: m.role, content: m.content } as ChatMessage)),
      { role: 'user', content: message },
    ];

    const actions: AgentAction[] = [];
    let reply = '';

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await nvidiaChatCompletion({
        messages,
        tools: AGENT_TOOLS,
        toolChoice: 'auto',
        temperature: 0.55,
        maxTokens: 4096,
      });

      const choice = completion.choices[0];
      const assistantMsg = choice.message;
      const toolCalls = assistantMsg.tool_calls;

      if (toolCalls?.length) {
        messages.push({
          role: 'assistant',
          content: assistantMsg.content ?? null,
          tool_calls: toolCalls,
        });

        for (const call of toolCalls) {
          const args = parseToolArguments(call.function.arguments);
          const action = toolCallToAction(call.function.name, args);

          let toolResult: string;
          if (action) {
            if (action.type !== 'advise_only') {
              actions.push(action);
            } else {
              actions.push(action);
            }
            toolResult = JSON.stringify({ ok: true, action });
          } else {
            toolResult = JSON.stringify({
              ok: false,
              error: `Invalid or unknown tool args for ${call.function.name}`,
            });
          }

          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            name: call.function.name,
            content: toolResult,
          });
        }
        continue;
      }

      reply = (assistantMsg.content || '').trim();
      break;
    }

    if (!reply) {
      reply =
        actions.length > 0
          ? 'Done — I applied those updates to your live resume. Check the preview, and use Undo if you want to revert anything.'
          : 'I could not complete that request. Try rephrasing, or check that NVIDIA_API_KEY is set.';
    }

    // Dedupe advise_only noise; keep real mutations
    const filteredActions = actions.filter((a, i, arr) => {
      if (a.type === 'advise_only') {
        return arr.every((x) => x.type === 'advise_only');
      }
      return true;
    });

    return NextResponse.json({
      reply,
      actions: filteredActions,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Agent request failed';
    const status = msg.includes('NVIDIA_API_KEY') ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
