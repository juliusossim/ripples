import { cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import { FEED_VIEWS, type FeedView } from '../feed.types';

export interface FilterBarProps {
  readonly activeView: FeedView;
  readonly onChange: (view: FeedView) => void;
}

export function FilterBar({ activeView, onChange }: Readonly<FilterBarProps>): ReactElement {
  return (
    <div className="sticky top-24 z-20 -mx-1 overflow-x-auto px-1">
      <div className="inline-flex min-w-full gap-2 rounded-full border border-white/12 bg-[#08172b]/92 p-1.5 shadow-[0_12px_42px_rgba(4,11,24,0.18)] backdrop-blur-xl">
        {FEED_VIEWS.map((view) => (
          <button
            aria-pressed={activeView === view}
            className={cn(
              'rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300',
              activeView === view
                ? 'bg-[linear-gradient(135deg,rgba(234,197,100,1),rgba(183,143,58,1))] text-slate-950 shadow-[0_8px_28px_rgba(183,143,58,0.24)]'
                : 'text-white/70 hover:bg-white/8 hover:text-white',
            )}
            key={view}
            onClick={() => onChange(view)}
            type="button"
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
