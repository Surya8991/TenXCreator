import { streamGemini } from './gemini';
import { streamGroq } from './groq';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

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
    const errMsg = error instanceof Error ? error.message : String(error);
    // Fall through to Groq on rate limit or other Gemini errors
    console.warn('Gemini failed, falling back to Groq:', errMsg);
  }

  // Fallback: Groq (free tier: 30 req/min)
  try {
    const stream = await streamGroq(systemPrompt, messages, ragContext);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Both LLM providers failed. Groq error: ${errMsg}`);
  }
}
