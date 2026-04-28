import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';

import { ApiKeyGuard } from './api-key.guard';

const originalClientIds = process.env.AUDIT_TRAIL_CLIENT_IDS;
const originalApiKeys = process.env.AUDIT_TRAIL_API_KEYS;
const originalSignatureTolerance = process.env.AUDIT_TRAIL_SIGNATURE_TOLERANCE_SECONDS;
const now = new Date('2026-04-27T16:00:00.000Z');

function contextWithRequest(request: {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  originalUrl?: string;
  url?: string;
  rawBody?: Buffer;
}): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function signRequest(params: {
  method?: string;
  path?: string;
  timestamp: string;
  rawBody?: Buffer;
  apiKey: string;
}): string {
  const method = params.method ?? 'POST';
  const path = params.path ?? '/v1/audit-events';
  const rawBody = params.rawBody ?? Buffer.from('{"eventName":"order.created"}');
  const bodyHash = createHash('sha256').update(rawBody).digest('hex');
  const canonicalRequest = [method.toUpperCase(), path, params.timestamp, bodyHash].join('\n');

  return `sha256=${createHmac('sha256', params.apiKey).update(canonicalRequest).digest('hex')}`;
}

function signedContext(
  overrides: {
    clientId?: string;
    apiKey?: string;
    timestamp?: string;
    signature?: string;
    method?: string;
    path?: string;
    rawBody?: Buffer;
  } = {},
): ExecutionContext {
  const clientId = overrides.clientId ?? 'orders-api';
  const apiKey = overrides.apiKey ?? 'orders-secret';
  const timestamp = overrides.timestamp ?? now.toISOString();
  const method = overrides.method ?? 'POST';
  const path = overrides.path ?? '/v1/audit-events';
  const rawBody = overrides.rawBody ?? Buffer.from('{"eventName":"order.created"}');
  const signature = overrides.signature ?? signRequest({ method, path, timestamp, rawBody, apiKey });

  return contextWithRequest({
    method,
    originalUrl: path,
    rawBody,
    headers: {
      'x-audit-trail-client-id': clientId,
      'x-audit-trail-timestamp': timestamp,
      'x-audit-trail-signature': signature,
    },
  });
}

describe('ApiKeyGuard', () => {
  afterEach(() => {
    if (originalClientIds === undefined) {
      delete process.env.AUDIT_TRAIL_CLIENT_IDS;
    } else {
      process.env.AUDIT_TRAIL_CLIENT_IDS = originalClientIds;
    }

    if (originalApiKeys === undefined) {
      delete process.env.AUDIT_TRAIL_API_KEYS;
    } else {
      process.env.AUDIT_TRAIL_API_KEYS = originalApiKeys;
    }

    if (originalSignatureTolerance === undefined) {
      delete process.env.AUDIT_TRAIL_SIGNATURE_TOLERANCE_SECONDS;
    } else {
      process.env.AUDIT_TRAIL_SIGNATURE_TOLERANCE_SECONDS = originalSignatureTolerance;
    }
  });

  it('allows requests signed by a configured client secret', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';

    const guard = new ApiKeyGuard(() => now);

    expect(guard.canActivate(signedContext())).toBe(true);
  });

  it('allows key rotation with repeated client ids', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api,orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'old-secret,new-secret';

    const guard = new ApiKeyGuard(() => now);

    expect(guard.canActivate(signedContext({ apiKey: 'new-secret' }))).toBe(true);
  });

  it('rejects requests without signed authentication headers', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';

    const guard = new ApiKeyGuard(() => now);

    expect(() =>
      guard.canActivate(contextWithRequest({ headers: {}, method: 'POST', originalUrl: '/v1/audit-events' })),
    ).toThrow(UnauthorizedException);
  });

  it('rejects requests from unknown clients', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';

    const guard = new ApiKeyGuard(() => now);

    expect(() => guard.canActivate(signedContext({ clientId: 'unknown-api' }))).toThrow(UnauthorizedException);
  });

  it('rejects requests when the body is tampered after signing', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';
    const signedBody = Buffer.from('{"eventName":"order.created"}');
    const tamperedBody = Buffer.from('{"eventName":"order.deleted"}');
    const timestamp = now.toISOString();
    const signature = signRequest({ timestamp, rawBody: signedBody, apiKey: 'orders-secret' });

    const guard = new ApiKeyGuard(() => now);

    expect(() => guard.canActivate(signedContext({ timestamp, rawBody: tamperedBody, signature }))).toThrow(
      UnauthorizedException,
    );
  });

  it('rejects replayed requests outside the timestamp tolerance', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';
    process.env.AUDIT_TRAIL_SIGNATURE_TOLERANCE_SECONDS = '300';
    const staleTimestamp = new Date(now.getTime() - 301_000).toISOString();

    const guard = new ApiKeyGuard(() => now);

    expect(() => guard.canActivate(signedContext({ timestamp: staleTimestamp }))).toThrow(UnauthorizedException);
  });

  it('fails closed when no signed API clients are configured', () => {
    delete process.env.AUDIT_TRAIL_CLIENT_IDS;
    delete process.env.AUDIT_TRAIL_API_KEYS;

    const guard = new ApiKeyGuard(() => now);

    expect(() => guard.canActivate(signedContext())).toThrow(UnauthorizedException);
  });

  it('fails closed when client ids and API keys are not aligned', () => {
    process.env.AUDIT_TRAIL_CLIENT_IDS = 'orders-api,crm-api';
    process.env.AUDIT_TRAIL_API_KEYS = 'orders-secret';

    const guard = new ApiKeyGuard(() => now);

    expect(() => guard.canActivate(signedContext())).toThrow(UnauthorizedException);
  });
});
