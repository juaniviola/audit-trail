import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/shared/infrastructure/filters/response.decorator';

import { FindAuditEventsService } from '../../application/find-audit-events/findAuditEvents.service';
import { GetAuditEventByIdService } from '../../application/get-audit-event-by-id/getAuditEventById.service';
import { FindAuditEventsQueryDto, parseQueryFilters } from '../dto/find-audit-events.dto';

@ApiTags('audit-events')
@Controller('audit-events')
export class AuditEventsGetController {
  constructor(
    private readonly findAuditEvents: FindAuditEventsService,
    private readonly getAuditEventById: GetAuditEventByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search audit events with criteria + pagination' })
  @ControllerResponse()
  async list(@Query() query: FindAuditEventsQueryDto) {
    return this.findAuditEvents.execute({
      filters: parseQueryFilters(query.filters),
      filterType: query.filterType,
      orderBy: query.orderBy,
      orderType: query.orderType,
      offset: query.offset,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single audit event by id' })
  @ControllerResponse()
  async detail(@Param('id') id: string) {
    return this.getAuditEventById.execute(id);
  }
}
