import { Catalog } from '../../models/shared.interface';

export interface FilterField {
  key: string; // nombre de la propiedad en el valor que se emite
  label: string;
  type: 'text' | 'select' | 'date-range';
  placeholder?: string;

  // Solo 'select'. Las opciones y el loading llegan desde el componente dueño del catálogo.
  options?: Catalog[];
  loading?: boolean;
  // Se llama al abrir el select. El propietario (CarList) dispara la query de TanStack.
  loadOptions?: (parentValue: unknown) => void;
  dependsOn?: string; // key del filtro padre

  // Solo 'text'
  live?: boolean; // aplica solo tras una pausa al escribir
}

// El valor de todos los filtros: { placa: 'ABC', marca: 3, modelo: 12 }
export type FilterValue = Record<string, unknown>;
