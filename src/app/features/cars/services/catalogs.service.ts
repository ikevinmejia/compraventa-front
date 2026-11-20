import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { aniosEnDeuda, yesNoOptions } from '../../../../data/data';
import { environment } from '../../../../environments/environment';
import { Catalog } from '../../../shared/models/shared.interface';

@Service()
export class CatalogsService {
  private readonly http = inject(HttpClient);
  // Normalizamos por si la variable de entorno termina accidentalmente en "/".
  private readonly baseUrl = `${environment.apiUrl}`;

  /** GET /departments */
  getDepartments(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/departments`));
  }

  /** GET /departments/:departmentId/municipalities */
  getMunicipalities(departmentId: number): Promise<Catalog[]> {
    return lastValueFrom(
      this.http.get<Catalog[]>(`${this.baseUrl}/departments/${departmentId}/municipalities`),
    );
  }

  /** GET /brands */
  getBrands(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/brands`));
  }

  /** GET /brands/:brandId/models */
  getModels(brandId: number): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/brands/${brandId}/models`));
  }

  getYesNoOptions(): Catalog[] {
    return yesNoOptions;
  }
  getAniosEnDeuda(): Catalog[] {
    return aniosEnDeuda;
  }

  /** GET /catalogs/engine-types/ */
  getEngineTypes(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/engine-types`));
  }

  /** GET /catalogs/transmissions/ */
  getTransmissions(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/transmissions`));
  }

  /** GET /catalogs/transmission-conditions/ */
  getTransmissionConditions(): Promise<Catalog[]> {
    return lastValueFrom(
      this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/transmission-conditions`),
    );
  }

  /** GET /catalogs/suspension-conditions/ */
  getSuspensionConditions(): Promise<Catalog[]> {
    return lastValueFrom(
      this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/suspension-conditions`),
    );
  }

  /** GET /catalogs/rims-types/ */
  getRimsTypes(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/rims-types`));
  }

  /** GET /catalogs/tires-conditions/ */
  getTiresConditions(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/tires-conditions`));
  }

  /** GET /catalogs/adjustment-types/ */
  getAdjustmentTypes(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/adjustment-types`));
  }

  /** GET /catalogs/paint-conditions/ */
  getPaintConditions(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/paint-conditions`));
  }

  /** GET /catalogs/chassis-damages/ */
  getChassisDamages(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/chassis-damages`));
  }

  /** GET /catalogs/structural-conditions/ */
  getStructuralConditions(): Promise<Catalog[]> {
    return lastValueFrom(
      this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/structural-conditions`),
    );
  }

  /** GET /catalogs/runt-pending-issues/ */
  getRuntPendingIssues(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/runt-pending-issues`));
  }

  /** GET /catalogs/insurance-claim-types/ */
  getInsuranceClaimTypes(): Promise<Catalog[]> {
    return lastValueFrom(
      this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/insurance-claim-types`),
    );
  }

  /** GET /catalogs/inventory-states/ */
  getInventoryStates(): Promise<Catalog[]> {
    return lastValueFrom(this.http.get<Catalog[]>(`${this.baseUrl}/catalogs/inventory-states`));
  }
}
