export type RequestLogActorType = 'user' | 'system' | 'service' | 'api_key' | 'anonymous';

export interface IRequestLogBase {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  method: string;
  path: string;
  route?: string | null;
  status: number;
  durationMs: number;
  actorType?: RequestLogActorType | null;
  actorId?: string | null;
  actorLabel?: string | null;
  organizationId?: string | null;
  correlationId?: string | null;
  occurredAt: string;
  ingestedAt: string;
}

export interface IRequestLogDetail extends IRequestLogBase {
  requestId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  origin?: string | null;
  requestBody?: Record<string, unknown> | null;
  responseBody?: Record<string, unknown> | null;
  query?: Record<string, unknown> | null;
  errorCode?: string | null;
  errorMessage?: string | null;
}
