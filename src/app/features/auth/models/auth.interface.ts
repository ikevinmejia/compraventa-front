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

export interface userDto extends Omit<registerData, 'termsAndConditions' | 'confirmPassword'> {}
