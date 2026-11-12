import { Component, inject, viewChild } from '@angular/core';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { ButtonModule } from '@openng/optimus-ui/button';
import { Drawer, DrawerModule } from '@openng/optimus-ui/drawer';
import { RippleModule } from '@openng/optimus-ui/ripple';
import { StyleClassModule } from '@openng/optimus-ui/styleclass';
import { Logo } from '../../../assets/logo/logo';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MenuLayout } from '../../../features/dashboard/layout/menu-layout/menu-layout';
import { LayoutService } from '../../../features/dashboard/services/layout.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  imports: [
    AvatarModule,
    ButtonModule,
    DrawerModule,
    RippleModule,
    StyleClassModule,
    Logo,
    MenuLayout,
  ],
})
export class Navbar {
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);

  drawer = viewChild<Drawer>('drawerRef');

  logout(event?: Event): void {
    this.drawer()?.close(event ?? new Event('click'));
    this.authService.logout();
  }
}
