import { Component, inject, signal } from '@angular/core';
import { CatalogApi } from '../../../../core/api/catalog.api';
import { FilterField, FilterValue } from '../../../../shared/components/filters/filter-field.model';
import { Filters } from '../../../../shared/components/filters/filters';
import { Paginator } from '../../../../shared/components/paginator/paginator';
import { CarCard } from '../../components/car-card/car-card';

@Component({
  imports: [Filters, Paginator, CarCard],
  selector: 'app-car-list',
  styleUrl: './car-list.css',
  templateUrl: './car-list.html',
})
export class CarList {
  private catalog = inject(CatalogApi); // antes de filterFields

  filterFields: FilterField[] = [
    {
      key: 'busqueda',
      label: 'Buscar',
      type: 'text',
      live: true,
      placeholder: 'Placa, marca o modelo',
    },
    { key: 'marca', label: 'Marca', type: 'select', loadOptions: () => this.catalog.marcas() },
    {
      key: 'modelo',
      label: 'Modelo',
      type: 'select',
      dependsOn: 'marca',
      loadOptions: (marca) => this.catalog.modelos(marca as number),
    },
    { key: 'fechaIngreso', label: 'Ingreso', type: 'date-range' },
  ];

  filters = signal<FilterValue>({});
}
