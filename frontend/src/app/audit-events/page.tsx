'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useDeferredValue, useMemo, useState } from 'react';

import useGetAuditEventsQuery from '@/modules/audit-events/application/getAuditEventsQuery';

import { actionTone, actorTone, Badge } from '@/components/ui/Badge';
import {
  AuditEventFiltersState,
  buildFilters,
  EMPTY_FILTERS,
  FiltersPanel,
} from './_Filters';
import { auditEventRepository } from './_repository';

const PAGE_SIZE = 25;

export default function AuditEventsPage() {
  const [filterState, setFilterState] = useState<AuditEventFiltersState>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);

  const deferredFilterState = useDeferredValue(filterState);
  const filters = useMemo(() => buildFilters(deferredFilterState), [deferredFilterState]);

  const { data, isLoading, isError, isFetching } = useGetAuditEventsQuery({
    repository: auditEventRepository,
    pagination: { offset: page * PAGE_SIZE, limit: PAGE_SIZE },
    filters,
  });

  const total = data?.total ?? 0;
  const events = data?.data ?? [];
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleFilterChange = (next: AuditEventFiltersState) => {
    setPage(0);
    setFilterState(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit events</h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} event{total === 1 ? '' : 's'} ingested across all sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={filterState.eventName}
            onChange={(e) => handleFilterChange({ ...filterState, eventName: e.target.value })}
            placeholder="Search by event name..."
            className="h-9 w-72 rounded-md border border-border bg-muted/40 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <Link
            href="/audit-events/new"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Record event
          </Link>
        </div>
      </div>

      <FiltersPanel value={filterState} onChange={handleFilterChange} />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Occurred</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  Loading audit events…
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-red-400">
                  Failed to load audit events. Make sure the backend is running on{' '}
                  <code className="font-mono text-xs">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</code>.
                </td>
              </tr>
            )}
            {!isLoading && !isError && events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No audit events match the current filters.
                </td>
              </tr>
            )}
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {format(new Date(evt.occurredAt), 'yyyy-MM-dd HH:mm:ss')}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{evt.sourceApp}</div>
                  <div className="text-xs text-muted-foreground">{evt.sourceEnv}</div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/audit-events/${evt.id}`} className="font-medium text-primary hover:underline">
                    {evt.eventName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={actionTone(evt.action)}>{evt.action}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <div>{evt.resourceType}</div>
                  <div className="text-muted-foreground">{evt.resourceId}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={actorTone(evt.actorType)}>{evt.actorType}</Badge>
                  {evt.actorLabel && (
                    <div className="mt-1 text-xs text-muted-foreground">{evt.actorLabel}</div>
                  )}
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
