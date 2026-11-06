import { Component, computed, inject, input, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FieldTree, FormField } from '@angular/forms/signals';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Select } from '@openng/optimus-ui/select';
import { catchError, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Catalog } from '../../../../../shared/models/shared.interface';
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

  /**
   * `toSignal` mantiene el resultado accesible desde la plantilla como signal
   * y limpia la suscripción al destruir este componente.
   */
  brands = toSignal(
    this.catalogsService.getBrands().pipe(
      // El interceptor global muestra el error; [] deja el select en estado seguro.
      catchError(() => of([] as Catalog[])),
    ),
    { initialValue: [] as Catalog[] },
  );

  /** ID de la marca actual, derivado del valor del Signal Form. */
  private brandId = computed(() => this.form().brand().value()?.id ?? null);

  /**
   * Al cambiar el ID, switchMap consulta sus modelos y cancela la petición previa.
   * Si se limpia la marca, emite una lista vacía sin llamar al backend.
   */
  models = toSignal(
    toObservable(this.brandId).pipe(
      distinctUntilChanged(),
      switchMap((brandId) =>
        brandId === null
          ? of([] as Catalog[])
          : this.catalogsService.getModels(brandId).pipe(catchError(() => of([] as Catalog[]))),
      ),
    ),
    { initialValue: [] as Catalog[] },
  );

  years = signal<Catalog[]>(years);

  engineTypes = toSignal(
    this.catalogsService.getEngineTypes().pipe(
      // El interceptor global muestra el error; [] deja el select en estado seguro.
      catchError(() => of([] as Catalog[])),
    ),
    { initialValue: [] as Catalog[] },
  );

  transmissions = toSignal(
    this.catalogsService.getTransmissions().pipe(
      // El interceptor global muestra el error; [] deja el select en estado seguro.
      catchError(() => of([] as Catalog[])),
    ),
    { initialValue: [] as Catalog[] },
  );

  /**
   * La marca cambió por una acción del usuario: la referencia previa ya no aplica.
   * Se invoca desde el evento del select, así la carga inicial de edición no borra
   * una referencia que llega precargada desde el vehículo.
   */
  onBrandChange(): void {
    this.model().update((current) => ({ ...current, model: null }));
  }

  isElectric = computed(() => this.form().engineType().value()?.id === ELECTRIC_ENGINE_ID);
  showDisplacement = computed(
    () => this.form().engineType().value() !== null && !this.isElectric(),
  );
}
