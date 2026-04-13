'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, Briefcase, BarChart3 } from 'lucide-react';
import type { AdvisorType } from '@/lib/router';

const advisors = [
  { key: 'growth' as AdvisorType, label: 'Growth', icon: TrendingUp, color: 'emerald', desc: 'Content, SEO, Virality' },
  { key: 'business' as AdvisorType, label: 'Business', icon: Briefcase, color: 'blue', desc: 'Deals, Legal, Finance' },
  { key: 'operations' as AdvisorType, label: 'Operations', icon: BarChart3, color: 'purple', desc: 'Analytics, Community, Tech' },
];

const colorMap: Record<string, { active: string; inactive: string }> = {
  emerald: { active: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400', inactive: 'border-white/10 text-white/50 hover:border-emerald-500/30' },
  blue: { active: 'bg-blue-500/20 border-blue-500/50 text-blue-400', inactive: 'border-white/10 text-white/50 hover:border-blue-500/30' },
  purple: { active: 'bg-purple-500/20 border-purple-500/50 text-purple-400', inactive: 'border-white/10 text-white/50 hover:border-purple-500/30' },
};

type Props = {
  selected: AdvisorType | null;
  onSelect: (advisor: AdvisorType | null) => void;
};

export function AdvisorPicker({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2">
      {advisors.map(({ key, label, icon: Icon, color, desc }) => {
        const isActive = selected === key;
        const colors = colorMap[color];
        return (
          <button
            key={key}
            onClick={() => onSelect(isActive ? null : key)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
              isActive ? colors.active : colors.inactive
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <div className="text-left">
              <div>{label}</div>
              <div className="text-[10px] opacity-60">{desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
