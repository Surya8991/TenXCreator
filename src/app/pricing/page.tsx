import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — TenX Creator',
  description: 'Free and Pro plans for TenX Creator AI advisor.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with real advice',
    cta: 'Start free',
    ctaHref: '/onboarding',
    highlight: false,
    features: [
      { text: '10 messages per day', included: true },
      { text: 'All 9 quick modes', included: true },
      { text: 'Smart advisor routing', included: true },
      { text: '20 countries supported', included: true },
      { text: 'Conversation history', included: true },
      { text: 'Rate card (text)', included: true },
      { text: 'Rate card PDF export', included: false },
      { text: 'Shareable output cards', included: false },
      { text: 'Brand deal tracker', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    priceInr: '₹499',
    period: '/month',
    description: 'For creators serious about growth',
    cta: 'Coming soon',
    ctaHref: '#',
    highlight: true,
    features: [
      { text: 'Unlimited messages', included: true },
      { text: 'All 9 quick modes', included: true },
      { text: 'Smart advisor routing', included: true },
      { text: '20 countries supported', included: true },
      { text: 'Conversation history', included: true },
      { text: 'Rate card (text + PDF)', included: true },
      { text: 'Shareable output cards (no watermark)', included: true },
      { text: 'Brand deal tracker', included: true },
      { text: 'Priority response speed', included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="flex items-center justify-between max-w-5xl mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-white font-bold text-lg">TenX Creator</span>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Simple pricing</h1>
          <p className="text-white/40">Free tier gives real value. Pro unlocks everything.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 border ${
                plan.highlight
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Most popular</div>
              )}
              <h2 className="text-xl font-bold text-white">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-white/40 text-sm">{plan.period}</span>
                {plan.priceInr && (
                  <span className="text-white/30 text-xs ml-2">({plan.priceInr}/mo in India)</span>
                )}
              </div>
              <p className="text-white/40 text-sm mt-2 mb-6">{plan.description}</p>

              <Link
                href={plan.ctaHref}
                className={`block text-center py-2.5 rounded-xl font-medium text-sm transition-all ${
                  plan.highlight
                    ? 'btn-primary'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta} {plan.ctaHref !== '#' && <ArrowRight className="w-3.5 h-3.5 inline ml-1" />}
              </Link>

              <div className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-white/20 shrink-0" />
                    )}
                    <span className={f.included ? 'text-white/70' : 'text-white/30'}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
