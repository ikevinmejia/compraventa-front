import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { aniosEnDeuda, yesNoOptions } from '../../../../data/data';
import { environment } from '../../../../environments/environment';
import { Catalog } from '../../../shared/models/shared.interface';
import { CacheService } from '../../../shared/services/cache.service';

/**
 * Capa de acceso a la API de catálogos.
 * Los componentes conocen estos métodos, no las URLs ni el mecanismo de simulación.
 */
// @Injectable({ providedIn: 'root' })
@Service()
export class CatalogsService {
  private readonly cacheService = inject(CacheService);
  // Normalizamos por si la variable de entorno termina accidentalmente en "/".
  private readonly baseUrl = `${environment.apiUrl}`;

  /** GET /departments */
  getDepartments(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/departments`);
  }

  /** GET /departments/:departmentId/municipalities */
  getMunicipalities(departmentId: number): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(
      `${this.baseUrl}/departments/${departmentId}/municipalities`,
    );
  }

  /** GET /brands */
  getBrands(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/brands`);
  }

  /** GET /brands/:brandId/models */
  getModels(brandId: number): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/brands/${brandId}/models`);
  }

  getYesNoOptions(): Catalog[] {
    return yesNoOptions;
  }
  getAniosEnDeuda(): Catalog[] {
    return aniosEnDeuda;
  }

  /** GET /catalogs/engine-types/ */
  getEngineTypes(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/engine-types`);
  }

  /** GET /catalogs/transmissions/ */
  getTransmissions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/transmissions`);
  }

  /** GET /catalogs/transmission-conditions/ */
  getTransmissionConditions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/transmission-conditions`);
  }

  /** GET /catalogs/suspension-conditions/ */
  getSuspensionConditions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/suspension-conditions`);
  }

  /** GET /catalogs/rims-types/ */
  getRimsTypes(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/rims-types`);
  }

  /** GET /catalogs/tires-conditions/ */
  getTiresConditions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/tires-conditions`);
  }

  /** GET /catalogs/adjustment-types/ */
  getAdjustmentTypes(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/adjustment-types`);
  }

  /** GET /catalogs/paint-conditions/ */
  getPaintConditions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/paint-conditions`);
  }

  /** GET /catalogs/chassis-damages/ */
  getChassisDamages(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/chassis-damages`);
  }

  /** GET /catalogs/structural-conditions/ */
  getStructuralConditions(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/structural-conditions`);
  }

  /** GET /catalogs/runt-pending-issues/ */
  getRuntPendingIssues(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/runt-pending-issues`);
  }

  /** GET /catalogs/insurance-claim-types/ */
  getInsuranceClaimTypes(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/insurance-claim-types`);
  }

  /** GET /catalogs/inventory-states/ */
  getInventoryStates(): Observable<Catalog[]> {
    return this.cacheService.get<Catalog[]>(`${this.baseUrl}/catalogs/inventory-states`);
  }
}
