import { computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Catalog } from '../models/shared.interface';

interface LazyRequest<P> {
  value: P | undefined;
}

export function lazyResource<TData, TParam = void>(
  load: (parameter: TParam) => Observable<TData>,
  defaultValue: TData,
) {
  // undefined = todavía no se ha pedido nada.
  const request = signal<LazyRequest<TParam> | undefined>(undefined);

  const resource = rxResource<TData, LazyRequest<TParam> | undefined>({
    params: () => request(),
    stream: ({ params }) => load(params.value as TParam),
    defaultValue,
  });

  return {
    data: computed(() => (resource.hasValue() ? resource.value() : defaultValue)),
    loading: resource.isLoading,
    error: resource.error,
    load: (parameter?: TParam) => request.set({ value: parameter as TParam }),
    reload: () => resource.reload(),
    reset: () => request.set(undefined),
  };
}

// Atajo para catálogos: conserva tu API actual y no tienes que tocar los componentes
export function lazyCatalog<TParam = void>(load: (parameter: TParam) => Observable<Catalog[]>) {
  const r = lazyResource<Catalog[], TParam>(load, []);
  return { options: r.data, loading: r.loading, error: r.error, load: r.load, reset: r.reset };
}
