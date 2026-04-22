'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import useGetAuditEventDetailQuery from '@/modules/audit-events/application/getAuditEventDetailQuery';

import { actionTone, actorTone, Badge } from '@/components/ui/Badge';
import { auditEventRepository } from '../_repository';

export default function AuditEventDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: event, isLoading, isError } = useGetAuditEventDetailQuery(auditEventRepository, params.id);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading audit event…</p>;
  }

  if (isError || !event) {
    return (
      <div className="space-y-4">
        <Link href="/audit-events" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to events
        </Link>
        <p className="text-red-400">Audit event not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/audit-events" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to events
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{event.eventName}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge tone={actionTone(event.action)}>{event.action}</Badge>
          <Badge tone={actorTone(event.actorType)}>{event.actorType}</Badge>
          <span>·</span>
          <span>{format(new Date(event.occurredAt), 'PPpp')}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Source">
          <Field label="Application" value={event.sourceApp} />
          <Field label="Environment" value={event.sourceEnv} />
          <Field label="Organization" value={event.organizationId ?? '—'} />
        </Card>

        <Card title="Resource">
          <Field label="Type" value={event.resourceType} />
          <Field label="ID" value={event.resourceId} mono />
        </Card>

        <Card title="Actor">
          <Field label="Type" value={event.actorType} />
          <Field label="ID" value={event.actorId ?? '—'} mono />
          <Field label="Label" value={event.actorLabel ?? '—'} />
        </Card>

        <Card title="Tracing">
          <Field label="Request" value={event.requestId ?? '—'} mono />
          <Field label="Correlation" value={event.correlationId ?? '—'} mono />
          <Field label="Causation" value={event.causationId ?? '—'} mono />
        </Card>
      </div>

      {event.changes && event.changes.length > 0 && (
        <Card title="Changes">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Path</th>
                <th className="py-2">Before</th>
                <th className="py-2">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {event.changes.map((change, idx) => (
                <tr key={`${change.path}-${idx}`}>
                  <td className="py-2 font-mono text-xs">{change.path}</td>
                  <td className="py-2 font-mono text-xs text-red-300">{JSON.stringify(change.before)}</td>
                  <td className="py-2 font-mono text-xs text-emerald-300">{JSON.stringify(change.after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <PayloadCard title="Before" data={event.before} />
        <PayloadCard title="After" data={event.after} />
      </div>

      {event.metadata && Object.keys(event.metadata).length > 0 && (
        <PayloadCard title="Metadata" data={event.metadata} />
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-muted/20 p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="space-y-2 text-sm">{children}</div>
    </section>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'font-mono text-xs' : ''}>{value}</span>
    </div>
  );
}

function PayloadCard({ title, data }: { title: string; data?: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <Card title={title}>
      <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}
