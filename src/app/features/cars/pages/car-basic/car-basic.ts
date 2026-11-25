import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { apply, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarFormFields } from '../../components/car-form/car-form-fields/car-form-fields';
import { carBaseSchema, setupCarFormEffects } from '../../components/car-form/car-form.logic';
import { CarFormModel } from '../../models/car-form.model';
import { UpdateCarModel } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';
import { CatalogsService } from '../../services/catalogs.service';

interface CarEditModel extends CarFormModel {
  inventoryState: Catalog | null;
  price: number | null;
}

@Component({
  selector: 'app-car-basic',
  imports: [CarFormFields, FormRoot, ButtonModule, FloatLabel, Select, FormField, InputTextModule],
  templateUrl: './car-basic.html',
  styleUrl: './car-basic.css',
})
export class CarBasic {
  private readonly catalogsService = inject(CatalogsService);
  private readonly toastService = inject(ToastService);
  private readonly queryClient = inject(QueryClient);
  private readonly carService = inject(CarService);

  id = input<string>();

  model = signal<CarEditModel>({
    plate: '',
    brand: null,
    model: null,
    year: null,
    engineType: null,
    displacement: null,
    transmission: null,
    inventoryState: null,
    price: null,
  });

  inventoryStates = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'inventory-states'],
    queryFn: () => this.catalogsService.getInventoryStates(),
    staleTime: Infinity,
  }));

  readonly getCarBasicData = injectQuery(() => ({
    queryKey: ['car', this.id()],
    queryFn: () => this.carService.findOne(this.id()!),
    enabled: !!this.id(),
    staleTime: 5 * 60 * 1000,
    select: (car): CarEditModel => ({
      plate: car.plate,
      inventoryState: car.inventoryState,
      price: car.price,
      brand: car.brand,
      model: car.model,
      year: { id: car.year, name: car.year.toString() },
      engineType: car.engineType,
      displacement: car.displacement,
      transmission: car.transmissionType,
    }),
  }));

  readonly uptadeCarMutation = injectMutation(() => ({
    mutationFn: ({ carId, data }: { carId: string; data: UpdateCarModel }) =>
      this.carService.patchCar(carId, data),
    onSuccess: (_, { carId }) => {
      this.toastService.success('Información actualizada.');
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
  }));

  carForm = form(
    this.model,
    (s) => {
      apply(s, carBaseSchema); // reglas compartidas con la creación
      apply(s, (schema) => {
        required(schema.inventoryState, { message: 'Estado es requerido.' });
        required(schema.price, {
          message: 'El precio es obligatorio cuando el estado es "Disponible" y "Separado".',
          when: ({ valueOf }) => {
            const inventoryStateId = valueOf(schema.inventoryState);
            return inventoryStateId?.id === 1 || inventoryStateId?.id === 2;
          },
        });
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          try {
            if (!this.id()) {
              this.toastService.show({
                summary: 'Vuelva a ingresar',
                detail: 'para obtener identificación del vehículo',
                severity: 'warn',
              });
            }

            const data: UpdateCarModel = {
              plate: value.plate,
              brandId: value.brand?.id,
              brandNameHint: value.brand?.name,
              modelId: value.model?.id,
              modelNameHint: value.model?.name,
              year: value.year?.id,
              engineTypeId: value.engineType?.id,
              displacement: value.displacement!,
              transmissionId: value.transmission?.id,
              inventoryStateId: value.inventoryState?.id,
              price: value.price!,
            };

            await this.uptadeCarMutation.mutateAsync({ carId: this.id()!, data });
            return;
          } catch (error) {
            const status = (error as HttpErrorResponse).status;
            const message =
              status === 409
                ? `Ya existe un vehículo con placa ${value.plate}.`
                : 'No se pudo guardar la información.';
            this.toastService.error('Error al guardar', message);
            return { kind: 'serverError', message };
          }
        },
      },
    },
  );

  constructor() {
    setupCarFormEffects(this.model); // los mismos effects que la creación
    effect(() => {
      const carData = this.getCarBasicData.data();
      if (!carData) return;
      this.model.set(carData);
    });
  }
}
