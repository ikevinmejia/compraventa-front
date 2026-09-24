import { Injectable, signal } from '@angular/core';
import { loginData, registerData, userDto } from '../models/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  users = signal<userDto[]>([]);

  findUserByEmail(email: string): userDto | undefined {
    return this.users().find((user) => user.email === email);
  }

  register(userData: registerData) {
    const existingUser = this.findUserByEmail(userData.email);

    if (existingUser) {
      throw new Error('Ya existe un usuario registrado con este correo.');
    }

    this.users.update((v) => [...v, { ...userData }]);
    console.log('Usuario registrado');
  }

  login(userData: loginData) {
    const user = this.findUserByEmail(userData.email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // aquí, más adelante, comparar password (hasheado en un backend real)
    return user;
  }
}
