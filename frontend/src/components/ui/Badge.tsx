import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

const TONES = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-500/10 text-emerald-300',
  warning: 'bg-amber-500/10 text-amber-300',
  danger: 'bg-red-500/10 text-red-300',
  info: 'bg-indigo-500/10 text-indigo-300',
} as const;

export type BadgeTone = keyof typeof TONES;

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function actorTone(actorType: string): BadgeTone {
  switch (actorType) {
    case 'user':
      return 'info';
    case 'system':
      return 'neutral';
    case 'service':
      return 'success';
    case 'api_key':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function actionTone(action: string): BadgeTone {
  const lower = action.toLowerCase();
  if (lower.includes('delete')) return 'danger';
  if (lower.includes('create')) return 'success';
  if (lower.includes('update') || lower.includes('change')) return 'warning';
  return 'info';
}
