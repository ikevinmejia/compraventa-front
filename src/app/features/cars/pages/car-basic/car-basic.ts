import { Component, signal } from '@angular/core';
import { apply, form, FormRoot } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CarFormFields } from '../../components/car-form/car-form-fields/car-form-fields';
import { carBaseSchema, setupCarFormEffects } from '../../components/car-form/car-form.logic';
import { CarFormModel } from '../../models/car-form.model';

interface CarEditModel extends CarFormModel {
  mileage: number | null;
  notes: string;
}

@Component({
  selector: 'app-car-basic',
  imports: [CarFormFields, FormRoot, ButtonModule],
  templateUrl: './car-basic.html',
  styleUrl: './car-basic.css',
})
export class CarBasic {
  // Modelo con los datos del auto (por ahora de ejemplo; luego vendrá del API)
  model = signal<CarFormModel>({
    plate: '',
    brand: null,
    model: null,
    year: null,
    engineType: null,
    displacement: null,
    transmission: null,
  });

  carForm = form(
    this.model,
    (s) => {
      apply(s, carBaseSchema); // reglas compartidas con la creación
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
