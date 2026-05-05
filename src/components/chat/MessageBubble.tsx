'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, Briefcase, Settings2 } from 'lucide-react';
import type { DomainTag } from '@/lib/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const domainConfig: Record<DomainTag, { icon: typeof TrendingUp; label: string; color: string; bg: string }> = {
  growth: { icon: TrendingUp, label: 'Growth', color: 'text-emerald-400', bg: 'border-emerald-500/20' },
  business: { icon: Briefcase, label: 'Business', color: 'text-blue-400', bg: 'border-blue-500/20' },
  operations: { icon: Settings2, label: 'Operations', color: 'text-purple-400', bg: 'border-purple-500/20' },
};

type Props = {
  role: 'user' | 'assistant';
  content: string;
  domainTag?: DomainTag;
  isStreaming?: boolean;
};

export function MessageBubble({ role, content, domainTag, isStreaming }: Props) {
  if (role === 'user') {
    return (
      <article aria-label="Your message" className="flex justify-end mb-4">
        <div className="max-w-[85%] sm:max-w-[80%] bg-white/10 rounded-2xl rounded-br-sm px-3 sm:px-4 py-2.5 sm:py-3 text-white">
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        </div>
      </article>
    );
  }

  const config = domainTag ? domainConfig[domainTag] : domainConfig.growth;
  const Icon = config.icon;

  return (
    <article
      aria-label={`TenX ${config.label} advisor response${isStreaming ? ' (typing)' : ''}`}
      aria-live={isStreaming ? 'polite' : undefined}
      aria-busy={isStreaming}
      className="flex justify-start mb-4"
    >
      <div className={cn('max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2.5 sm:py-3 border bg-white/5', config.bg)}>
        <div className="flex items-center gap-1.5 mb-2" aria-hidden="true">
          <Icon className={cn('w-3 h-3', config.color)} />
          <span className={cn('text-[10px] font-medium', config.color)}>{config.label}</span>
        </div>
        <div className="text-white/90 text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1.5 prose-li:my-0.5 prose-strong:text-white prose-code:text-emerald-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-white/5 prose-pre:rounded-lg prose-a:text-blue-400 prose-hr:border-white/10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          {isStreaming && (
            <span
              aria-label="Typing"
              className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-1"
            />
          )}
        </div>
      </div>
    </article>
  );
}
