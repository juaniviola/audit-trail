import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class RecordRequestLogDto {
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

  @ApiProperty({ example: 'POST', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'] })
  @IsIn([
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
    'HEAD',
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
  ])
  method: string;

  @ApiProperty({ example: '/v1/orders' })
  @IsString()
  path: string;

  @ApiPropertyOptional({ example: '/v1/orders/:id' })
  @IsOptional()
  @IsString()
  route?: string | null;

  @ApiProperty({ example: 201 })
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(599)
  status: number;

  @ApiProperty({ example: 42 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationMs: number;

  @ApiPropertyOptional({ enum: ['user', 'system', 'service', 'api_key', 'anonymous'] })
  @IsOptional()
  @IsIn(['user', 'system', 'service', 'api_key', 'anonymous'])
  actorType?: 'user' | 'system' | 'service' | 'api_key' | 'anonymous' | null;

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
  organizationId?: string | null;

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
  ip?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referer?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  origin?: string | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  requestBody?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  responseBody?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  query?: Record<string, unknown> | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorCode?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  errorMessage?: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  occurredAt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ingestedAt?: string;
}
