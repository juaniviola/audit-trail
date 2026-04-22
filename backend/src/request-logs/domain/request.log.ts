import { AggregateRoot } from 'src/shared/domain/aggregate/aggregate.root';

import { RequestLogRecordedDomainEvent } from './domainEvents/request-log-recorded.domain.event';
import { RequestLogActorId } from './request.log.actorId';
import { RequestLogActorLabel } from './request.log.actorLabel';
import { RequestLogActorType } from './request.log.actorType';
import { RequestLogCorrelationId } from './request.log.correlationId';
import { RequestLogDurationMs } from './request.log.durationMs';
import { RequestLogErrorCode } from './request.log.errorCode';
import { RequestLogErrorMessage } from './request.log.errorMessage';
import { RequestLogId } from './request.log.id';
import { RequestLogIngestedAt } from './request.log.ingestedAt';
import { RequestLogIp } from './request.log.ip';
import { RequestLogMethod } from './request.log.method';
import { RequestLogOccurredAt } from './request.log.occurredAt';
import { RequestLogOrganizationId } from './request.log.organizationId';
import { RequestLogOrigin } from './request.log.origin';
import { RequestLogPath } from './request.log.path';
import { RequestLogQuery } from './request.log.query';
import { RequestLogReferer } from './request.log.referer';
import { RequestLogRequestBody } from './request.log.requestBody';
import { RequestLogRequestId } from './request.log.requestId';
import { RequestLogResponseBody } from './request.log.responseBody';
import { RequestLogRoute } from './request.log.route';
import { RequestLogSourceApp } from './request.log.sourceApp';
import { RequestLogSourceEnv } from './request.log.sourceEnv';
import { RequestLogStatus } from './request.log.status';
import { RequestLogUserAgent } from './request.log.userAgent';

export type RequestLogProps = {
  id: RequestLogId;
  sourceApp: RequestLogSourceApp;
  sourceEnv: RequestLogSourceEnv;
  method: RequestLogMethod;
  path: RequestLogPath;
  route?: RequestLogRoute;
  status: RequestLogStatus;
  durationMs: RequestLogDurationMs;
  actorType?: RequestLogActorType;
  actorId?: RequestLogActorId;
  actorLabel?: RequestLogActorLabel;
  organizationId?: RequestLogOrganizationId;
  requestId?: RequestLogRequestId;
  correlationId?: RequestLogCorrelationId;
  ip?: RequestLogIp;
  userAgent?: RequestLogUserAgent;
  referer?: RequestLogReferer;
  origin?: RequestLogOrigin;
  requestBody?: RequestLogRequestBody;
  responseBody?: RequestLogResponseBody;
  query?: RequestLogQuery;
  errorCode?: RequestLogErrorCode;
  errorMessage?: RequestLogErrorMessage;
  occurredAt: RequestLogOccurredAt;
  ingestedAt: RequestLogIngestedAt;
};

export type RequestLogPrimitiveProps = {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  method: string;
  path: string;
  route?: string | null;
  status: number;
  durationMs: number;
  actorType?: 'user' | 'system' | 'service' | 'api_key' | 'anonymous' | null;
  actorId?: string | null;
  actorLabel?: string | null;
  organizationId?: string | null;
  requestId?: string | null;
  correlationId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  origin?: string | null;
  requestBody?: Record<string, unknown> | null;
  responseBody?: Record<string, unknown> | null;
  query?: Record<string, unknown> | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  occurredAt: Date;
  ingestedAt: Date;
};

export type RecordRequestLogInput = Omit<RequestLogPrimitiveProps, 'id' | 'ingestedAt'> & {
  id?: string;
  ingestedAt?: Date;
};

export type RequestLogListResponse = {
  id: string;
  sourceApp: string;
  sourceEnv: string;
  method: string;
  path: string;
  route?: string | null;
  status: number;
  durationMs: number;
  actorType?: string | null;
  actorId?: string | null;
  actorLabel?: string | null;
  organizationId?: string | null;
  correlationId?: string | null;
  occurredAt: Date;
  ingestedAt: Date;
};

export type RequestLogDetailResponse = RequestLogPrimitiveProps;

