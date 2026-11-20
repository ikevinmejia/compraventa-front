import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DataPaginator } from '../../../shared/models/shared.interface';
import { CarListQuery, CreateCarModel } from '../models/car-query.model';
import { Car } from '../models/car.interface';

@Service()
export class CarService {
  private readonly http = inject(HttpClient);
  // Normalizamos por si la variable de entorno termina accidentalmente en "/".
  private readonly baseUrl = `${environment.apiUrl}`;

  /** GET /cars */
  getCars(query: CarListQuery): Promise<DataPaginator<Car>> {
    return lastValueFrom(
      this.http.get<DataPaginator<Car>>(`${this.baseUrl}/cars`, {
        params: { ...query },
      }),
    );
  }
  /** POST /cars */
  postCar(createCarModel: CreateCarModel): Promise<CreateCarModel> {
    return firstValueFrom(this.http.post<CreateCarModel>(`${this.baseUrl}/cars`, createCarModel));
  }
}
