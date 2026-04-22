import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/shared/infrastructure/filters/response.decorator';

import { FindRequestLogsService } from '../../application/find-request-logs/findRequestLogs.service';
import { GetRequestLogByIdService } from '../../application/get-request-log-by-id/getRequestLogById.service';
import { FindRequestLogsQueryDto, parseQueryFilters } from '../dto/find-request-logs.dto';

@ApiTags('request-logs')
@Controller('request-logs')
export class RequestLogsGetController {
  constructor(
    private readonly findRequestLogs: FindRequestLogsService,
    private readonly getRequestLogById: GetRequestLogByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search request logs with criteria + pagination' })
  @ControllerResponse()
  async list(@Query() query: FindRequestLogsQueryDto) {
    return this.findRequestLogs.execute({
      filters: parseQueryFilters(query.filters),
      filterType: query.filterType,
      orderBy: query.orderBy,
      orderType: query.orderType,
      offset: query.offset,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single request log by id' })
  @ControllerResponse()
  async detail(@Param('id') id: string) {
    return this.getRequestLogById.execute(id);
  }
}
