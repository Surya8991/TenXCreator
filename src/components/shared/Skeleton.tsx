'use client';

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-white/5 rounded-lg', className)} />
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full bg-gray-950 p-4"> {/* bg-gray-950 is overridden in light mode via globals.css */}
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div>
          <Skeleton className="w-24 h-4 mb-1" />
          <Skeleton className="w-40 h-3" />
        </div>
      </div>
      {/* Message skeletons */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-end">
          <Skeleton className="w-48 h-12 rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="w-72 h-24 rounded-2xl" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="w-56 h-12 rounded-2xl" />
        </div>
        <div className="flex justify-start">
          <Skeleton className="w-64 h-32 rounded-2xl" />
        </div>
      </div>
      {/* Input skeleton */}
      <div className="mt-4">
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  );
}
