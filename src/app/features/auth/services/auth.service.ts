import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ToastService } from '../../../core/services/toast.service';
import { loginData, registerUserDto, Role, User } from '../models/auth.interface';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private toastService = inject(ToastService);

  private readonly currentUser = signal<Omit<User, 'token'> | null>(this.readStoredUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly user = this.currentUser.asReadonly();

  async login(userData: loginData): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<User>(`${environment.apiUrl}/auth/login`, userData),
    );
    this.setSession(response);
    const isAdmin = response.roles.some((r) => r === 'admin' || r === 'superuser');
    await this.router.navigateByUrl(isAdmin ? '/admin/dashboard' : '/');
  }

  async register(userData: registerUserDto): Promise<void> {
    await firstValueFrom(this.http.post<User>(`${environment.apiUrl}/auth/register`, userData));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
    this.toastService.show({ summary: 'Sesión cerrada.', severity: 'info' });
  }

  private setSession(response: User): void {
    const { token, ...user } = response;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private readStoredUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser();
    return !!user && user.roles.some((r) => roles.includes(r));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
