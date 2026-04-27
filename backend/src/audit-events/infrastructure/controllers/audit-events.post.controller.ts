import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/shared/infrastructure/filters/response.decorator';
import { ApiKeyGuard } from 'src/shared/infrastructure/security/api-key.guard';

import { RecordAuditEventService } from '../../application/record-audit-event/recordAuditEvent.service';
import { RecordAuditEventDto } from '../dto/record-audit-event.dto';

@ApiTags('audit-events')
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
@Controller('audit-events')
export class AuditEventsPostController {
  constructor(private readonly recordAuditEvent: RecordAuditEventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a new audit event' })
  @ControllerResponse('Audit event recorded')
  async record(@Body() dto: RecordAuditEventDto) {
    const auditEvent = await this.recordAuditEvent.execute({
      ...dto,
      occurredAt: new Date(dto.occurredAt),
      ingestedAt: dto.ingestedAt ? new Date(dto.ingestedAt) : undefined,
      requestContext: dto.requestContext ?? null,
    });
    return auditEvent.toResponseDetail();
  }
}
