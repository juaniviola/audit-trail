import { GenerateUuid } from 'src/shared/infrastructure/utils/generate.uuid';

import { RequestLog, RequestLogPrimitiveProps } from '../domain/request.log';

export class RequestLogObjectMother {
  public static random(): RequestLog {
    return RequestLog.fromPrimitives(this.randomProps());
  }

  public static withProps(overrides: Partial<RequestLogPrimitiveProps> = {}): RequestLog {
    return RequestLog.fromPrimitives({ ...this.randomProps(), ...overrides });
  }

  public static randomProps(): RequestLogPrimitiveProps {
    const now = new Date();
    return {
      id: GenerateUuid.new(),
      sourceApp: 'audit-trail-api',
      sourceEnv: 'production',
      method: 'POST',
      path: '/v1/audit-events',
      route: '/v1/audit-events',
      status: 201,
      durationMs: 42,
      actorType: 'user',
      actorId: GenerateUuid.new(),
      actorLabel: 'jane.doe@example.com',
      organizationId: GenerateUuid.new(),
      requestId: GenerateUuid.new(),
      correlationId: GenerateUuid.new(),
      ip: '127.0.0.1',
      userAgent: 'jest',
      referer: null,
      origin: 'http://localhost:3000',
      requestBody: { sourceApp: 'orders-api' },
      responseBody: null,
      query: {},
      errorCode: null,
      errorMessage: null,
      occurredAt: now,
      ingestedAt: now,
    };
  }

  public static randomFailure(): RequestLog {
    return this.withProps({
      status: 500,
      errorCode: 'INTERNAL_ERROR',
      errorMessage: 'Unexpected failure',
      responseBody: { error: 'Internal server error' },
    });
  }

  public static randomAnonymous(): RequestLog {
    return this.withProps({
      actorType: 'anonymous',
      actorId: null,
      actorLabel: null,
      organizationId: null,
    });
  }
}
