import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from '@openng/optimus-ui/api';
import { filter } from 'rxjs';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: '[app-menuitem]',
  imports: [RouterModule, NgClass],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.css',
  host: {
    '[class.active-menuitem]': 'isActive()',
    '[class.layout-root-menuitem]': 'root()',
  },
})
export class AppMenuItem {
  layoutService = inject(LayoutService);

  router = inject(Router);

  item = input.required<MenuItem>();

  root = input<boolean>(false);

  parentPath = input<string | null>(null);

  isVisible = computed(() => this.item()?.visible !== false);

  hasChildren = computed(() => (this.item().items?.length ?? 0) > 0);

  hasRouterLink = computed(() => !!this.item()?.routerLink);

  fullPath = computed(() => {
    const itemPath = this.item()['path'];
    if (!itemPath) return this.parentPath();
    const parent = this.parentPath();
    if (parent && !itemPath.startsWith(parent)) {
      return parent + itemPath;
    }
    return itemPath;
  });

  isActive = computed(() => {
    const activePath = this.layoutService.layoutState().activePath;
    if (this.item()['path']) {
      return activePath?.startsWith(this.fullPath() ?? '') ?? false;
    }
    return false;
  });

  initialized = signal<boolean>(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        if (this.item()?.routerLink) {
          this.updateActiveStateFromRoute();
        }
      });
  }

  ngOnInit() {
    if (this.item()?.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initialized.set(true);
    });
  }

  updateActiveStateFromRoute() {
    const item = this.item();
    if (!item?.routerLink) return;

    const isRouteActive = this.router.isActive(item.routerLink[0], {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });

    if (isRouteActive) {
      const parentPath = this.parentPath();
      if (parentPath) {
        this.layoutService.layoutState.update((val) => ({
          ...val,
          activePath: parentPath,
        }));
      }
    }
  }

  itemClick(event: Event) {
    const item = this.item();

    if (item?.disabled) {
      event.preventDefault();
      return;
    }

    if (item?.command) {
      item.command({ originalEvent: event, item: item });
    }

    if (this.hasChildren()) {
      if (this.isActive()) {
        this.layoutService.layoutState.update((val) => ({
          ...val,
          activePath: this.parentPath(),
        }));
      } else {
        this.layoutService.layoutState.update((val) => ({
          ...val,
          activePath: this.fullPath(),
          menuHoverActive: true,
        }));
      }
    } else {
      this.layoutService.layoutState.update((val) => ({
        ...val,
        overlayMenuActive: false,
        staticMenuMobileActive: false,
        mobileMenuActive: false,
        menuHoverActive: false,
      }));
    }
  }
}
