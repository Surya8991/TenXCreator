import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MarkdownContent } from '@/components/shared/MarkdownContent';

const articles: Record<string, { title: string; description: string; content: string }> = {
  'youtube-brand-deal-rates-india-2026': {
    title: 'YouTube Brand Deal Rates in India (2026)',
    description: 'Complete rate card breakdown by niche and subscriber count for Indian YouTube creators.',
    content: `Understanding what brands pay is the first step to never underselling yourself.

## Rate Factors

Brand deal rates depend on four key variables: your niche, subscriber count, engagement rate, and the type of integration (dedicated video vs. mention vs. Shorts).

Finance and technology niches command the highest rates because brands in these spaces have higher customer lifetime values.

## How to Negotiate

Never accept the first offer. Brands typically start 30-40% below their actual budget. Counter with your rate card and justify it with your engagement metrics, not just subscriber count.

## What to Include in Your Rate Card

Your rate card should list rates for: dedicated videos, integrations, Shorts/Reels, Instagram Stories, and bundle packages. Always offer a multi-platform bundle at a 30-50% premium.

---

*Want personalized rate card advice? Try the TenX Creator Business Advisor — it builds rate cards specific to your niche and metrics.*`,
  },
  'instagram-reels-algorithm-2026': {
    title: 'How the Instagram Reels Algorithm Works in 2026',
    description: 'Understanding the signals that determine Reels distribution and reach.',
    content: `Instagram Reels distribution is driven by a specific set of signals that you can optimize for.

## The Signals That Matter

**Completion Rate** is the most important signal. If viewers watch your Reel to the end, Instagram pushes it further. Aim for 50%+ average watch time.

**Share Rate** is the second strongest signal. Content that gets shared via DM or to Stories gets dramatically more distribution.

**Save Rate** indicates the content has lasting value. Educational and how-to Reels tend to get more saves.

## First 1.5 Seconds

Your Reel has about 1.5 seconds to stop the scroll. Use text hooks, surprising visuals, or pattern interrupts.

## India-Specific Insights

Indian Instagram audiences are heavily mobile-first. Vertical format is mandatory. Regional language Reels often outperform English content in engagement rates.

---

*Get personalized Reels strategy from the TenX Creator Growth Advisor.*`,
  },
  'gst-guide-indian-creators': {
    title: 'Complete GST Guide for Indian Creators',
    description: 'Everything Indian creators need to know about GST registration, filing, and compliance.',
    content: `GST compliance is one of the most confusing parts of running a creator business in India. Here is a simplified breakdown.

## When to Register

GST registration becomes mandatory when your annual turnover exceeds 20 lakh rupees. This includes all creator income: AdSense, brand deals, course sales, and affiliate commissions.

## Which Rate Applies

Most creator services fall under 18% GST. This applies to brand deal income, consulting, and course sales.

## Foreign Brand Payments

Payments from foreign brands (including Google AdSense) are treated as export of services and may be zero-rated under IGST. Keep documentation of the foreign entity and payment receipts.

## Filing Frequency

Quarterly filing for turnover under 5 crore, monthly otherwise. Always set aside the GST component of every brand deal payment immediately.

---

*Get a complete tax plan from the TenX Creator Business Advisor.*`,
  },
  'cross-platform-content-strategy': {
    title: 'Cross-Platform Content Strategy: Create Once, Distribute Everywhere',
    description: 'How to repurpose one video into content for every platform.',
    content: `The best creators don't create more — they distribute smarter.

## The One-to-Many Framework

Start with one long-form piece (YouTube video, blog post, or podcast episode). Then extract:

- **3-5 short clips** for Reels, TikTok, and Shorts
- **A Twitter/X thread** summarizing the key points
- **A LinkedIn post** with the professional angle
- **A newsletter** with the behind-the-scenes story
- **An Instagram carousel** with the key takeaways as slides

## Platform-Specific Adaptation

Don't just cross-post. Each platform has different audience expectations. A TikTok clip needs a faster hook than a YouTube Short. A LinkedIn post needs professional framing that would feel stiff on Instagram.

## The 80/20 Rule

80% of your content should come from repurposing. 20% should be platform-native content that only works on that specific platform.

---

*Get a personalized cross-platform calendar from the TenX Creator Growth Advisor.*`,
  },
  'creator-money-system': {
    title: 'The Creator Money System: Stop Living Paycheck to Paycheck',
    description: 'The exact allocation framework for every rupee of creator income.',
    content: `Most creators earn well but save nothing. The Creator Money System fixes that by allocating every payment before you spend it.

## The Allocation Framework

When money comes in, split it immediately:

- **30% Tax Bucket** — Set aside for income tax and advance tax payments
- **GST Bucket** — The GST component of every brand deal
- **15-20% Business Reinvestment** — Equipment, software, courses, team
- **Emergency Fund** — Until you have 6 months of living expenses
- **Fixed Personal Salary** — Pay yourself the same amount every month
- **Wealth Building** — Everything remaining goes to long-term investments

## Why Fixed Salary Matters

Variable income is the creator's biggest financial enemy. A fixed monthly salary transfer from your business account to your personal account removes the emotional spending that comes with windfall months.

## Investment Priority

1. Emergency fund (6 months expenses)
2. SIP in index mutual funds
3. PPF for tax-free returns + Section 80C deduction
4. NPS for additional tax benefits
5. Diversify into REITs or property

---

*Get a complete financial plan from the TenX Creator Business Advisor.*`,
  },
  'tiktok-vs-youtube-shorts-vs-reels': {
    title: 'TikTok vs YouTube Shorts vs Instagram Reels: Where to Focus',
    description: 'Platform comparison for creators choosing where to invest their short-form energy.',
    content: `You can't be everywhere at once. Here's how to choose.

## Algorithm Differences

**TikTok** rewards discovery — your content reaches non-followers easily. Best for growing from zero.

**YouTube Shorts** feeds into your long-form channel. Best for creators who want Shorts to drive subscribers and watch time.

**Instagram Reels** rewards existing engagement. Best for creators with an established Instagram presence.

## Monetization

- **TikTok**: Creator Fund pays poorly. Money is in brand deals and TikTok Shop.
- **YouTube Shorts**: Revenue sharing (45%) from Shorts feed ads. Growing but modest.
- **Instagram Reels**: No direct monetization. Money is in brand deals and driving traffic to products.

## India-Specific

TikTok is banned in India. Focus on YouTube Shorts and Instagram Reels. Shorts has the distribution advantage; Reels has the brand deal advantage.

## The Verdict

If starting from zero: TikTok (where available) or YouTube Shorts.
If building a business: YouTube Shorts (feeds long-form) + Instagram Reels (brand deals).

---

*Get platform-specific strategy from the TenX Creator Growth Advisor.*`,
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: 'Article Not Found' };
  return { title: `${article.title} — TenX Creator`, description: article.description };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Article not found</h1>
          <Link href="/blog" className="text-white/40 hover:text-white/80 text-sm">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="flex items-center justify-between max-w-3xl mx-auto px-4 py-4">
        <Link href="/blog" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Blog
        </Link>
        <Link
          href="/chat"
          className="text-sm btn-primary font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
        >
          Try the Advisor
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
        <MarkdownContent content={article.content} />

        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Get personalized advice</h3>
          <p className="text-white/50 text-sm mb-4">Three AI advisors ready to help with your specific situation.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 btn-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all text-sm"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>
    </div>
  );
}
