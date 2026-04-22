import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AuditEventChangeDto {
  @ApiProperty({ example: 'status' })
  @IsString()
  path: string;

  @ApiPropertyOptional({ example: 'pending' })
  before: unknown;

  @ApiPropertyOptional({ example: 'paid' })
  after: unknown;
}

export class RecordAuditEventDto {
  @ApiPropertyOptional({ description: 'Optional client-supplied UUID for idempotency.' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'orders-api' })
  @IsString()
  sourceApp: string;

  @ApiProperty({ example: 'production' })
  @IsString()
  sourceEnv: string;

  @ApiProperty({ example: 'order.created' })
  @IsString()
  eventName: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  action: string;

  @ApiProperty({ example: 'order' })
  @IsString()
  resourceType: string;

  @ApiProperty({ example: '0193b4a4-...-...' })
  @IsString()
  resourceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationId?: string | null;

  @ApiProperty({ enum: ['user', 'system', 'service', 'api_key'] })
  @IsIn(['user', 'system', 'service', 'api_key'])
  actorType: 'user' | 'system' | 'service' | 'api_key';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actorLabel?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requestId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correlationId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  causationId?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  occurredAt: string;

  @ApiPropertyOptional({ description: 'Optional ingested timestamp (defaults to server time).' })
  @IsOptional()
  @IsDateString()
  ingestedAt?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  before?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  after?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: [AuditEventChangeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuditEventChangeDto)
  changes?: AuditEventChangeDto[] | null;

  @ApiPropertyOptional({
    type: Object,
    description:
      'Structured HTTP/transport context (ip, userAgent, method, path, geo, ...). Separate from domain metadata.',
    example: {
      ip: '203.0.113.4',
      userAgent: 'Mozilla/5.0',
      method: 'POST',
      path: '/v1/orders',
      route: '/v1/orders',
      origin: 'https://app.example.com',
      geoCountry: 'AR',
    },
  })
  @IsOptional()
  @IsObject()
  requestContext?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: Object, description: 'Free-form domain metadata. Do NOT include HTTP context here.' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;
}
