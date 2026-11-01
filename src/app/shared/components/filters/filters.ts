import { Component, DestroyRef, inject, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { InputTextModule } from '@openng/optimus-ui/inputtext';

import { FilterField, FilterValue } from './filter-field.model';
import { FilterSelect } from './filter-select';

@Component({
  selector: 'app-filters',
  imports: [FormsModule, InputTextModule, DatePickerModule, ButtonModule, FilterSelect],
  templateUrl: './filters.html',
})
export class Filters {
  // ----- Entradas y salidas -----
  fields = input.required<FilterField[]>(); // qué filtros mostrar
  value = input<FilterValue>({}); // lo que la página tiene aplicado
  applied = output<FilterValue>(); // se emite al aplicar

  // ----- Estado interno -----
  // Borrador: lo que el usuario está editando. Se reinicia si el padre cambia `value`.
  draft = linkedSignal<FilterValue>(() => ({ ...this.value() }));

  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Evita que el temporizador dispare después de destruir el componente
    inject(DestroyRef).onDestroy(() => clearTimeout(this.searchTimer));
  }

  // ----- Edición del borrador -----
  setDraft(key: string, newValue: unknown) {
    this.draft.update((d) => {
      const next = { ...d, [key]: newValue };
      // Si cambia un padre, se borran sus hijos (y los hijos de sus hijos)
      for (const dep of this.dependentsOf(key)) delete next[dep];
      return next;
    });
  }

  // Búsqueda "en vivo": actualiza el borrador y aplica tras 400 ms sin escribir
  onSearchInput(key: string, text: string) {
    this.setDraft(key, text);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.apply(), 400);
  }

  // Devuelve las keys de todos los descendientes de un filtro (recursivo)
  private dependentsOf(key: string): string[] {
    return this.fields()
      .filter((f) => f.dependsOn === key)
      .flatMap((f) => [f.key, ...this.dependentsOf(f.key)]);
  }

  // ----- Acciones -----
  apply() {
    // Quita los vacíos para no enviar { placa: '' } ni rangos sin fechas
    const clean = Object.fromEntries(
      Object.entries(this.draft()).filter(([, v]) => {
        if (Array.isArray(v)) return v.some((x) => x != null);
        return v !== null && v !== undefined && v !== '';
      }),
    );
    this.applied.emit(clean);
  }

  clear() {
    clearTimeout(this.searchTimer);
    this.draft.set({});
    this.applied.emit({});
  }
}
