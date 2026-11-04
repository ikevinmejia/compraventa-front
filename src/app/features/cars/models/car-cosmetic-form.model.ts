import { Catalog } from '../../../shared/models/shared.interface';

type WindowsCheckDto = {
  fl: boolean | null; // front-left
  fr: boolean | null; // front-right
  rl: boolean | null; // rear-left
  rr: boolean | null; // rear-right
};

export interface CarCosmeticFormModel {
  electricWindowsFunctional: boolean | null;

  windowsCheckByDoor: WindowsCheckDto;

  rimsType: Catalog | null;

  tiresCondition: Catalog | null; // Estado de las llantas

  steeringColumnAdjustment: Catalog | null; // Ajuste del volante

  mirrorsType: Catalog | null; // Espejos manuales o electricos

  mirrorsFunctional: boolean | null;

  paintCondition: Catalog | null; // Condición de la pintura

  hoodDents: boolean | null; // Capó presenta golpes?

  chassisFrontDamage: Catalog | null;

  driverDoorPillar: Catalog | null;

  passengerDoorPillar: Catalog | null;

  doorsOpenProperly: boolean | null; // puertas abren bien?

  trunkStructure: Catalog | null; // estructura del maletero

  trunkFloor: Catalog | null; // Estructura del piso del maletero

  trunkHasRust: boolean | null; // Maletero tiene podridos?

  hasSpareTire: boolean | null; // Llanta de repuesto

  additionalObservations: string; // Observaciones adicionales
}
