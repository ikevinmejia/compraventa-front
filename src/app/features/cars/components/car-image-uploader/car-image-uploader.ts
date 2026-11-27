import { Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ImageModule } from '@openng/optimus-ui/image';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query';
import { ToastService } from '../../../../core/services/toast.service';
import { CarImage, ReorderImages } from '../../models/car-image.model';
import { CarImagesService } from '../../services/car-images.service';
import { CarService } from '../../services/car.service';
interface PendingImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-car-image-uploader',
  imports: [ButtonModule, ImageModule],
  templateUrl: './car-image-uploader.html',
  styleUrl: './car-image-uploader.css',
})
export class CarImageUploader {
  private readonly imagesService = inject(CarImagesService);
  private readonly carService = inject(CarService);
  private readonly queryClient = inject(QueryClient);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Esta página es hija de la ruta /admin/autos/:id.
  readonly id = input<string | undefined>();

  readonly images = signal<CarImage[]>([]);
  readonly pendingImages = signal<PendingImage[]>([]);
  readonly coveringImageId = signal<string | null>(null);
  readonly isDragging = signal(false);
  /** ID de la imagen que se está arrastrando dentro de la galería. */
  readonly draggedImageId = signal<string | null>(null);

  private readonly maxFiles = 10;
  private readonly maxFileSize = 500 * 1024; // 512,000 bytes (500 KB)
  private readonly allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

  constructor() {
    // Las previsualizaciones son object URLs del navegador; revocarlas libera memoria.
    this.destroyRef.onDestroy(() => this.releasePreviews());

    effect(() => {
      const id = this.id();
      const images = this.getImages.data();
      if (!id || !images) return;
      // untracked: evita que el effect dependa de los signals que se leen dentro de loadImages
      untracked(() => this.images.set(images));
    });
  }

  readonly getImages = injectQuery(() => ({
    queryKey: ['car', this.id()],
    queryFn: () => this.carService.findOne(this.id()!),
    enabled: !!this.id(),
    staleTime: 5 * 60 * 1000,
    select: ({ images }): CarImage[] => {
      // El backend puede devolver la relación sin orden; presentamos primero
      // displayOrder para que la galería respete el orden guardado.
      return [...images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    },
  }));

  readonly uploadMutation = injectMutation(() => ({
    mutationFn: ({ carId, files }: { carId: string; files: File[] }) =>
      this.imagesService.upload(carId, files),
    onSuccess: (_, { carId, files }) => {
      const uploadedCount = files.length;
      this.pendingImages.set([]);
      this.toastService.success(
        uploadedCount === 1 ? 'Imagen subida' : 'Imágenes subidas',
        `${uploadedCount} ${uploadedCount === 1 ? 'imagen quedó asociada' : 'imágenes quedaron asociadas'} al vehículo.`,
      );
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
  }));

  readonly setCoverMutation = injectMutation(() => ({
    mutationFn: ({ carId, imageId }: { carId: string; imageId: string }) =>
      this.imagesService.setCover(carId, imageId),
    onSuccess: (_, { carId, imageId }) => {
      this.images.update((items) =>
        items.map((item) => ({ ...item, isCover: item.id === imageId })),
      );
      this.toastService.show({
        summary: 'Portada actualizada',
        detail: 'Esta imagen se mostrará como portada del vehículo.',
        severity: 'info',
      });
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
  }));

  readonly updateOrderMutation = injectMutation(() => ({
    mutationFn: ({ carId, images }: { carId: string; images: ReorderImages }) =>
      this.imagesService.updateImages(carId, images),
    onSuccess: (_, { carId }) => {
      this.toastService.show({
        summary: 'Orden de imagenes',
        detail: 'actualizado.',
        severity: 'info',
      });
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
  }));

  readonly deleteImageMutation = injectMutation(() => ({
    mutationFn: ({ carId, imageId }: { carId: string; imageId: string }) =>
      this.imagesService.delete(carId, imageId),
    onSuccess: (_, { carId, imageId }) => {
      this.images.update((items) =>
        items.map((item) => ({ ...item, isCover: item.id === imageId })),
      );
      this.toastService.success('Imagen eliminada');
      Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['cars'] }),
        this.queryClient.invalidateQueries({ queryKey: ['car', carId] }),
      ]);
    },
    onError: (error) => {
      this.toastService.error('Ocurrió un error al eliminar', error.message);
    },
  }));

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    // Permite seleccionar nuevamente el mismo archivo después de quitarlo.
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    console.log('over');
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    console.log('leave');
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  /** Inicia el arrastre de una imagen ya guardada en la galería. */
  onImageDragStart(event: DragEvent, image: CarImage): void {
    this.draggedImageId.set(image.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', image.id);
    }
  }

