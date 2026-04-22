import { createHash } from 'crypto';
import { v5 as uuidv5, v7 as uuidv7 } from 'uuid';

export class GenerateUuid {
  private static readonly NAMESPACE = '6766d555-3afb-44b7-9f09-dc06cc29ec56';

  public static new(): string {
    return uuidv7();
  }

  public static generateUniqueId(data: string[]): string {
    const uniqueString = `${data.join('-')}`;
    const hash = createHash('sha256').update(uniqueString).digest('hex');
    return uuidv5(hash, GenerateUuid.NAMESPACE);
  }
}
