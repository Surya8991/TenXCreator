# TenX Creator

<!-- Replace with your own screenshot: take a screenshot of the chat page and save as docs/banner.png -->
<!-- ![TenX Creator](docs/banner.png) -->

AI-powered business advisor built for content creators. Get real-time, actionable advice on content strategy, brand deals, taxes, finance, and analytics — with actual numbers, not generic tips.

**India-first** with GST, TDS, and INR rate cards built-in. Supports 20+ countries.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Features

- **Three AI Advisors** — Growth (content & SEO), Business (deals & taxes), Operations (analytics & tech) — auto-routed based on your question
- **9 Quick Modes** — Hook Lab, Deal Review, Rate Card Generator, Data Crisis, Contract Review, Weekly Audit, Content Calendar, Quick Win, Website Advisor
- **Real Rate Cards** — Platform-specific rates by niche, tier, and country (not guesses)
- **Tax Intelligence** — GST, TDS, income tax slabs, advance tax deadlines for India + global rules
- **Progressive Profiling** — Learns your niche, stage, country, and platforms from conversation
- **Multi-LLM** — Gemini 2.0 Flash (primary) with Groq Llama 3.3 auto-fallback
- **Works Without a Backend** — Fully functional with localStorage; Supabase optional
- **Voice Input** — Speech-to-text for hands-free interaction
- **Dark/Light Mode** — System-aware theme switching

## Quick Start

```bash
git clone https://github.com/Surya8991/TenXCreator.git
cd TenXCreator
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Environment Variables

| Variable | Required | Get Key | Purpose |
|----------|----------|---------|---------|
| `GOOGLE_GEMINI_API_KEY` | Yes | [ai.google.dev](https://ai.google.dev) | Primary LLM (1500 req/day free) |
| `GROQ_API_KEY` | Yes | [console.groq.com](https://console.groq.com) | Fallback LLM (~6000 req/day free) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | [supabase.com](https://supabase.com) | Database + Auth (optional) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | [supabase.com](https://supabase.com) | Supabase public key (optional) |
| `SUPABASE_SERVICE_ROLE_KEY` | No | [supabase.com](https://supabase.com) | Server-side Supabase key (optional) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Primary LLM | Google Gemini 2.0 Flash |
| Fallback LLM | Groq Llama 3.3 70B |
| Database | Supabase (Postgres) — optional |
| Auth | Supabase Auth (Google OAuth + Email) — optional |
| Deployment | Vercel |
| Icons | Lucide React |

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    chat/                 # Chat interface with conversation sidebar
    onboarding/           # Platform selection
    dashboard/            # Profile & quick actions
    blog/                 # Blog listing & posts
    pricing/              # Free vs Pro plans
    auth/                 # Login & OAuth callback
    api/
      chat/route.ts       # Main chat streaming endpoint
      rate-card/route.ts  # Rate card generation API
  components/
    chat/                 # ChatWindow, MessageBubble, ModeSelector, VoiceInput, etc.
    landing/              # Hero, Features
    shared/               # AuthProvider, ThemeProvider, ErrorBoundary, Skeleton
  lib/
    llm/                  # Gemini + Groq providers with auto-fallback
    prompts/              # Unified advisor system prompt + 9 quick modes
    rag/                  # RAG search (rate cards, tax rules, benchmarks)
    db/                   # Supabase client, auth, conversations, creators
    router.ts             # Smart advisor domain routing
    profile-extractor.ts  # Extract niche/stage/country from messages
    constants.ts          # Storage keys, creator stages, limits
  data/
    countries.json        # 20+ countries with tax/CPM data
    rate-cards/           # India (INR) + Global (USD) rates by niche & tier
    tax-rules/            # GST, income tax, TDS rules
    benchmarks/           # YouTube CTR, AVD, engagement benchmarks
    tools/                # Creator tools & website platforms
supabase/
  migrations/             # SQL migrations (creators, conversations, metrics)
```

## Three Advisors

| Advisor | Domain | Examples |
|---------|--------|----------|
| Growth | Content strategy, SEO, viral hooks, thumbnails, upload schedules | "How do I improve my CTR?", "Give me hooks for a finance video" |
| Business | Brand deals, rate cards, contracts, tax, negotiation | "What should I charge for a YouTube integration?", "Review this brand deal" |
| Operations | Analytics, community, tech stack, AI tools | "My views dropped 40%, what happened?", "Best editing tools for beginners?" |

The system auto-routes your question to the right advisor based on keywords. No manual switching needed.

## Quick Modes

| Mode | What It Does |
|------|-------------|
| Hook Lab | 5 viral hook options ranked by emotional psychology |
| Deal Review | Evaluate a brand deal against market rates |
| Rate Card | Generate your rate card in INR + USD |
| Data Crisis | Emergency diagnostic for metric drops |
| Contract Review | Flag red flags with alternative contract language |
| Weekly Review | 360-degree assessment across all domains |
| Content Calendar | 30-day cross-platform content plan |
| Quick Win | Single best action for the next 24 hours |
| Website Advisor | CMS & hosting platform recommendations |

## Creator Stages

| Stage | Subscribers | Label |
|-------|-------------|-------|
| 1 | 0 - 1K | Starter |
| 2 | 1K - 10K | Builder |
| 3 | 10K - 100K | Grower |
| 4 | 100K - 1M | Scaler |
| 5 | 1M+ | Operator |

Rate cards, advice, and benchmarks are tailored to your stage.

## Rate Limiting

- **Server:** 20 requests/minute per IP
- **Client:** 10 requests/minute
- **Free plan:** 10 messages/day
- **Pro plan:** Unlimited

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations from `supabase/migrations/` in the SQL editor
3. Enable Google OAuth in Authentication > Providers
4. Add Supabase keys to `.env.local`

The app works fully without Supabase — all data is stored in localStorage.

## Scripts

```bash
npm run dev      # Start dev server on port 3003
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT License. See [LICENSE](LICENSE) for details.
