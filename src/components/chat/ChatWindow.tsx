'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { Send, RotateCcw, Share2, Copy, Check, AlertTriangle } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ModeSelector } from './ModeSelector';
import { ShareCard } from './ShareCard';
import type { DomainTag } from '@/lib/router';
import { extractProfileFromMessages, type ProfileUpdates } from '@/lib/profile-extractor';
import { QuickReplies } from './QuickReplies';
import { VoiceInput } from './VoiceInput';
import { STORAGE_KEYS, LIMITS, safeJsonParse } from '@/lib/constants';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  domainTag?: DomainTag;
  id?: string;
};

type CreatorContext = {
  stage: number;
  niche: string;
  platforms?: string[];
  country?: string;
};

const RATE_LS_KEY = 'tenx-rate-timestamps';

function loadTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(RATE_LS_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function saveTimestamps(ts: number[]): void {
  try { localStorage.setItem(RATE_LS_KEY, JSON.stringify(ts)); } catch { /* storage full */ }
}

function checkRateLimit(): boolean {
  const now = Date.now();
  const timestamps = loadTimestamps().filter((t) => now - t < LIMITS.clientRateWindowMs);
  if (timestamps.length >= LIMITS.clientRateLimit) return false;
  saveTimestamps([...timestamps, now]);
  return true;
}

function getRemainingRequests(): number {
  const now = Date.now();
  const timestamps = loadTimestamps().filter((t) => now - t < LIMITS.clientRateWindowMs);
  return Math.max(0, LIMITS.clientRateLimit - timestamps.length);
}

export function ChatWindow({
  creatorContext,
  conversationId,
  onConversationUpdate,
}: {
  creatorContext?: CreatorContext;
  conversationId?: string;
  onConversationUpdate?: (id: string, messages: ChatMessage[]) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<{ content: string; domainTag: DomainTag } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef('');
  const rafRef = useRef<number | null>(null);
  const [, startTransition] = useTransition();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (conversationId) {
      const stored = localStorage.getItem(`${STORAGE_KEYS.conversationPrefix}${conversationId}`);
      if (stored) setMessages(safeJsonParse<ChatMessage[]>(stored, []));
    }
  }, [conversationId]);

  // Debounced save conversation to localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    const timeout = setTimeout(() => {
      const id = conversationId || `conv-${Date.now()}`;
      localStorage.setItem(`${STORAGE_KEYS.conversationPrefix}${id}`, JSON.stringify(messages));
      const list = safeJsonParse<{ id: string }[]>(localStorage.getItem(STORAGE_KEYS.conversations), []);
      const existing = list.findIndex((c: { id: string }) => c.id === id);
      const entry = {
        id,
        title: messages[0]?.content.slice(0, 50) || 'New Conversation',
        domainTag: messages.find((m) => m.domainTag)?.domainTag || 'growth',
        updatedAt: new Date().toISOString(),
        messageCount: messages.length,
      };
      if (existing >= 0) list[existing] = entry;
      else list.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(list.slice(0, LIMITS.maxConversations)));
      onConversationUpdate?.(id, messages);
    }, 500); // Debounce 500ms
    return () => clearTimeout(timeout);
  }, [messages, conversationId, onConversationUpdate]);

  async function copyMessage(content: string, msgId: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.warn('Clipboard write failed');
    }
  }

  function shareMessage(content: string, domainTag: DomainTag) {
    setShareMsg({ content, domainTag: domainTag || 'growth' });
  }

  async function sendMessage(content: string, mode?: string) {
    if (!content.trim() && !mode) return;
    setError(null);

    // Daily message limit (free tier)
    const today = new Date().toISOString().slice(0, 10);
    const dailyData = safeJsonParse<{ date: string; count: number }>(
      localStorage.getItem(STORAGE_KEYS.dailyMessages), { date: today, count: 0 }
    );
    if (dailyData.date !== today) {
      dailyData.date = today;
      dailyData.count = 0;
    }
    if (dailyData.count >= LIMITS.freeMessageLimit) {
      setError(`Daily limit reached (${LIMITS.freeMessageLimit} messages/day on free tier). Upgrade to Pro for unlimited.`);
      return;
    }
    dailyData.count++;
    localStorage.setItem(STORAGE_KEYS.dailyMessages, JSON.stringify(dailyData));

    // Rate limit check
    if (!checkRateLimit()) {
      setError(`Rate limit reached. ${getRemainingRequests()} requests remaining. Please wait a moment.`);
      return;
    }

    const msgId = `msg-${Date.now()}`;
    const userMessage: ChatMessage = { role: 'user', content: content.trim() || `[Mode: ${mode}]`, id: msgId };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);
    setActiveMode(mode || null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: mode || undefined,
          creatorStage: creatorContext?.stage,
          creatorNiche: creatorContext?.niche,
          creatorCountry: creatorContext?.country,
          creatorPlatforms: creatorContext?.platforms,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API rate limit reached. Please wait a few minutes and try again.');
        }
        throw new Error(`Server error (${response.status}). Check your API keys in .env.local.`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream available.');

      const decoder = new TextDecoder();
      streamingContentRef.current = '';
      let responseDomain: DomainTag = 'growth';
      const assistantId = `msg-${Date.now()}-ai`;

      // Add placeholder — functional update avoids stale closure over newMessages
      setMessages((prev) => [...prev, { role: 'assistant', content: '', domainTag: responseDomain, id: assistantId }]);

      const flushStreamingContent = (domain: DomainTag, id: string) => {
        const snapshot = streamingContentRef.current;
        startTransition(() => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.id !== id) return prev;
            return [...prev.slice(0, -1), { ...last, content: snapshot, domainTag: domain }];
          });
        });
        rafRef.current = null;
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'domain') {
              responseDomain = parsed.tag;
            } else if (parsed.type === 'text') {
              streamingContentRef.current += parsed.content;
              // Throttle renders via requestAnimationFrame — at most one setState per frame
              if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(() => flushStreamingContent(responseDomain, assistantId));
              }
            } else if (parsed.type === 'error') {
              throw new Error(parsed.content);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
              if (e.message.includes('rate') || e.message.includes('limit') || e.message.includes('Both LLM')) {
                throw e;
              }
            }
          }
        }
      }

      // Cancel any pending RAF and do a final flush with complete content
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.id !== assistantId) return prev;
        return [...prev.slice(0, -1), { ...last, content: streamingContentRef.current, domainTag: responseDomain }];
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Something went wrong: ${errMsg}`,
          domainTag: 'growth',
          id: `msg-${Date.now()}-err`,
        },
      ]);
    } finally {
      setIsStreaming(false);
      setActiveMode(null);

      // Progressive profiling: extract profile info from user messages
      try {
        // Use newMessages (not stale `messages` from closure) + current content
        const userMsgs = [...newMessages]
          .filter((m) => m.role === 'user')
          .map((m) => m.content);
        const updates: ProfileUpdates = extractProfileFromMessages(userMsgs);
        if (Object.keys(updates).length > 0) {
          const stored = localStorage.getItem(STORAGE_KEYS.profile);
          const profile = safeJsonParse<Record<string, unknown>>(stored, {});
          let changed = false;
          for (const [key, val] of Object.entries(updates)) {
            if (val && !profile[key]) {
              profile[key] = val;
              changed = true;
            }
          }
          if (changed) {
            profile.profileComplete = Boolean(profile.niche && profile.country && profile.stage && profile.name);
            localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
          }
        }
      } catch (err) {
        console.warn('[TenX] Profile extraction failed:', err);
      }
    }
  }

  function retryLast() {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;
    // Remove last assistant message
    const trimmed = messages.slice(0, -1);
    setMessages(trimmed);
    setError(null);
    setTimeout(() => sendMessage(lastUserMsg.content), 100);
  }

  const remaining = getRemainingRequests();

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">TenX Creator</h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-md">
              Your AI-powered creator business team. Ask about any platform — YouTube, Instagram,
              TikTok, X, LinkedIn, podcasts, or newsletters.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6 max-w-lg justify-center">
              {[
                'How do I grow my Instagram Reels in the food niche?',
                'What should I charge for a brand deal at 50K followers?',
                'My engagement rate dropped, what happened?',
                'Build me a cross-platform content calendar',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] sm:text-xs text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-2 rounded-xl transition-all border border-white/5"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id || i} className="group relative">
            <MessageBubble
              role={msg.role}
              content={msg.content}
              domainTag={msg.domainTag}
              isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
            />
            {/* Action buttons on assistant messages */}
            {msg.role === 'assistant' && !isStreaming && msg.content && (
              <div className="flex gap-1 ml-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyMessage(msg.content, msg.id || String(i))}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                  title="Copy"
                >
                  {copiedId === (msg.id || String(i)) ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => shareMessage(msg.content, msg.domainTag || 'growth')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
                  title="Share"
                >
                  <Share2 className="w-3 h-3" />
                </button>
              </div>
            )}
            {/* Quick replies after last assistant message */}
            {msg.role === 'assistant' && i === messages.length - 1 && !isStreaming && (
              <QuickReplies
                domainTag={msg.domainTag || 'growth'}
                onSelect={(text) => sendMessage(text)}
                visible={true}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error bar */}
      {error && (
        <div role="alert" className="mx-3 sm:mx-4 mb-2 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-none" aria-hidden="true" />
          <p className="text-red-400 text-xs flex-1">{error}</p>
          <button
            onClick={retryLast}
            aria-label="Retry last message"
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" /> Retry
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3 overflow-x-auto scrollbar-hide">
          <ModeSelector onSelectMode={(mode) => sendMessage(input || `Use ${mode} mode`, mode)} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeMode
                ? `Mode active: ${activeMode}...`
                : 'Ask anything about your creator business...'
            }
            disabled={isStreaming}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 text-sm disabled:opacity-50"
          />
          <VoiceInput
            onTranscript={(text) => setInput((prev) => prev ? `${prev} ${text}` : text)}
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl p-2.5 sm:p-3 text-white transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        {/* Rate limit indicator */}
        <div className="mt-1.5 flex justify-end">
          <span className={`text-[10px] ${remaining <= 3 ? 'text-yellow-400' : 'text-white/15'}`}>
            {remaining}/{LIMITS.clientRateLimit} requests remaining
          </span>
        </div>
      </div>

      {/* Share card modal */}
      {shareMsg && (
        <ShareCard
          content={shareMsg.content}
          domainTag={shareMsg.domainTag}
          onClose={() => setShareMsg(null)}
        />
      )}
    </div>
  );
}
