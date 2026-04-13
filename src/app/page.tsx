import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between max-w-5xl mx-auto px-4 py-4">
        <div className="text-white font-bold text-lg">TenX Creator</div>
        <div className="flex items-center gap-4">
          <Link href="/chat" className="text-sm text-white/50 hover:text-white transition-colors">
            Chat
          </Link>
          <Link
            href="/onboarding"
            className="text-sm btn-primary font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <Hero />
      <Features />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to 10x your creator business?
          </h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Free to use. No credit card. Three AI advisors ready to help you grow.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 btn-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-all"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            TenX Creator — AI-powered creator business advisor for 20+ countries.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/pricing" className="text-white/20 hover:text-white/50 transition-colors">Pricing</Link>
            <Link href="/blog" className="text-white/20 hover:text-white/50 transition-colors">Blog</Link>
            <Link href="/terms" className="text-white/20 hover:text-white/50 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-white/20 hover:text-white/50 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
