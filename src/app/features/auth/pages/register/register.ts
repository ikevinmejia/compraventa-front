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
  validate,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthCard } from '../../components/auth-card/auth-card';
import { registerData } from '../../models/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [
    AuthCard,
    RouterLink,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    FormField,
    FormRoot,
    CheckboxModule,
  ],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  registerModel = signal<registerData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastName: '',
    phone: '',
    termsAndConditions: false,
  });

  registerForm = form(
    this.registerModel,
    (schema) => {
      // Validaciones para Email
      required(schema.email, { message: 'El correo electrónico es obligatorio.' });
      email(schema.email, { message: 'Ingresa un correo electrónico válido.' });
      maxLength(schema.email, 150, { message: 'Maximo 150 caracteres.' });

      // Validaciones para Password
      required(schema.password, { message: 'La contraseña es obligatoria.' });
      minLength(schema.password, 6, { message: 'Debe contener al menos 6 caracteres.' });
      maxLength(schema.password, 150, { message: 'Maximo 150 caracteres.' });
      pattern(schema.password, /(?=.*[A-Z])(?=.*\d)/, {
        message: 'La contraseña debe incluir al menos una letra mayúscula y un número.',
      });

      // Validaciones para Confirm Password
      required(schema.confirmPassword, { message: 'Debes confirmar la contraseña.' });

      // Validar que las contraseñas coincidan
      validate(schema.confirmPassword, ({ value, valueOf }) => {
        const passwordValue = valueOf(schema.password);
        const confirmPasswordValue = value();

        if (confirmPasswordValue && confirmPasswordValue !== passwordValue) {
          return {
            kind: 'passwordMismatch',
            message: 'Las contraseñas no coinciden.',
          };
        }
        return null;
      });

      required(schema.name, { message: 'Nombre es requerido' });
      minLength(schema.name, 2, { message: 'Debe contener al menos 2 caracteres.' });
      maxLength(schema.name, 100, { message: 'Maximo 100 caracteres.' });

      required(schema.lastName, { message: 'Apellido es requerido' });
      minLength(schema.lastName, 2, { message: 'Debe contener al menos 2 caracteres.' });
      maxLength(schema.lastName, 100, { message: 'Maximo 100 caracteres.' });

      required(schema.phone, { message: 'Celular es requerido.' });
      pattern(schema.phone, /^3\d{9}$/, {
        message: 'Debe empezar por 3 y tener maximo 10 digitos',
      });
      maxLength(schema.phone, 10, { message: 'Maximo 10 caracteres.' });

      required(schema.termsAndConditions, { message: 'Debe aceptar los terminos y condiciones' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            this.authService.register(field().value());

            // Aquí va todo lo que quieras que pase en caso de éxito
            // await this.router.navigate(['/auth/login']);
            this.toastService.success('Registro', 'Existoso');
            return; // sin retorno = éxito
          } catch (error) {
            this.toastService.error('Error al registrar', (error as Error).message);
            return { kind: 'serverError', message: (error as Error).message };
          }
        },
      },
    },
  );
}
