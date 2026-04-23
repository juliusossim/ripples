import { Bookmark, Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react';
import { Button, Item, cn } from '@org/ui-primitives';
import type { ReactElement } from 'react';
import type {
  ActionDef,
  SocialInteractionAction,
  SocialInteractionsProps,
} from './social-interactions.types';

function formatMetric(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString();
}

function getActionColorClass(
  activeClassName: string,
  inactiveInlineClassName: string,
  isActive: boolean | undefined,
  variant: SocialInteractionsProps['variant'],
): string {
  if (isActive) {
    return activeClassName;
  }

  return variant === 'overlay' ? 'text-white' : inactiveInlineClassName;
}

function getReglamColorClass(
  isActive: boolean | undefined,
  reglamEnabled: boolean | undefined,
  variant: SocialInteractionsProps['variant'],
): string {
  if (isActive) {
    return 'fill-emerald-500 text-emerald-500';
  }

  if (variant === 'overlay') {
    return reglamEnabled ? 'text-amber-300' : 'text-white';
  }

  return 'text-emerald-500';
}

function getReglamValue(
  reglamMeta: SocialInteractionsProps['reglamMeta'],
  reglams: number,
  variant: SocialInteractionsProps['variant'],
): string {
  if (variant === 'overlay' && reglamMeta?.enabled) {
    return `${reglamMeta.commissionRate}%`;
  }

  return formatMetric(reglams);
}

function buildActions({
  counts,
  onInteraction,
  reglamMeta,
  state,
  variant,
}: Readonly<Required<Pick<SocialInteractionsProps, 'variant'>> & Omit<SocialInteractionsProps, 'variant'>>): ActionDef[] {
  const likes = counts?.likes ?? 0;
  const saves = counts?.saves ?? 0;
  const comments = counts?.comments ?? 0;
  const shares = counts?.shares ?? 0;
  const reglams = counts?.reglams ?? 0;

  const baseActions: ActionDef[] = [
    {
      id: 'like',
      icon: (
        <Heart
          className={cn(
            'h-5 w-5',
            getActionColorClass('fill-rose-500 text-rose-500', 'text-rose-500', state?.liked, variant),
          )}
        />
      ),
      label: 'Likes',
      onClick: () => onInteraction?.('like'),
      value: formatMetric(likes),
    },
    {
      id: 'save',
      icon: (
        <Bookmark
          className={cn(
            'h-5 w-5',
            getActionColorClass(
              'fill-amber-300 text-amber-300',
              'text-amber-500',
              state?.saved,
              variant,
            ),
          )}
        />
      ),
      label: 'Saves',
      onClick: () => onInteraction?.('save'),
      value: formatMetric(saves),
    },
    {
      id: 'comment',
      icon: (
        <MessageCircle
          className={cn('h-5 w-5', variant === 'overlay' ? 'text-white' : 'text-muted-foreground')}
        />
      ),
      label: 'Comments',
      onClick: () => onInteraction?.('comment'),
      value: formatMetric(comments),
    },
    {
      id: 'share',
      icon: (
        <Share2
          className={cn(
            'h-5 w-5',
            getActionColorClass('fill-sky-500 text-sky-500', 'text-sky-500', state?.shared, variant),
          )}
        />
      ),
      label: 'Shares',
      onClick: () => onInteraction?.('share'),
      value: formatMetric(shares),
    },
  ];

  const reglamAction: ActionDef = {
    id: 'reglam',
    icon: (
      <Repeat2
          className={cn(
            'h-5 w-5',
            getReglamColorClass(state?.reglammed, reglamMeta?.enabled, variant),
          )}
        />
      ),
    label: variant === 'overlay' && reglamMeta?.enabled ? 'Reglam & Earn' : 'Reglams',
    onClick: () =>
      onInteraction?.('reglam', reglamMeta?.enabled ? { commissionRate: reglamMeta.commissionRate } : undefined),
    value: getReglamValue(reglamMeta, reglams, variant),
  };

  return [...baseActions, reglamAction];
}

function InlineLayout({ actions }: Readonly<{ actions: readonly ActionDef[] }>): ReactElement {
  return (
    <Item className="flex flex-row flex-nowrap">
      {actions.map((action) => (
        <div key={action.id} className="flex flex-col items-center gap-0.5">
          <Button
            className="cursor-pointer p-0"
            onClick={action.onClick}
            size="icon"
            variant="ghost"
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

function OverlayLayout({ actions }: Readonly<{ actions: readonly ActionDef[] }>): ReactElement {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3 sm:bottom-5 sm:right-5">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          className="flex flex-col items-center gap-1 rounded-full border border-white/12 bg-slate-950/55 px-3 py-3 text-white shadow-[0_12px_28px_rgba(4,11,24,0.16)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5"
        >
          {action.icon}
          <span className="text-[11px] font-medium">{action.value}</span>
        </button>
      ))}
    </div>
  );
}

export function SocialInteractions({
  variant = 'inline',
  visibleActions,
  counts,
  state,
  reglamMeta,
  onInteraction,
}: Readonly<SocialInteractionsProps>): ReactElement {
  const actions = buildActions({
    counts,
    onInteraction,
    reglamMeta,
    state,
    variant,
  });
  const visible = visibleActions
    ? actions.filter((action) => visibleActions.includes(action.id as SocialInteractionAction))
    : actions;

  return variant === 'overlay' ? <OverlayLayout actions={visible} /> : <InlineLayout actions={visible} />;
}
