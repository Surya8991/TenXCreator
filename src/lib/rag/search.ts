import type { DomainTag } from '../router';

// Static imports — works on Vercel serverless (no fs.readFileSync)
import indiaRates from '@/data/rate-cards/india.json';
import globalRates from '@/data/rate-cards/global.json';
import taxRules from '@/data/tax-rules/india.json';
import benchmarks from '@/data/benchmarks/youtube.json';
import creatorTools from '@/data/tools/creator-tools.json';
import websitePlatforms from '@/data/tools/website-platforms.json';
import countriesData from '@/data/countries.json';

// Cache formatted strings after first use
const cache: Record<string, string> = {};

function getCached(key: string, builder: () => string): string {
  if (!cache[key]) cache[key] = builder();
  return cache[key];
}

function extractRelevantData(query: string, advisor: DomainTag, country?: string): string {
  const lower = query.toLowerCase();
  const chunks: string[] = [];

  // Always inject creator context reminder
  chunks.push('IMPORTANT: Reference the creator\'s specific stage, niche, country, and platforms in your answer. Do NOT give generic advice. Ask follow-up questions if you need more context.');

  if (advisor === 'business' || lower.includes('rate') || lower.includes('brand') || lower.includes('deal') || lower.includes('sponsor') || lower.includes('charge')) {
    chunks.push(getCached('india-rates', () =>
      `INDIAN BRAND DEAL RATES (INR, updated ${indiaRates.lastUpdated}):\n${JSON.stringify(indiaRates.platforms, null, 2)}`
    ));
    chunks.push(getCached('global-rates', () =>
      `GLOBAL BRAND DEAL RATES (USD, updated ${globalRates.lastUpdated}):\n${JSON.stringify(globalRates.niches, null, 2)}\n\nCPM BY GEOGRAPHY:\n${JSON.stringify(globalRates.cpmByGeography, null, 2)}`
    ));
  }

  if (advisor === 'business' || lower.includes('tax') || lower.includes('gst') || lower.includes('tds') || lower.includes('income') || lower.includes('legal') || lower.includes('business structure')) {
    chunks.push(getCached('tax-rules', () =>
      `TAX RULES (updated ${taxRules.lastUpdated}):\n${JSON.stringify(taxRules, null, 2)}`
    ));
  }

  if (advisor === 'operations' || advisor === 'growth' || lower.includes('benchmark') || lower.includes('metric') || lower.includes('ctr') || lower.includes('avd') || lower.includes('stage') || lower.includes('engagement')) {
    chunks.push(getCached('benchmarks', () =>
      `PLATFORM BENCHMARKS (updated ${benchmarks.lastUpdated}):\n${JSON.stringify(benchmarks, null, 2)}`
    ));
  }

  if (advisor === 'operations' || lower.includes('tool') || lower.includes('software') || lower.includes('ai') || lower.includes('automat') || lower.includes('edit')) {
    chunks.push(getCached('tools', () =>
      `CREATOR TOOLS (updated ${creatorTools.lastUpdated}):\n${JSON.stringify(creatorTools.categories, null, 2)}`
    ));
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

  return chunks.join('\n\n---\n\n');
}

export function getRAGContext(query: string, advisor: DomainTag, country?: string): string {
  return extractRelevantData(query, advisor, country);
}
