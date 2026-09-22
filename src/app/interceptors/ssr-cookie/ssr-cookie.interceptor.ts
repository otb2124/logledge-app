import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID, REQUEST } from '@angular/core'; // <-- Import REQUEST from @angular/core
import { isPlatformServer } from '@angular/common';

export const ssrCookieInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isServer = isPlatformServer(platformId);

  if (isServer) {
    // REQUEST is a Web API Request object (or null) injected during SSR
    const serverRequest = inject(REQUEST, { optional: true }) as Request | null;

    // Read incoming client cookie header from standard Web API Request headers
    const clientCookies = serverRequest?.headers?.get('cookie');

    if (clientCookies) {
      const clonedReq = req.clone({
        setHeaders: {
          Cookie: clientCookies
        },
        withCredentials: true
      });
      return next(clonedReq);
    }
  }

  // Client-side browser execution handles cookie attachments natively
  return next(req.clone({ withCredentials: true }));
};