'use client';

import { useState, useRef } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import type { DomainTag } from '@/lib/router';

type Props = {
  content: string;
  domainTag: DomainTag;
  onClose: () => void;
};

const domainLabels: Record<DomainTag, string> = {
  growth: '📈 Growth',
  business: '💼 Business',
  operations: '⚙️ Operations',
};

const domainGradients: Record<DomainTag, string> = {
  growth: 'from-emerald-900 to-emerald-950',
  business: 'from-blue-900 to-blue-950',
  operations: 'from-purple-900 to-purple-950',
};

export function ShareCard({ content, domainTag, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);

  // Truncate content for card
  const truncated = content.length > 500 ? content.slice(0, 500) + '...' : content;

  async function copyAsText() {
    try {
      await navigator.clipboard.writeText(`${truncated}\n\n— TenX Creator (tenxcreator.com)`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text for manual copy
      console.warn('Clipboard write failed — user must copy manually');
    }
  }

  async function downloadAsImage() {
    if (!cardRef.current) return;
    try {
      // Use canvas to render the card as image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 400;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const colors = domainTag === 'growth'
        ? ['#064e3b', '#022c22']
        : domainTag === 'business'
          ? ['#1e3a5f', '#0c1929']
          : ['#3b0764', '#1a0533'];
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.roundRect(0, 0, canvas.width, canvas.height, 16);
      ctx.fill();

      // Domain tag
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '14px system-ui';
      ctx.fillText(domainLabels[domainTag], 24, 36);

      // Content
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '15px system-ui';
      const lines = wrapText(ctx, truncated.slice(0, 300), 552);
      lines.forEach((line, i) => {
        ctx.fillText(line, 24, 65 + i * 22);
      });

      // Branding
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = '12px system-ui';
      ctx.fillText('TenX Creator — tenxcreator.com', 24, canvas.height - 20);

      // Download
      const link = document.createElement('a');
      link.download = 'tenx-creator-insight.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      setDownloadFailed(true);
      setTimeout(() => setDownloadFailed(false), 3000);
    }
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
      if (lines.length >= 12) break; // Max lines
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Preview card */}
        <div
          ref={cardRef}
          className={`bg-gradient-to-b ${domainGradients[domainTag]} rounded-2xl p-6 mb-4 border border-white/10`}
        >
          <div className="text-white/50 text-xs mb-3">{domainLabels[domainTag]}</div>
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{truncated}</p>
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-white/30 text-[10px]">TenX Creator — tenxcreator.com</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={copyAsText}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={downloadAsImage}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm transition-all"
          >
            <Download className="w-4 h-4" /> {downloadFailed ? 'Failed — try Copy' : 'Save Image'}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
