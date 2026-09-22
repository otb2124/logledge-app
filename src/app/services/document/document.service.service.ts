import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT, { optional: true });

  isBrowser = isPlatformBrowser(this.platformId);

  get myCookie(): string | null | undefined {
    if (!this.isBrowser || !this.document) {
      return undefined;
    }

    try {
      const cookies = this.document.cookie;
      const cookie = cookies
        .split('; ')
        .map((c) => c.split('='))
        .find(([name]) => name === 'my-cookie');

      return cookie?.[1] ?? null;
    } catch (e) {
      console.error('Cookie error', e);
      return null;
    }
  }
}