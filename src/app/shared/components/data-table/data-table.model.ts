export interface TableColumn<T = any> {
  field: string; // propiedad de la fila (acepta 'marca.nombre')
  header: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean';
  width?: string;
  align?: 'left' | 'center' | 'right';
}
