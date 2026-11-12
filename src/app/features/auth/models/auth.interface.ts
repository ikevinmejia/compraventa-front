export type Role = 'admin' | 'superuser' | 'user';

export interface loginData {
  email: string;
  password: string;
}

export interface registerData extends loginData {
  name: string;
  lastName: string;
  phone: string;
  confirmPassword: string;
  termsAndConditions: boolean;
}

export interface registerUserDto extends Omit<
  registerData,
  'termsAndConditions' | 'confirmPassword'
> {}

export interface User {
  id: string;
  token: string;
  email: string;
  name: string;
  lastName: string;
  phone: string;
  roles: Role[];
}
