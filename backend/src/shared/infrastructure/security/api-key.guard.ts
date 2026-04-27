import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  static readonly HEADER_NAME = 'x-audit-trail-api-key';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedApiKey = this.getApiKeyFromRequest(request);
    const configuredApiKeys = this.getConfiguredApiKeys();

    if (!providedApiKey || configuredApiKeys.length === 0) {
      throw new UnauthorizedException('Invalid API key');
    }

    const isValid = configuredApiKeys.some((configuredApiKey) =>
      this.isTimingSafeMatch(providedApiKey, configuredApiKey),
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  private getApiKeyFromRequest(request: Request): string | undefined {
    const headerValue = request.headers[ApiKeyGuard.HEADER_NAME];
    const apiKey = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    return apiKey?.trim() || undefined;
  }

  private getConfiguredApiKeys(): string[] {
    return (process.env.AUDIT_TRAIL_API_KEYS || '')
      .split(',')
      .map((apiKey) => apiKey.trim())
      .filter(Boolean);
  }

  private isTimingSafeMatch(providedApiKey: string, configuredApiKey: string): boolean {
    const providedBuffer = Buffer.from(providedApiKey);
    const configuredBuffer = Buffer.from(configuredApiKey);

    if (providedBuffer.length !== configuredBuffer.length) {
      return false;
    }

    return timingSafeEqual(providedBuffer, configuredBuffer);
  }
}
