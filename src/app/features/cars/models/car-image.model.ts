/** Imagen ya asociada a un vehículo según la respuesta de la API. */
export interface CarImage {
  id: string;
  url: string;
  publicId: string;
  isCover: boolean;
}

/** findOne del backend debe incluir la relación `images` del vehículo. */
export interface CarWithImages {
  id: string;
  images?: CarImage[];
}
