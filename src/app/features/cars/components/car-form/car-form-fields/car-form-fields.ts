import { Component, computed, input, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { brands, engineTypes, models, transmissions } from '../../../../../../data/data';
import { Catalog } from '../../../../../shared/models/shared.interface';
import { CarFormModel } from '../../../models/car-form.model';
import { ELECTRIC_ENGINE_ID } from '../car-form.logic';

const currentYear = new Date().getFullYear();

const years: Catalog[] = Array.from({ length: 17 }, (_, i) => {
  const value = currentYear + 1 - i;
  return {
    id: value,
    name: value.toString(),
  };
});

@Component({
  selector: 'app-car-form-fields',
  imports: [FormField, Select, FloatLabel, InputText],
  templateUrl: './car-form-fields.html',
  styleUrl: './car-form-fields.css',
})
export class CarFormFields {
  form = input.required<FieldTree<CarFormModel>>(); // verifica el nombre del tipo en tu versión

  submitted = signal(false);

  brands = signal<Catalog[]>(brands);
  models = signal<Catalog[]>(models);
  years = signal<Catalog[]>(years);
  engineTypes = signal<Catalog[]>(engineTypes);
  transmissions = signal<Catalog[]>(transmissions);

  isElectric = computed(() => this.form().engineType().value()?.id === ELECTRIC_ENGINE_ID);
  showDisplacement = computed(
    () => this.form().engineType().value() !== null && !this.isElectric(),
  );
}
