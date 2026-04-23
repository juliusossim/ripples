import { Card } from '@org/ui-primitives';
import type { ReactElement } from 'react';

function SkeletonBlock({ className }: Readonly<{ className: string }>): ReactElement {
  return <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />;
}

export function FeedSkeletonCard(): ReactElement {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-white/8 bg-[#08172b] p-0 text-white shadow-[0_22px_90px_rgba(4,11,24,0.18)]">
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
          </div>
          <SkeletonBlock className="h-8 w-20" />
        </div>
        <div className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-white/10" />
        <div className="space-y-3">
          <SkeletonBlock className="h-5 w-2/3 rounded-md" />
          <SkeletonBlock className="h-4 w-full rounded-md" />
          <SkeletonBlock className="h-4 w-5/6 rounded-md" />
          <div className="flex gap-2 pt-2">
            <SkeletonBlock className="h-10 w-24" />
            <SkeletonBlock className="h-10 w-24" />
            <SkeletonBlock className="h-10 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
