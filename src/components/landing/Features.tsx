'use client';

import { Zap, Database, Globe, Shield, Brain, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Smart Routing',
    desc: 'Ask anything — the system auto-detects whether you need growth, business, or operations advice.',
  },
  {
    icon: Database,
    title: 'Live Rate Cards',
    desc: 'Brand deal rates updated by niche, subscriber count, and geography. No outdated guesswork.',
  },
  {
    icon: Globe,
    title: 'India-First',
    desc: 'GST, TDS, advance tax, INR rate cards, diaspora strategy — built for Indian creators.',
  },
  {
    icon: Zap,
    title: 'Quick Modes',
    desc: 'Hook Lab, Deal Review, Data Crisis, Rate Card — one click to specialized help.',
  },
  {
    icon: Shield,
    title: 'Contract Review',
    desc: 'Paste any brand deal contract — get every red flag identified with alternative language.',
  },
  {
    icon: Users,
    title: 'Stage-Calibrated',
    desc: 'Every answer is tuned to your stage — from 0 subscribers to 1M+ operator.',
  },
];

export function Features() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        Everything your creator business needs
      </h2>
      <p className="text-white/40 text-center mb-12 max-w-lg mx-auto">
        Three advisors, zero fluff. Specific, actionable advice backed by real data.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all">
            <Icon className="w-6 h-6 text-white/60 mb-4" />
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-white/40 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
