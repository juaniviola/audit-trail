import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ApiKeyGuard } from 'src/shared/infrastructure/security/api-key.guard';

import { AuditEventsPostController } from './audit-events.post.controller';

describe('AuditEventsPostController security', () => {
  it('protects audit event ingestion with the API key guard', () => {
    const guards = Reflect.getMetadata(GUARDS_METADATA, AuditEventsPostController) || [];

    expect(guards).toContain(ApiKeyGuard);
  });
});
