import { ProductCategory } from '../types/product';

export const catalogConfig = {
  defaultItemsPerPage: 12,
  itemsPerPageOptions: [6, 12, 24] as const,
  searchDebounceMs: 300,
  categories: [
    { id: 'all', label: 'Todas las categorías' },
    { id: 'electronics', label: 'Electrónica' },
    { id: 'footwear', label: 'Calzado Deportivo' },
    { id: 'accessories', label: 'Accesorios & Relojes' },
    { id: 'home', label: 'Hogar & Café' },
  ] as { id: ProductCategory | 'all'; label: string }[],
  sortOptions: [
    { id: 'default', label: 'Relevancia' },
    { id: 'price-asc', label: 'Menor precio' },
    { id: 'price-desc', label: 'Mayor precio' },
    { id: 'rating-desc', label: 'Mejor valorados' },
  ] as const,
} as const;
