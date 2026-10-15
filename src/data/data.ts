import { ChartData } from 'chart.js';
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

export const graficoVentasSemana: ChartData<'bar'> = {
  labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  datasets: [
    {
      type: 'bar',
      label: 'Vehículos',
      data: [4000, 10000, 15000, 4000, 10000, 15000],
    },
  ],
};

export const graficoIngresosMes: ChartData<'bar'> = {
  labels: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  datasets: [
    {
      type: 'bar',
      label: 'Mes',
      data: [4000, 10000, 15000, 4000, 10000, 15000, 4000, 10000, 15000, 4000, 10000, 15000],
    },
  ],
};

export const graficoMarcaMasVendidas: ChartData<'bar'> = {
  labels: [
    'Mazda',
    'Ford',
    'Mercedez Benz',
    'Toyota',
    'BYD',
    'Zeekr',
    'Suzuki',
    'Volvo',
    'Chevrolet',
  ],
  datasets: [
    {
      type: 'bar',
      label: 'Mes',
      data: [4000, 10000, 15000, 4000, 10000, 15000, 4000, 10000, 15000],
    },
  ],
};

export const graficoAntiguedad: ChartData<'bar'> = {
  labels: ['0-15 días', '16-30', '31-60', '61-90', 'Más de 90'],
  datasets: [
    {
      type: 'bar',
      label: 'Carros disponibles',
      data: [9, 7, 5, 3, 2],
      backgroundColor: ['#22c55e', '#84cc16', '#f59e0b', '#f97316', '#ef4444'],
    },
  ],
};
