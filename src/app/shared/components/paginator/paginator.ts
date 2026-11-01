import { Component } from '@angular/core';
import { PaginatorModule, PaginatorState } from '@openng/optimus-ui/paginator';
@Component({
  selector: 'app-paginator',
  imports: [PaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  first: number = 0;
  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
