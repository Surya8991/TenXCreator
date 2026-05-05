import type { DomainTag } from '../router';

// Static imports — works on Vercel serverless (no fs.readFileSync)
import indiaRates from '@/data/rate-cards/india.json';
import globalRates from '@/data/rate-cards/global.json';
import taxRules from '@/data/tax-rules/india.json';
import benchmarks from '@/data/benchmarks/youtube.json';
import creatorTools from '@/data/tools/creator-tools.json';
import websitePlatforms from '@/data/tools/website-platforms.json';
import countriesData from '@/data/countries.json';
import creatorDatabank from '@/data/creator-databank.json';

interface DatabankEntry {
  claim: string;
  source: string;
  url: string;
  year: string;
  context: string;
  quotable_version: string;
  topic_tags: string[];
}

interface RateTier {
  range: string;
  integration?: [number, number | null];
  dedicated?: [number, number | null];
  shorts?: [number, number | null];
  reel?: [number, number | null];
  story?: [number, number | null];
}

// Cache formatted strings after first use
const cache: Record<string, string> = {};

function getCached(key: string, builder: () => string): string {
  if (!cache[key]) cache[key] = builder();
  return cache[key];
}

function formatAmount(val: number | null, currency: string): string {
  if (val === null) return `${currency}...`;
  if (currency === '₹') return `₹${val.toLocaleString('en-IN')}`;
  return `$${val.toLocaleString('en-US')}`;
}

function formatTiers(tiers: RateTier[], currency: string): string {
  return tiers.map(t => {
    const parts: string[] = [`  ${t.range}:`];
    if (t.integration) parts.push(`integration ${formatAmount(t.integration[0], currency)}–${formatAmount(t.integration[1], currency)}`);
    if (t.dedicated) parts.push(`dedicated ${formatAmount(t.dedicated[0], currency)}–${formatAmount(t.dedicated[1], currency)}`);
    if (t.shorts) parts.push(`Shorts ${formatAmount(t.shorts[0], currency)}–${formatAmount(t.shorts[1], currency)}`);
    if (t.reel) parts.push(`Reel ${formatAmount(t.reel[0], currency)}–${formatAmount(t.reel[1], currency)}`);
    if (t.story) parts.push(`Story ${formatAmount(t.story[0], currency)}–${formatAmount(t.story[1], currency)}`);
    return parts.join(', ');
  }).join('\n');
}

function formatIndiaRates(): string {
  const lines: string[] = [`INDIAN BRAND DEAL RATES — INR (updated ${indiaRates.lastUpdated})`];
  const yt = indiaRates.platforms.youtube;
  lines.push(`\nYOUTUBE by niche:`);
  for (const [, niche] of Object.entries(yt.niches)) {
    const n = niche as { label: string; tiers: RateTier[]; note?: string };
    lines.push(`\n${n.label}${n.note ? ` [NOTE: ${n.note}]` : ''}:`);
    lines.push(formatTiers(n.tiers, '₹'));
  }
  const ig = indiaRates.platforms.instagram;
  lines.push(`\nINSTAGRAM (${ig.note}):`);
  lines.push(formatTiers(ig.tiers as unknown as RateTier[], '₹'));
  const li = indiaRates.platforms.linkedin;
  lines.push(`\nLINKEDIN (${li.note}):`);
  for (const t of li.tiers as Array<{ range: string; post: [number, number|null]; newsletter: [number, number|null]; carousel: [number, number|null] }>) {
    lines.push(`  ${t.range}: post ₹${t.post[0].toLocaleString('en-IN')}–${t.post[1] ? '₹'+t.post[1].toLocaleString('en-IN') : '₹...'}, newsletter ₹${t.newsletter[0].toLocaleString('en-IN')}–${t.newsletter[1] ? '₹'+t.newsletter[1].toLocaleString('en-IN') : '₹...'}`);
  }
  lines.push(`\n${indiaRates.bundlePremium}`);
  return lines.join('\n');
}

