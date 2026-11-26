import { signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query';
import { Catalog } from '../models/shared.interface';

export function injectLazyCatalog<TParam = void>(
  options: (param: TParam) => {
    queryKey: unknown[];
    queryFn: () => Promise<Catalog[]>;
    enabled?: boolean; // condición extra (ej. que exista la marca)
  },
) {
  // undefined = todavía no se ha abierto
  const request = signal<{ param: TParam } | undefined>(undefined);

  const query = injectQuery(() => {
    const req = request();
    if (!req) {
      // Query deshabilitada hasta que se abra
      return {
        queryKey: ['lazy-catalog-idle'],
        queryFn: async () => [] as Catalog[],
        enabled: false,
      };
    }
    const { enabled = true, ...rest } = options(req.param);
    return { ...rest, enabled, staleTime: Infinity };
  });

  return {
    data: () => query.data() ?? [],
    isFetching: query.isFetching,
    open: (param: TParam) => request.set({ param }),
    reset: () => request.set(undefined),
    refetch: query.refetch,
    options: (selected: Catalog | Catalog[] | null | undefined): Catalog[] => {
      const catalog = query.data() ?? [];

      // Normalizamos a arreglo
      const selectedList = Array.isArray(selected) ? selected : selected ? [selected] : [];

      if (!selectedList.length) {
        return catalog;
      }

      const catalogIds = new Set(catalog.map((item) => item.id));
      const missing = selectedList.filter((item) => !catalogIds.has(item.id));

      return missing.length ? [...missing, ...catalog] : catalog;
    },
  };
}
