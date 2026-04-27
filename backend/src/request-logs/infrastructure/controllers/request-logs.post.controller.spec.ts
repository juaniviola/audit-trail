import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ApiKeyGuard } from 'src/shared/infrastructure/security/api-key.guard';

import { RequestLogsPostController } from './request-logs.post.controller';

describe('RequestLogsPostController security', () => {
  it('protects request log ingestion with the API key guard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, RequestLogsPostController) || [];

    expect(guards).toContain(ApiKeyGuard);
  });
});
