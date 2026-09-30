import { Component, inject } from '@angular/core';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DrawerModule } from '@openng/optimus-ui/drawer';
import { RippleModule } from '@openng/optimus-ui/ripple';
import { StyleClassModule } from '@openng/optimus-ui/styleclass';
import { Logo } from '../../../assets/logo/logo';
import { LayoutService } from '../../../features/dashboard/services/layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [AvatarModule, ButtonModule, DrawerModule, RippleModule, StyleClassModule, Logo],
})
export class Navbar {
  layoutService = inject(LayoutService);
}
