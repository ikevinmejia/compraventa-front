import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { FilterOption } from '../../shared/components/filters/filter-field.model';

interface Item {
  id: number;
  nombre: string;
}
interface ItemHijo extends Item {
  padreId: number;
}

// ---------- Datos ficticios ----------
const MARCAS: Item[] = [
  { id: 1, nombre: 'Toyota' },
  { id: 2, nombre: 'Mazda' },
  { id: 3, nombre: 'Renault' },
  { id: 4, nombre: 'Chevrolet' },
  { id: 5, nombre: 'Kia' },
];

const MODELOS: ItemHijo[] = [
  { id: 101, padreId: 1, nombre: 'Corolla' },
  { id: 102, padreId: 1, nombre: 'Hilux' },
  { id: 103, padreId: 1, nombre: 'Prado' },
  { id: 201, padreId: 2, nombre: 'Mazda 2' },
  { id: 202, padreId: 2, nombre: 'Mazda 3' },
  { id: 203, padreId: 2, nombre: 'CX-5' },
  { id: 301, padreId: 3, nombre: 'Duster' },
  { id: 302, padreId: 3, nombre: 'Logan' },
  { id: 303, padreId: 3, nombre: 'Sandero' },
  { id: 401, padreId: 4, nombre: 'Spark GT' },
  { id: 402, padreId: 4, nombre: 'Tracker' },
  { id: 403, padreId: 4, nombre: 'Onix' },
  { id: 501, padreId: 5, nombre: 'Picanto' },
  { id: 502, padreId: 5, nombre: 'Sportage' },
  { id: 503, padreId: 5, nombre: 'Sorento' },
];

const DEPARTAMENTOS: Item[] = [
  { id: 5, nombre: 'Antioquia' },
  { id: 11, nombre: 'Bogotá D.C.' },
  { id: 76, nombre: 'Valle del Cauca' },
  { id: 8, nombre: 'Atlántico' },
  { id: 68, nombre: 'Santander' },
];

const MUNICIPIOS: ItemHijo[] = [
  { id: 5001, padreId: 5, nombre: 'Medellín' },
  { id: 5088, padreId: 5, nombre: 'Bello' },
  { id: 5266, padreId: 5, nombre: 'Envigado' },
  { id: 5360, padreId: 5, nombre: 'Itagüí' },
  { id: 11001, padreId: 11, nombre: 'Bogotá' },
  { id: 76001, padreId: 76, nombre: 'Cali' },
  { id: 76520, padreId: 76, nombre: 'Palmira' },
  { id: 76834, padreId: 76, nombre: 'Tuluá' },
  { id: 8001, padreId: 8, nombre: 'Barranquilla' },
  { id: 8758, padreId: 8, nombre: 'Soledad' },
  { id: 68001, padreId: 68, nombre: 'Bucaramanga' },
  { id: 68276, padreId: 68, nombre: 'Floridablanca' },
];

// ---------- Helpers ----------
const LATENCIA_MS = 400; // simula la red; así ves el estado "loading" del select

const toOptions = (list: Item[]): FilterOption[] =>
  list.map((x) => ({ label: x.nombre, value: x.id }));

// Simula una respuesta del servidor: espera un poco y entrega las opciones
const responder = (list: Item[]): Observable<FilterOption[]> =>
  of(list).pipe(delay(LATENCIA_MS), map(toOptions));

// ---------- Servicio ----------
@Injectable({ providedIn: 'root' })
export class CatalogApi {
  marcas() {
    return responder(MARCAS);
  }

  modelos(marcaId: number) {
    return responder(MODELOS.filter((m) => m.padreId === marcaId));
  }

  departamentos() {
    return responder(DEPARTAMENTOS);
  }

  municipios(departamentoId: number) {
    return responder(MUNICIPIOS.filter((m) => m.padreId === departamentoId));
  }
}
