import { Catalog } from '../../../shared/models/shared.interface';

export interface CarFormModel {
  plate: string;
  brand: Catalog | null;
  model: Catalog | null;
  year: Catalog | null;
  engineType: Catalog | null;
  displacement: number | null;
  transmission: Catalog | null;
}
