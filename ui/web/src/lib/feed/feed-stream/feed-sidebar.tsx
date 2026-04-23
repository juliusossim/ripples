import { Badge, Card } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type { FeedView } from '../feed.types';

const rankingSignals = [
  'Fresh listings climb quickly when they arrive with strong media and clear pricing.',
  'Likes, saves, and shares add social weight without overpowering recency.',
  'Ripple score keeps surfacing listings that continue to attract action after first publish.',
] as const;

const publishingTips = [
  'Lead with the strongest image or short walkthrough video.',
  'Keep titles concrete and location-aware so buyers decide faster.',
  'Descriptions should explain intent, not just inventory.',
] as const;

export interface FeedSidebarProps {
  readonly activeView: FeedView;
  readonly count: number;
}

export function FeedSidebar({ activeView, count }: Readonly<FeedSidebarProps>): ReactElement {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      <Card className="rounded-[2rem] border-white/8 bg-[linear-gradient(180deg,#08172b_0%,#0d2039_100%)] p-6 text-white shadow-[0_22px_90px_rgba(4,11,24,0.14)]">
        <Badge className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">
          Now showing
        </Badge>
        <h2 className="mt-4 text-lg font-semibold">{activeView}</h2>
        <p className="mt-2 text-sm leading-6 text-white/72">
          {count} ranked post{count === 1 ? '' : 's'} flowing through the feed right now.
        </p>
      </Card>

      <Card className="rounded-[2rem] border-white/8 bg-[linear-gradient(180deg,#08172b_0%,#0d2039_100%)] p-6 text-white shadow-[0_22px_90px_rgba(4,11,24,0.14)]">
        <h2 className="text-lg font-semibold">Why posts rise</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-white/72">
          {rankingSignals.map((signal) => (
            <p key={signal}>{signal}</p>
          ))}
        </div>
      </Card>

      <Card className="rounded-[2rem] border-white/8 bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] p-6 text-slate-900 shadow-[0_22px_90px_rgba(15,23,42,0.08)]">
        <h2 className="text-lg font-semibold">Make listings travel</h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          {publishingTips.map((tip) => (
            <p key={tip}>{tip}</p>
          ))}
        </div>
      </Card>
    </aside>
  );
}
