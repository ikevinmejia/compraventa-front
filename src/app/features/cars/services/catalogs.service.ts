import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { aniosEnDeuda, yesNoOptions } from '../../../../data/data';
import { environment } from '../../../../environments/environment';
import { Catalog } from '../../../shared/models/shared.interface';

/**
 * Capa de acceso a la API de catálogos.
 * Los componentes conocen estos métodos, no las URLs ni el mecanismo de simulación.
 */
// @Injectable({ providedIn: 'root' })
@Service()
export class CatalogsService {
  private readonly http = inject(HttpClient);
  // Normalizamos por si la variable de entorno termina accidentalmente en "/".
  private readonly baseUrl = `${environment.apiUrl}`;

  /**
   * La clave es la URL. Así Toyota y Mazda tienen entradas distintas,
   * y una petición repetida reutiliza tanto una respuesta guardada como
   * una solicitud que todavía está en curso.
   */
  private readonly getCache = new Map<string, Observable<unknown>>();

  /** GET /departments */
  getDepartments(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/departments`);
  }

  /** GET /departments/:departmentId/municipalities */
  getMunicipalities(departmentId: number): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/departments/${departmentId}/municipalities`);
  }

  /** GET /brands */
  getBrands(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/brands`);
  }

  /** GET /brands/:brandId/models */
  getModels(brandId: number): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/brands/${brandId}/models`);
  }

  getYesNoOptions(): Catalog[] {
    return yesNoOptions;
  }
  getAniosEnDeuda(): Catalog[] {
    return aniosEnDeuda;
  }

  /** GET /catalogs/engine-types/ */
  getEngineTypes(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/engine-types`);
  }

  /** GET /catalogs/transmissions/ */
  getTransmissions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/transmissions`);
  }

  /** GET /catalogs/transmission-conditions/ */
  getTransmissionConditions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/transmission-conditions`);
  }

  /** GET /catalogs/suspension-conditions/ */
  getSuspensionConditions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/suspension-conditions`);
  }

  /** GET /catalogs/rims-types/ */
  getRimsTypes(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/rims-types`);
  }

  /** GET /catalogs/tires-conditions/ */
  getTiresConditions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/tires-conditions`);
  }

  /** GET /catalogs/adjustment-types/ */
  getAdjustmentTypes(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/adjustment-types`);
  }

  /** GET /catalogs/paint-conditions/ */
  getPaintConditions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/paint-conditions`);
  }

  /** GET /catalogs/chassis-damages/ */
  getChassisDamages(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/chassis-damages`);
  }

  /** GET /catalogs/structural-conditions/ */
  getStructuralConditions(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/structural-conditions`);
  }

  /** GET /catalogs/runt-pending-issues/ */
  getRuntPendingIssues(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/runt-pending-issues`);
  }

  /** GET /catalogs/insurance-claim-types/ */
  getInsuranceClaimTypes(): Observable<Catalog[]> {
    return this.getCached<Catalog[]>(`${this.baseUrl}/catalogs/insurance-claim-types`);
  }

  /**
   * Vacía la caché si algún catálogo cambia y quieres forzar una nueva consulta.
   * Por ejemplo, después de crear o editar una marca o una referencia.
   */
  clearCache(): void {
    this.getCache.clear();
  }

  /**
   * `HttpClient.get` es frío: la petición empieza al suscribirse.
   * `shareReplay` comparte la petición en curso y conserva su último resultado
   * para los siguientes suscriptores mientras esta instancia del servicio exista.
   */
  private getCached<T>(url: string): Observable<T> {
    const cachedRequest = this.getCache.get(url);
    if (cachedRequest) {
      return cachedRequest as Observable<T>;
    }

    const request = this.http.get<T>(url).pipe(
      // refCount:false permite completar y guardar la respuesta aunque el
      // componente deje de observarla al cambiar rápidamente de marca.
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.getCache.set(url, request);
    return request;
  }
}
