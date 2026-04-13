import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = { title: 'Privacy Policy — TenX Creator' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="max-w-3xl mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/80">
          <ArrowLeft className="w-4 h-4" /> <span className="text-white font-bold">TenX Creator</span>
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-sm max-w-none">
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
        <p className="text-white/50 text-sm">Last updated: April 2026</p>

        <h2 className="text-lg font-semibold text-white mt-8">What We Collect</h2>
        <p className="text-white/60">When you use TenX Creator without an account, all data (profile, conversations, metrics) is stored locally in your browser. We collect nothing.</p>
        <p className="text-white/60">When you create an account, we store: email address, profile information (niche, country, stage, platforms), and conversation history.</p>

        <h2 className="text-lg font-semibold text-white mt-8">How We Use Your Data</h2>
        <p className="text-white/60">Your data is used solely to provide personalized advisory through the AI advisor. We do not sell, share, or monetize your data.</p>

        <h2 className="text-lg font-semibold text-white mt-8">Third-Party Services</h2>
        <p className="text-white/60">We use Google Gemini and Groq APIs to generate AI responses. Your messages are sent to these services for processing. These services have their own privacy policies.</p>
        <p className="text-white/60">We use Supabase for authentication and data storage when accounts are created.</p>

        <h2 className="text-lg font-semibold text-white mt-8">Data Retention</h2>
        <p className="text-white/60">Local data persists until you clear your browser storage. Account data is retained until you request deletion.</p>

        <h2 className="text-lg font-semibold text-white mt-8">Your Rights</h2>
        <p className="text-white/60">You can request deletion of your account and all associated data at any time. Contact us to exercise this right.</p>

        <h2 className="text-lg font-semibold text-white mt-8">Cookies</h2>
        <p className="text-white/60">We use essential cookies for authentication only. No tracking or advertising cookies are used.</p>

        <h2 className="text-lg font-semibold text-white mt-8">Contact</h2>
        <p className="text-white/60">For privacy concerns, reach out via the app or email.</p>
      </div>
    </div>
  );
}