export class RequestLog extends AggregateRoot {
  private id: RequestLogId;
  private sourceApp: RequestLogSourceApp;
  private sourceEnv: RequestLogSourceEnv;
  private method: RequestLogMethod;
  private path: RequestLogPath;
  private route?: RequestLogRoute;
  private status: RequestLogStatus;
  private durationMs: RequestLogDurationMs;
  private actorType?: RequestLogActorType;
  private actorId?: RequestLogActorId;
  private actorLabel?: RequestLogActorLabel;
  private organizationId?: RequestLogOrganizationId;
  private requestId?: RequestLogRequestId;
  private correlationId?: RequestLogCorrelationId;
  private ip?: RequestLogIp;
  private userAgent?: RequestLogUserAgent;
  private referer?: RequestLogReferer;
  private origin?: RequestLogOrigin;
  private requestBody?: RequestLogRequestBody;
  private responseBody?: RequestLogResponseBody;
  private query?: RequestLogQuery;
  private errorCode?: RequestLogErrorCode;
  private errorMessage?: RequestLogErrorMessage;
  private occurredAt: RequestLogOccurredAt;
  private ingestedAt: RequestLogIngestedAt;

  private constructor(props: RequestLogProps) {
    super();
    this.id = props.id;
    this.sourceApp = props.sourceApp;
    this.sourceEnv = props.sourceEnv;
    this.method = props.method;
    this.path = props.path;
    this.route = props.route;
    this.status = props.status;
    this.durationMs = props.durationMs;
    this.actorType = props.actorType;
    this.actorId = props.actorId;
    this.actorLabel = props.actorLabel;
    this.organizationId = props.organizationId;
    this.requestId = props.requestId;
    this.correlationId = props.correlationId;
    this.ip = props.ip;
    this.userAgent = props.userAgent;
    this.referer = props.referer;
    this.origin = props.origin;
    this.requestBody = props.requestBody;
    this.responseBody = props.responseBody;
    this.query = props.query;
    this.errorCode = props.errorCode;
    this.errorMessage = props.errorMessage;
    this.occurredAt = props.occurredAt;
    this.ingestedAt = props.ingestedAt;
  }

  public static record(input: RecordRequestLogInput): RequestLog {
    const id = input.id ? RequestLogId.create(input.id) : RequestLogId.generate();
    const ingestedAt = RequestLogIngestedAt.create(input.ingestedAt ?? new Date());

    const log = new RequestLog({
      id,
      sourceApp: RequestLogSourceApp.create(input.sourceApp),
      sourceEnv: RequestLogSourceEnv.create(input.sourceEnv),
      method: RequestLogMethod.create(input.method),
      path: RequestLogPath.create(input.path),
      route: input.route ? RequestLogRoute.create(input.route) : undefined,
      status: RequestLogStatus.create(input.status),
      durationMs: RequestLogDurationMs.create(input.durationMs),
      actorType: input.actorType ? RequestLogActorType.create(input.actorType) : undefined,
      actorId: input.actorId ? RequestLogActorId.create(input.actorId) : undefined,
      actorLabel: input.actorLabel ? RequestLogActorLabel.create(input.actorLabel) : undefined,
      organizationId: input.organizationId ? RequestLogOrganizationId.create(input.organizationId) : undefined,
      requestId: input.requestId ? RequestLogRequestId.create(input.requestId) : undefined,
      correlationId: input.correlationId ? RequestLogCorrelationId.create(input.correlationId) : undefined,
      ip: input.ip ? RequestLogIp.create(input.ip) : undefined,
      userAgent: input.userAgent ? RequestLogUserAgent.create(input.userAgent) : undefined,
      referer: input.referer ? RequestLogReferer.create(input.referer) : undefined,
      origin: input.origin ? RequestLogOrigin.create(input.origin) : undefined,
      requestBody: input.requestBody ? RequestLogRequestBody.create(input.requestBody) : undefined,
      responseBody: input.responseBody ? RequestLogResponseBody.create(input.responseBody) : undefined,
      query: input.query ? RequestLogQuery.create(input.query) : undefined,
      errorCode: input.errorCode ? RequestLogErrorCode.create(input.errorCode) : undefined,
      errorMessage: input.errorMessage ? RequestLogErrorMessage.create(input.errorMessage) : undefined,
      occurredAt: RequestLogOccurredAt.create(input.occurredAt),
      ingestedAt,
    });

    log.addDomainEvent(new RequestLogRecordedDomainEvent({ requestLog: log }));
    return log;
  }

