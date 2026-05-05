import { UNIFIED_ADVISOR_PROMPT, QUICK_MODES, getModeInstruction, detectDomainTag, type DomainTag, type QuickMode } from './prompts/unified';
import { CONTENT_STRATEGY_PROMPT } from './prompts/content-strategy';
import { EMAIL_STRATEGY_PROMPT } from './prompts/email-strategy';
import { SEO_CONTENT_PROMPT } from './prompts/seo-content';
import { MEDIA_PITCH_PROMPT } from './prompts/media-pitch';

// Re-export for backward compatibility
export type AdvisorType = DomainTag;

// Modes that require an injected domain-specific prompt supplement
const DOMAIN_PROMPT_MAP: Record<string, string> = {
  'blog-pillar': CONTENT_STRATEGY_PROMPT,
  'blog-spoke': CONTENT_STRATEGY_PROMPT,
  'blog-decision': CONTENT_STRATEGY_PROMPT,
  'geo-optimize': CONTENT_STRATEGY_PROMPT,
  'geo-audit': SEO_CONTENT_PROMPT,
  'seo-content': SEO_CONTENT_PROMPT,
  'newsletter': EMAIL_STRATEGY_PROMPT,
  'nurture-sequence': EMAIL_STRATEGY_PROMPT,
  'subject-lines': EMAIL_STRATEGY_PROMPT,
  'media-pitch': MEDIA_PITCH_PROMPT,
  'pitch-subject': MEDIA_PITCH_PROMPT,
};

export function routeMessage(message: string): {
  systemPrompt: string;
  domainTag: DomainTag;
} {
  const domainTag = detectDomainTag(message);
  return { systemPrompt: UNIFIED_ADVISOR_PROMPT, domainTag };
}

export function getSystemPromptWithMode(mode: string, message: string): {
  systemPrompt: string;
  domainTag: DomainTag;
} {
  const instruction = getModeInstruction(mode);
  const domainTag = detectDomainTag(message);
  const domainSupplement = DOMAIN_PROMPT_MAP[mode];

  let prompt = UNIFIED_ADVISOR_PROMPT;
  if (domainSupplement) {
    prompt += `\n\n---\nDOMAIN KNOWLEDGE FOR THIS MODE:\n${domainSupplement}`;
  }
  if (instruction) {
    prompt += `\n\nACTIVE MODE: ${mode}\n${instruction}`;
  }
  return { systemPrompt: prompt, domainTag };
}

export { QUICK_MODES, getModeInstruction, detectDomainTag };
export type { DomainTag, QuickMode };

// All modes for the UI
export const ALL_MODES = Object.entries(QUICK_MODES).map(([key, val]) => ({
  key,
  label: val.label,
  description: val.description,
}));
