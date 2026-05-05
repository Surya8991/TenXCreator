'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/constants';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

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

const niches = [
  { key: 'Finance', label: 'Finance & Investing' },
  { key: 'Technology', label: 'Tech & Gadgets' },
  { key: 'Education', label: 'Education & EdTech' },
  { key: 'Health', label: 'Health & Fitness' },
  { key: 'Food', label: 'Food & Cooking' },
  { key: 'Beauty', label: 'Beauty & Fashion' },
  { key: 'Gaming', label: 'Gaming' },
  { key: 'Business', label: 'Business & Motivation' },
  { key: 'Travel', label: 'Travel & Lifestyle' },
  { key: 'Crypto', label: 'Crypto & Web3' },
  { key: 'Comedy', label: 'Comedy & Entertainment' },
  { key: 'Spirituality', label: 'Spirituality & Wellness' },
  { key: 'Parenting', label: 'Parenting & Family' },
  { key: 'Other', label: 'Other / Mixed' },
];

const stages = [
  { value: 1, label: 'Starter', sub: 'Under 1K followers' },
  { value: 2, label: 'Builder', sub: '1K – 10K followers' },
  { value: 3, label: 'Grower', sub: '10K – 100K followers' },
  { value: 4, label: 'Scaler', sub: '100K – 1M followers' },
  { value: 5, label: 'Operator', sub: '1M+ followers' },
];

const popularCountries = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'SG', label: 'Singapore' },
  { code: 'AE', label: 'UAE' },
  { code: 'NG', label: 'Nigeria' },
  { code: 'PH', label: 'Philippines' },
  { code: 'PK', label: 'Pakistan' },
  { code: 'BD', label: 'Bangladesh' },
  { code: 'OTHER', label: 'Other' },
];

const TOTAL_STEPS = 4;

function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStage, setSelectedStage] = useState(0);

  function togglePlatform(key: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  function handleStart() {
    const profile = {
      name: '',
      country: selectedCountry,
      niche: selectedNiche,
      platforms: selectedPlatforms,
      stage: selectedStage,
      profileComplete: selectedNiche !== '' && selectedCountry !== '' && selectedStage !== 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    router.push('/chat');
  }

  const canProceed = (): boolean => {
    if (step === 1) return selectedPlatforms.length > 0;
    if (step === 2) return selectedNiche !== '';
    if (step === 3) return selectedCountry !== '';
    if (step === 4) return selectedStage !== 0;
    return false;
  };

  const stepLabel = ['Platforms', 'Niche', 'Country', 'Stage'];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">TenX Creator</h1>
          <p className="text-white/50 text-sm">Quick setup — 4 steps so I can give you specific advice</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={cn(
                'h-1 w-full rounded-full transition-all',
                i + 1 <= step ? 'bg-yellow-400' : 'bg-white/10'
              )} />
              <span className={cn(
                'text-[10px] font-medium',
                i + 1 === step ? 'text-yellow-400' : 'text-white/30'
              )}>
                {stepLabel[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1 — Platforms */}
        {step === 1 && (
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-3 block font-medium">
              Which platforms are you active on?
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
        )}

        {/* Step 2 — Niche */}
        {step === 2 && (
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-3 block font-medium">
              What&apos;s your primary content niche?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {niches.map((n) => (
                <button
                  key={n.key}
                  onClick={() => setSelectedNiche(n.key)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border focus:outline-none focus:ring-2 focus:ring-white/30',
                    selectedNiche === n.key
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  )}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Country */}
        {step === 3 && (
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-3 block font-medium">
              Where are you based?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {popularCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code === 'OTHER' ? '' : c.code)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border focus:outline-none focus:ring-2 focus:ring-white/30',
                    selectedCountry === c.code || (c.code === 'OTHER' && selectedCountry === '')
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {selectedCountry === '' && (
              <p className="text-white/30 text-xs mt-2">
                Select &quot;Other&quot; if your country isn&apos;t listed — I&apos;ll still tailor advice.
              </p>
            )}
          </div>
        )}

        {/* Step 4 — Stage */}
        {step === 4 && (
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-3 block font-medium">
              What&apos;s your current creator stage?
            </label>
            <div className="flex flex-col gap-2">
              {stages.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedStage(s.value)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/30',
                    selectedStage === s.value
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'bg-white/5 border-white/5 text-white/60 hover:border-white/20'
                  )}
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-white/40 text-xs">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-none px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex-1 btn-primary font-semibold py-3 rounded-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={!canProceed()}
              className="flex-1 btn-primary font-semibold py-3 rounded-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              Start chatting <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-center mt-4 text-white/20 text-[10px]">
          Your profile is stored locally. I&apos;ll refine it as we talk.
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPageWithBoundary() {
  return (
    <ErrorBoundary>
      <OnboardingPage />
    </ErrorBoundary>
  );
}
