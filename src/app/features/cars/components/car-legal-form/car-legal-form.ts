import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { disabled, form, FormField, FormRoot, max, min, required } from '@angular/forms/signals';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { DividerModule } from '@openng/optimus-ui/divider';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { InputText } from '@openng/optimus-ui/inputtext';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { Select } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { Catalog } from '../../../../shared/models/shared.interface';
import { parseDateOnly } from '../../../../shared/utils/date.utils';
import { injectLazyCatalog } from '../../../../shared/utils/lazy-query';
import { CarLegalFormModel } from '../../models/car-legal-form.model';
import { UpdateCarLegalModel } from '../../models/car-query.model';
import { CarService } from '../../services/car.service';
import { CatalogsService } from '../../services/catalogs.service';
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
  private readonly catalogsService = inject(CatalogsService);
  private readonly queryClient = inject(QueryClient);
  private readonly carService = inject(CarService);

  id = input.required<string | undefined>();

  minDate: Date | undefined;

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

  yesNoOptions = signal<Catalog[]>(this.catalogsService.getYesNoOptions()).asReadonly();
  aniosEnDeuda = signal<Catalog[]>(this.catalogsService.getAniosEnDeuda()).asReadonly();

  // El desplegable de municipios usa este ID como parámetro de su petición.
  departmentId = computed(() => this.carModel().registrationDepartment?.id ?? null);

  private hasTrafficFines = computed(() => {
    const hasTrafficFines = this.carModel().hasTrafficFines;
    return hasTrafficFines !== null && hasTrafficFines.id === 1; // Enabled => trafficFinesCount | trafficFinesTotalAmount
  });

  private owesTaxes = computed(() => {
    const taxesUpToDate = this.carModel().taxesUpToDate;
    return taxesUpToDate !== null && taxesUpToDate.id === 2;
  });

  private hasRuntPendingIssues = computed(() => {
    const runtHasLiens = this.carModel().runtHasLiens;
    return runtHasLiens !== null && runtHasLiens.id === 1; // Se muestra el campo si hay fugas
  });

  private hasInsuranceClaims = computed(() => {
    const hasInsuranceClaims = this.carModel().hasInsuranceClaims;
    return hasInsuranceClaims !== null && hasInsuranceClaims.id === 1; // Se muestra el campo si hay fugas
  });

  departments = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'departments'],
    queryFn: () => this.catalogsService.getDepartments(),
    staleTime: Infinity,
  }));

  municipalities = injectLazyCatalog<number>((departementId) => ({
    queryKey: ['catalogs', 'municipalities', departementId],
    queryFn: () => this.catalogsService.getMunicipalities(departementId),
    // enabled: this.departmentId() !== null,
    staleTime: Infinity,
  }));

  runtPendingIssues = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'runt-pending-issues'],
    queryFn: () => this.catalogsService.getRuntPendingIssues(),
    staleTime: Infinity,
  }));

  insuranceClaimType = injectLazyCatalog(() => ({
    queryKey: ['catalogs', 'insurance-claim-types'],
    queryFn: () => this.catalogsService.getInsuranceClaimTypes(),
    staleTime: Infinity,
  }));

  /** Al cambiar el padre, descarta el municipio y las opciones del departamento anterior. */
  onDepartmentChange(): void {
    this.carModel.update((model) => ({ ...model, registrationCity: null }));
    this.municipalities.refetch();
  }

  readonly getCarLegalData = injectQuery(() => ({
    queryKey: ['car', this.id()],
    queryFn: () => this.carService.findOne(this.id()!),
    enabled: !!this.id(),
    staleTime: 5 * 60 * 1000,
    select: (car): CarLegalFormModel => {
      const legalVerification = car.legalVerification;
      const yesOrNot = (v: boolean): Catalog => {
        return v ? { id: 1, name: 'Sí' } : { id: 2, name: 'No' };
      };
      return {
        hadPublicServiceUse: yesOrNot(legalVerification.hadPublicServiceUse),
        hasInsuranceClaims: yesOrNot(legalVerification.hasInsuranceClaims),
        hasTrafficFines: yesOrNot(legalVerification.hasTrafficFines),
        insuranceClaimType: legalVerification.insuranceClaimType,
        municipalTrafficLightTaxUpToDate: yesOrNot(
          legalVerification.municipalTrafficLightTaxUpToDate,
        ),
        registrationCity: legalVerification.registrationCity,
        registrationDepartment: legalVerification.registrationDepartment,
        runtHasLiens: yesOrNot(legalVerification.runtHasLiens),
        runtMatchesLicense: yesOrNot(legalVerification.runtMatchesLicense),
        runtPendingIssues: legalVerification.runtPendingIssues,
        soatExpirationDate: parseDateOnly(legalVerification.soatExpirationDate),
        taxesOwedYears: {
          id: legalVerification.taxesOwedYears,
          name: legalVerification.taxesOwedYears.toString(),
        },
        taxesUpToDate: yesOrNot(legalVerification.taxesUpToDate),
        technicalInspectionExpirationDate: parseDateOnly(
          legalVerification.technicalInspectionExpirationDate,
        ),
        trafficFinesCount: legalVerification.trafficFinesCount,
        trafficFinesTotalAmount: legalVerification.trafficFinesTotalAmount,
      };
    },
  }));

  readonly uptadeCarMutation = injectMutation(() => ({
    mutationFn: ({ carId, data }: { carId: string; data: UpdateCarLegalModel }) =>
      this.carService.patchLegalCar(carId, data),
    onSuccess: (_, { carId }) => {
      this.toastService.success('Información actualizada.');
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
  }));

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
        when: () => this.owesTaxes(),
      });

      required(schema.runtPendingIssues, {
        when: () => this.hasRuntPendingIssues(),
      });

      required(schema.insuranceClaimType, {
        when: () => this.hasInsuranceClaims(),
      });

      disabled(schema.registrationCity, {
        when: () => !this.departmentId(),
      });

      disabled(schema.trafficFinesCount, {
        when: () => !this.hasTrafficFines(),
      });

      disabled(schema.trafficFinesTotalAmount, {
        when: () => !this.hasTrafficFines(),
      });

      disabled(schema.taxesOwedYears, {
        when: () => !this.owesTaxes(),
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
          const value = field().value();
          if (!this.id()) {
            this.toastService.show({
              summary: 'Vuelva a ingresar',
              detail: 'para obtener identificación del vehículo',
              severity: 'warn',
            });
          }
          const transformToBoolean = (v: number): boolean => {
            return v === 1 ? true : false;
          };
          try {
            const data: UpdateCarLegalModel = {
              registrationDepartmentId: value.registrationDepartment?.id!,
              registrationCityId: value.registrationCity?.id!,
              soatExpirationDate: value.soatExpirationDate!,
              technicalInspectionExpirationDate: value.technicalInspectionExpirationDate!,
              hasTrafficFines: transformToBoolean(value.hasTrafficFines?.id!),
              trafficFinesCount: value.trafficFinesCount!,
              trafficFinesTotalAmount: value.trafficFinesTotalAmount!,
              taxesUpToDate: transformToBoolean(value.taxesUpToDate?.id!),
              taxesOwedYears: value.taxesOwedYears?.id!,
              runtMatchesLicense: transformToBoolean(value.runtMatchesLicense?.id!),
              runtHasLiens: transformToBoolean(value.runtHasLiens?.id!),
              municipalTrafficLightTaxUpToDate: transformToBoolean(
                value.municipalTrafficLightTaxUpToDate?.id!,
              ),
              hadPublicServiceUse: transformToBoolean(value.hadPublicServiceUse?.id!),
              hasInsuranceClaims: transformToBoolean(value.hasInsuranceClaims?.id!),
              insuranceClaimTypeId: value.insuranceClaimType?.id!,
              runtPendingIssues: value.runtPendingIssues?.map((i) => ({ id: i.id })),
            };

            await this.uptadeCarMutation.mutateAsync({ carId: this.id()!, data });
            return;
          } catch (error) {
            const status = (error as HttpErrorResponse).status;
            const message = 'No se pudo actualizar la información';
            this.toastService.error('Error al actualizar', message);
            return { kind: 'serverError', message };
          }
        },
      },
    },
  );

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

  constructor() {
    effect(() => {
      const hasDepartment = this.carModel().registrationDepartment?.id != undefined;
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
      if (!this.owesTaxes() && this.carModel().taxesOwedYears !== null) {
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
      if (!hasDepartment && this.carModel().registrationCity !== null) {
        this.carModel.update((m) => ({
          ...m,
          registrationCity: null,
        }));
      }
    });

    effect(() => {
      const carData = this.getCarLegalData.data();
      if (!carData) return;
      this.carModel.set(carData);
    });
  }
}
