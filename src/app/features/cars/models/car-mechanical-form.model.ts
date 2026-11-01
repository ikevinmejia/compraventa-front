import { Catalog } from '../../../shared/models/shared.interface';

export interface CarMechanicalFormModel {
  hasEngineLeaks: Catalog | null; // null = aún no respondido
  engineLeaksDetail: string;
  transmissionCondition: Catalog | null;
  suspensionCondition: Catalog | null;
  additionalMechanicalObservations: string;
}
