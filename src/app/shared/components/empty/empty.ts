import { Component, input } from '@angular/core';
import { ImageModule } from '@openng/optimus-ui/image';
@Component({
  selector: 'app-empty',
  imports: [ImageModule],
  templateUrl: './empty.html',
  styleUrl: './empty.css',
  host: {
    class: 'col-span-full block w-full',
  },
})
export class Empty {
  title = input<string>('');
  subtitle = input<string>('');
}