  /** El navegador solo permite soltar sobre un elemento que cancela dragover. */
  onImageDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  /** Coloca la imagen arrastrada antes de la imagen sobre la que se suelta. */
  onImageDrop(event: DragEvent, targetImageId: string): void {
    event.preventDefault();
    event.stopPropagation();

    const draggedId = this.draggedImageId() ?? event.dataTransfer?.getData('text/plain');
    if (draggedId && draggedId !== targetImageId) {
      this.moveImageBefore(draggedId, targetImageId);
    }
    this.draggedImageId.set(null);
  }

  onImageDragEnd(): void {
    this.draggedImageId.set(null);
  }

  /** Alternativa accesible al arrastre: mueve una imagen una posición. */
  moveImageBy(imageId: string, offset: -1 | 1): void {
    const currentIndex = this.images().findIndex((image) => image.id === imageId);
    const targetIndex = currentIndex + offset;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= this.images().length) return;

    this.images.update((items) => {
      const reordered = [...items];
      const [image] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, image);
      return this.withDisplayOrder(reordered);
    });
    const carId = this.id();
    if (!carId) return;

    const orderImages = this.images().flatMap((i) => i.id);

    this.updateOrderMutation.mutate({ carId, images: { imageIds: orderImages } });
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
    const carId = this.id();
    if (!files.length || this.uploadMutation.isPending() || !carId) return;

    this.uploadMutation.mutate({ carId, files });
  }

  setCover(image: CarImage): void {
    const carId = this.id();
    if (image.isCover || this.coveringImageId() || !carId) return;

    this.coveringImageId.set(image.id);

    this.setCoverMutation.mutate({ carId, imageId: image.id });
  }

  private moveImageBefore(draggedId: string, targetId: string): void {
    this.images.update((items) => {
      const fromIndex = items.findIndex((image) => image.id === draggedId);
      const toIndex = items.findIndex((image) => image.id === targetId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items;

      const reordered = [...items];
      const [draggedImage] = reordered.splice(fromIndex, 1);
      // Busca el destino otra vez: al quitar la imagen pueden cambiar sus índices.
      const adjustedTargetIndex = reordered.findIndex((image) => image.id === targetId);
      reordered.splice(adjustedTargetIndex, 0, draggedImage);
      return this.withDisplayOrder(reordered);
    });
    const carId = this.id();
    if (!carId) return;

    const orderImages = this.images().flatMap((i) => i.id);

    this.updateOrderMutation.mutate({ carId, images: { imageIds: orderImages } });
  }

  private withDisplayOrder(items: CarImage[]): CarImage[] {
    return items.map((image, displayOrder) => ({ ...image, displayOrder }));
  }

  deleteImage(image: CarImage) {
    const { carId, publicId } = image;
    this.deleteImageMutation.mutate({ carId, imageId: publicId });
  }

  private addFiles(files: File[]): void {
    if (!files.length) return;

    const slotsLeft = this.maxFiles - this.pendingImages().length;
    if (slotsLeft <= 0) {
      this.toastService.error(
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
        invalidReasons.push(`${file.name}: supera 500 KB`);
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
      this.toastService.show({
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
