import { Injectable, inject } from '@angular/core';
import { MessageService } from '@openng/optimus-ui/api';

type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageService = inject(MessageService);

  private calculateDuration(summary: string, detail: string): number {
    const wordCount = `${summary} ${detail}`.trim().split(/\s+/).length;

    const baseMs = 6000; // piso mínimo, incluso para mensajes muy cortos - 6 segundos
    const extraPerWord = 200; // ~0.2s por palabra adicional más allá de la base

    // Las primeras ~10 palabras ya están cubiertas por el piso de 6s;
    // a partir de ahí, cada palabra extra suma tiempo.
    const baseWords = 10;
    const extraWords = Math.max(0, wordCount - baseWords);

    return baseMs + extraWords * extraPerWord;
  }

  show(summary: string, detail: string = '', severity: ToastSeverity = 'secondary') {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: this.calculateDuration(summary, detail),
    });
  }

  success(summary: string, detail: string = '') {
    this.show(summary, detail, 'success');
  }

  error(summary: string, detail: string = '') {
    this.show(summary, detail, 'error');
  }
}
