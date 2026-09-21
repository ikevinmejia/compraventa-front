import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, form, minLength, pattern, required } from '@angular/forms/signals';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { DividerModule } from '@openng/optimus-ui/divider';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PasswordModule } from '@openng/optimus-ui/password';
import { loginData } from '../../models/auth.interface';
@Component({
  imports: [
    RouterOutlet,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    FormsModule,
    DividerModule,
  ],
  selector: 'app-auth-layout',
  styleUrl: './auth-layout.css',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  loginModel = signal<loginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'El correo electrónico es obligatorio.' });
    email(schema.email, { message: 'Ingresa un correo electrónico válido.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 6, { message: 'Debe contener al menos 6 caracteres.' });
    pattern(schema.password, /(?=.*[A-Z])(?=.*\d)/, {
      message: 'La contraseña debe incluir al menos una letra mayúscula y un número.',
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    // 1. Marca todos los campos como tocados para mostrar las alertas de error en la UI
    this.loginForm().markAsTouched();

    // 2. Si el formulario es inválido, interrumpe la ejecución
    if (this.loginForm().invalid()) {
      return;
    }

    // 3. Procesa el envío solo si todo es correcto
    console.log(this.loginForm().value());
  }
}
