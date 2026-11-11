import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CarImage, CarWithImages } from '../models/car-image.model';

/** Peticiones HTTP para leer y administrar las imágenes asociadas a un auto. */
@Injectable({ providedIn: 'root' })
export class CarImagesService {
  private readonly http = inject(HttpClient);
  private readonly carsUrl = `${environment.apiUrl.replace(/\/+$/, '')}/cars`;

  /** El endpoint GET /cars/:id debe devolver la relación `images`. */
  getImages(carId: string): Observable<CarImage[]> {
    return this.http
      .get<CarWithImages>(`${this.carsUrl}/${carId}`)
      .pipe(map((car) => car.images ?? []));
  }

  /**
   * `FilesInterceptor('files', 10)` espera que cada archivo use la clave `files`.
   * El navegador añade automáticamente el boundary del multipart/form-data.
   */
  upload(carId: string, files: File[]): Observable<unknown> {
    const body = new FormData();
    for (const file of files) body.append('files', file, file.name);

    return this.http.patch(`${this.carsUrl}/${carId}/images`, body);
  }

  /** Marca una imagen ya asociada como portada del vehículo. */
  setCover(carId: string, imageId: string): Observable<unknown> {
    return this.http.patch(`${this.carsUrl}/${carId}/images/${imageId}/cover`, {});
  }
}
