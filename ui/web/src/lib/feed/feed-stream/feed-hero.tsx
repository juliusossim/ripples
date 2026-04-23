import { Badge, Card } from '@org/ui-primitives';
import type { ReactElement } from 'react';

const heroHighlights = [
  {
    body: 'Ranked listing posts with the pace of a social scroll, not a static catalog.',
    title: 'Feed rhythm',
  },
  {
    body: 'Views, likes, saves, and shares stack beside recency and ripple score.',
    title: 'Signal layer',
  },
  {
    body: 'Media-first cards make every listing feel publishable, shareable, and alive.',
    title: 'Social feel',
  },
] as const;

export function FeedHero(): ReactElement {
  return (
    <section className="space-y-5 rounded-[2rem] bg-[linear-gradient(135deg,#06162b_0%,#0b2342_50%,rgba(178,140,68,0.86)_100%)] px-5 py-8 text-white shadow-[0_26px_120px_rgba(4,12,30,0.2)] sm:px-8 sm:py-10">
      <div className="space-y-3">
        <Badge className="rounded-full bg-white/12 px-4 py-1.5 text-[11px] uppercase tracking-[0.26em] text-white">
          Feed-first discovery
        </Badge>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          A property stream that feels social, but still ranks like a decision tool.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
          Every listing arrives as a media-first post with ranking cues, buyer momentum, and
          lightweight actions that keep the feed moving.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {heroHighlights.map((highlight) => (
          <Card
            className="rounded-[1.5rem] border-white/10 bg-white/10 p-5 text-white shadow-none backdrop-blur-xl"
            key={highlight.title}
          >
            <p className="text-sm font-semibold">{highlight.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/68">{highlight.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
