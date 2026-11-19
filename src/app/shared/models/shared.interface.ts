export type Catalog = {
  id: number;
  name: string;
};

export type limitOffset = {
  limit: number;
  offset: number;
};

export type DataPaginator<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