  public static fromPrimitives(props: RequestLogPrimitiveProps): RequestLog {
    return new RequestLog({
      id: RequestLogId.create(props.id),
      sourceApp: RequestLogSourceApp.create(props.sourceApp),
      sourceEnv: RequestLogSourceEnv.create(props.sourceEnv),
      method: RequestLogMethod.create(props.method),
      path: RequestLogPath.create(props.path),
      route: props.route ? RequestLogRoute.create(props.route) : undefined,
      status: RequestLogStatus.create(props.status),
      durationMs: RequestLogDurationMs.create(props.durationMs),
      actorType: props.actorType ? RequestLogActorType.create(props.actorType) : undefined,
      actorId: props.actorId ? RequestLogActorId.create(props.actorId) : undefined,
      actorLabel: props.actorLabel ? RequestLogActorLabel.create(props.actorLabel) : undefined,
      organizationId: props.organizationId ? RequestLogOrganizationId.create(props.organizationId) : undefined,
      requestId: props.requestId ? RequestLogRequestId.create(props.requestId) : undefined,
      correlationId: props.correlationId ? RequestLogCorrelationId.create(props.correlationId) : undefined,
      ip: props.ip ? RequestLogIp.create(props.ip) : undefined,
      userAgent: props.userAgent ? RequestLogUserAgent.create(props.userAgent) : undefined,
      referer: props.referer ? RequestLogReferer.create(props.referer) : undefined,
      origin: props.origin ? RequestLogOrigin.create(props.origin) : undefined,
      requestBody: props.requestBody ? RequestLogRequestBody.create(props.requestBody) : undefined,
      responseBody: props.responseBody ? RequestLogResponseBody.create(props.responseBody) : undefined,
      query: props.query ? RequestLogQuery.create(props.query) : undefined,
      errorCode: props.errorCode ? RequestLogErrorCode.create(props.errorCode) : undefined,
      errorMessage: props.errorMessage ? RequestLogErrorMessage.create(props.errorMessage) : undefined,
      occurredAt: RequestLogOccurredAt.create(props.occurredAt),
      ingestedAt: RequestLogIngestedAt.create(props.ingestedAt),
    });
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getSourceApp(): string {
    return this.sourceApp.getValue();
  }

  public getMethod(): string {
    return this.method.getValue();
  }

  public getPath(): string {
    return this.path.getValue();
  }

  public getStatus(): number {
    return this.status.getValue();
  }

  public getDurationMs(): number {
    return this.durationMs.getValue();
  }

  public getCorrelationId(): string | null {
    return this.correlationId?.getValue() ?? null;
  }

  public getOccurredAt(): Date {
    return this.occurredAt.getValue();
  }

  public getIngestedAt(): Date {
    return this.ingestedAt.getValue();
  }

  public isError(): boolean {
    return this.status.getValue() >= 400;
  }

  public toPrimitives(): RequestLogPrimitiveProps {
    return {
      id: this.id.getValue(),
      sourceApp: this.sourceApp.getValue(),
      sourceEnv: this.sourceEnv.getValue(),
      method: this.method.getValue(),
      path: this.path.getValue(),
      route: this.route?.getValue() ?? null,
      status: this.status.getValue(),
      durationMs: this.durationMs.getValue(),
      actorType: this.actorType?.getValue() ?? null,
      actorId: this.actorId?.getValue() ?? null,
      actorLabel: this.actorLabel?.getValue() ?? null,
      organizationId: this.organizationId?.getValue() ?? null,
      requestId: this.requestId?.getValue() ?? null,
      correlationId: this.correlationId?.getValue() ?? null,
      ip: this.ip?.getValue() ?? null,
      userAgent: this.userAgent?.getValue() ?? null,
      referer: this.referer?.getValue() ?? null,
      origin: this.origin?.getValue() ?? null,
      requestBody: this.requestBody?.getValue() ?? null,
      responseBody: this.responseBody?.getValue() ?? null,
      query: this.query?.getValue() ?? null,
      errorCode: this.errorCode?.getValue() ?? null,
      errorMessage: this.errorMessage?.getValue() ?? null,
      occurredAt: this.occurredAt.getValue(),
      ingestedAt: this.ingestedAt.getValue(),
    };
  }

  public toResponseList(): RequestLogListResponse {
    return {
      id: this.id.getValue(),
      sourceApp: this.sourceApp.getValue(),
      sourceEnv: this.sourceEnv.getValue(),
      method: this.method.getValue(),
      path: this.path.getValue(),
      route: this.route?.getValue() ?? null,
      status: this.status.getValue(),
      durationMs: this.durationMs.getValue(),
      actorType: this.actorType?.getValue() ?? null,
      actorId: this.actorId?.getValue() ?? null,
      actorLabel: this.actorLabel?.getValue() ?? null,
      organizationId: this.organizationId?.getValue() ?? null,
      correlationId: this.correlationId?.getValue() ?? null,
      occurredAt: this.occurredAt.getValue(),
      ingestedAt: this.ingestedAt.getValue(),
    };
  }

  public toResponseDetail(): RequestLogDetailResponse {
    return this.toPrimitives();
  }
}