function formatGlobalRates(): string {
  const lines: string[] = [`GLOBAL BRAND DEAL RATES — USD (updated ${globalRates.lastUpdated})`];
  for (const [, niche] of Object.entries(globalRates.niches)) {
    const n = niche as { label: string; tiers: RateTier[]; notes?: string };
    lines.push(`\n${n.label}${n.notes ? ` [${n.notes}]` : ''}:`);
    lines.push(formatTiers(n.tiers, '$'));
  }
  lines.push(`\nCPM BY GEOGRAPHY (USD):`);
  for (const [niche, regions] of Object.entries(globalRates.cpmByGeography)) {
    const r = regions as unknown as Record<string, [number, number]>;
    const regionStr = Object.entries(r).map(([geo, range]) => `${geo}: $${range[0]}–$${range[1]}`).join(', ');
    lines.push(`  ${niche}: ${regionStr}`);
  }
  return lines.join('\n');
}

function formatBenchmarks(): string {
  const b = benchmarks as Record<string, unknown>;
  const lines: string[] = [`PLATFORM BENCHMARKS (updated ${benchmarks.lastUpdated})`];

  const yt = b.youtube as Record<string, unknown>;
  lines.push(`\nYOUTUBE:`);
  lines.push(`  CTR: excellent 6%+, strong 5–6%, average 2–5%, broken <2%`);
  lines.push(`  AVD: excellent 50%+, average 30–50%, poor <30%`);
  lines.push(`  30-second retention: critical — algorithm suppresses video if viewer drops before 0:30`);
  const uf = yt.uploadFrequency as Record<string, string>;
  lines.push(`  Upload: ${uf.minimum} | Optimal: ${uf.optimal}`);

  const ig = b.instagram as Record<string, unknown>;
  const igEng = (ig.engagementRate as Record<string, { min?: number; max?: number; label: string }>);
  lines.push(`\nINSTAGRAM:`);
  lines.push(`  Engagement: excellent ${igEng.excellent.min}%+, average ${igEng.average.min}–${igEng.average.max}%, declining <${igEng.declining.max}%`);
  const igReels = ig.reels as Record<string, unknown>;
  lines.push(`  Reels reach: should be 2–5x follower count`);
  lines.push(`  Hook window: ${igReels.hookWindow}`);

  const tt = b.tiktok as Record<string, unknown>;
  lines.push(`\nTIKTOK:`);
  lines.push(`  Completion: excellent 70%+, strong 50–70%, poor <30%`);
  lines.push(`  FYP %: strong 80%+, concern <40%`);
  lines.push(`  Hook window: ${tt.hookWindow}`);

  const li = b.linkedin as Record<string, unknown>;
  const liFmt = li.formatMultipliers as Record<string, { multiplier?: number; penalty?: number; note: string }>;
  lines.push(`\nLINKEDIN:`);
  lines.push(`  Target: 5,000+ impressions, 4%+ engagement rate`);
  lines.push(`  Carousels: ${liFmt.carousels.multiplier}x reach multiplier vs text | Polls: ${liFmt.polls.multiplier}x reach`);
  lines.push(`  External links in post body: ${Math.abs(liFmt.externalLinks.penalty! * 100)}% reach penalty — always put in first comment`);
  lines.push(`  Best times: ${li.bestPostTimes}`);

  const pod = b.podcast as Record<string, unknown>;
  const podDl = pod.downloads7Days as Record<string, { min?: number; label: string }>;
  lines.push(`\nPODCAST:`);
  lines.push(`  Top 10% globally: ${podDl.top10Percent.min}+ downloads in first 7 days`);

  const nl = b.newsletter as Record<string, unknown>;
  lines.push(`\nNEWSLETTER:`);
  lines.push(`  Open rate: excellent 40%+, good 25–40%, poor <15%`);
  lines.push(`  Click rate: excellent 5%+, solid 2–5%, poor <1%`);
  lines.push(`  Subject line max: ${nl.subjectLineMaxChars} characters`);
  lines.push(`  Best send time: ${nl.optimalSendTime}`);

  const stages = b.creatorStages as Array<{ stage: number; label: string; subscribers: string; focus: string }>;
  lines.push(`\nCREATOR STAGES:`);
  for (const s of stages) {
    lines.push(`  Stage ${s.stage} — ${s.label} (${s.subscribers}): ${s.focus}`);
  }

  return lines.join('\n');
}

