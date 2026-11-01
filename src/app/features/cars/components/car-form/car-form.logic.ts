import { effect, WritableSignal } from '@angular/core';
import { max, maxLength, min, pattern, required, schema } from '@angular/forms/signals';
import { CarFormModel } from '../../models/car-form.model';

export const ELECTRIC_ENGINE_ID = 4;

export const emptyCarModel = (): CarFormModel => ({
  plate: '',
  brand: null,
  model: null,
  year: null,
  engineType: null,
  displacement: null,
  transmission: null,
});

// Reglas del formulario base. Verifica el nombre de `schema`/`apply` en tu versión.
export const carBaseSchema = schema<CarFormModel>((schema) => {
  required(schema.plate, { message: 'Placa es requerida.' });
  required(schema.brand, { message: 'Marca es requerida.' });
  required(schema.model, { message: 'Modelo es requerido.' });
  required(schema.year, { message: 'Año del vehículo es requerido.' });
  required(schema.engineType, { message: 'Tipo de motor es requerido.' });

  required(schema.transmission, {
    message: 'Transmisión es requerida.',
    when: ({ valueOf }) => {
      const e = valueOf(schema.engineType);
      return e !== null && e.id !== ELECTRIC_ENGINE_ID;
    },
  });

  required(schema.displacement, {
    message: 'Cilindraje es requerido.',
    when: ({ valueOf }) => {
      const e = valueOf(schema.engineType);
      return e !== null && e.id !== ELECTRIC_ENGINE_ID;
    },
  });

  maxLength(schema.plate, 6);

  min(schema.displacement, 800, { message: 'Cilindraje debe ser mayor a 800 cc.' });
  max(schema.displacement, 9999, { message: 'Cilindraje máximo 4 dígitos.' });

  pattern(schema.plate, /^[A-Z]{3}[0-9]{3}$/, { message: 'Formato válido: ABC123.' });
});

// Los effects, como función que recibe el modelo (se llama en un constructor)
export function setupCarFormEffects(model: WritableSignal<CarFormModel>) {
  effect(() => {
    const plate = model().plate;
    const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (plate !== normalized) {
      model.update((m) => ({ ...m, plate: normalized }));
    }
  });

  effect(() => {
    const isElectric = model().engineType?.id === ELECTRIC_ENGINE_ID;
    if (isElectric && model().displacement !== null) {
      model.update((m) => ({ ...m, displacement: null, transmission: null }));
    }
  });
}
