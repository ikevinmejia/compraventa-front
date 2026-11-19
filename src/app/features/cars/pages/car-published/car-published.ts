import { Component, computed, inject, signal } from '@angular/core';
import { FilterValue } from '../../../../shared/components/filters/filter-field.model';
import { DataPaginator } from '../../../../shared/models/shared.interface';
import { lazyResource } from '../../../../shared/utils/lazy-catalog';
import { CarList } from '../../components/car-list/car-list';
import { CarRegisteredCard } from '../../components/car-published-card/car-published-card';
import { CarListQuery, CarSearchParams } from '../../models/car-query.model';
import { Car } from '../../models/car.interface';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-published',
  imports: [CarList, CarRegisteredCard],
  templateUrl: './car-published.html',
  styleUrl: './car-published.css',
})
export class CarPublished {
  private carService = inject(CarService);

  readonly page = signal({ limit: 10, offset: 1 });
  readonly searchParams = signal<CarSearchParams>({});
  readonly filters = signal<FilterValue>({});

  readonly query = computed<CarListQuery>(() => ({
    ...this.searchParams(),
    ...this.page(),
  }));

  readonly cars = lazyResource<DataPaginator<Car>, CarListQuery>(
    (query) => this.carService.getCars(query),
    {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    },
  );

  onFiltersApplied(rawFilters: FilterValue): void {
    this.searchParams.set(rawFilters);
    this.page.update((page) => ({ ...page, offset: 0 }));
    this.cars.load(this.query());
  }

  constructor() {
    this.cars.load(this.query());
  }
}
