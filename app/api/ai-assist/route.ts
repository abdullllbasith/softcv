import { NextResponse } from 'next/server';
import { nvidiaChatCompletion } from '@/lib/nvidia';

export async function POST(req: Request) {
  try {
    const { type, text, title } = await req.json();

    if (type === 'summary') {
      const completion = await nvidiaChatCompletion({
        messages: [
          {
            role: 'system',
            content:
              'You are an expert resume writer. Rewrite the professional summary to be ATS-friendly, specific, and concise (3–5 sentences). Do not invent employers or metrics not present in the input. Return ONLY the summary text.',
          },
          {
            role: 'user',
            content: `Target title: ${title || 'Professional'}\n\nCurrent summary:\n${text || '(empty — write a strong starter based only on the title)'}`,
          },
        ],
        temperature: 0.5,
        maxTokens: 600,
      });

      const result = completion.choices[0]?.message?.content?.trim() || text;
      return NextResponse.json({ result });
    }

    if (type === 'bullet') {
      const completion = await nvidiaChatCompletion({
        messages: [
          {
            role: 'system',
            content:
              'You are an expert resume writer. Rewrite one achievement bullet with a strong action verb and clear impact. Do not invent metrics. Return ONLY the bullet text without a leading bullet character.',
          },
          {
            role: 'user',
            content: `Role/context: ${title || 'professional'}\n\nBullet to improve:\n${text || ''}`,
          },
        ],
        temperature: 0.5,
        maxTokens: 220,
      });

      const result = completion.choices[0]?.message?.content?.trim() || text;
      return NextResponse.json({ result });
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to process AI assist request';
    const status = msg.includes('NVIDIA_API_KEY') ? 503 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
