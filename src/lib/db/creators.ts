// TODO: Wire to UI when Supabase auth is active. Currently app uses localStorage.
import { supabase } from './supabase';

export type CreatorProfile = {
  id?: string;
  email?: string;
  name: string;
  niche: string;
  stage: number;
  subscribers?: number;
  monthly_revenue?: number;
  platforms: string[];
  created_at?: string;
};

export async function createCreator(profile: CreatorProfile) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('creators').insert(profile).select().single();
  if (error) throw error;
  return data;
}

export async function getCreator(id: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();
  if (error) throw error;
  return data as CreatorProfile;
}

export async function updateCreator(id: string, updates: Partial<CreatorProfile>) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.from('creators').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export function detectStage(subscribers: number): number {
  if (subscribers < 1000) return 1;
  if (subscribers < 10000) return 2;
  if (subscribers < 100000) return 3;
  if (subscribers < 1000000) return 4;
  return 5;
}
