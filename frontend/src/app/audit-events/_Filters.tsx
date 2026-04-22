'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { AuditActorType } from '@/modules/audit-events/domain/auditEvent';
import Filter from '@/modules/shared/domain/filter';

export interface AuditEventFiltersState {
  eventName: string;
  sourceApp: string;
  sourceEnv: string;
  action: string;
  resourceType: string;
  resourceId: string;
  actorType: AuditActorType | '';
  actorId: string;
  actorLabel: string;
  organizationId: string;
  correlationId: string;
  from: string;
  to: string;
}

export const EMPTY_FILTERS: AuditEventFiltersState = {
  eventName: '',
  sourceApp: '',
  sourceEnv: '',
  action: '',
  resourceType: '',
  resourceId: '',
  actorType: '',
  actorId: '',
  actorLabel: '',
  organizationId: '',
  correlationId: '',
  from: '',
  to: '',
};

const ACTOR_TYPES: AuditActorType[] = ['user', 'system', 'service', 'api_key'];

const SOURCE_ENVS = ['dev', 'staging', 'prod'];

function toIsoOrEmpty(local: string): string {
  if (!local) return '';
  const date = new Date(local);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

export function buildFilters(state: AuditEventFiltersState): Filter[] {
  const out: Filter[] = [];

  const text = (field: string, value: string, op: Filter['operator'] = 'CONTAINS') => {
    const v = value.trim();
    if (v) out.push({ field, operator: op, value: v });
  };

  text('event_name', state.eventName, 'CONTAINS');
  text('source_app', state.sourceApp, 'CONTAINS');
  text('action', state.action, 'CONTAINS');
  text('resource_type', state.resourceType, 'CONTAINS');
  text('resource_id', state.resourceId, '=');
  text('actor_id', state.actorId, '=');
  text('actor_label', state.actorLabel, 'CONTAINS');
  text('organization_id', state.organizationId, '=');
  text('correlation_id', state.correlationId, '=');

  if (state.sourceEnv) out.push({ field: 'source_env', operator: '=', value: state.sourceEnv });
  if (state.actorType) out.push({ field: 'actor_type', operator: '=', value: state.actorType });

  const fromIso = toIsoOrEmpty(state.from);
  if (fromIso) out.push({ field: 'occurred_at', operator: '>', value: fromIso });
  const toIso = toIsoOrEmpty(state.to);
  if (toIso) out.push({ field: 'occurred_at', operator: '<', value: toIso });

  return out;
}

export function countActive(state: AuditEventFiltersState): number {
  return (Object.keys(state) as Array<keyof AuditEventFiltersState>).reduce(
    (acc, key) => acc + (state[key] ? 1 : 0),
    0,
  );
}

interface FiltersPanelProps {
  value: AuditEventFiltersState;
  onChange: (next: AuditEventFiltersState) => void;
}

export function FiltersPanel({ value, onChange }: FiltersPanelProps) {
  const [open, setOpen] = useState(false);
  const active = useMemo(() => countActive(value), [value]);

  const set =
    <K extends keyof AuditEventFiltersState>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [key]: e.target.value as AuditEventFiltersState[K] });

  const clearAll = () => onChange(EMPTY_FILTERS);

  return (
    <div className="rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <ChevronIcon open={open} />
          Filters
          {active > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 py-0.5 text-xs font-semibold text-primary">
              {active}
            </span>
          )}
        </span>
        {active > 0 && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                clearAll();
              }
            }}
            className="cursor-pointer text-xs font-normal text-muted-foreground hover:text-foreground"
          >
            Clear all
          </span>
        )}
      </button>

      {open && (
        <div className="border-t border-border px-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Section title="Event">
              <Field label="Event name">
                <TextInput value={value.eventName} onChange={set('eventName')} placeholder="order.created" />
              </Field>
              <Field label="Action">
                <TextInput value={value.action} onChange={set('action')} placeholder="create / update / delete" />
              </Field>
            </Section>

            <Section title="Source">
              <Field label="Application">
                <TextInput value={value.sourceApp} onChange={set('sourceApp')} placeholder="orders-api" />
              </Field>
              <Field label="Environment">
                <SelectInput value={value.sourceEnv} onChange={set('sourceEnv')}>
                  <option value="">Any</option>
                  {SOURCE_ENVS.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </Section>

            <Section title="Resource">
              <Field label="Type">
                <TextInput value={value.resourceType} onChange={set('resourceType')} placeholder="order" />
              </Field>
              <Field label="ID (exact)">
                <TextInput value={value.resourceId} onChange={set('resourceId')} placeholder="uuid or identifier" />
              </Field>
            </Section>

            <Section title="Actor">
              <Field label="Type">
                <SelectInput value={value.actorType} onChange={set('actorType')}>
                  <option value="">Any</option>
                  {ACTOR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="ID (exact)">
                <TextInput value={value.actorId} onChange={set('actorId')} placeholder="uuid" />
              </Field>
              <Field label="Label">
                <TextInput value={value.actorLabel} onChange={set('actorLabel')} placeholder="alice@kuntur.io" />
              </Field>
            </Section>

            <Section title="Context">
              <Field label="Organization ID">
                <TextInput
                  value={value.organizationId}
                  onChange={set('organizationId')}
                  placeholder="org-uuid"
                />
              </Field>
              <Field label="Correlation ID">
                <TextInput
                  value={value.correlationId}
                  onChange={set('correlationId')}
                  placeholder="req-uuid"
                />
              </Field>
            </Section>

            <Section title="Occurred at">
              <Field label="From">
                <DateInput value={value.from} onChange={set('from')} />
              </Field>
              <Field label="To">
                <DateInput value={value.to} onChange={set('to')} />
              </Field>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const INPUT_CLASS =
  'h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary';

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={INPUT_CLASS} />;
}

function DateInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="datetime-local"
      {...props}
      className={`${INPUT_CLASS} [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100`}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={INPUT_CLASS} />;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-transform ${open ? 'rotate-90' : ''}`}
      aria-hidden="true"
    >
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
