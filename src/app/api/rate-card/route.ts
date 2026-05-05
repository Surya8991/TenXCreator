import { NextRequest, NextResponse } from 'next/server';
import indiaData from '@/data/rate-cards/india.json';
import globalData from '@/data/rate-cards/global.json';

// Maps UI/profile niche values → india.json keys (youtube.niches)
const INDIA_NICHE_KEY: Record<string, string> = {
  finance: 'finance', fintech: 'finance',
  technology: 'technology', tech: 'technology', gadgets: 'technology',
  education: 'education', edtech: 'education',
  health: 'health', fitness: 'health', wellness: 'health',
  food: 'food', cooking: 'food',
  beauty: 'beauty', fashion: 'beauty',
  business: 'motivation', motivation: 'motivation',
  gaming: 'gaming',
  crypto: 'crypto', web3: 'crypto', blockchain: 'crypto',
  lifestyle: 'motivation', travel: 'motivation', // closest bucket
};

// Maps UI/profile niche values → global.json keys (niches)
const GLOBAL_NICHE_KEY: Record<string, string> = {
  finance: 'finance', fintech: 'finance',
  technology: 'technology', tech: 'technology', gadgets: 'technology',
  education: 'education', edtech: 'education',
  health: 'health_wellness', fitness: 'health_wellness', wellness: 'health_wellness',
  food: 'food_cooking', cooking: 'food_cooking',
  beauty: 'beauty_fashion', fashion: 'beauty_fashion',
  business: 'business_motivation', motivation: 'business_motivation',
  gaming: 'gaming',
  crypto: 'crypto_web3', web3: 'crypto_web3', blockchain: 'crypto_web3',
  lifestyle: 'lifestyle',
  travel: 'travel',
};

function parseSubscriberCount(range: string): { min: number; max: number | null } {
  const clean = range.toUpperCase().replace(/\s/g, '');
  const toNum = (s: string) => {
    if (!s || s === '+') return null;
    const n = parseFloat(s);
    if (s.endsWith('M')) return n * 1_000_000;
    if (s.endsWith('K')) return n * 1_000;
    return n;
  };
  if (clean.endsWith('+')) {
    return { min: toNum(clean.slice(0, -1)) ?? 0, max: null };
  }
  const parts = clean.split('-');
  return { min: toNum(parts[0]) ?? 0, max: toNum(parts[1]) };
}

function findTier<T extends { range: string }>(tiers: T[] | undefined, subscribers: number): T | null {
  if (!tiers || tiers.length === 0) return null;
  for (const tier of tiers) {
    const { min, max } = parseSubscriberCount(tier.range);
    if (subscribers >= min && (max === null || subscribers <= max)) return tier;
  }
  return tiers[tiers.length - 1];
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = (searchParams.get('niche') || 'technology').toLowerCase();
  const subscribers = parseInt(searchParams.get('subscribers') || '50000');
  const name = searchParams.get('name') || 'Creator';

  const indiaKey = INDIA_NICHE_KEY[niche] ?? niche;
  const globalKey = GLOBAL_NICHE_KEY[niche] ?? niche;

  const ytNiches = indiaData.platforms.youtube.niches as Record<string, { tiers: { range: string }[] }>;
  const ytTier = findTier(ytNiches[indiaKey]?.tiers, subscribers);
  const igTier = findTier(indiaData.platforms.instagram.tiers as { range: string }[], subscribers);
  const globalNiches = globalData.niches as Record<string, { tiers: { range: string }[] }>;
  const globalTier = findTier(globalNiches[globalKey]?.tiers, subscribers);

  let stage = 'Starter';
  if (subscribers >= 1_000_000) stage = 'Operator';
  else if (subscribers >= 100_000) stage = 'Scaler';
  else if (subscribers >= 10_000) stage = 'Grower';
  else if (subscribers >= 1_000) stage = 'Builder';

  return NextResponse.json({
    name, niche, subscribers, stage,
    youtube: ytTier ?? null,
    instagram: igTier ?? null,
    global: globalTier ?? null,
    bundleNote: indiaData.bundlePremium,
    generatedAt: new Date().toISOString(),
  });
}
