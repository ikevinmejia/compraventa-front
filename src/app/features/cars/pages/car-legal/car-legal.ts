import { Component } from '@angular/core';
import { CarLegalForm } from '../../components/car-legal-form/car-legal-form';

@Component({
  selector: 'app-car-legal',
  imports: [CarLegalForm],
  templateUrl: './car-legal.html',
  styleUrl: './car-legal.css',
})
export class CarLegal {}
