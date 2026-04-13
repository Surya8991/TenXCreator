'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 pt-20 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Free · 20 countries · All platforms
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Your AI chief of staff
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
            for your creator business
          </span>
        </h1>

        <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          One advisor that masters YouTube, Instagram, TikTok, X, LinkedIn, podcasts
          and newsletters — covering content strategy, brand deals, tax, finance, and
          tech across 20 countries.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/onboarding"
            className="btn-primary font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="bg-white/5 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >
            See how it works
          </Link>
        </div>

        {/* Value props */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            {
              icon: Sparkles,
              title: 'Not a generic chatbot',
              desc: 'Asks about YOUR niche, metrics, and country. Gives specific numbers, not vague advice.',
              color: '#34d399',
              bg: 'rgba(16,185,129,0.05)',
              border: 'rgba(16,185,129,0.1)',
            },
            {
              icon: Zap,
              title: '9 quick modes',
              desc: 'Hook Lab, Rate Card, Deal Review, Data Crisis, Contract Review — one click to specialized help.',
              color: '#60a5fa',
              bg: 'rgba(59,130,246,0.05)',
              border: 'rgba(59,130,246,0.1)',
            },
            {
              icon: Shield,
              title: '20 countries built in',
              desc: 'Country-specific tax rules, brand deal rates, regulations, and platform advice. From India to the US.',
              color: '#c084fc',
              bg: 'rgba(168,85,247,0.05)',
              border: 'rgba(168,85,247,0.1)',
            },
          ].map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div
              key={title}
              className="rounded-2xl p-5 text-left border"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <Icon className="w-7 h-7 mb-3" style={{ color }} />
              <h3 className="text-white font-semibold mb-1 text-sm">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
