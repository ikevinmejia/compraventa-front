export interface carModel {
  plate: string;
  brandNameHint: string;
  modelNameHint: string;
  brandId: number;
  modelId: number;
  year: number;
  engineTypeId: number;
  displacement: number;
  transmissionId: number;
}

export interface Car {
  id: string;
  plate: string;
  slug: string;
  year: number;
  displacement: number;
  brand: string;
  model: string;
  engineType: string;
  transmission: string;
  inventoryState: string;
  coverImageUrl: string;
}
