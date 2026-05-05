// Extracts profile info from chat messages to progressively build the creator profile
// This runs client-side after each AI response

import countriesData from '@/data/countries.json';

// Zip country codes and names together to prevent desync
const countryEntries = Object.entries(countriesData.countries).map(([code, data]) => ({
  code,
  name: (data as { name: string }).name.toLowerCase(),
}));

const niches = [
  'finance', 'fintech', 'technology', 'tech', 'gadgets', 'education', 'edtech',
  'health', 'fitness', 'food', 'cooking', 'beauty', 'fashion', 'motivation',
  'business', 'gaming', 'entertainment', 'travel', 'lifestyle',
  'crypto', 'web3', 'blockchain', 'nft',
  'astrology', 'spirituality', 'yoga', 'meditation',
  'comedy', 'memes', 'vlogs', 'vlogging',
  'parenting', 'kids', 'diy', 'crafts', 'art',
  'music', 'dance', 'sports', 'fitness coaching',
];

const falsePositiveNames = new Set([
  'a', 'the', 'an', 'from', 'in', 'at', 'new', 'just', 'not', 'very',
  'here', 'there', 'going', 'trying', 'looking', 'working', 'making',
  'sure', 'fine', 'good', 'bad', 'also', 'really', 'currently',
]);

export type ProfileUpdates = {
  niche?: string;
  country?: string;
  stage?: number;
  name?: string;
};

export function extractProfileFromMessages(
  userMessages: string[]
): ProfileUpdates {
  const updates: ProfileUpdates = {};
  const allText = userMessages.join(' ').toLowerCase();

  // Extract country — using zipped entries (no desync risk)
  for (const { code, name } of countryEntries) {
    if (
      allText.includes(name) ||
      allText.includes(`from ${name}`) ||
      allText.includes(`based in ${name}`) ||
      allText.includes(`live in ${name}`)
    ) {
      updates.country = code;
      break;
    }
  }
  // Also check short country code mentions like "I'm in the US"
  if (!updates.country) {
    for (const { code } of countryEntries) {
      const lower = code.toLowerCase();
      if (
        allText.includes(`in the ${lower}`) ||
        allText.includes(`from ${lower}`) ||
        allText.includes(`based in ${lower}`)
      ) {
        updates.country = code;
        break;
      }
    }
  }

  // Extract niche
  for (const niche of niches) {
    if (
      allText.includes(`${niche} niche`) ||
      allText.includes(`${niche} channel`) ||
      allText.includes(`${niche} content`) ||
      allText.includes(`i make ${niche}`) ||
      allText.includes(`i create ${niche}`) ||
      allText.includes(`my niche is ${niche}`) ||
      allText.includes(`i'm in ${niche}`)
    ) {
      updates.niche = niche.charAt(0).toUpperCase() + niche.slice(1);
      break;
    }
  }

  // Extract subscriber/follower count → map to stage
  // Supports: 50k, 2m, 1.5 lakh, 3 crore
  const subMatch = allText.match(/(\d+(?:[.,]\d+)?)\s*(k|m|lakh|lac|crore|cr)?\s*(subscribers?|subs?|followers?)/i);
  if (subMatch) {
    let count = parseFloat(subMatch[1].replace(',', ''));
    const multiplier = subMatch[2]?.toLowerCase();
    if (multiplier === 'k') count *= 1000;
    else if (multiplier === 'm') count *= 1_000_000;
    else if (multiplier === 'lakh' || multiplier === 'lac') count *= 100_000;
    else if (multiplier === 'crore' || multiplier === 'cr') count *= 10_000_000;

    if (count < 1000) updates.stage = 1;
    else if (count < 10000) updates.stage = 2;
    else if (count < 100000) updates.stage = 3;
    else if (count < 1000000) updates.stage = 4;
    else updates.stage = 5;
  }

  // Extract name — case-insensitive match that captures uppercase first letters
  const nameMatch = allText.match(/(?:my name is|i'm|i am|call me)\s+([a-zA-Z][a-zA-Z\s]{1,20}?)(?:\.|,|!|\?|\s-|$)/i);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    if (!falsePositiveNames.has(name.toLowerCase()) && name.length > 1) {
      updates.name = name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  return updates;
}
