import { Catalog } from '../../../shared/models/shared.interface';

type WindowsCheckDto = {
  fl: Catalog | null; // front-left
  fr: Catalog | null; // front-right
  rl: Catalog | null; // rear-left
  rr: Catalog | null; // rear-right
};

export interface CarCosmeticFormModel {
  electricWindowsFunctional: Catalog | null;

  windowsCheckByDoor: WindowsCheckDto;

  rimsType: Catalog | null;

  tiresCondition: Catalog | null; // Estado de las llantas

  steeringColumnAdjustment: Catalog | null; // Ajuste del volante

  mirrorsType: Catalog | null; // Espejos manuales o electricos

  mirrorsFunctional: Catalog | null;

  paintCondition: Catalog | null; // Condición de la pintura

  hoodDents: Catalog | null; // Capó presenta golpes?

  chassisFrontDamage: Catalog | null;

  driverDoorPillar: Catalog | null;

  passengerDoorPillar: Catalog | null;

  doorsOpenProperly: Catalog | null; // puertas abren bien?

  trunkStructure: Catalog | null; // estructura del maletero

  trunkFloor: Catalog | null; // Estructura del piso del maletero

  trunkHasRust: Catalog | null; // Maletero tiene podridos?

  hasSpareTire: Catalog | null; // Llanta de repuesto

  additionalObservations: string; // Observaciones adicionales
}
