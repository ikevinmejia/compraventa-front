import { Component, computed, inject, signal } from '@angular/core';
import { ProgressSpinnerModule } from '@openng/optimus-ui/progressspinner';
import { injectQuery, keepPreviousData } from '@tanstack/angular-query';
import { Empty } from '../../../../shared/components/empty/empty';
import { FilterValue } from '../../../../shared/components/filters/filter-field.model';
import { CarList } from '../../components/car-list/car-list';
import { CarRegisteredCard } from '../../components/car-registered-card/car-registered-card';
import { CarListQuery, CarSearchParams } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';

@Component({
  selector: 'app-car-registered',
  imports: [CarList, CarRegisteredCard, Empty, ProgressSpinnerModule],
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

  readonly cars = injectQuery(() => ({
    queryKey: ['cars', this.query()],
    queryFn: () => this.carService.getCars(this.query()),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  }));

  onFiltersApplied(searchParams: CarSearchParams): void {
    // Conservamos lo aplicado para que el formulario de filtros refleje la búsqueda.
    this.filters.set({ ...searchParams });
    this.searchParams.set(searchParams);
    this.page.update((page) => ({ ...page, offset: 1 }));
  }
}
