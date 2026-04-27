import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/shared/infrastructure/filters/response.decorator';
import { ApiKeyGuard } from 'src/shared/infrastructure/security/api-key.guard';

import { RecordRequestLogService } from '../../application/record-request-log/recordRequestLog.service';
import { RecordRequestLogDto } from '../dto/record-request-log.dto';

@ApiTags('request-logs')
@ApiSecurity('audit-trail-api-key')
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
