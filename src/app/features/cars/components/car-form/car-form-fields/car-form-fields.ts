import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { Catalog } from '../../../../../shared/models/shared.interface';
import { injectLazyCatalog } from '../../../../../shared/utils/lazy-query';
import { CarFormModel } from '../../../models/car-form.model';
import { CatalogsService } from '../../../services/catalogs.service';
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
  form = input.required<FieldTree<CarFormModel>>();
  model = input.required<WritableSignal<CarFormModel>>();

  private readonly catalogsService = inject(CatalogsService);

  submitted = signal(false);

  /** ID de la marca actual, derivado del valor del Signal Form. */
  brandId = computed(() => this.form().brand().value()?.id ?? null);

  years = signal<Catalog[]>(years);

  brands = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'brands'],
    queryFn: () => this.catalogsService.getBrands(),
    staleTime: Infinity,
  }));

  models = injectLazyCatalog<number>((brandId) => ({
    queryKey: ['catalogs', 'models', brandId],
    queryFn: () => this.catalogsService.getModels(brandId),
  }));

  engineTypes = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'engine-types'],
    queryFn: () => this.catalogsService.getEngineTypes(),
    staleTime: Infinity,
  }));

  transmissions = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'transmissions'],
    queryFn: () => this.catalogsService.getTransmissions(),
    staleTime: Infinity,
  }));

  /**
   * La marca cambió por una acción del usuario: la referencia previa ya no aplica.
   * Se invoca desde el evento del select, así la carga inicial de edición no borra
   * una referencia que llega precargada desde el vehículo.
   */
  onBrandChange(): void {
    this.model().update((current) => ({ ...current, model: null }));
  }

  isElectric = computed(() => this.form().engineTypeId().value() === ELECTRIC_ENGINE_ID);
  showDisplacement = computed(
    () => this.form().engineTypeId().value() !== null && !this.isElectric(),
  );
}
