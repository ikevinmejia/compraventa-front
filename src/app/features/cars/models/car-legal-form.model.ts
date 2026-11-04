import { Catalog } from '../../../shared/models/shared.interface';
export interface CarLegalFormModel {
  registrationDepartment: Catalog | null;

  registrationCity: Catalog | null;

  soatExpirationDate: Date | null; // vigencia de soat

  technicalInspectionExpirationDate: Date | null; // vigencia tecnomecanica

  hasTrafficFines: Catalog | null; // Tiene fotomultas? - Si | No

  trafficFinesCount: number | null; // Cantidad de multas

  trafficFinesTotalAmount: number | null; // Total en dinero de multas

  municipalTrafficLightTaxUpToDate: Catalog | null; // Esta al día impuesto municipal - semaforización - Si | No

  taxesUpToDate: Catalog | null; // Impuestos al día si o no

  taxesOwedYears: Catalog | null; // Años de deuda de impuestos

  runtMatchesLicense: Catalog | null; // Coincide la licencia con el runt? - Si | No

  runtHasLiens: Catalog | null; // Tiene gravamenes? - Si | No

  runtPendingIssues: Catalog[] | null; // * Esta es obligatoria si runtHasLiens se seleccionó que Sí === 1

  hasInsuranceClaims: Catalog | null; // Tiene siniestros? - Si | No

  insuranceClaimType: Catalog | null;

  hadPublicServiceUse: Catalog | null; // Tuvo uso público? - Si | No
}
