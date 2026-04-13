'use client';

import type { DomainTag } from '@/lib/router';

const chipsByDomain: Record<DomainTag, string[]> = {
  growth: ['Tell me more', 'Build a content calendar', 'Give me hook ideas', 'What about Shorts/Reels?'],
  business: ['Tell me more', 'Build my rate card', 'Review a contract', 'What about tax?'],
  operations: ['Tell me more', 'Recommend tools', 'Diagnose my metrics', 'Website advice'],
};

type Props = {
  domainTag: DomainTag;
  onSelect: (text: string) => void;
  visible: boolean;
};

export function QuickReplies({ domainTag, onSelect, visible }: Props) {
  if (!visible) return null;

  const chips = chipsByDomain[domainTag] || chipsByDomain.growth;

  return (
    <div className="flex flex-wrap gap-1.5 ml-2 mb-3">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className="text-[11px] text-white/40 hover:text-white/80 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all border border-white/5 hover:border-white/15"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
