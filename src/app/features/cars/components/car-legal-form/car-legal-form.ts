import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { DividerModule } from '@openng/optimus-ui/divider';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import {
  aniosEnDeuda,
  citties,
  departments,
  insuranceClaimType,
  runtPendingIssues,
  yesNoOptions,
} from '../../../../../data/data';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { CarLegalFormModel } from '../../models/car-legal-form.model';
@Component({
  imports: [
    FormField,
    Select,
    FloatLabel,
    InputText,
    SelectButtonModule,
    ButtonModule,
    FormRoot,
    DividerModule,
    DatePickerModule,
    MultiSelectModule,
  ],
  selector: 'app-car-legal-form',
  styleUrl: './car-legal-form.css',
  templateUrl: './car-legal-form.html',
})
export class CarLegalForm implements OnInit {
  private readonly toastService = inject(ToastService);

  minDate: Date | undefined;

  ngOnInit() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
  }

  carModel = signal<CarLegalFormModel>({
    registrationDepartment: null,
    registrationCity: null,
    soatExpirationDate: null,
    technicalInspectionExpirationDate: null,
    hasTrafficFines: null,
    trafficFinesCount: null,
    trafficFinesTotalAmount: null,
    taxesUpToDate: null,
    taxesOwedYears: null,
    runtMatchesLicense: null,
    runtHasLiens: null,
    runtPendingIssues: null,
    municipalTrafficLightTaxUpToDate: null,
    hadPublicServiceUse: null,
    hasInsuranceClaims: null,
    insuranceClaimType: null,
  });

  submitted = signal(false);

  yesNoOptions = signal<Catalog[]>(yesNoOptions);
  departments = signal<Catalog[]>(departments);
  citties = signal<Catalog[]>(citties);
  aniosEnDeuda = signal<Catalog[]>(aniosEnDeuda);
  runtPendingIssues = signal<Catalog[]>(runtPendingIssues);
  insuranceClaimType = signal<Catalog[]>(insuranceClaimType);

  hasTrafficFines = computed(() => {
    const hasTrafficFines = this.carModel().hasTrafficFines;
    return hasTrafficFines !== null && hasTrafficFines.id === 1; // Enabled => trafficFinesCount | trafficFinesTotalAmount
  });

  hasTaxesUpToDate = computed(() => {
    const taxesUpToDate = this.carModel().taxesUpToDate;
    return taxesUpToDate !== null && taxesUpToDate.id === 1; // Enabled => taxesOwedYears
  });

  hasRuntPendingIssues = computed(() => {
    const runtHasLiens = this.carModel().runtHasLiens;
    return runtHasLiens !== null && runtHasLiens.id === 1; // Se muestra el campo si hay fugas
  });

  hasInsuranceClaims = computed(() => {
    const hasInsuranceClaims = this.carModel().hasInsuranceClaims;
    return hasInsuranceClaims !== null && hasInsuranceClaims.id === 1; // Se muestra el campo si hay fugas
  });

  carForm = form(
    this.carModel,
    (schema) => {
      required(schema.registrationDepartment);
      required(schema.registrationCity);
      required(schema.soatExpirationDate);
      required(schema.technicalInspectionExpirationDate);
      required(schema.hasTrafficFines);
      required(schema.taxesUpToDate);
      required(schema.runtMatchesLicense);
      required(schema.runtHasLiens);
      required(schema.municipalTrafficLightTaxUpToDate);
      required(schema.hadPublicServiceUse);
      required(schema.hasInsuranceClaims);

      required(schema.trafficFinesCount, {
        when: () => this.hasTrafficFines(),
      });

      required(schema.trafficFinesTotalAmount, {
        when: () => this.hasTrafficFines(),
      });

      required(schema.taxesOwedYears, {
        when: () => this.hasTaxesUpToDate(),
      });

      required(schema.runtPendingIssues, {
        when: () => this.hasRuntPendingIssues(),
      });

      required(schema.insuranceClaimType, {
        when: () => this.hasInsuranceClaims(),
      });

      disabled(schema.trafficFinesCount, {
        when: () => !this.hasTrafficFines(),
      });

      disabled(schema.trafficFinesTotalAmount, {
        when: () => !this.hasTrafficFines(),
      });

      disabled(schema.taxesOwedYears, {
        when: () => !this.hasTaxesUpToDate(),
      });

      disabled(schema.runtPendingIssues, {
        when: () => !this.hasRuntPendingIssues(),
      });

      disabled(schema.insuranceClaimType, {
        when: () => !this.hasInsuranceClaims(),
      });

      min(schema.trafficFinesCount, 1, { message: 'Mínimo de multas "1".' });
      max(schema.trafficFinesCount, 500, { message: 'Maximo de multas 500.' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            // this.authService.login(field().value());
            console.log(field().value());

            // Aquí va todo lo que quieras que pase en caso de éxito
            // await this.router.navigate(['/auth/login']);
            this.toastService.success(`información actualizada`);
            return; // sin retorno = éxito
          } catch (error) {
            console.log(field().errors());
            console.log(error);
            this.toastService.error('Error al registrar', (error as Error).message);
            return { kind: 'serverError', message: (error as Error).message };
          }
        },
      },
    },
  );

  constructor() {
    effect(() => {
      const notHasTrafficFines = this.carModel().hasTrafficFines?.id === 2;
      const notHasTaxesUpToDate = this.carModel().taxesUpToDate?.id === 2;
      const notHasRuntHasLiens = this.carModel().runtHasLiens?.id === 2;
      const notHasInsuranceClaims = this.carModel().hasInsuranceClaims?.id === 2;
      if (
        notHasTrafficFines &&
        this.carModel().trafficFinesCount !== null &&
        this.carModel().trafficFinesTotalAmount !== null
      ) {
        this.carModel.update((m) => ({
          ...m,
          trafficFinesCount: null,
          trafficFinesTotalAmount: null,
        }));
      }
      if (notHasTaxesUpToDate && this.carModel().taxesOwedYears !== null) {
        this.carModel.update((m) => ({
          ...m,
          taxesOwedYears: null,
        }));
      }
      if (notHasRuntHasLiens && this.carModel().runtPendingIssues !== null) {
        this.carModel.update((m) => ({
          ...m,
          runtPendingIssues: null,
        }));
      }
      if (notHasInsuranceClaims && this.carModel().insuranceClaimType !== null) {
        this.carModel.update((m) => ({
          ...m,
          insuranceClaimType: null,
        }));
      }
    });
  }
}
