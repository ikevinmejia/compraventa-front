import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from '@openng/optimus-ui/card';
import { TagModule } from '@openng/optimus-ui/tag';
import { BadgeSeverity } from '@openng/optimus-ui/types/badge';
import { Car } from '../../models/car.interface';
import { InventoryStates } from '../../models/inventory-states.enum';

@Component({
  selector: 'app-car-registered-card',
  imports: [CardModule, DecimalPipe, RouterLink, TagModule],
  templateUrl: './car-registered-card.html',
  styleUrl: './car-registered-card.css',
})
export class CarRegisteredCard {
  car = input.required<Car>();

  inventoryStateSeverity = computed<BadgeSeverity | null>(() => {
    switch (this.car().inventoryState) {
      case InventoryStates['En peritaje']:
        return 'secondary';
      case InventoryStates['Alistamiento']:
        return 'info';
      case InventoryStates['Disponible']:
        return 'contrast';
      case InventoryStates['Separado']:
        return 'warn';
      case InventoryStates['Vendido']:
        return 'success';
      default:
        return null;
    }
  });
}
