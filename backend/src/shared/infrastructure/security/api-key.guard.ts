import { CanActivate, ExecutionContext, Inject, Injectable, Optional, UnauthorizedException } from '@nestjs/common';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { Request } from 'express';

export const API_KEY_GUARD_CLOCK = Symbol('API_KEY_GUARD_CLOCK');

type SignedApiRequest = Request & {
  rawBody?: Buffer;
};

type ApiClient = {
  clientId: string;
  apiKey: string;
};

@Injectable()
export class ApiKeyGuard implements CanActivate {
  static readonly CLIENT_ID_HEADER = 'x-audit-trail-client-id';
  static readonly TIMESTAMP_HEADER = 'x-audit-trail-timestamp';
  static readonly SIGNATURE_HEADER = 'x-audit-trail-signature';
  static readonly SIGNATURE_PREFIX = 'sha256=';
  private static readonly DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 300;

  constructor(@Optional() @Inject(API_KEY_GUARD_CLOCK) private readonly now: () => Date = () => new Date()) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<SignedApiRequest>();
    const clientId = this.getHeader(request, ApiKeyGuard.CLIENT_ID_HEADER);
    const timestamp = this.getHeader(request, ApiKeyGuard.TIMESTAMP_HEADER);
    const providedSignature = this.getHeader(request, ApiKeyGuard.SIGNATURE_HEADER);
    const apiKeys = this.getClientApiKeys(clientId);

    if (!clientId || !timestamp || !providedSignature || apiKeys.length === 0) {
      throw new UnauthorizedException('Invalid API signature');
    }

    if (!this.isTimestampWithinTolerance(timestamp)) {
      throw new UnauthorizedException('Invalid API signature');
    }

    const canonicalRequest = this.createCanonicalRequest(request, timestamp);
    const isValid = apiKeys.some((apiKey) => this.isValidSignature(providedSignature, canonicalRequest, apiKey));

    if (!isValid) {
      throw new UnauthorizedException('Invalid API signature');
    }

    return true;
  }

  private getHeader(request: SignedApiRequest, headerName: string): string | undefined {
    const headerValue = request.headers[headerName];
    const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    return value?.trim() || undefined;
  }

  private getClientApiKeys(clientId: string | undefined): string[] {
    if (!clientId) {
      return [];
    }

    return this.getConfiguredClients()
      .filter((client) => client.clientId === clientId)
      .map((client) => client.apiKey);
  }

  private getConfiguredClients(): ApiClient[] {
    const clientIds = this.getCommaSeparatedValues(process.env.AUDIT_TRAIL_CLIENT_IDS);
    const apiKeys = this.getCommaSeparatedValues(process.env.AUDIT_TRAIL_API_KEYS);

    if (clientIds.length === 0 || clientIds.length !== apiKeys.length) {
      return [];
    }

    return clientIds.map((clientId, index) => ({
      clientId,
      apiKey: apiKeys[index],
    }));
  }

  private getCommaSeparatedValues(value: string | undefined): string[] {
    return (value || '')
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  private isTimestampWithinTolerance(timestamp: string): boolean {
    const requestTime = Date.parse(timestamp);

    if (Number.isNaN(requestTime)) {
      return false;
    }

    const toleranceMs = this.getSignatureToleranceSeconds() * 1000;
    const currentTime = this.now().getTime();

    return Math.abs(currentTime - requestTime) <= toleranceMs;
  }

  private getSignatureToleranceSeconds(): number {
    const configuredTolerance = Number(process.env.AUDIT_TRAIL_SIGNATURE_TOLERANCE_SECONDS);

    if (!Number.isFinite(configuredTolerance) || configuredTolerance <= 0) {
      return ApiKeyGuard.DEFAULT_SIGNATURE_TOLERANCE_SECONDS;
    }

    return configuredTolerance;
  }

  private createCanonicalRequest(request: SignedApiRequest, timestamp: string): string {
    const method = (request.method || '').toUpperCase();
    const path = request.originalUrl || request.url || '';
    const rawBody = this.getRawBody(request);
    const bodyHash = createHash('sha256').update(rawBody).digest('hex');

    return [method, path, timestamp, bodyHash].join('\n');
  }

  private getRawBody(request: SignedApiRequest): Buffer {
    if (!request.rawBody) {
      throw new UnauthorizedException('Invalid API signature');
    }

    return request.rawBody;
  }

  private isValidSignature(providedSignature: string, canonicalRequest: string, apiKey: string): boolean {
    const expectedSignature = createHmac('sha256', apiKey).update(canonicalRequest).digest('hex');
    const normalizedProvidedSignature = this.normalizeSignature(providedSignature);

    return this.isTimingSafeMatch(normalizedProvidedSignature, expectedSignature);
  }

  private normalizeSignature(signature: string): string {
    return signature.startsWith(ApiKeyGuard.SIGNATURE_PREFIX)
      ? signature.slice(ApiKeyGuard.SIGNATURE_PREFIX.length)
      : signature;
  }

  private isTimingSafeMatch(providedValue: string, expectedValue: string): boolean {
    const providedBuffer = Buffer.from(providedValue);
    const expectedBuffer = Buffer.from(expectedValue);

    if (providedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(providedBuffer, expectedBuffer);
  }
}
