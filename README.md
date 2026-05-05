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
- **20 Quick Modes** — Hook Lab, Video Script, Deal Review, Rate Card, Data Crisis, Contract Review, Case Study, Weekly Review, Content Calendar, Quick Win, Website Advisor, Newsletter, Nurture Sequence, Pillar Page, Spoke Article, Decision Article, GEO Audit, SEO Content, Media Pitch, Repurpose Content
- **Real Rate Cards** — 11 niches × 5 tiers in INR and USD (finance, tech, education, health, beauty, food, gaming, lifestyle, crypto, travel, business) across India and global markets
- **Tax Intelligence** — GST, TDS (brand deals 194R, affiliate 194H, course sales, contractor 194J), income tax slabs + 87A rebate, advance tax, penalty rules (234B/C/F), 17 allowable expense categories, business structure guide (Sole Prop → OPC → LLP → Pvt Ltd)
- **Platform Benchmarks** — YouTube, Instagram, TikTok, LinkedIn, podcast, and newsletter KPIs with exact numbers by platform
- **Guided Onboarding** — 4-step setup (platforms → niche → country → stage) pre-populates your profile for immediate specific advice
- **Progressive Profiling** — Continues learning from conversation; supports lakh/crore notation; 20+ niche categories
- **Human Writing Standards** — Every response enforces active voice, sourced statistics, and zero AI filler phrases
- **Creator DataBank** — Cited creator economy stats wired into RAG — cited automatically in relevant responses for brand deals, pitches, and content
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
    onboarding/           # 4-step setup: platforms → niche → country → stage
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
    prompts/
      unified.ts          # Core advisor system prompt + 20 quick modes
      growth.ts           # Growth advisor: YouTube retention, LinkedIn, repurpose, platform KPIs
      business.ts         # Business advisor: brand deals, contracts, case study framework
      operations.ts       # Operations advisor: analytics, SEO benchmarks, repurposing KPIs
      content-strategy.ts # Blog writing: Pillar/Spoke/Decision types, 4-layer chunk format
      email-strategy.ts   # Newsletter 8-block structure, 5-email nurture sequence
      seo-content.ts      # GEO/AEO framework for AI search citation (Google AIO, Perplexity, ChatGPT)
      media-pitch.ts      # HARO/Featured 5-block pitch structure, CARE checklist
    rag/
      search.ts           # RAG context builder — structured text formatters, DataBank tag matching
    db/                   # Supabase client, auth, conversations, creators
    router.ts             # Smart advisor routing + domain-specific prompt injection
    profile-extractor.ts  # Extract niche/stage/country/lakh-crore counts from messages
    constants.ts          # Storage keys, creator stages, limits
  data/
    countries.json        # 20+ countries with tax/CPM data
    rate-cards/
      india.json          # INR rates: 9 niches × 5 tiers (YouTube, Instagram, LinkedIn, X) incl. gaming & crypto
      global.json         # USD rates: 11 niches × 5 tiers + CPM by geography (6 countries)
    tax-rules/
      india.json          # GST, income tax slabs, TDS (194R/H/C/J/I), penalty rules, 17 expense categories, 4 business structures
    benchmarks/
      youtube.json        # All-platform benchmarks: YouTube, Instagram, TikTok, LinkedIn, podcast, newsletter + creator stages
    tools/
      creator-tools.json  # 14 tool categories: scriptwriting, editing, email, scheduling, analytics, payments, community, brand platforms
      website-platforms.json  # CMS & hosting platforms by stage and goal
    creator-databank.json # 14+ cited creator economy stats — auto-injected by RAG when topic tags match
supabase/
  migrations/             # SQL migrations (creators, conversations, metrics)
