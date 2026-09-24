import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from 'express';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { loginData, registerData, userDto } from '../models/auth.interface';

interface AuthResponse extends userDto {
  token: string;
}

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUser = signal<userDto | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly user = this.currentUser.asReadonly();

  async login(userData: loginData): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, userData),
    );
    this.setSession(response);
  }

  async register(userData: registerData): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData),
    );
    this.setSession(response);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(response: AuthResponse): void {
    const { token, ...user } = response;
    localStorage.setItem(TOKEN_KEY, token);
    this.currentUser.set(user);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
