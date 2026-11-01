import { Observable } from 'rxjs';

export interface FilterOption {
  label: string;
  value: unknown;
}

export interface FilterField {
  key: string; // nombre de la propiedad en el valor que se emite
  label: string;
  type: 'text' | 'select' | 'date-range';
  placeholder?: string;

  // Solo 'select'
  options?: FilterOption[]; // opciones fijas
  loadOptions?: (parentValue: unknown) => Observable<FilterOption[]>; // opciones remotas
  dependsOn?: string; // key del filtro padre

  // Solo 'text'
  live?: boolean; // aplica solo tras una pausa al escribir
}

// El valor de todos los filtros: { placa: 'ABC', marca: 3, modelo: 12 }
export type FilterValue = Record<string, unknown>;