```

## Three Advisors

| Advisor | Domain | Examples |
|---------|--------|----------|
| Growth | Content strategy, SEO, viral hooks, thumbnails, video scripts, repurposing, email, media pitching — all platforms | "How do I improve my CTR?", "Write me hooks for a finance video", "Build my repurposing plan for this article" |
| Business | Brand deals (11 niches × 5 tiers), rate cards, contracts, tax (GST/TDS/income), negotiation, business structures, case studies | "What should I charge for a YouTube integration at 50K subs?", "Review this brand deal", "How do I register as OPC vs Pvt Ltd?" |
| Operations | Analytics benchmarks (YouTube/Instagram/TikTok/LinkedIn/podcast/newsletter), community platforms, 14 tool categories, AI stack | "My views dropped 40%, what happened?", "Audit my content for AI search citation", "Best email marketing tool for a creator?" |

The system auto-routes your question to the right advisor based on keywords. No manual switching needed.

## Quick Modes

### Growth & Content
| Mode | What It Does |
|------|-------------|
| Hook Lab | 5 viral hooks ranked by emotional psychology + thumbnail and title options |
| Video Script | Full YouTube script (Short / How-to / Case Study) with retention structure and visual direction |
| Content Calendar | 30-day cross-platform content plan |
| Repurpose Content | Full derivative map from one source asset (article, video, case study, research) |
| Quick Win | Single best action for the next 24 hours |

### Writing & SEO
| Mode | What It Does |
|------|-------------|
| Pillar Page | 2,000-3,500 word authoritative hub article with 4-layer chunk format |
| Spoke Article | 1,000-1,800 word deep-dive on a specific creator subtopic |
| Decision Article | 800-1,400 word comparison piece for creators evaluating tools or platforms |
| SEO Content | GEO-optimized article structured for AI search citation (Google AIO, Perplexity, ChatGPT) |
| GEO Audit | Score existing content against 11 AI citation criteria with specific fixes |

### Email & Outreach
| Mode | What It Does |
|------|-------------|
| Newsletter | Single value-first email using the 8-block structure with subject line options |
| Nurture Sequence | 5-email onboarding arc for new subscribers (Day 0 → Day 14) |
| Media Pitch | HARO/Featured journalist pitch using the 5-block structure and CARE checklist |

### Business & Deals
| Mode | What It Does |
|------|-------------|
| Deal Review | Evaluate a brand deal against market rates |
| Rate Card | Generate your rate card in INR + USD |
| Contract Review | Flag red flags with exact alternative contract language |
| Case Study | Creator case study using the BAB-Plus framework with metrics enforcement |
| Weekly Review | 360-degree assessment across all three advisor domains |

### Operations
| Mode | What It Does |
|------|-------------|
| Data Crisis | Emergency diagnostic for metric drops across any platform |
| Website Advisor | CMS & hosting platform recommendations by stage |

## Creator Stages

| Stage | Subscribers | Label |
|-------|-------------|-------|
| 1 | 0 - 1K | Starter |
| 2 | 1K - 10K | Builder |
| 3 | 10K - 100K | Grower |
| 4 | 100K - 1M | Scaler |
| 5 | 1M+ | Operator |

Rate cards, advice, and benchmarks are tailored to your stage.

## Data Coverage

| Dataset | What's Inside |
|---------|--------------|
| India Rate Cards | 9 niches (finance, tech, education, health, food, beauty, gaming, motivation, crypto) × 5 tiers — YouTube (integration + dedicated + Shorts), Instagram (Reel/Story/Carousel/Static), LinkedIn, X |
| Global Rate Cards | 11 niches × 5 tiers in USD + CPM by geography for 5–6 countries per niche |
| India Tax Rules | GST (18%, zero-rated exports, ITC), income tax slabs 2026 + 87A rebate + surcharge, TDS types (194R brand deals, 194H affiliate, 194C/J courses, 194I rent), penalty rules (234B/C/F, 271), 17 allowable expenses, 4 business structures with compliance notes |
| Platform Benchmarks | YouTube (CTR/AVD/upload cadence/RPM by country), Instagram (engagement/Reels/Stories/carousels), TikTok (completion/FYP%), LinkedIn (impressions/engagement/format multipliers), Podcast (downloads), Newsletter (open/click rates) |
| Creator Tools | 14 categories: scriptwriting, video editing, thumbnails, SEO, short-form repurposing, audio, email marketing, scheduling, analytics, courses/memberships, payments, automation, community, Indian & global brand deal platforms |
| Creator DataBank | 14+ cited stats auto-matched to query by topic tags — YouTube CTR algorithmics, India brand deal rates, creator economy size, upload frequency data, income distribution, email vs social reach |

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
