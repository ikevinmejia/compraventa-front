import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TabsModule } from '@openng/optimus-ui/tabs';

import { filter, map, startWith } from 'rxjs';
@Component({
  imports: [TabsModule, RouterOutlet],
  selector: 'app-car-detail',
  styleUrl: './car-detail.css',
  templateUrl: './car-detail.html',
})
export class CarDetail {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  tabs = [
    { route: 'datos-basicos', icon: 'pi pi-info-circle', label: 'Datos básicos' },
    { route: 'mecanica', icon: 'pi pi-wrench', label: 'Mecánica' },
    { route: 'cosmetica', icon: 'pi pi-car', label: 'Cosmética' },
    { route: 'legal', icon: 'pi pi-file-check', label: 'Documentación' },
  ];

  activeTab = toSignal<string, string>(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.route.firstChild?.snapshot?.url[0]?.path ?? 'datos-basicos'),
    ),
    { initialValue: 'datos-basicos' },
  );

  onTabChange(value: string | number | undefined) {
    this.router.navigate([value], { relativeTo: this.route });
  }
}
