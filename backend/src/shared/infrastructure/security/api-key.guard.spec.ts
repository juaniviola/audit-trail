import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { ApiKeyGuard } from './api-key.guard';

const originalApiKeys = process.env.AUDIT_TRAIL_API_KEYS;

function contextWithHeaders(headers: Record<string, string | string[] | undefined>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  } as unknown as ExecutionContext;
}

describe('ApiKeyGuard', () => {
  afterEach(() => {
    if (originalApiKeys === undefined) {
      delete process.env.AUDIT_TRAIL_API_KEYS;
      return;
    }

    process.env.AUDIT_TRAIL_API_KEYS = originalApiKeys;
  });

  it('allows requests with a configured API key in x-audit-trail-api-key', () => {
    process.env.AUDIT_TRAIL_API_KEYS = 'client-key';

    const guard = new ApiKeyGuard();

    expect(guard.canActivate(contextWithHeaders({ 'x-audit-trail-api-key': 'client-key' }))).toBe(true);
  });

  it('allows key rotation with comma-separated API keys', () => {
    process.env.AUDIT_TRAIL_API_KEYS = 'old-key, new-key';

    const guard = new ApiKeyGuard();

    expect(guard.canActivate(contextWithHeaders({ 'x-audit-trail-api-key': 'new-key' }))).toBe(true);
  });

  it('rejects requests without an API key', () => {
    process.env.AUDIT_TRAIL_API_KEYS = 'client-key';

    const guard = new ApiKeyGuard();

    expect(() => guard.canActivate(contextWithHeaders({}))).toThrow(UnauthorizedException);
  });

  it('rejects requests with an invalid API key', () => {
    process.env.AUDIT_TRAIL_API_KEYS = 'client-key';

    const guard = new ApiKeyGuard();

    expect(() => guard.canActivate(contextWithHeaders({ 'x-audit-trail-api-key': 'attacker-key' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('fails closed when no backend API keys are configured', () => {
    delete process.env.AUDIT_TRAIL_API_KEYS;

    const guard = new ApiKeyGuard();

    expect(() => guard.canActivate(contextWithHeaders({ 'x-audit-trail-api-key': 'client-key' }))).toThrow(
      UnauthorizedException,
    );
  });
});
