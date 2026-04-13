'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ChatSkeleton } from '@/components/shared/Skeleton';
import { STORAGE_KEYS, safeJsonParse } from '@/lib/constants';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { ArrowLeft, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/shared/ThemeProvider';
import Link from 'next/link';

type CreatorProfile = {
  name: string;
  niche: string;
  stage: number;
  platforms?: string[];
  country?: string;
};

export default function ChatPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.profile);
    const parsed = safeJsonParse<CreatorProfile | null>(stored, null);
    if (parsed) {
      setProfile(parsed);
    } else {
      router.push('/onboarding');
    }
    setLoaded(true);
  }, [router]);

  const handleConversationUpdate = useCallback(() => {
    setRefreshTrigger((t) => t + 1);
  }, []);

  if (!loaded) {
    return <div className="h-screen"><ChatSkeleton /></div>;
  }

  if (!profile) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="text-white/40 hover:text-white/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">TenX Creator</h1>
            <p className="text-[10px] text-white/40 hidden sm:block">
              {[profile.name, profile.niche, profile.stage ? `Stage ${profile.stage}` : null, profile.platforms?.join(', ')].filter(Boolean).join(' · ') || 'Setting up...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link href="/dashboard" className="text-white/40 hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/10">
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main area with sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <ErrorBoundary>
          <ConversationSidebar
            activeId={activeConvId}
            onSelect={setActiveConvId}
            refreshTrigger={refreshTrigger}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <div className="flex-1 overflow-hidden">
            <ChatWindow
              key={activeConvId || 'new'}
              creatorContext={{
                stage: profile.stage,
                niche: profile.niche,
                platforms: profile.platforms,
                country: profile.country,
              }}
              conversationId={activeConvId || undefined}
              onConversationUpdate={handleConversationUpdate}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
