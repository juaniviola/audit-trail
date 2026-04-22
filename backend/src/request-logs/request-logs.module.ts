import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { FindRequestLogsService } from './application/find-request-logs/findRequestLogs.service';
import { GetRequestLogByIdService } from './application/get-request-log-by-id/getRequestLogById.service';
import { RecordRequestLogService } from './application/record-request-log/recordRequestLog.service';
import { RequestLogsGetController } from './infrastructure/controllers/request-logs.get.controller';
import { RequestLogsPostController } from './infrastructure/controllers/request-logs.post.controller';
import { RequestLogsPsqlRepository } from './infrastructure/persistence/sql/request-logs.psql.repository';

@Module({
  imports: [SharedModule],
  controllers: [RequestLogsPostController, RequestLogsGetController],
  providers: [
    RecordRequestLogService,
    GetRequestLogByIdService,
    FindRequestLogsService,
    {
      provide: 'IRequestLogsRepository',
      useClass: RequestLogsPsqlRepository,
    },
  ],
  exports: [RecordRequestLogService, GetRequestLogByIdService, FindRequestLogsService],
})
export class RequestLogsModule {}
