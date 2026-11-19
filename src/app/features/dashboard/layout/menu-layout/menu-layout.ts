import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '@openng/optimus-ui/api';
import { AppMenuItem } from '../menu-item/menu-item';

@Component({
  selector: 'app-menu-layout',
  imports: [AppMenuItem, RouterModule],
  templateUrl: './menu-layout.html',
  styleUrl: './menu-layout.css',
})
export class MenuLayout {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/admin/dashboard'],
      },
      {
        label: 'Autos',
        icon: 'pi pi-fw pi-car',
        items: [
          {
            label: 'Registrados',
            icon: 'pi pi-pencil',
            routerLink: ['/admin/autos/registrados/'],
          },
          {
            label: 'Publicados',
            icon: 'pi pi-megaphone',
            routerLink: ['/admin/autos/publicados/'],
          },
        ],
      },
    ];
  }
}
