// localStorage keys — single source of truth
export const STORAGE_KEYS = {
  profile: 'tenx-creator-profile',
  theme: 'tenx-theme',
  conversations: 'tenx-conversations',
  metrics: 'tenx-metrics',
  conversationPrefix: 'tenx-conv-',
  dailyMessages: 'tenx-daily-msgs',
} as const;

// Creator stages — single source of truth
export const CREATOR_STAGES = [
  { value: 1, label: 'Starter', range: '0-1K followers', short: 'Starter (0-1K followers)' },
  { value: 2, label: 'Builder', range: '1K-10K', short: 'Builder (1K-10K)' },
  { value: 3, label: 'Grower', range: '10K-100K', short: 'Grower (10K-100K)' },
  { value: 4, label: 'Scaler', range: '100K-1M', short: 'Scaler (100K-1M)' },
  { value: 5, label: 'Operator', range: '1M+', short: 'Operator (1M+)' },
] as const;

export function getStageLabel(stage: number): string {
  return CREATOR_STAGES.find((s) => s.value === stage)?.short || 'Unknown';
}

// Limits
export const LIMITS = {
  maxConversations: 50,
  maxMetricsEntries: 52,  // ~1 year of weekly entries
  chartDataPoints: 20,
  debounceSaveMs: 500,
  clientRateLimit: 10,
  clientRateWindowMs: 60_000,
  serverRateLimit: 20,
  serverRateWindowMs: 60_000,
  freeMessageLimit: 10,
} as const;

// Safe JSON parse helper
export function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
