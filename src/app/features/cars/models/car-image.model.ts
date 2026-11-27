/** Imagen ya asociada a un vehículo según la respuesta de la API. */
export interface CarImage {
  id: string;
  carId: string;
  url: string;
  publicId: string;
  isCover: boolean;
  /** Orden persistido por el backend para mostrar la galería. */
  displayOrder?: number;
}

/** findOne del backend debe incluir la relación `images` del vehículo. */
export interface CarWithImages {
  id: string;
  images?: CarImage[];
}

export interface ReorderImages {
  imageIds: string[];
}
