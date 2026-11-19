import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

type ParamValue = string | number | boolean;

export interface CacheOptions {
  params?: Record<string, ParamValue | ReadonlyArray<ParamValue>>;
  headers?: Record<string, string | string[]>;
  /** Tiempo de vida en ms. Por defecto no expira. */
  ttlMs?: number;
  /** Ignora lo guardado y vuelve a pedir. */
  forceRefresh?: boolean;
}

interface CacheEntry {
  request: Observable<unknown>;
  expiresAt: number;
}

@Service()
export class CacheService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, CacheEntry>();

  get<T>(url: string, options: CacheOptions = {}): Observable<T> {
    const { params, headers, ttlMs = Infinity, forceRefresh = false } = options;
    const key = this.buildKey(url, params);

    const cached = this.cache.get(key);
    if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
      return cached.request as Observable<T>;
    }

    const request = this.http
      .get<T>(url, { params, headers })
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.cache.set(key, { request, expiresAt: Date.now() + ttlMs });
    return request;
  }

  /** Sin argumento vacía todo; con prefijo, solo las URLs que empiecen así. */
  clear(urlPrefix?: string): void {
    if (!urlPrefix) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(urlPrefix)) this.cache.delete(key);
    }
  }

  // Ordena los params para que {a:1,b:2} y {b:2,a:1} sean la misma clave
  private buildKey(url: string, params?: CacheOptions['params']): string {
    if (!params) return url;
    const query = Object.keys(params)
      .sort()
      .map((k) => `${k}=${JSON.stringify(params[k])}`)
      .join('&');
    return `${url}?${query}`;
  }
}
