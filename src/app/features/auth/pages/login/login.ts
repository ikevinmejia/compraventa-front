import { Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { AuthCard } from '../../components/auth-card/auth-card';
import { loginData } from '../../models/auth.interface';

@Component({
  imports: [
    AuthCard,
    FormField,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    FormRoot,
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  loginModel = signal<loginData>({ email: '', password: '' });
  submitted = signal(false);

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'El correo electrónico es obligatorio.' });
    email(schema.email, { message: 'Ingresa un correo electrónico válido.' });
    maxLength(schema.email, 150, { message: 'Maximo 150 caracteres.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 6, { message: 'Debe contener al menos 6 caracteres.' });
    maxLength(schema.password, 150, { message: 'Maximo 150 caracteres.' });
    pattern(schema.password, /(?=.*[A-Z])(?=.*\d)/, {
      message: 'La contraseña debe incluir al menos una letra mayúscula y un número.',
    });
  });

  async onSave() {
    const success = await submit(this.loginForm, async (field) => {
      // const result = await console.log(field().value());
      console.log(field().value());

      // if (result.ok) return;

      return { kind: 'serverError', message: 'Failed to submit form' };
    });
    if (success) {
      // Handle success — navigate, show confirmation, etc.
    }
  }
}
