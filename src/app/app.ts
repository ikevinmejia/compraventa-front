import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from '@openng/optimus-ui/button';
@Component({
  imports: [RouterOutlet, Button],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('compraventa-front');
}
