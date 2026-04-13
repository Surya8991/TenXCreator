import { NextRequest, NextResponse } from 'next/server';
import indiaData from '@/data/rate-cards/india.json';
import globalData from '@/data/rate-cards/global.json';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche') || 'technology';
  const subscribers = parseInt(searchParams.get('subscribers') || '50000');
  const name = searchParams.get('name') || 'Creator';

  const nicheKey = niche.toLowerCase().split(' ')[0];

  const ytNiches = (indiaData.platforms as Record<string, { niches?: Record<string, { tiers: { range: string }[] }> }>)?.youtube?.niches;
  const ytNiche = ytNiches?.[nicheKey];
  const igRates = indiaData.platforms?.instagram;
  const globalNiche = (globalData.niches as Record<string, { tiers: { range: string }[] }>)?.[nicheKey];

  function findTier(tiers: { range: string }[] | undefined) {
    if (!tiers || tiers.length === 0) return null;
    for (const tier of tiers) {
      const parts = tier.range.replace(/K/g, '000').replace(/M/g, '000000').replace(/\+/g, '').split('-');
      const min = Number(parts[0]);
      const max = Number(parts[1]);
      if (subscribers >= min && (isNaN(max) || subscribers <= max)) return tier;
    }
    return tiers[tiers.length - 1];
  }

  const ytTier = findTier(ytNiche?.tiers);
  const igTier = findTier(igRates?.tiers);
  const globalTier = findTier(globalNiche?.tiers);

  let stage = 'Starter';
  if (subscribers >= 1000000) stage = 'Operator';
  else if (subscribers >= 100000) stage = 'Scaler';
  else if (subscribers >= 10000) stage = 'Grower';
  else if (subscribers >= 1000) stage = 'Builder';

  return NextResponse.json({
    name, niche, subscribers, stage,
    youtube: ytTier, instagram: igTier, global: globalTier,
    bundleNote: indiaData.bundlePremium,
    generatedAt: new Date().toISOString(),
  });
}
