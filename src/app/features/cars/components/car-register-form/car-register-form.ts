import { Component, signal } from '@angular/core';
import { apply, form, FormRoot } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
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
  model = signal(emptyCarModel());
  carForm = form(this.model, (s) => apply(s, carBaseSchema), {
    submission: {
      action: async (f) => {
        /* POST */
      },
    },
  });
  constructor() {
    setupCarFormEffects(this.model);
  }
}
// @Component({
//   selector: 'app-car-register-form',
//   imports: [
//     FormRoot,
//     FormField,
//     FormField,
//     FloatLabelModule,
//     InputTextModule,
//     ButtonModule,
//     InputNumberModule,
//     SelectModule,
//   ],
//   templateUrl: './car-register-form.html',
//   styleUrl: './car-register-form.css',
// })
// export class CarRegisterForm {
//   private ref = inject(DynamicDialogRef);
//   private readonly toastService = inject(ToastService);

//   carModel = signal<CarFormModel>({
//     plate: '',
//     brand: null,
//     model: null,
//     year: null,
//     engineType: null,
//     displacement: null,
//     transmission: null,
//   });
//   submitted = signal(false);

//   brands = signal<Catalog[]>(brands);
//   models = signal<Catalog[]>(models);
//   years = signal<Catalog[]>(years);
//   engineTypes = signal<Catalog[]>(engineTypes);
//   transmissions = signal<Catalog[]>(transmissions);

//   showDisplacement = computed(() => {
//     const engineType = this.carModel().engineType;
//     return engineType !== null && engineType.id !== ELECTRIC_ENGINE_ID;
//   });

//   isElectric = computed(() => this.carModel().engineType?.id === ELECTRIC_ENGINE_ID);

//   carForm = form(
//     this.carModel,
//     (schema) => {
//       required(schema.plate, { message: 'Placa es requerida.' });
//       required(schema.brand, { message: 'Marca es requerida.' });
//       required(schema.model, { message: 'Modelo es requerido.' });
//       required(schema.year, { message: 'Año del vehículo es requerido.' });
//       required(schema.engineType, { message: 'Tipo de motor es requerido.' });

//       required(schema.transmission, {
//         message: 'Transmisión es requerida.',
//         when: () => !this.isElectric(),
//       });

//       required(schema.displacement, {
//         message: 'Cilindraje es requerido.',
//         when: () => this.showDisplacement(),
//       });

//       maxLength(schema.plate, 6);

//       min(schema.displacement, 800, { message: 'Cilindraje debe ser mayor a 800 cc.' });
//       max(schema.displacement, 9999, { message: 'Cilindraje máximo 4 dígitos.' });

//       pattern(schema.plate, /^[A-Z]{3}[0-9]{3}$/, { message: 'Formato válido: ABC123.' });
//     },
//     {
//       submission: {
//         action: async (field) => {
//           try {
//             // this.authService.login(field().value());
//             console.log(field().value());

//             // Aquí va todo lo que quieras que pase en caso de éxito
//             // await this.router.navigate(['/auth/login']);
//             this.toastService.success(
//               `${field().value().brand?.name} ${field().value().model?.name} registrado`,
//             );
//             return; // sin retorno = éxito
//           } catch (error) {
//             console.log(field().errors());
//             console.log(error);
//             this.toastService.error('Error al registrar', (error as Error).message);
//             return { kind: 'serverError', message: (error as Error).message };
//           }
//         },
//       },
//     },
//   );

// }
