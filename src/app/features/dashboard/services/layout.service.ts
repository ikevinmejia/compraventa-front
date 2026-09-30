import { computed, Injectable, signal } from '@angular/core';

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  configSidebarVisible: boolean;
  mobileMenuActive: boolean;
  menuHoverActive: boolean;
  activePath: string | null;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
  layoutState = signal<LayoutState>({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    configSidebarVisible: false,
    mobileMenuActive: false,
    menuHoverActive: false,
    activePath: null,
  });

  isSidebarActive = computed(
    () => this.layoutState().overlayMenuActive || this.layoutState().mobileMenuActive,
  );

  onMenuToggle() {
    this.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: !prev.overlayMenuActive,
    }));
  }

  // Establece explícitamente el estado del drawer
  setOverlayMenuActive(value: boolean) {
    this.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: value,
    }));
  }

  isDesktop() {
    return window.innerWidth > 991;
  }
}
