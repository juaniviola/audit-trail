'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

import useGetRequestLogsQuery from '@/modules/request-logs/application/getRequestLogsQuery';
import { Badge, type BadgeTone } from '@/components/ui/Badge';

import { requestLogRepository } from './_repository';

const PAGE_SIZE = 25;

function statusTone(status: number): BadgeTone {
  if (status >= 500) return 'danger';
  if (status >= 400) return 'warning';
  if (status >= 300) return 'neutral';
  return 'success';
}

function methodTone(method: string): BadgeTone {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warning';
    case 'DELETE':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function RequestLogsPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, isFetching } = useGetRequestLogsQuery({
    repository: requestLogRepository,
    pagination: { offset: page * PAGE_SIZE, limit: PAGE_SIZE },
  });

  const total = data?.total ?? 0;
  const logs = data?.data ?? [];
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Request logs</h1>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString()} HTTP request{total === 1 ? '' : 's'} captured (success and failure).
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Occurred</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Correlation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  Loading request logs…
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-red-400">
                  Failed to load request logs.
                </td>
              </tr>
            )}
            {!isLoading && !isError && logs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No request logs yet. Hit the API to generate some traffic.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {format(new Date(log.occurredAt), 'yyyy-MM-dd HH:mm:ss')}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={methodTone(log.method)}>{log.method}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <Link href={`/request-logs/${log.id}`} className="text-primary hover:underline">
                    {log.path}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(log.status)}>{log.status}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{log.durationMs} ms</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground">{log.actorType ?? 'anonymous'}</span>
                  {log.actorLabel && <div className="text-xs">{log.actorLabel}</div>}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                  {log.correlationId?.slice(0, 8) ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page + 1} of {pages} {isFetching && '(refreshing...)'}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
