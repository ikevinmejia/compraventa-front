import { Component, inject, signal } from '@angular/core';
import { apply, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { Select } from '@openng/optimus-ui/select';
import { lazyCatalog } from '../../../../shared/utils/lazy-catalog';
import { CarFormFields } from '../../components/car-form/car-form-fields/car-form-fields';
import { carBaseSchema, setupCarFormEffects } from '../../components/car-form/car-form.logic';
import { CarFormModel } from '../../models/car-form.model';
import { CatalogsService } from '../../services/catalogs.service';

interface CarEditModel extends CarFormModel {
  inventoryStateId: number | null;
  price: number | null;
}

@Component({
  selector: 'app-car-basic',
  imports: [CarFormFields, FormRoot, ButtonModule, FloatLabel, Select, FormField],
  templateUrl: './car-basic.html',
  styleUrl: './car-basic.css',
})
export class CarBasic {
  private readonly catalogsService = inject(CatalogsService);

  inventoryStates = lazyCatalog(() => this.catalogsService.getInventoryStates());

  model = signal<CarEditModel>({
    plate: '',
    brand: null,
    model: null,
    year: null,
    engineTypeId: null,
    displacement: null,
    transmissionId: null,
    inventoryStateId: null,
    price: null,
  });

  carForm = form(
    this.model,
    (s) => {
      apply(s, carBaseSchema); // reglas compartidas con la creación
      apply(s, (schema) => {
        required(schema.inventoryStateId, { message: 'Estado es requerido.' });
        required(schema.price, {
          message: 'El precio es obligatorio cuando el estado es "Disponible" y "Separado".',
          when: ({ valueOf }) => {
            const inventoryStateId = valueOf(schema.inventoryStateId);
            return inventoryStateId === 1 || inventoryStateId === 2;
          },
        });
      });
    },
    {
      submission: {
        action: async (field) => {
          console.log(field().value()); // aquí iría el PATCH al API
        },
      },
    },
  );

  constructor() {
    setupCarFormEffects(this.model); // los mismos effects que la creación
  }
}
