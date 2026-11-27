import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@openng/optimus-ui/select';
import { FilterField } from './filter-field.model';

@Component({
  selector: 'app-filter-select',
  imports: [FormsModule, SelectModule],
  template: `
    <p-select
      [inputId]="field().key"
      [name]="field().key"
      [options]="options()"
      optionLabel="name"
      optionValue="id"
      [showClear]="true"
      [loading]="field().loading ?? false"
      [disabled]="disabled()"
      [placeholder]="field().placeholder ?? 'Todos'"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
      (onShow)="loadOptions()"
    />
  `,
})
export class FilterSelect {
  // Entradas
  field = input.required<FilterField>();
  value = input<unknown>(); // valor seleccionado en este select
  parentValue = input<unknown>(); // valor del filtro del que depende (si aplica)
  // Salida
  valueChange = output<unknown>();

  // Si depende de otro filtro y ese aún no tiene valor, queda deshabilitado
  disabled = computed(() => {
    const parentValue = this.parentValue();
    return (
      !!this.field().dependsOn &&
      (parentValue === null || parentValue === undefined || parentValue === '')
    );
  });

  // Las opciones llegan como input reactivo desde el componente propietario del catálogo.
  options = computed(() => this.field().options ?? []);

  /** Pide al propietario que cargue el catálogo cuando el usuario abre el desplegable. */
  loadOptions(): void {
    if (this.disabled()) return;
    this.field().loadOptions?.(this.parentValue());
  }
}
