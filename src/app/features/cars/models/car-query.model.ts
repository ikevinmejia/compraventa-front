import { Catalog } from '../../../shared/models/shared.interface';

export interface CarSearchParams {
  search?: string;
  brandId?: number;
  modelId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface CarListQuery extends CarSearchParams {
  limit: number;
  offset: number;
}

export interface CreateCarModel {
  plate: string;
  brandId: number;
  brandNameHint: string;
  modelNameHint: string;
  modelId: number;
  year: number;
  engineTypeId: number;
  displacement: number;
  transmissionId: number;
}

export interface UpdateCarModel extends Partial<CreateCarModel> {
  price?: number;
  inventoryStateId?: number;
}

export interface CarDetails {
  id: string;
  plate: string;
  price: number;
  year: number;
  displacement: number;
  slug: string;
  brand: Catalog;
  model: Catalog;
  engineType: Catalog;
  transmissionType: Catalog;
  inventoryState: Catalog;
  images: string[];
  cosmeticInspection: CarCosmeticInspection;
  mechanicalInspection: CarMechanicalInspection;
  legalVerification: null; // ! Falta
  coverImageUrl: string;
}

export interface UpdateCarMechanicalModel {
  hasEngineLeaks: boolean; // Tiene fugas el motor

  engineLeaksDetail?: string; // Detalle de fugaz

  transmissionConditionId: number;

  suspensionConditionId: number;

  additionalMechanicalObservations?: string; // Observaciones
}

export interface CarMechanicalInspection {
  hasEngineLeaks: boolean;
  engineLeaksDetail: string;
  additionalMechanicalObservations: string;
  transmissionCondition: Catalog;
  suspensionCondition: Catalog;
}

export interface UpdateCarCosmeticlModel {
  electricWindowsFunctional: boolean;

  windowsCheckByDoor: {
    fl: boolean; // front-left
    fr: boolean; // front-right
    rl: boolean; // rear-left
    rr: boolean; // rear-right
  };

  rimsTypeId: number;

  tiresConditionId: number; // Estado de las llantas

  steeringColumnAdjustmentId: number; // Ajuste de la cabrilla

  mirrorsTypeId: number; // Vidrios manuales o electricos

  mirrorsFunctional: boolean;

  paintConditionId: number; // Vidrios manuales o electricos

  hoodDents: boolean; // Capó presenta golpes?

  chassisFrontDamageId: number;

  driverDoorPillarId: number;

  passengerDoorPillarId: number;

  doorsOpenProperly: boolean; // puertas abren bien?

  trunkStructureId: number; // estructura del maletero

  trunkFloorId: number; // Estructura del piso del maletero

  trunkHasRust: boolean; // Maletero tiene podridos?

  hasSpareTire: boolean; // Llanta de repuesto

  additionalObservations?: string; // Llanta de repuesto
}

export interface CarCosmeticInspection {
  electricWindowsFunctional: boolean;
  windowsCheckByDoor: {
    fl: boolean;
    fr: boolean;
    rl: boolean;
    rr: boolean;
  };
  rimsType: Catalog;
  tiresCondition: Catalog;
  steeringColumnAdjustment: Catalog;
  mirrorsType: Catalog;
  mirrorsFunctional: boolean;
  paintCondition: Catalog;
  hoodDents: boolean;
  chassisFrontDamage: Catalog;
  driverDoorPillar: Catalog;
  passengerDoorPillar: Catalog;
  doorsOpenProperly: boolean;
  trunkStructure: Catalog;
  trunkFloor: Catalog;
  trunkHasRust: boolean;
  hasSpareTire: boolean;
  additionalObservations: string;
}
