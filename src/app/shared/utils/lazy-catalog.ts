import { computed, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Catalog } from '../models/shared.interface';

interface LazyRequest<T> {
  value: T | undefined;
}

export function lazyCatalog<T = void>(load: (parameter?: T) => Observable<Catalog[]>) {
  // undefined significa que el usuario todavía no abrió el desplegable.
  const request = signal<LazyRequest<T> | undefined>(undefined);

  const resource = rxResource({
    // rxResource no hace nada hasta que load() establezca estos parámetros.
    params: () => request(),
    // El parámetro capturado al abrir llega aquí y se entrega al método del servicio.
    stream: ({ params }) => load(params.value),
    defaultValue: [] as Catalog[],
  });

  return {
    // Evita leer value() cuando el recurso está en error.
    options: computed(() => (resource.hasValue() ? resource.value() : [])),
    loading: resource.isLoading,
    error: resource.error,

    // Se conecta a onShow. Puede recibir un ID u otro parámetro dependiente.
    load: (parameter?: T) => request.set({ value: parameter }),
    // Llamar al cambiar el catálogo padre evita conservar opciones del padre anterior.
    reset: () => request.set(undefined),
  };
}
