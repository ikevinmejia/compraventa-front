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
