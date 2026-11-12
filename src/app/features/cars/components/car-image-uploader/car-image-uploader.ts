import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { CarImage } from '../../models/car-image.model';
import { CarImagesService } from '../../services/car-images.service';

interface PendingImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-car-image-uploader',
  imports: [],
  templateUrl: './car-image-uploader.html',
  styleUrl: './car-image-uploader.css',
})
export class CarImageUploader {
  private readonly route = inject(ActivatedRoute);
  private readonly imagesService = inject(CarImagesService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Esta página es hija de la ruta /admin/autos/:id.
  readonly carId = this.route.parent?.snapshot.paramMap.get('id') ?? '';

  readonly images = signal<CarImage[]>([]);
  readonly pendingImages = signal<PendingImage[]>([]);
  readonly loadingImages = signal(true);
  readonly loadError = signal(false);
  readonly uploading = signal(false);
  readonly uploadError = signal(false);
  readonly coveringImageId = signal<string | null>(null);
  readonly coverError = signal(false);
  readonly isDragging = signal(false);

  private readonly maxFiles = 10;
  private readonly maxFileSize = 5 * 1024 * 1024;
  private readonly allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

  constructor() {
    // Las previsualizaciones son object URLs del navegador; revocarlas libera memoria.
    this.destroyRef.onDestroy(() => this.releasePreviews());
    this.loadImages();
  }

  loadImages(): void {
    if (!this.carId) {
      this.loadingImages.set(false);
      this.loadError.set(true);
      return;
    }

    this.loadingImages.set(true);
    this.loadError.set(false);
    this.imagesService
      .getImages(this.carId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingImages.set(false)),
      )
      .subscribe({
        next: (images) => this.images.set(images),
        error: () => this.loadError.set(true),
      });
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    // Permite seleccionar nuevamente el mismo archivo después de quitarlo.
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  removePending(index: number): void {
    this.pendingImages.update((items) => {
      const removed = items[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return items.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  upload(): void {
    const files = this.pendingImages().map(({ file }) => file);
    if (!files.length || this.uploading()) return;

    this.uploadError.set(false);
    this.uploading.set(true);
    this.imagesService
      .upload(this.carId, files)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.uploading.set(false)),
      )
      .subscribe({
        next: () => {
          const uploadedCount = files.length;
          this.clearPending();
          this.toast.success(
            uploadedCount === 1 ? 'Imagen subida' : 'Imágenes subidas',
            `${uploadedCount} ${uploadedCount === 1 ? 'imagen quedó asociada' : 'imágenes quedaron asociadas'} al vehículo.`,
          );
          // La respuesta GET incluye los IDs necesarios para elegir la portada.
          this.loadImages();
        },
        error: () => this.uploadError.set(true),
      });
  }

  setCover(image: CarImage): void {
    if (image.isCover || this.coveringImageId()) return;

    this.coverError.set(false);
    this.coveringImageId.set(image.id);
    this.imagesService
      .setCover(this.carId, image.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.coveringImageId.set(null)),
      )
      .subscribe({
        next: () => {
          this.images.update((items) =>
            items.map((item) => ({ ...item, isCover: item.id === image.id })),
          );
          this.toast.success(
            'Portada actualizada',
            'Esta imagen se mostrará como portada del vehículo.',
          );
        },
        error: () => this.coverError.set(true),
      });
  }

  private addFiles(files: File[]): void {
    if (!files.length) return;

    const slotsLeft = this.maxFiles - this.pendingImages().length;
    if (slotsLeft <= 0) {
      this.toast.error(
        'Límite alcanzado',
        `Puedes subir hasta ${this.maxFiles} imágenes por carga.`,
      );
      return;
    }

    const validFiles: File[] = [];
    const invalidReasons: string[] = [];

    for (const file of files) {
      if (!this.allowedTypes.has(file.type)) {
        invalidReasons.push(`${file.name}: formato no permitido`);
      } else if (file.size > this.maxFileSize) {
        invalidReasons.push(`${file.name}: supera 5 MB`);
      } else if (this.pendingImages().some((item) => this.isSameFile(item.file, file))) {
        invalidReasons.push(`${file.name}: ya está seleccionada`);
      } else {
        validFiles.push(file);
      }
    }

    const filesToAdd = validFiles.slice(0, slotsLeft);
    this.pendingImages.update((items) => [
      ...items,
      ...filesToAdd.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);

    if (validFiles.length > slotsLeft) {
      invalidReasons.push(
        `Solo se agregaron ${slotsLeft} archivo(s): el máximo por carga es ${this.maxFiles}.`,
      );
    }
    if (invalidReasons.length) {
      this.toast.show({
        summary: 'Algunos archivos no se agregaron',
        detail: invalidReasons.join('. '),
        severity: 'warn',
      });
    }
  }

  private isSameFile(first: File, second: File): boolean {
    return (
      first.name === second.name &&
      first.size === second.size &&
      first.lastModified === second.lastModified
    );
  }

  private clearPending(): void {
    this.releasePreviews();
    this.pendingImages.set([]);
  }

  private releasePreviews(): void {
    for (const image of this.pendingImages()) URL.revokeObjectURL(image.previewUrl);
  }
}
