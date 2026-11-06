import { Component, inject, signal } from '@angular/core';
import { apply, form, FormRoot } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToastService } from '../../../../core/services/toast.service';
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
  model = signal(emptyCarModel());
  carForm = form(this.model, (s) => apply(s, carBaseSchema), {
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
  });
  constructor() {
    setupCarFormEffects(this.model);
  }
}
