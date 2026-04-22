'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import useGetRequestLogDetailQuery from '@/modules/request-logs/application/getRequestLogDetailQuery';

import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { requestLogRepository } from '../_repository';

function statusTone(status: number): BadgeTone {
  if (status >= 500) return 'danger';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'neutral';
  return 'success';
}

export default function RequestLogDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: log, isLoading, isError } = useGetRequestLogDetailQuery(requestLogRepository, params.id);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading request log…</p>;
  }

  if (isError || !log) {
    return (
      <div className="space-y-4">
        <Link href="/request-logs" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to logs
        </Link>
        <p className="text-red-400">Request log not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/request-logs" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to logs
        </Link>
        <h1 className="mt-2 font-mono text-xl font-semibold tracking-tight">
          {log.method} {log.path}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge tone={statusTone(log.status)}>{log.status}</Badge>
          <span>{log.durationMs} ms</span>
          <span>·</span>
          <span>{format(new Date(log.occurredAt), 'PPpp')}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Source">
          <Field label="Application" value={log.sourceApp} />
          <Field label="Environment" value={log.sourceEnv} />
          <Field label="Route" value={log.route ?? '—'} mono />
        </Card>

        <Card title="Actor">
          <Field label="Type" value={log.actorType ?? 'anonymous'} />
          <Field label="ID" value={log.actorId ?? '—'} mono />
          <Field label="Label" value={log.actorLabel ?? '—'} />
          <Field label="Organization" value={log.organizationId ?? '—'} mono />
        </Card>

        <Card title="Tracing">
          <Field label="Request" value={log.requestId ?? '—'} mono />
          <Field label="Correlation" value={log.correlationId ?? '—'} mono />
          {log.correlationId && (
            <Link
              href={`/audit-events?filters=${encodeURIComponent(
                JSON.stringify([{ field: 'correlationId', operator: '=', value: log.correlationId }]),
              )}`}
              className="text-xs text-primary hover:underline"
            >
              → Related audit events
            </Link>
          )}
        </Card>

        <Card title="Transport">
          <Field label="IP" value={log.ip ?? '—'} mono />
          <Field label="Origin" value={log.origin ?? '—'} mono />
          <Field label="Referer" value={log.referer ?? '—'} mono />
          <Field label="User-Agent" value={log.userAgent ?? '—'} />
        </Card>
      </div>

      {log.errorCode || log.errorMessage ? (
        <Card title="Error">
          <Field label="Code" value={log.errorCode ?? '—'} mono />
          <Field label="Message" value={log.errorMessage ?? '—'} />
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <PayloadCard title="Query" data={log.query} />
        <PayloadCard title="Request body" data={log.requestBody} />
      </div>

      {log.responseBody && <PayloadCard title="Response body" data={log.responseBody} />}
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
      <span className={mono ? 'font-mono text-xs break-all' : 'break-all text-right'}>{value}</span>
    </div>
  );
}

function PayloadCard({ title, data }: { title: string; data?: Record<string, unknown> | null }) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <Card title={title}>
      <pre className="overflow-auto rounded-md bg-background p-3 font-mono text-xs leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
}
