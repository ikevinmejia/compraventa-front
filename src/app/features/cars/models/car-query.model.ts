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
  cosmeticInspection: null; // ! Falta
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
