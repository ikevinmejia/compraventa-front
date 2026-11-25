import { Component, input } from '@angular/core';
import { CarCosmeticForm } from '../../components/car-cosmetic-form/car-cosmetic-form';

@Component({
  selector: 'app-car-cosmetic',
  imports: [CarCosmeticForm],
  templateUrl: './car-cosmetic.html',
  styleUrl: './car-cosmetic.css',
})
export class CarCosmetic {
  id = input<string | undefined>();
}
