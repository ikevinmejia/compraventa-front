import { Catalog } from '../../../shared/models/shared.interface';

export interface CarFormModel {
  plate: string;
  brand: Catalog | null;
  model: Catalog | null;
  year: number | null;
  engineTypeId: number | null;
  displacement: number | null;
  transmissionId: number | null;
}
