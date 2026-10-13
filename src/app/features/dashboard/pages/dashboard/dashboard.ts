import { Component, signal } from '@angular/core';
import { TagModule } from '@openng/optimus-ui/tag';
import {
  columns,
  columnsDocumentation,
  columnsLegal,
  rowsDocumentation,
  rowsLegal,
  vehiculos,
} from '../../../../../data/data';
import { BarChart } from '../../../../shared/components/bar-chart/bar-chart';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table';
import { DataTableCellDirective } from '../../../../shared/components/data-table/data-table-cell.directive';
import { StatsWidget } from '../../components/stats-widget/stats-widget';
@Component({
  imports: [StatsWidget, BarChart, DataTableComponent, TagModule, DataTableCellDirective],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  dataTableInventory = signal({
    columns,
    rows: vehiculos,
  });
  dataTableDocu = signal({
    columns: columnsDocumentation,
    rows: rowsDocumentation,
  });
  dataTableLegal = signal({
    columns: columnsLegal,
    rows: rowsLegal,
  });
}
