import { CurrencyPipe, DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, input } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { TableModule } from '@openng/optimus-ui/table';
import { DataTableCellDirective } from './data-table-cell.directive';
import { TableColumn } from './data-table.model';
/**
 * Tabla reusable.
 * Uso: imports: [DATA_TABLE]
 * Celdas personalizadas: <ng-template appCell="campo" let-row> ... </ng-template>
 */
@Component({
  selector: 'app-data-table',
  imports: [CardModule, TableModule, CurrencyPipe, DatePipe, NgTemplateOutlet],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent<T extends object = any> {
  title = input<string>();
  subheader = input<string>();

  columns = input.required<TableColumn<T>[]>();
  rows = input<T[]>([]);
  paginator = input(true);
  rowsPerPage = input(10);
  resizable = input(true);

  private cells = contentChildren(DataTableCellDirective);

  // field -> TemplateRef, para buscar rápido en el template
  cellTemplates = computed(
    () => new Map(this.cells().map((cell) => [cell.field(), cell.template])),
  );

  getValue(row: any, field: string) {
    return field.split('.').reduce((acc, key) => acc?.[key], row);
  }
}
