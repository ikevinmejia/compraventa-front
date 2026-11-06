import { Component, computed, inject, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { lazyCatalog } from '../../../../shared/utils/lazy-catalog';
import { CarMechanicalFormModel } from '../../models/car-mechanical-form.model';
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

  carModel = signal<CarMechanicalFormModel>({
    hasEngineLeaks: null, // Tiene fugas?
    engineLeaksDetail: '', // detalle de fugas
    transmissionCondition: null,
    suspensionCondition: null,
    additionalMechanicalObservations: '',
  });
  submitted = signal(false);

  yesNoOptions = signal<Catalog[]>(this.catalogsService.getYesNoOptions()).asReadonly();
  transmissionConditions = lazyCatalog(() => this.catalogsService.getTransmissionConditions());

  suspensionConditions = lazyCatalog(() => this.catalogsService.getSuspensionConditions());

  showEngineLeaksDetail = computed(() => {
    const hasEngineLeaks = this.carModel().hasEngineLeaks;
    return hasEngineLeaks !== null && hasEngineLeaks.id === 1; // Se muestra el campo si hay fugas
  });

  carForm = form(
    this.carModel,
    (schema) => {
      required(schema.hasEngineLeaks, { message: 'Tiene fugas requerido.' });
      required(schema.transmissionCondition, {
        message: 'Condición de la transmisión es requerida.',
      });
      required(schema.suspensionCondition, { message: 'Condición de la suspensión es requerida.' });

      required(schema.engineLeaksDetail, {
        message: 'Transmisión es requerida.',
        when: () => this.showEngineLeaksDetail(),
      });

      disabled(schema.engineLeaksDetail, {
        when: () => !this.showEngineLeaksDetail(),
      });

      maxLength(schema.engineLeaksDetail, 3000);
      maxLength(schema.additionalMechanicalObservations, 3000);
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
