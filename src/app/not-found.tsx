import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-white/10 mb-4">404</div>
        <h1 className="text-xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-white/40 text-sm mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn-primary font-medium px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}
