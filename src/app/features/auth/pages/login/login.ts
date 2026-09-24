import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  pattern,
  required,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthCard } from '../../components/auth-card/auth-card';
import { loginData } from '../../models/auth.interface';
import { AuthService } from '../../services/auth.service';

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
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  loginModel = signal<loginData>({ email: '', password: '' });
  submitted = signal(false);

  loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.email, { message: 'El correo electrónico es obligatorio.' });
      email(schema.email, { message: 'Ingresa un correo electrónico válido.' });
      maxLength(schema.email, 150, { message: 'Maximo 150 caracteres.' });
      required(schema.password, { message: 'La contraseña es obligatoria.' });
      minLength(schema.password, 6, { message: 'Debe contener al menos 6 caracteres.' });
      maxLength(schema.password, 150, { message: 'Maximo 150 caracteres.' });
      pattern(schema.password, /(?=.*[A-Z])(?=.*\d)/, {
        message: 'La contraseña debe incluir al menos una letra mayúscula y un número.',
      });
    },
    {
      submission: {
        action: async (field) => {
          try {
            this.authService.login(field().value());

            // Aquí va todo lo que quieras que pase en caso de éxito
            // await this.router.navigate(['/auth/login']);
            this.toastService.success('Iniciando sesión');
            return; // sin retorno = éxito
          } catch (error) {
            this.toastService.error('Error iniciar sesión', (error as Error).message);
            return { kind: 'serverError', message: (error as Error).message };
          }
        },
      },
    },
  );
}
