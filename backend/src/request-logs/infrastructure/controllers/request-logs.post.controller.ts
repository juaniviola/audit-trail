import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/shared/infrastructure/filters/response.decorator';
import { ApiKeyGuard } from 'src/shared/infrastructure/security/api-key.guard';

import { RecordRequestLogService } from '../../application/record-request-log/recordRequestLog.service';
import { RecordRequestLogDto } from '../dto/record-request-log.dto';

@ApiTags('request-logs')
@ApiSecurity('audit-trail-client-id')
@ApiSecurity('audit-trail-timestamp')
@ApiSecurity('audit-trail-signature')
@ApiHeader({
  name: 'x-audit-trail-client-id',
  required: true,
  description: 'Client id configured in AUDIT_TRAIL_CLIENT_IDS.',
})
@ApiHeader({
  name: 'x-audit-trail-timestamp',
  required: true,
  description: 'ISO-8601 request timestamp used for replay protection.',
})
@ApiHeader({
  name: 'x-audit-trail-signature',
  required: true,
  description: 'HMAC-SHA256 signature with sha256=<hex> format.',
})
@UseGuards(ApiKeyGuard)
@Controller('request-logs')
export class RequestLogsPostController {
  constructor(private readonly recordRequestLog: RecordRequestLogService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new HTTP request log (transport-level trace)' })
  @ControllerResponse('Request log recorded')
  async record(@Body() dto: RecordRequestLogDto) {
    const log = await this.recordRequestLog.execute({
      ...dto,
      occurredAt: new Date(dto.occurredAt),
      ingestedAt: dto.ingestedAt ? new Date(dto.ingestedAt) : undefined,
    });
    return log.toResponseDetail();
  }
}
