import { Component, input } from '@angular/core';
import { CarMechanicalForm } from '../../components/car-mechanical-form/car-mechanical-form';

@Component({
  selector: 'app-car-mechanical',
  imports: [CarMechanicalForm],
  templateUrl: './car-mechanical.html',
  styleUrl: './car-mechanical.css',
})
export class CarMechanical {
  id = input<string>();
}
