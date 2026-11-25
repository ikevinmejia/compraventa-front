import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarMechanicalFormModel } from '../../models/car-mechanical-form.model';
import { UpdateCarMechanicalModel } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';
import { CatalogsService } from '../../services/catalogs.service';

@Component({
  imports: [FormField, Select, FloatLabel, InputText, SelectButtonModule, ButtonModule, FormRoot],
  selector: 'app-car-mechanical-form',
  styleUrl: './car-mechanical-form.css',
  templateUrl: './car-mechanical-form.html',
})
export class CarMechanicalForm {
  private readonly toastService = inject(ToastService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly queryClient = inject(QueryClient);
  private readonly carService = inject(CarService);

  id = input.required<string | undefined>();

  carModel = signal<CarMechanicalFormModel>({
    hasEngineLeaks: null, // Tiene fugas?
    engineLeaksDetail: '', // detalle de fugas
    transmissionCondition: null,
    suspensionCondition: null,
    additionalMechanicalObservations: '',
  });
  submitted = signal(false);

  yesNoOptions = signal<Catalog[]>(this.catalogsService.getYesNoOptions()).asReadonly();

  transmissionConditions = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'transmission-conditions'],
    queryFn: () => this.catalogsService.getTransmissionConditions(),
    staleTime: Infinity,
  }));

  suspensionConditions = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'suspension-conditions'],
    queryFn: () => this.catalogsService.getSuspensionConditions(),
    staleTime: Infinity,
  }));

  showEngineLeaksDetail = computed(() => {
    const hasEngineLeaks = this.carModel().hasEngineLeaks;
    return hasEngineLeaks !== null && hasEngineLeaks.id === 1; // Se muestra el campo si hay fugas
  });

  readonly getCarMechanicalData = injectQuery(() => ({
    queryKey: ['car', this.id()],
    queryFn: () => this.carService.findOne(this.id()!),
    enabled: !!this.id(),
    staleTime: 5 * 60 * 1000,
    select: (car): CarMechanicalFormModel => {
      const mechanicalInspection = car.mechanicalInspection;

      return {
        hasEngineLeaks: mechanicalInspection.hasEngineLeaks
          ? { id: 1, name: 'Sí' }
          : { id: 2, name: 'No' },
        engineLeaksDetail: mechanicalInspection.engineLeaksDetail,
        transmissionCondition: mechanicalInspection.transmissionCondition,
        suspensionCondition: mechanicalInspection.suspensionCondition,
        additionalMechanicalObservations: mechanicalInspection.additionalMechanicalObservations,
      };
    },
  }));

  readonly uptadeCarMutation = injectMutation(() => ({
    mutationFn: ({ carId, data }: { carId: string; data: UpdateCarMechanicalModel }) =>
      this.carService.patchMechanicalCar(carId, data),
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
      required(schema.hasEngineLeaks, { message: 'Tiene fugas requerido.' });
      required(schema.transmissionCondition, {
        message: 'Condición de la transmisión es requerida.',
      });
      required(schema.suspensionCondition, { message: 'Condición de la suspensión es requerida.' });

      disabled(schema.engineLeaksDetail, {
        when: () => !this.showEngineLeaksDetail(),
      });

      maxLength(schema.engineLeaksDetail, 3000);
      maxLength(schema.additionalMechanicalObservations, 3000);
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
          try {
            const data: UpdateCarMechanicalModel = {
              hasEngineLeaks: value.hasEngineLeaks?.id === 1 ? true : false,
              transmissionConditionId: value.transmissionCondition?.id!,
              suspensionConditionId: value.suspensionCondition?.id!,
              additionalMechanicalObservations: value.additionalMechanicalObservations,
              engineLeaksDetail: value.engineLeaksDetail,
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
      const carData = this.getCarMechanicalData.data();
      if (!carData) return;
      this.carModel.set(carData);
    });
  }
}
