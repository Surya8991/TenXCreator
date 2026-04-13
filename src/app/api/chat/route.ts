import { NextRequest } from 'next/server';
import { streamLLM, type Message } from '@/lib/llm/provider';
import { routeMessage, getSystemPromptWithMode, type DomainTag } from '@/lib/router';
import { getRAGContext } from '@/lib/rag/search';
import { LIMITS, getStageLabel } from '@/lib/constants';

export const runtime = 'nodejs';

// Server-side rate limiting per IP with automatic cleanup
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (ipRequests.size > 1000) {
    for (const [key, val] of ipRequests) {
      if (now > val.resetAt) ipRequests.delete(key);
    }
  }
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + LIMITS.serverRateWindowMs });
    return true;
  }
  if (entry.count >= LIMITS.serverRateLimit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), { status: 429 });
  }

  try {
    const body = await req.json();
    const {
      messages,
      mode,
      creatorStage,
      creatorNiche,
      creatorCountry,
      creatorPlatforms,
    } = body as {
      messages: Message[];
      mode?: string;
      creatorStage?: number;
      creatorNiche?: string;
      creatorCountry?: string;
      creatorPlatforms?: string[];
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages required' }), { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // Get system prompt — unified advisor, optionally with mode
    let systemPrompt: string;
    let domainTag: DomainTag;

    if (mode) {
      const result = getSystemPromptWithMode(mode, lastMessage);
      systemPrompt = result.systemPrompt;
      domainTag = result.domainTag;
    } else {
      const result = routeMessage(lastMessage);
      systemPrompt = result.systemPrompt;
      domainTag = result.domainTag;
    }

    // Inject creator context
    const contextParts: string[] = ['\n\n--- CREATOR PROFILE (reference in EVERY response) ---'];
    if (creatorStage) contextParts.push(`Stage: ${creatorStage} — ${getStageLabel(creatorStage)}`);
    if (creatorNiche) contextParts.push(`Niche: ${creatorNiche}`);
    if (creatorCountry) contextParts.push(`Country: ${creatorCountry}`);
    if (creatorPlatforms?.length) contextParts.push(`Active platforms: ${creatorPlatforms.join(', ')}`);
    contextParts.push('\nRULES: Reference their stage/niche/country/platforms. Give specific numbers. End with next step + follow-up question. On first message, ask diagnostic questions first.');
    systemPrompt += contextParts.join('\n');

    // RAG context with country
    const ragContext = getRAGContext(lastMessage, domainTag, creatorCountry);

    // Stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send domain tag as first chunk (for UI badge)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'domain', tag: domainTag })}\n\n`)
          );

          const llmStream = streamLLM(systemPrompt, messages, ragContext);
          for await (const chunk of llmStream) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`)
            );
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errMsg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
