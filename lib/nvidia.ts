/**
 * OpenAI-compatible chat client for NVIDIA Nemotron 3 Ultra.
 * Supports NVIDIA NIM or OpenRouter (same model slug).
 * Keys stay server-side only (.env.local).
 */

export const NVIDIA_DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';
export const NVIDIA_DEFAULT_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
};

export type ToolCall = {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
};

export type ChatToolDefinition = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ChatCompletionChoice = {
  message: {
    role: string;
    content: string | null;
    tool_calls?: ToolCall[];
  };
  finish_reason?: string;
};

export type ChatCompletionResponse = {
  choices: ChatCompletionChoice[];
  error?: { message?: string };
};

export function getNvidiaConfig() {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  // OpenRouter keys (sk-or-v1-...) default to OpenRouter base URL
  const isOpenRouterKey = Boolean(apiKey?.startsWith('sk-or-'));
  const baseUrl = (
    process.env.NVIDIA_BASE_URL ||
    (isOpenRouterKey ? OPENROUTER_BASE_URL : NVIDIA_DEFAULT_BASE_URL)
  ).replace(/\/$/, '');
  const model = process.env.NVIDIA_MODEL || NVIDIA_DEFAULT_MODEL;
  return {
    apiKey,
    baseUrl,
    model,
    isOpenRouter: isOpenRouterKey || baseUrl.includes('openrouter.ai'),
  };
}

export async function nvidiaChatCompletion(params: {
  messages: ChatMessage[];
  tools?: ChatToolDefinition[];
  temperature?: number;
  maxTokens?: number;
  toolChoice?: 'auto' | 'none' | 'required';
}): Promise<ChatCompletionResponse> {
  const { apiKey, baseUrl, model, isOpenRouter } = getNvidiaConfig();

  if (!apiKey) {
    throw new Error(
      'NVIDIA_API_KEY is not set. Add it to your .env.local file (see .env.example).'
    );
  }

  const body: Record<string, unknown> = {
    model,
    messages: params.messages,
    temperature: params.temperature ?? 0.6,
    top_p: 0.95,
    max_tokens: params.maxTokens ?? 4096,
    stream: false,
  };

  if (params.tools?.length) {
    body.tools = params.tools;
    body.tool_choice = params.toolChoice ?? 'auto';
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // OpenRouter recommends these optional headers
  if (isOpenRouter) {
    headers['HTTP-Referer'] = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
    headers['X-Title'] = process.env.OPENROUTER_APP_NAME || 'SoftCV Agent';
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as ChatCompletionResponse & { message?: string };

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      (data as { message?: string }).message ||
      `LLM API error (${res.status})`;
    throw new Error(msg);
  }

  if (!data.choices?.length) {
    throw new Error('LLM API returned no choices');
  }

  return data;
}
