import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

    const isGetRequest = request.method === 'GET';

    if (!isGetRequest) {
      return undefined;
    }

    return request.url;
  }
}