function formatTools(): string {
  const lines: string[] = [`CREATOR TOOLS (updated ${creatorTools.lastUpdated})`];
  for (const [, cat] of Object.entries(creatorTools.categories)) {
    const c = cat as { label: string; tools: Array<{ name: string; free?: boolean; best_for: string }> };
    lines.push(`\n${c.label}:`);
    for (const t of c.tools) {
      const freeTag = t.free !== undefined ? (t.free ? ' [free tier]' : ' [paid]') : '';
      lines.push(`  • ${t.name}${freeTag} — ${t.best_for}`);
    }
  }
  return lines.join('\n');
}

function searchCreatorDatabank(query: string): string {
  const lower = query.toLowerCase();
  const entries = (creatorDatabank.entries as DatabankEntry[]).filter(entry => {
    if (!entry.quotable_version) return false;
    return entry.topic_tags.some(tag => lower.includes(tag.toLowerCase())) ||
      lower.includes(entry.source.toLowerCase().split(' ')[0]);
  });

  if (entries.length === 0) return '';

  const lines = entries.slice(0, 5).map(e =>
    `• ${e.quotable_version} (${e.source}, ${e.year})`
  );
  return `CREATOR DATA BANK — VERIFIED STATS (cite these in your response when relevant):\n${lines.join('\n')}`;
}

function extractRelevantData(query: string, advisor: DomainTag, country?: string): string {
  const lower = query.toLowerCase();
  const chunks: string[] = [];

  chunks.push('IMPORTANT: Reference the creator\'s specific stage, niche, country, and platforms in your answer. Do NOT give generic advice. Ask follow-up questions if you need more context.');

  if (advisor === 'business' || lower.includes('rate') || lower.includes('brand') || lower.includes('deal') || lower.includes('sponsor') || lower.includes('charge')) {
    chunks.push(getCached('india-rates', formatIndiaRates));
    chunks.push(getCached('global-rates', formatGlobalRates));
  }

  if (advisor === 'business' || lower.includes('tax') || lower.includes('gst') || lower.includes('tds') || lower.includes('income') || lower.includes('legal') || lower.includes('business structure')) {
    chunks.push(getCached('tax-rules', () =>
      `TAX RULES — INDIA (updated ${taxRules.lastUpdated}):\n${JSON.stringify(taxRules, null, 2)}`
    ));
  }

  if (advisor === 'operations' || advisor === 'growth' || lower.includes('benchmark') || lower.includes('metric') || lower.includes('ctr') || lower.includes('avd') || lower.includes('stage') || lower.includes('engagement') || lower.includes('open rate') || lower.includes('completion')) {
    chunks.push(getCached('benchmarks', formatBenchmarks));
  }

  if (advisor === 'operations' || lower.includes('tool') || lower.includes('software') || lower.includes('ai') || lower.includes('automat') || lower.includes('edit') || lower.includes('email') || lower.includes('schedule') || lower.includes('analytics') || lower.includes('course') || lower.includes('payment')) {
    chunks.push(getCached('tools', formatTools));
  }

  if (lower.includes('website') || lower.includes('cms') || lower.includes('wordpress') || lower.includes('shopify') || lower.includes('landing page') || lower.includes('blog') || lower.includes('course platform') || lower.includes('webflow') || lower.includes('link in bio') || lower.includes('merch') || lower.includes('squarespace') || lower.includes('ghost') || lower.includes('kajabi') || lower.includes('gumroad') || lower.includes('next.js') || lower.includes('portfolio') || lower.includes('hosting')) {
    chunks.push(getCached('websites', () =>
      `WEBSITE & CMS PLATFORMS (updated ${websitePlatforms.lastUpdated}):\n${JSON.stringify(websitePlatforms, null, 2)}`
    ));
  }

  if (country) {
    const countryInfo = (countriesData.countries as Record<string, unknown>)[country];
    if (countryInfo) {
      chunks.push(`CREATOR'S COUNTRY DATA:\n${JSON.stringify(countryInfo, null, 2)}\n\nUse this country-specific data for tax, legal, CPM, and platform advice.`);
    } else {
      chunks.push(`CREATOR'S COUNTRY: ${country}. Tailor tax, legal, monetization, and market advice to this country specifically.`);
    }
  }

  const databankStats = searchCreatorDatabank(query);
  if (databankStats) chunks.push(databankStats);

  return chunks.join('\n\n---\n\n');
}

export function getRAGContext(query: string, advisor: DomainTag, country?: string): string {
  return extractRelevantData(query, advisor, country);
}
