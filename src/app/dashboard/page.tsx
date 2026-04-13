'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, TrendingUp, Briefcase, Settings2, Zap, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/shared/ThemeProvider';
import { STORAGE_KEYS, safeJsonParse } from '@/lib/constants';

type CreatorProfile = {
  name: string;
  niche: string;
  stage: number;
  platforms?: string[];
  country?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [conversationCount, setConversationCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.profile);
    const parsed = safeJsonParse<CreatorProfile | null>(stored, null);
    if (parsed) {
      setProfile(parsed);
    } else {
      router.push('/onboarding');
    }
    const convs = safeJsonParse<unknown[]>(localStorage.getItem(STORAGE_KEYS.conversations), []);
    setConversationCount(convs.length);
  }, [router]);

  if (!profile) return null;

  const hasNiche = Boolean(profile.niche);
  const hasStage = profile.stage > 0;
  const hasCountry = Boolean(profile.country);
  const profileItems = [hasNiche, hasStage, hasCountry, (profile.platforms?.length || 0) > 0];
  const profilePercent = Math.round((profileItems.filter(Boolean).length / profileItems.length) * 100);

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/40 hover:text-white/80"><ArrowLeft className="w-4 h-4" /></Link>
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/chat" className="btn-primary text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile completion */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Your Profile</h2>
            <span className={cn('text-sm font-semibold', profilePercent === 100 ? 'text-emerald-400' : 'text-yellow-400')}>
              {profilePercent}% complete
            </span>
          </div>
          <div className="flex gap-1 mb-4">
            {profileItems.map((done, i) => (
              <div key={i} className={cn('h-1.5 flex-1 rounded-full', done ? 'bg-emerald-500' : 'bg-white/10')} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-white/40 text-xs">Platforms</span>
              <p className="text-white font-medium">{profile.platforms?.join(', ') || 'Not set'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-white/40 text-xs">Niche</span>
              <p className="text-white font-medium">{profile.niche || 'Ask me in chat'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-white/40 text-xs">Country</span>
              <p className="text-white font-medium">{profile.country || 'Ask me in chat'}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-white/40 text-xs">Stage</span>
              <p className="text-white font-medium">{profile.stage ? `Stage ${profile.stage}` : 'Ask me in chat'}</p>
            </div>
          </div>
          {profilePercent < 100 && (
            <Link
              href="/chat"
              className="mt-4 block text-center text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Chat with me to complete your profile →
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{conversationCount}</p>
            <p className="text-white/40 text-xs">Conversations</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{profile.platforms?.length || 0}</p>
            <p className="text-white/40 text-xs">Platforms</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">9</p>
            <p className="text-white/40 text-xs">Quick Modes</p>
          </div>
        </div>

        {/* Quick actions */}
        <h3 className="text-white font-semibold mb-4">Start a Conversation</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {([
            { icon: TrendingUp, label: 'Content Strategy', desc: 'Hooks, SEO, content calendar', q: 'Help me plan my content strategy', color: '#059669' },
            { icon: Briefcase, label: 'Brand Deals', desc: 'Rates, contracts, negotiation', q: 'What should I charge for brand deals?', color: '#2563eb' },
            { icon: Settings2, label: 'Analytics Help', desc: 'Metrics, benchmarks, diagnosis', q: 'Help me understand my analytics', color: '#7c3aed' },
            { icon: Zap, label: 'Quick Win', desc: 'Best action for next 24 hours', q: 'Give me a quick win I can do today', color: '#d97706' },
            { icon: MessageSquare, label: 'Website Setup', desc: 'CMS, hosting, landing pages', q: 'What website platform should I use?', color: '#0891b2' },
            { icon: TrendingUp, label: 'Rate Card', desc: 'Build your rate card', q: 'Build me a rate card', color: '#db2777' },
          ]).map(({ icon: Icon, label, desc, color }) => (
            <Link
              key={label}
              href="/chat"
              className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/15 transition-all group"
            >
              <Icon className="w-5 h-5 mb-2" style={{ color }} />
              <h4 className="text-white font-medium text-sm mb-0.5 group-hover:text-white/90">{label}</h4>
              <p className="text-white/30 text-xs">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
