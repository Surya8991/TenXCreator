'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/constants';

const platforms = [
  { key: 'youtube', label: 'YouTube', icon: '▶' },
  { key: 'instagram', label: 'Instagram', icon: '◐' },
  { key: 'tiktok', label: 'TikTok', icon: '♪' },
  { key: 'twitter', label: 'X (Twitter)', icon: '𝕏' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { key: 'facebook', label: 'Facebook', icon: 'f' },
  { key: 'podcast', label: 'Podcast', icon: '🎙' },
  { key: 'newsletter', label: 'Newsletter', icon: '✉' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  function togglePlatform(key: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  function handleStart() {
    // Minimal profile — rest will be collected progressively via chat
    const profile = {
      name: '',
      country: '',
      niche: '',
      platforms: selectedPlatforms,
      stage: 0,
      profileComplete: false,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    router.push('/chat');
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">TenX Creator</h1>
          <p className="text-white/50 text-sm">
            Your AI business advisor. One question to get started — I&apos;ll learn the rest as we talk.
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm text-white/70 mb-3 block font-medium">
            Which platforms are you on?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((p) => {
              const isSelected = selectedPlatforms.includes(p.key);
              return (
                <button
                  key={p.key}
                  onClick={() => togglePlatform(p.key)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white/30',
                    isSelected
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  )}
                >
                  <span className="text-lg w-6 text-center">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={selectedPlatforms.length === 0}
          className="w-full btn-primary font-semibold py-3 rounded-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"
        >
          Start chatting <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center mt-4 text-white/20 text-[10px]">
          I&apos;ll ask about your niche, country, and stage in our first conversation.
        </p>
      </div>
    </div>
  );
}
