import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DividerModule } from '@openng/optimus-ui/divider';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarCosmeticFormModel } from '../../models/car-cosmetic-form.model';
import { CatalogsService } from '../../services/catalogs.service';

@Component({
  imports: [
    FormField,
    Select,
    FloatLabel,
    InputText,
    SelectButtonModule,
    ButtonModule,
    FormRoot,
    DividerModule,
  ],
  selector: 'app-car-cosmetic-form',
  styleUrl: './car-cosmetic-form.css',
  templateUrl: './car-cosmetic-form.html',
})
export class CarCosmeticForm {
  private readonly toastService = inject(ToastService);
  private readonly catalogsService = inject(CatalogsService);

  carModel = signal<CarCosmeticFormModel>({
    electricWindowsFunctional: null,
    windowsCheckByDoor: {
      fl: null,
      fr: null,
      rl: null,
      rr: null,
    },
    rimsType: null,
    tiresCondition: null,
    steeringColumnAdjustment: null,
    mirrorsType: null,
    mirrorsFunctional: null,
    paintCondition: null,
    hoodDents: null,
    chassisFrontDamage: null,
    driverDoorPillar: null,
    passengerDoorPillar: null,
    doorsOpenProperly: null,
    trunkStructure: null,
    trunkFloor: null,
    trunkHasRust: null,
    hasSpareTire: null,
    additionalObservations: '',
  });
  submitted = signal(false);

  yesNoOptions = signal<Catalog[]>(this.catalogsService.getYesNoOptions()).asReadonly();

  readonly rimsTypes = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'rims-types'],
    queryFn: () => this.catalogsService.getRimsTypes(),
    staleTime: Infinity,
  }));

  readonly tiresCondition = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'tires-conditions'],
    queryFn: () => this.catalogsService.getTiresConditions(),
    staleTime: Infinity,
  }));

  readonly adjustmentType = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'adjustment-types'],
    queryFn: () => this.catalogsService.getAdjustmentTypes(),
    staleTime: Infinity,
  }));

  readonly paintCondition = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'paint-conditions'],
    queryFn: () => this.catalogsService.getPaintConditions(),
    staleTime: Infinity,
  }));

  readonly chassisFrontDamage = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'chassis-damages'],
    queryFn: () => this.catalogsService.getChassisDamages(),
    staleTime: Infinity,
  }));

  readonly structuralCondition = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'structural-conditions'],
    queryFn: () => this.catalogsService.getStructuralConditions(),
    staleTime: Infinity,
  }));

  carForm = form(
    this.carModel,
    (schema) => {
      required(schema.electricWindowsFunctional, { message: 'Ventanas funcionales requerido' });
      required(schema.windowsCheckByDoor.fl);
      required(schema.windowsCheckByDoor.fr);
      required(schema.windowsCheckByDoor.rl);
      required(schema.windowsCheckByDoor.rr);
      required(schema.rimsType, { message: 'Tipo de rines requerido.' });
      required(schema.tiresCondition, { message: 'Estado de las llantas requerido.' });
      required(schema.steeringColumnAdjustment, {
        message: 'Estado de ajuste de cabrilla requerido.',
      });
      required(schema.mirrorsType, { message: 'Tipo de vidrios requerido.' });
      required(schema.mirrorsFunctional, { message: 'Espejos funcionales requerido.' });
      required(schema.paintCondition, { message: 'Condición de la pintura requerida.' });
      required(schema.hoodDents, { message: 'Capó con golpes requerido.' });
      required(schema.chassisFrontDamage, {
        message: 'Estado de golpes al frente del chasis requerido.',
      });
      required(schema.driverDoorPillar, { message: 'Paral puerta conductor requerido.' });
      required(schema.passengerDoorPillar, { message: 'Paral puerta pasajero requerido.' });
      required(schema.doorsOpenProperly, { message: 'Puertas abren bien requerido.' });
      required(schema.trunkStructure, { message: 'Estructura maletero requerido.' });
      required(schema.trunkFloor, { message: 'Condición del maletero requerido.' });
      required(schema.trunkHasRust, { message: 'Tiene llanta de repuesto requerido.' });
      required(schema.hasSpareTire, { message: 'Condición de la suspensión es requerida.' });

      maxLength(schema.additionalObservations, 3000);
    },
    {
      submission: {
        action: async (field) => {
          try {
            // this.authService.login(field().value());
            console.log(field().value());

            // Aquí va todo lo que quieras que pase en caso de éxito
            // await this.router.navigate(['/auth/login']);
            this.toastService.success(`información actualizada`);
            return; // sin retorno = éxito
          } catch (error) {
            console.log(field().errors());
            console.log(error);
            this.toastService.error('Error al registrar', (error as Error).message);
            return { kind: 'serverError', message: (error as Error).message };
          }
        },
      },
    },
  );
}
