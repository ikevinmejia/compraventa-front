import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({ selector: 'ng-template[appCell]' })
export class DataTableCellDirective {
  field = input.required<string>({ alias: 'appCell' });
  template = inject(TemplateRef);
}
