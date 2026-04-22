'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import useRecordAuditEventMutation from '@/modules/audit-events/application/recordAuditEventMutation';
import { AuditActorType } from '@/modules/audit-events/domain/auditEvent';

import { auditEventRepository } from '../_repository';

const ACTOR_TYPES: AuditActorType[] = ['user', 'system', 'service', 'api_key'];

export default function NewAuditEventPage() {
  const router = useRouter();
  const mutation = useRecordAuditEventMutation(auditEventRepository);

  const [form, setForm] = useState({
    sourceApp: '',
    sourceEnv: 'production',
    eventName: '',
    action: 'create',
    resourceType: '',
    resourceId: '',
    actorType: 'user' as AuditActorType,
    actorId: '',
    actorLabel: '',
    metadata: '',
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    let metadata: Record<string, unknown> | null = null;
    if (form.metadata.trim()) {
      try {
        metadata = JSON.parse(form.metadata);
      } catch {
        alert('Metadata must be valid JSON');
        return;
      }
    }

    const created = await mutation.mutateAsync({
      sourceApp: form.sourceApp,
      sourceEnv: form.sourceEnv,
      eventName: form.eventName,
      action: form.action,
      resourceType: form.resourceType,
      resourceId: form.resourceId,
      actorType: form.actorType,
      actorId: form.actorId || null,
      actorLabel: form.actorLabel || null,
      metadata,
      occurredAt: new Date().toISOString(),
    });

    router.push(`/audit-events/${created.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Record audit event</h1>
        <p className="text-sm text-muted-foreground">Manually publish an audit event for testing or backfills.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border bg-muted/20 p-5">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Source app" required value={form.sourceApp} onChange={(v) => setForm({ ...form, sourceApp: v })} />
          <Input label="Source env" required value={form.sourceEnv} onChange={(v) => setForm({ ...form, sourceEnv: v })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Event name" required value={form.eventName} onChange={(v) => setForm({ ...form, eventName: v })} />
          <Input label="Action" required value={form.action} onChange={(v) => setForm({ ...form, action: v })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Resource type" required value={form.resourceType} onChange={(v) => setForm({ ...form, resourceType: v })} />
          <Input label="Resource ID" required value={form.resourceId} onChange={(v) => setForm({ ...form, resourceId: v })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Actor type</span>
            <select
              className="block h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
              value={form.actorType}
              onChange={(e) => setForm({ ...form, actorType: e.target.value as AuditActorType })}
            >
              {ACTOR_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <Input label="Actor label" value={form.actorLabel} onChange={(v) => setForm({ ...form, actorLabel: v })} />
        </div>

        <Input label="Actor ID" value={form.actorId} onChange={(v) => setForm({ ...form, actorId: v })} />

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Metadata (JSON)</span>
          <textarea
            className="block min-h-32 w-full rounded-md border border-border bg-background p-2 font-mono text-xs"
            placeholder='{"ip":"127.0.0.1"}'
            value={form.metadata}
            onChange={(e) => setForm({ ...form, metadata: e.target.value })}
          />
        </label>

        {mutation.isError && (
          <p className="text-sm text-red-400">Failed to record audit event. Check backend logs.</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push('/audit-events')}
            className="rounded-md border border-border px-3 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {mutation.isPending ? 'Recording…' : 'Record event'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="space-y-1 text-sm">
      <span className="text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>
      <input
        required={required}
        className="block h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
