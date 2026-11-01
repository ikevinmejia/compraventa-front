import { Component, inject } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { IconFieldModule } from '@openng/optimus-ui/iconfield';
import { SplitButtonModule } from '@openng/optimus-ui/splitbutton';
import { ToolbarModule } from '@openng/optimus-ui/toolbar';
import { Logo } from '../../../assets/logo/logo';
import { CarRegisterForm } from '../../../features/cars/components/car-register-form/car-register-form';
import { LayoutService } from '../../../features/dashboard/services/layout.service';
@Component({
  selector: 'app-toolbar',
  styleUrl: './toolbar.css',
  templateUrl: './toolbar.html',
  imports: [ButtonModule, IconFieldModule, SplitButtonModule, ToolbarModule, Logo],
})
export class Toolbar {
  layoutService = inject(LayoutService);
  private dialogService = inject(DialogService);
  items: MenuItem[] | undefined;

  nuevoAuto() {
    const ref = this.dialogService.open(CarRegisterForm, {
      header: 'Nuevo registro',
      width: '40rem',
      modal: true,
      closable: true,
      closeOnEscape: true,
      draggable: false,
      dismissableMask: true,
    });

    ref?.onClose.subscribe((auto) => {
      if (auto) {
        /* se guardó: refrescar datos, mostrar toast */
      }
    });
  }
}
