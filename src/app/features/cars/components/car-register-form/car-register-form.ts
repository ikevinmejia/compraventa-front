import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { apply, form, FormRoot } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { injectMutation, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { CreateCarModel } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';
import { CarFormFields } from '../car-form/car-form-fields/car-form-fields';
import { carBaseSchema, emptyCarModel, setupCarFormEffects } from '../car-form/car-form.logic';

@Component({
  selector: 'app-car-register-form',
  imports: [
    FormRoot,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    CarFormFields,
  ],
  templateUrl: './car-register-form.html',
  styleUrl: './car-register-form.css',
})
export class CarRegisterForm {
  private readonly toastService = inject(ToastService);
  private readonly carService = inject(CarService);
  private readonly queryClient = inject(QueryClient);

  readonly createCarMutation = injectMutation(() => ({
    mutationFn: (data: CreateCarModel) => this.carService.postCar(data),
    onSuccess: () => {
      this.toastService.success('Vehículo registrado.');
      return this.queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  }));

  model = signal(emptyCarModel());

  carForm = form(this.model, (s) => apply(s, carBaseSchema), {
    submission: {
      action: async (field) => {
        const value = field().value();
        try {
          await this.createCarMutation.mutateAsync({
            plate: value.plate,
            year: value.year?.id!,
            brandId: value.brand!.id,
            brandNameHint: value.brand!.name,
            modelId: value.model!.id,
            modelNameHint: value.model!.name,
            engineTypeId: value.engineType?.id!,
            displacement: value.displacement!,
            transmissionId: value.transmission?.id!,
          });

          // Solo llega aquí si el POST salió bien
          this.model.set(emptyCarModel());
          field().reset();
          return;
        } catch (error) {
          const status = (error as HttpErrorResponse).status;
          const message =
            status === 409
              ? `Ya existe un vehículo con placa ${value.plate}.`
              : 'No se pudo registrar el vehículo.';
          this.toastService.error('Error al registrar', message);
          return { kind: 'serverError', message };
        }
      },
    },
  });
  constructor() {
    setupCarFormEffects(this.model);
  }
}
