import { UNIFIED_ADVISOR_PROMPT, QUICK_MODES, getModeInstruction, detectDomainTag, type DomainTag, type QuickMode } from './prompts/unified';

// Re-export for backward compatibility
export type AdvisorType = DomainTag;

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
  const prompt = instruction
    ? `${UNIFIED_ADVISOR_PROMPT}\n\nACTIVE MODE: ${mode}\n${instruction}`
    : UNIFIED_ADVISOR_PROMPT;
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
