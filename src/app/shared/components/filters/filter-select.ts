import { Component, computed, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
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
      optionLabel="label"
      optionValue="value"
      [showClear]="true"
      [loading]="remote.isLoading()"
      [disabled]="disabled()"
      [placeholder]="field().placeholder ?? 'Todos'"
      [ngModel]="value()"
      (ngModelChange)="valueChange.emit($event)"
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
  disabled = computed(() => !!this.field().dependsOn && this.parentValue() == null);

  // Carga remota. Cuando `params` cambia, cancela la petición anterior y lanza otra.
  // Si `params` devuelve undefined, no hace nada.
  remote = rxResource({
    params: () => {
      const f = this.field();
      if (!f.loadOptions) return undefined; // opciones fijas
      if (f.dependsOn && this.parentValue() == null) return undefined; // falta el padre
      return { parent: this.parentValue() };
    },
    stream: ({ params }) => this.field().loadOptions!(params.parent),
  });

  // Fijas o remotas, según cómo se configuró el campo
  options = computed(() =>
    this.field().loadOptions ? (this.remote.value() ?? []) : (this.field().options ?? []),
  );
}
