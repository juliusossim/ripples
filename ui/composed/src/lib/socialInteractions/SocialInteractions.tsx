import type { SocialInteractionsProps } from '@org/models';
import { useInteractions } from '@org/shared-data';
import { Bookmark, Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Item } from '../ui/item';
import { cn } from '../utils';

interface ActionDef {
  id: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  value: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

const formatMetric = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

export function SocialInteractions({
  productId,
  variant = 'inline',
  visibleActions,
  fallbackCounts,
  reglamMeta,
  onInteraction,
}: Readonly<SocialInteractionsProps>) {
  const {
    interactions,
    loading,
    toggleLike,
    toggleShare,
    toggleReglam,
    isLiking,
    isSharing,
    isReglaming,
  } = useInteractions(productId);

  const [saved, setSaved] = useState(false);

  const wrap =
    (action: string, fn: () => void, extra?: Record<string, unknown>) => () => {
      fn();
      onInteraction?.(action, extra);
    };

  const likes = interactions.likes || fallbackCounts?.likes || 0;
  const shares = interactions.shares || fallbackCounts?.shares || 0;
  const comments = fallbackCounts?.comments || 0;
  const saves = fallbackCounts?.saves || 0;
  const reglams = interactions.reglams || 0;

  const allActions: ActionDef[] = [
    {
      id: 'like',
      icon: (
        <Heart
          className={cn(
            'h-5 w-5',
            interactions.userLiked
              ? 'fill-rose-500 text-rose-500'
              : variant === 'overlay'
              ? 'text-white'
              : 'text-rose-500'
          )}
        />
      ),
      value: formatMetric(likes),
      label: 'Likes',
      onClick: wrap('like', () => toggleLike()),
      disabled: isLiking || loading,
      active: interactions.userLiked,
    },
    {
      id: 'save',
      icon: (
        <Bookmark
          className={cn(
            'h-5 w-5',
            saved
              ? 'fill-amber-300 text-amber-300'
              : variant === 'overlay'
              ? 'text-white'
              : 'text-amber-500'
          )}
        />
      ),
      value: formatMetric(saves),
      label: 'Saves',
      onClick: wrap('save', () => setSaved((v) => !v)),
      active: saved,
    },
    {
      id: 'comment',
      icon: (
        <MessageCircle
          className={cn(
            'h-5 w-5',
            variant === 'overlay' ? 'text-white' : 'text-muted-foreground'
          )}
        />
      ),
      value: formatMetric(comments),
      label: 'Comments',
    },
    {
      id: 'share',
      icon: (
        <Share2
          className={cn(
            'h-5 w-5',
            interactions.userShared
              ? 'fill-sapphire-500 text-sapphire-500'
              : variant === 'overlay'
              ? 'text-white'
              : 'text-sapphire-500'
          )}
        />
      ),
      value: formatMetric(shares),
      label: 'Shares',
      onClick: wrap('share', () => toggleShare()),
      disabled: isSharing || loading,
      active: interactions.userShared,
    },
    ...(reglamMeta?.enabled
      ? [
          {
            id: 'reglam',
            icon: (
              <Repeat2
                className={cn(
                  'h-5 w-5',
                  interactions.userReglammed
                    ? 'fill-sage-500 text-sage-500'
                    : variant === 'overlay'
                    ? 'text-amber-300'
                    : 'text-sage-500'
                )}
              />
            ),
            value:
              variant === 'overlay'
                ? `${reglamMeta.commissionRate}%`
                : formatMetric(reglams),
            label: variant === 'overlay' ? 'Reglam & Earn' : 'Reglams',
            onClick: wrap('reglam', () => toggleReglam(), {
              commissionRate: reglamMeta.commissionRate,
            }),
            disabled: isReglaming || loading,
            active: interactions.userReglammed,
          },
        ]
      : [
          {
            id: 'reglam',
            icon: (
              <Repeat2
                className={cn(
                  'h-5 w-5',
                  interactions.userReglammed
                    ? 'fill-sage-500 text-sage-500'
                    : variant === 'overlay'
                    ? 'text-white'
                    : 'text-sage-500'
                )}
              />
            ),
            value: formatMetric(reglams),
            label: 'Reglams',
            onClick: wrap('reglam', () => toggleReglam()),
            disabled: isReglaming || loading,
            active: interactions.userReglammed,
          },
        ]),
  ];

  const visible = visibleActions
    ? allActions.filter((a) => visibleActions.includes(a.id as never))
    : allActions;

  if (variant === 'overlay') return <OverlayLayout actions={visible} />;
  return <InlineLayout actions={visible} />;
}

function InlineLayout({ actions }: { actions: ActionDef[] }) {
  return (
    <Item className="flex flex-row flex-nowrap">
      {actions.map((action) => (
        <div key={action.id} className="flex flex-col items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="cursor-pointer p-0"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
          </Button>
          <span className="text-xs text-muted-foreground">
            {action.value} {action.label}
          </span>
        </div>
      ))}
    </Item>
  );
}

function OverlayLayout({ actions }: { actions: ActionDef[] }) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3 sm:bottom-5 sm:right-5">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className="glass-panel flex flex-col items-center gap-1 rounded-full border border-white/12 bg-slate-950/55 px-3 py-3 text-white shadow-[0_12px_28px_rgba(4,11,24,0.16)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {action.icon}
          <span className="text-[11px] font-medium">{action.value}</span>
        </button>
      ))}
    </div>
  );
}

export default SocialInteractions;
