import { Component, computed, inject, input, output } from '@angular/core';
import { FilterField, FilterValue } from '../../../../shared/components/filters/filter-field.model';
import { Filters } from '../../../../shared/components/filters/filters';
import { Paginator } from '../../../../shared/components/paginator/paginator';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarSearchParams } from '../../models/car-query.model';
import { CatalogsService } from '../../services/catalogs.service';

@Component({
  imports: [Filters, Paginator],
  selector: 'app-car-list',
  styleUrl: './car-list.css',
  templateUrl: './car-list.html',
})
export class CarList {
  private readonly catalogsService = inject(CatalogsService);

  filters = input.required<FilterValue>();
  filtersApplied = output<CarSearchParams>();

  /**
   * El componente compartido trabaja con valores flexibles. Aquí validamos
   * los tipos y emitimos solo los parámetros que soporta GET /cars.
   */
  forwardFilters(values: FilterValue): void {
    const filters: CarSearchParams = {};
    const search = values['search'];
    const brandId = values['brandId'];
    const modelId = values['modelId'];
    const engineTypeId = values['engineTypeId'];
    const transmissionId = values['transmissionId'];

    if (typeof search === 'string' && search !== '') filters.search = search;
    if (typeof brandId === 'number') filters.brandId = brandId;
    if (typeof modelId === 'number') filters.modelId = modelId;
    if (typeof engineTypeId === 'number') {
      filters.engineTypeId = engineTypeId;
    }

    if (typeof transmissionId === 'number') {
      filters.transmissionId = transmissionId;
    }

    this.filtersApplied.emit(filters);
  }

  brands = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'brands'],
    queryFn: () => this.catalogsService.getBrands(),
    staleTime: Infinity,
  }));

  models = injectLazyCatalog<number>((brandId) => ({
    queryKey: ['catalogs', 'models', brandId],
    queryFn: () => this.catalogsService.getModels(brandId),
  }));

  engineTypes = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'engine-types'],
    queryFn: () => this.catalogsService.getEngineTypes(),
    staleTime: Infinity,
  }));

  transmissions = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'transmissions'],
    queryFn: () => this.catalogsService.getTransmissions(),
    staleTime: Infinity,
  }));

  /**
   * computed vuelve a construir la configuración al cambiar los datos o el
   * estado loading de una query; así los options no quedan congelados vacíos.
   */
  readonly filterFields = computed<FilterField[]>(() => [
    // { key: 'fechaIngreso', label: 'Ingreso', type: 'date-range' },
    // {
    //   key: 'search',
    //   label: 'Buscar',
    //   type: 'text',
    //   live: true,
    //   placeholder: 'Placa, marca o modelo',
    // },
    {
      key: 'brandId',
      label: 'Marca',
      type: 'select',
      options: this.brands.data(),
      loading: this.brands.isFetching(),
      loadOptions: () => this.brands.open(),
    },
    {
      key: 'modelId',
      label: 'Modelo',
      type: 'select',
      dependsOn: 'brandId',
      options: this.models.data(),
      loading: this.models.isFetching(),
      loadOptions: (parentValue) => {
        if (typeof parentValue === 'number') this.models.open(parentValue);
      },
    },
    {
      key: 'engineTypeId',
      label: 'Tipo de motor',
      type: 'select',
      options: this.engineTypes.data(),
      loading: this.engineTypes.isFetching(),
      loadOptions: () => this.engineTypes.open(),
    },
    {
      key: 'transmissionId',
      label: 'Transmisión',
      type: 'select',
      options: this.transmissions.data(),
      loading: this.transmissions.isFetching(),
      loadOptions: () => this.transmissions.open(),
    },
  ]);
}
