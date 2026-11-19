import { Component, computed, inject, signal } from '@angular/core';
import { Empty } from '../../../../shared/components/empty/empty';
import { FilterValue } from '../../../../shared/components/filters/filter-field.model';
import { DataPaginator } from '../../../../shared/models/shared.interface';
import { lazyResource } from '../../../../shared/utils/lazy-catalog';
import { CarList } from '../../components/car-list/car-list';
import { CarRegisteredCard } from '../../components/car-registered-card/car-registered-card';
import { CarListQuery, CarSearchParams } from '../../models/car-query.model';
import { Car } from '../../models/car.interface';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-registered',
  imports: [CarList, CarRegisteredCard, Empty],
  templateUrl: './car-registered.html',
  styleUrl: './car-registered.css',
})
export class CarRegistered {
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
    this.page.update((page) => ({ ...page, offset: 1 }));

    this.cars.load(this.query());
  }

  constructor() {
    this.cars.load(this.query());
  }
}
