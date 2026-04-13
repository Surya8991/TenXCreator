import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function streamGroq(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  ragContext?: string
) {
  const fullSystemPrompt = ragContext
    ? `${systemPrompt}\n\n---\nRELEVANT DATA (use when answering):\n${ragContext}`
    : systemPrompt;

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: fullSystemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ],
    stream: true,
    max_tokens: 4096,
  });

  return stream;
}
