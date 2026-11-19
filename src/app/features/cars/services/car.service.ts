import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DataPaginator } from '../../../shared/models/shared.interface';
import { CacheService } from '../../../shared/services/cache.service';
import { CarListQuery, CreateCarModel } from '../models/car-query.model';
import { Car } from '../models/car.interface';

@Service()
export class CarService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  // Normalizamos por si la variable de entorno termina accidentalmente en "/".
  private readonly baseUrl = `${environment.apiUrl}`;

  // Contador que avisa "el listado cambió"
  private readonly _carsVersion = signal<number>(0);
  readonly carsVersion = this._carsVersion.asReadonly();

  /** GET /cars */
  getCars(query: CarListQuery): Observable<DataPaginator<Car>> {
    return this.cacheService.get<DataPaginator<Car>>(`${this.baseUrl}/cars`, {
      params: { ...query },
      ttlMs: 30_000,
    });
  }
  /** POST /cars */
  postCar(createCarModel: CreateCarModel) {
    return firstValueFrom(
      this.http.post<CreateCarModel>(`${this.baseUrl}/cars`, createCarModel).pipe(
        tap(() => {
          this.cacheService.clear(`${this.baseUrl}/cars`);
          this._carsVersion.update((v) => v + 1);
        }),
      ),
    );
  }
}
