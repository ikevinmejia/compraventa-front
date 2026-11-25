import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DataPaginator } from '../../../shared/models/shared.interface';
import {
  CarDetails,
  CarListQuery,
  CreateCarModel,
  UpdateCarMechanicalModel,
  UpdateCarModel,
} from '../models/car-query.model';
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

  /** GET /cars/:id */
  findOne(carId: string): Promise<CarDetails> {
    return lastValueFrom(this.http.get<CarDetails>(`${this.baseUrl}/cars/${carId}`));
  }

  /** POST /cars */
  postCar(createCarModel: CreateCarModel): Promise<CreateCarModel> {
    return firstValueFrom(this.http.post<CreateCarModel>(`${this.baseUrl}/cars`, createCarModel));
  }

  /** PATCH /cars/:id */
  patchCar(carId: string, updateCarModel: UpdateCarModel): Promise<UpdateCarModel> {
    return firstValueFrom(
      this.http.patch<UpdateCarModel>(`${this.baseUrl}/cars/${carId}`, updateCarModel),
    );
  }

  /** PATCH /car-mechanical-inspections/:id */
  patchMechanicalCar(
    carId: string,
    updateCarMechanicalModel: UpdateCarMechanicalModel,
  ): Promise<UpdateCarMechanicalModel> {
    return firstValueFrom(
      this.http.post<UpdateCarMechanicalModel>(
        `${this.baseUrl}/car-mechanical-inspections/${carId}`,
        updateCarMechanicalModel,
      ),
    );
  }
}
