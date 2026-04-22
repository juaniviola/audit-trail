import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindAuditEventsQueryDto {
  @ApiPropertyOptional({
    description: 'JSON-encoded array of filters: [{"field":"sourceApp","operator":"=","value":"orders-api"}]',
  })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiPropertyOptional({ enum: ['AND', 'OR'], default: 'AND' })
  @IsOptional()
  @IsIn(['AND', 'OR'])
  filterType?: 'AND' | 'OR';

  @ApiPropertyOptional({ default: 'occurredAt' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderType?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}

export type ParsedFiltersArray = Array<{ field: string; operator: string; value: string }>;

export function parseQueryFilters(raw?: string): ParsedFiltersArray {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f) => f && f.field && f.operator && 'value' in f) as ParsedFiltersArray;
  } catch {
    return [];
  }
}
