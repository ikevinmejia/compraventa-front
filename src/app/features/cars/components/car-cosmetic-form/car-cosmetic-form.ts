import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DividerModule } from '@openng/optimus-ui/divider';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarCosmeticFormModel } from '../../models/car-cosmetic-form.model';
import { UpdateCarCosmeticlModel } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';
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
  private readonly queryClient = inject(QueryClient);
  private readonly carService = inject(CarService);

  id = input.required<string | undefined>();

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

  readonly getCarCosmeticData = injectQuery(() => ({
    queryKey: ['car', this.id()],
    queryFn: () => this.carService.findOne(this.id()!),
    enabled: !!this.id(),
    staleTime: 5 * 60 * 1000,
    select: (car): CarCosmeticFormModel => {
      const cosmeticInspection = car.cosmeticInspection;

      const yesOrNot = (v: boolean): Catalog => {
        return v ? { id: 1, name: 'Sí' } : { id: 2, name: 'No' };
      };

      return {
        electricWindowsFunctional: yesOrNot(cosmeticInspection.electricWindowsFunctional),
        windowsCheckByDoor: {
          fl: yesOrNot(cosmeticInspection.windowsCheckByDoor.fl),
          fr: yesOrNot(cosmeticInspection.windowsCheckByDoor.fr),
          rl: yesOrNot(cosmeticInspection.windowsCheckByDoor.rl),
          rr: yesOrNot(cosmeticInspection.windowsCheckByDoor.rr),
        },
        rimsType: cosmeticInspection.rimsType,
        tiresCondition: cosmeticInspection.tiresCondition,
        steeringColumnAdjustment: cosmeticInspection.steeringColumnAdjustment,
        mirrorsType: cosmeticInspection.mirrorsType,
        mirrorsFunctional: yesOrNot(cosmeticInspection.mirrorsFunctional),
        paintCondition: cosmeticInspection.paintCondition,
        hoodDents: yesOrNot(cosmeticInspection.hoodDents),
        chassisFrontDamage: cosmeticInspection.chassisFrontDamage,
        driverDoorPillar: cosmeticInspection.driverDoorPillar,
        passengerDoorPillar: cosmeticInspection.passengerDoorPillar,
        doorsOpenProperly: yesOrNot(cosmeticInspection.doorsOpenProperly),
        trunkStructure: cosmeticInspection.trunkStructure,
        trunkFloor: cosmeticInspection.trunkFloor,
        trunkHasRust: yesOrNot(cosmeticInspection.trunkHasRust),
        hasSpareTire: yesOrNot(cosmeticInspection.hasSpareTire),
        additionalObservations: cosmeticInspection.additionalObservations,
      };
    },
  }));

  readonly uptadeCarMutation = injectMutation(() => ({
    mutationFn: ({ carId, data }: { carId: string; data: UpdateCarCosmeticlModel }) =>
      this.carService.patchCosmeticCar(carId, data),
    onSuccess: (_, { carId }) => {
      this.toastService.success('Información actualizada.');
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
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
          const value = field().value();
          if (!this.id()) {
            this.toastService.show({
              summary: 'Vuelva a ingresar',
              detail: 'para obtener identificación del vehículo',
              severity: 'warn',
            });
          }

          const transformToBoolean = (v: number): boolean => {
            return v === 1 ? true : false;
          };
          try {
            const data: UpdateCarCosmeticlModel = {
              electricWindowsFunctional: transformToBoolean(value.electricWindowsFunctional?.id!),
              windowsCheckByDoor: {
                fl: transformToBoolean(value.windowsCheckByDoor.fl?.id!),
                fr: transformToBoolean(value.windowsCheckByDoor.fr?.id!),
                rl: transformToBoolean(value.windowsCheckByDoor.rl?.id!),
                rr: transformToBoolean(value.windowsCheckByDoor.rr?.id!),
              },
              rimsTypeId: value.rimsType?.id!,
              tiresConditionId: value.tiresCondition?.id!,
              steeringColumnAdjustmentId: value.steeringColumnAdjustment?.id!,
              mirrorsTypeId: value.mirrorsType?.id!,
              mirrorsFunctional: transformToBoolean(value.mirrorsFunctional?.id!),
              paintConditionId: value.paintCondition?.id!,
              hoodDents: transformToBoolean(value.hoodDents?.id!),
              chassisFrontDamageId: value.chassisFrontDamage?.id!,
              driverDoorPillarId: value.driverDoorPillar?.id!,
              passengerDoorPillarId: value.passengerDoorPillar?.id!,
              doorsOpenProperly: transformToBoolean(value.doorsOpenProperly?.id!),
              trunkStructureId: value.trunkStructure?.id!,
              trunkFloorId: value.trunkFloor?.id!,
              trunkHasRust: transformToBoolean(value.trunkHasRust?.id!),
              hasSpareTire: transformToBoolean(value.hasSpareTire?.id!),
              additionalObservations: value.additionalObservations,
            };

            await this.uptadeCarMutation.mutateAsync({ carId: this.id()!, data });
            return;
          } catch (error) {
            const status = (error as HttpErrorResponse).status;
            const message = 'No se pudo actualizar la información';
            this.toastService.error('Error al actualizar', message);
            return { kind: 'serverError', message };
          }
        },
      },
    },
  );

  constructor() {
    effect(() => {
      const carData = this.getCarCosmeticData.data();
      if (!carData) return;
      this.carModel.set(carData);
    });
  }
}
