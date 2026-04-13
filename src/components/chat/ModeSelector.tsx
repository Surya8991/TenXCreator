'use client';

import { cn } from '@/lib/utils';
import { ALL_MODES } from '@/lib/router';
import { Zap, ChevronDown } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onSelectMode: (mode: string) => void;
};

export function ModeSelector({ onSelectMode }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-all border border-white/10"
      >
        <Zap className="w-3 h-3" />
        Quick Modes
        <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {ALL_MODES.map((mode) => (
              <button
                key={mode.key}
                onClick={() => {
                  onSelectMode(mode.key);
                  setIsOpen(false);
                }}
                title={mode.description}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 hover:border-white/15"
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
