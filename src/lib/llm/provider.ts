import { streamGemini } from './gemini';
import { streamGroq } from './groq';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function classifyError(error: unknown): 'auth' | 'rate_limit' | 'invalid_request' | 'transient' {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  if (msg.includes('api key') || msg.includes('invalid key') || msg.includes('unauthorized') || msg.includes('403')) return 'auth';
  if (msg.includes('rate limit') || msg.includes('quota') || msg.includes('429') || msg.includes('resource_exhausted')) return 'rate_limit';
  if (msg.includes('invalid') || msg.includes('bad request') || msg.includes('400')) return 'invalid_request';
  return 'transient';
}

export async function* streamLLM(
  systemPrompt: string,
  messages: Message[],
  ragContext?: string
): AsyncGenerator<string> {
  // Try Gemini first (free tier: 1500 req/day)
  try {
    const geminiMessages = messages.map((m) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      content: m.content,
    }));

    const stream = await streamGemini(systemPrompt, geminiMessages, ragContext);

    for await (const chunk of stream) {
      const text = chunk.text();
      if (text) yield text;
    }
    return;
  } catch (error: unknown) {
    const errType = classifyError(error);
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errType === 'auth') {
      throw new Error(`Gemini API key is invalid or missing. Check GOOGLE_GEMINI_API_KEY in .env.local. (${errMsg})`);
    }
    if (errType === 'invalid_request') {
      throw new Error(`Gemini rejected the request: ${errMsg}`);
    }
    // rate_limit and transient errors fall through to Groq
    console.warn(`Gemini unavailable (${errType}), falling back to Groq:`, errMsg);
  }

  // Fallback: Groq (free tier: 30 req/min)
  try {
    const stream = await streamGroq(systemPrompt, messages, ragContext);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  } catch (error: unknown) {
    const errType = classifyError(error);
    const errMsg = error instanceof Error ? error.message : String(error);

    if (errType === 'auth') {
      throw new Error(`Groq API key is invalid or missing. Check GROQ_API_KEY in .env.local. (${errMsg})`);
    }
    throw new Error(`Both LLM providers failed. Groq error: ${errMsg}`);
  }
}
