import { Component, input } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { Logo } from '../../../../assets/logo/logo';

@Component({
  selector: 'app-auth-card',
  imports: [CardModule, Logo],
  templateUrl: './auth-card.html',
})
export class AuthCard {
  cardTitle = input.required<string>();
  cardSubtitle = input.required<string>();
}
