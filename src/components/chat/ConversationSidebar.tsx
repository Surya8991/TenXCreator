'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageSquare, Plus, Trash2, TrendingUp, Briefcase, BarChart3, PanelLeftClose, PanelLeft } from 'lucide-react';
import type { DomainTag } from '@/lib/router';
import { STORAGE_KEYS, safeJsonParse } from '@/lib/constants';

type ConversationEntry = {
  id: string;
  title: string;
  domainTag: DomainTag;
  updatedAt: string;
  messageCount: number;
};

const domainIcons: Record<DomainTag, typeof TrendingUp> = {
  growth: TrendingUp,
  business: Briefcase,
  operations: BarChart3,
};

const domainColors: Record<DomainTag, string> = {
  growth: 'text-emerald-400',
  business: 'text-blue-400',
  operations: 'text-purple-400',
};

type Props = {
  activeId: string | null;
  onSelect: (id: string | null) => void;
  refreshTrigger?: number;
};

export function ConversationSidebar({ activeId, onSelect, refreshTrigger }: Props) {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const list = safeJsonParse<ConversationEntry[]>(localStorage.getItem(STORAGE_KEYS.conversations), []);
    setConversations(list);
  }, [refreshTrigger]);

  function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    localStorage.removeItem(`${STORAGE_KEYS.conversationPrefix}${id}`);
    const list = conversations.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(list));
    setConversations(list);
    if (activeId === id) onSelect(null);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  // Collapsed state
  if (!isOpen) {
    return (
      <div className="w-10 border-r border-white/10 flex flex-col items-center py-3 gap-2 shrink-0">
        <button onClick={() => setIsOpen(true)} className="text-white/40 hover:text-white/80 p-1">
          <PanelLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onSelect(null)} className="text-white/40 hover:text-white/80 p-1" title="New chat">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-white/10 flex flex-col shrink-0 hidden sm:flex">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">History</span>
        <div className="flex gap-1">
          <button
            onClick={() => onSelect(null)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
            title="New chat"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-all"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-1">
        {conversations.length === 0 && (
          <div className="p-4 text-center">
            <MessageSquare className="w-6 h-6 text-white/10 mx-auto mb-2" />
            <p className="text-white/20 text-xs">No conversations yet</p>
          </div>
        )}
        {conversations.map((conv) => {
          const Icon = domainIcons[conv.domainTag] || MessageSquare;
          const isActive = activeId === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full flex items-start gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-all group',
                isActive && 'bg-white/5'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5 mt-0.5 shrink-0', domainColors[conv.domainTag])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 truncate">{conv.title}</p>
                <p className="text-[10px] text-white/30">{formatDate(conv.updatedAt)} · {conv.messageCount} msgs</p>
              </div>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}
