import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from '@openng/optimus-ui/card';

@Component({
  selector: 'app-car-published-card',
  imports: [CardModule, DecimalPipe, RouterLink],
  templateUrl: './car-published-card.html',
  styleUrl: './car-published-card.css',
})
export class CarRegisteredCard {
  cars = Array.from({ length: 10 }, (_, i) => i);
}
