import { EPattern } from '../types/pattern';

export async function redisClearCache(
  redis: any,
  pattern: EPattern,
  contain?: string,
): Promise<void> {
  let keyWillDeleted = await redis.keys(pattern);

  if (contain) {
    keyWillDeleted = keyWillDeleted.filter(item => item.includes(contain));
  }

  if (keyWillDeleted.length) {
    for (const key of keyWillDeleted) {
      await redis.del(key);
    }
  }
}
