import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { apply, form, FormRoot } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
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
  model = signal(emptyCarModel());
  carForm = form(this.model, (s) => apply(s, carBaseSchema), {
    submission: {
      action: async (field) => {
        try {
          if (!field().value()) return;
          const data: CreateCarModel = {
            plate: field().value().plate,
            year: field().value().year!,
            brandId: field().value().brand!.id,
            brandNameHint: field().value().brand!.name,
            modelNameHint: field().value().model!.name,
            modelId: field().value().model!.id,
            engineTypeId: field().value().engineTypeId!,
            displacement: field().value().displacement!,
            transmissionId: field().value().transmissionId!,
          };
          await this.carService.postCar(data);

          this.toastService.success(`Vehículo registrado.`);

          this.model.set(emptyCarModel()); // 1. vuelve a los valores iniciales
          field().reset(); // 2. limpia touched/dirty para que no salgan errores en rojo
          return;
        } catch (error) {
          const status = (error as HttpErrorResponse).status;
          const message =
            status === 409
              ? `Ya existe un vehículo con placa ${field().value().plate}.`
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
