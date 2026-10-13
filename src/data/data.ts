import { TableColumn } from '../app/shared/components/data-table/data-table.model';

export const columns: TableColumn[] = [
  { field: 'imagen', header: 'Imagen' },
  { field: 'nombre', header: 'Vehículo', sortable: true },
  { field: 'placa', header: 'Placa', sortable: true },
  { field: 'diasDisponible', header: 'Días disponible', sortable: true, type: 'number' },
  { field: 'precio', header: 'Precio publicado', sortable: true, type: 'currency' },
  { field: 'estado', header: 'Estado', sortable: true },
];

export const vehiculos = [
  {
    id: 1,
    imagen: 'https://images.pexels.com/photos/40046541/pexels-photo-40046541.jpeg',
    nombre: 'Mazda 3 Touring 2020',
    placa: 'ABC123',
    diasDisponible: 12,
    precio: 65000000,
    estado: 'Disponible',
  },
  {
    id: 2,
    imagen: 'https://images.pexels.com/photos/40046541/pexels-photo-40046541.jpeg',
    nombre: 'Renault Duster 2019',
    placa: 'XYZ789',
    diasDisponible: 30,
    precio: 52000000,
    estado: 'Reservado',
  },
];

export const columnsDocumentation: TableColumn[] = [
  { field: 'car', header: 'Vehículo', sortable: true },
  { field: 'placa', header: 'Placa', sortable: true },
  { field: 'cosmetic', header: 'Cosmética', sortable: true, align: 'center', type: 'boolean' },
  { field: 'mechanic', header: 'Mecánica', sortable: true, align: 'center', type: 'boolean' },
  { field: 'Legal', header: 'legal', sortable: true, align: 'center', type: 'boolean' },
  { field: 'img', header: 'Fotos', sortable: true, align: 'center', type: 'boolean' },
  { field: 'daysPeritaje', header: 'Días en peritaje', sortable: true, type: 'number' },
];

export const rowsDocumentation = [
  {
    id: 1,
    car: 'Mazda 3 Touring 2020',
    placa: 'ABC123',
    cosmetic: false,
    mechanic: true,
    legal: false,
    img: true,
    daysPeritaje: 5,
  },
  {
    id: 2,
    car: 'Renault Duster 2019',
    placa: 'XYZ789',
    cosmetic: true,
    mechanic: true,
    legal: true,
    img: false,
    daysPeritaje: 5,
  },
];

export const columnsLegal: TableColumn[] = [
  { field: 'car', header: 'Vehículo', sortable: true },
  { field: 'placa', header: 'Placa', sortable: true },
  { field: 'alert', header: 'Alerta', sortable: true },
  { field: 'detail', header: 'Detalle', sortable: true, align: 'center' },
  {
    field: 'proxVencimiento',
    header: 'Próximo vencimiento',
    sortable: true,
    align: 'center',
  },
];

export const rowsLegal = [
  {
    id: 1,
    car: 'Mazda 3 Touring 2020',
    placa: 'ABC123',
    alert: 'Gravamen, Multas',
    detail: 'Prenda natural · $450.000',
    proxVencimiento: 'SOAT en 12 días',
  },
  {
    id: 2,
    car: 'Renault Duster 2019',
    placa: 'XYZ789',
    alert: 'Gravamen, Multas',
    detail: 'Prenda natural · $450.000',
    proxVencimiento: 'SOAT en 12 días',
  },
];
