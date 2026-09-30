import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { SplitButtonModule } from '@openng/optimus-ui/splitbutton';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';
import { Logo } from '../../../assets/logo/logo';
import { LayoutService } from '../../../features/dashboard/services/layout.service';
@Component({
  selector: 'app-toolbar',
  styleUrl: './toolbar.css',
  templateUrl: './toolbar.html',
  imports: [ButtonModule, IconFieldModule, SplitButtonModule, ToolbarModule, Logo],
})
export class Toolbar implements OnInit {
  layoutService = inject(LayoutService);

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}
