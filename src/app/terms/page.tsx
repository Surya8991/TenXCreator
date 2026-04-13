import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Terms of Service — TenX Creator' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="max-w-3xl mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80">
          <ArrowLeft className="w-4 h-4" /> <span className="text-white font-bold">TenX Creator</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-sm max-w-none">
        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
        <p className="text-white/50 text-sm">Last updated: April 2026</p>

        <h2 className="text-lg font-semibold text-white mt-8">1. Service</h2>
        <p className="text-white/60">TenX Creator provides AI-powered advisory for content creators. The service generates suggestions and information — it does not constitute professional legal, financial, or tax advice.</p>

        <h2 className="text-lg font-semibold text-white mt-8">2. Disclaimer</h2>
        <p className="text-white/60">AI-generated advice may contain inaccuracies. Rate cards, tax rules, and benchmarks are approximations. Always consult qualified professionals (CA, CPA, lawyer) for high-stakes decisions.</p>

        <h2 className="text-lg font-semibold text-white mt-8">3. User Responsibilities</h2>
        <p className="text-white/60">You are responsible for verifying any advice before acting on it. You agree not to misuse the service or attempt to circumvent usage limits.</p>

        <h2 className="text-lg font-semibold text-white mt-8">4. Data</h2>
        <p className="text-white/60">Conversations are stored locally in your browser. If you create an account, profile data is stored in our database. We do not sell your data. See our Privacy Policy for details.</p>

        <h2 className="text-lg font-semibold text-white mt-8">5. Changes</h2>
        <p className="text-white/60">We may update these terms. Continued use of the service constitutes acceptance of updated terms.</p>

        <h2 className="text-lg font-semibold text-white mt-8">6. Contact</h2>
        <p className="text-white/60">Questions about these terms? Reach out via the app or email.</p>
      </div>
    </div>
  );
}
