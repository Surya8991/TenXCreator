import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function streamGemini(
  systemPrompt: string,
  messages: { role: 'user' | 'model'; content: string }[],
  ragContext?: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const fullSystemPrompt = ragContext
    ? `${systemPrompt}\n\n---\nRELEVANT DATA (use when answering):\n${ragContext}`
    : systemPrompt;

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    systemInstruction: fullSystemPrompt,
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  return result.stream;
}

export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
