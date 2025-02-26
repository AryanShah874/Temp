// src/types/index.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type SortOption = 'name' | 'price';
export type SortDirection = 'asc' | 'desc';