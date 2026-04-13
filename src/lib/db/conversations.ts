// TODO: Wire to UI when Supabase auth is active. Currently app uses localStorage.
import { supabase } from './supabase';
import type { AdvisorType } from '../router';

export type StoredMessage = {
  role: 'user' | 'assistant';
  content: string;
  advisor?: AdvisorType;
  mode?: string;
  timestamp: string;
};

export type Conversation = {
  id?: string;
  creator_id: string;
  title: string;
  messages: StoredMessage[];
  advisor: AdvisorType;
  created_at?: string;
  updated_at?: string;
};

export async function createConversation(conv: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('conversations')
    .insert({ ...conv, messages: JSON.stringify(conv.messages) })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateConversation(id: string, messages: StoredMessage[], advisor: AdvisorType) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('conversations')
    .update({ messages: JSON.stringify(messages), advisor, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function getConversations(creatorId: string, limit = 20) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, advisor, created_at, updated_at')
    .eq('creator_id', creatorId)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getConversation(id: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
  if (error) throw error;
  return {
    ...data,
    messages: typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages,
  } as Conversation;
}
