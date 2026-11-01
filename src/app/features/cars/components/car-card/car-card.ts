import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from '@openng/optimus-ui/card';

@Component({
  selector: 'app-car-card',
  imports: [CardModule, DecimalPipe, RouterLink],
  templateUrl: './car-card.html',
  styleUrl: './car-card.css',
})
export class CarCard {
  cars = Array.from({ length: 10 }, (_, i) => i);
}
