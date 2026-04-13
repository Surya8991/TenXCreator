import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Creator Growth Blog — TenX Creator',
  description: 'Expert guides on YouTube strategy, Instagram growth, brand deals, creator finance, and social media monetization for Indian creators.',
};

const posts = [
  {
    slug: 'youtube-brand-deal-rates-india-2026',
    title: 'YouTube Brand Deal Rates in India (2026)',
    excerpt: 'Complete rate card breakdown by niche and subscriber count. What Indian brands are actually paying creators right now.',
    category: 'Brand Deals',
    readTime: '8 min',
  },
  {
    slug: 'instagram-reels-algorithm-2026',
    title: 'How the Instagram Reels Algorithm Works in 2026',
    excerpt: 'The exact signals that determine Reels distribution. Completion rate, share rate, and the metrics that actually matter.',
    category: 'Instagram',
    readTime: '6 min',
  },
  {
    slug: 'gst-guide-indian-creators',
    title: 'Complete GST Guide for Indian Creators',
    excerpt: 'When to register, what rate applies, how to handle foreign brand payments, and quarterly filing explained simply.',
    category: 'Finance',
    readTime: '10 min',
  },
  {
    slug: 'cross-platform-content-strategy',
    title: 'Cross-Platform Content Strategy: Create Once, Distribute Everywhere',
    excerpt: 'How to repurpose one video into YouTube, Reels, TikTok, Twitter threads, LinkedIn posts, and newsletter content.',
    category: 'Strategy',
    readTime: '7 min',
  },
  {
    slug: 'creator-money-system',
    title: 'The Creator Money System: Stop Living Paycheck to Paycheck',
    excerpt: 'The exact allocation framework for every rupee of creator income. Tax bucket, investment bucket, and building real wealth.',
    category: 'Finance',
    readTime: '9 min',
  },
  {
    slug: 'tiktok-vs-youtube-shorts-vs-reels',
    title: 'TikTok vs YouTube Shorts vs Instagram Reels: Where to Focus',
    excerpt: 'Platform comparison for Indian creators. Algorithm differences, monetization, and which platform fits your niche.',
    category: 'Strategy',
    readTime: '6 min',
  },
];

const categoryColors: Record<string, string> = {
  'Brand Deals': 'bg-blue-500/10 text-blue-400',
  'Instagram': 'bg-pink-500/10 text-pink-400',
  'Finance': 'bg-green-500/10 text-green-400',
  'Strategy': 'bg-purple-500/10 text-purple-400',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="flex items-center justify-between max-w-4xl mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-white font-bold text-lg">TenX Creator</span>
        </Link>
        <Link
          href="/chat"
          className="text-sm btn-primary font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
        >
          Try the Advisor
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Creator Growth Blog</h1>
        <p className="text-white/40 mb-10">
          Expert guides on growing and monetizing your creator business across every platform.
        </p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-white/10 text-white/60'}`}>
                  {post.category}
                </span>
                <span className="text-white/20 text-xs">{post.readTime} read</span>
              </div>
              <h2 className="text-lg font-semibold text-white group-hover:text-white/90 mb-2">
                {post.title}
              </h2>
              <p className="text-white/40 text-sm mb-3">{post.excerpt}</p>
              <span className="text-white/30 text-xs flex items-center gap-1 group-hover:text-white/60 transition-colors">
                Read more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
