// src/redux/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, SortOption, SortDirection } from '../../types';

interface ProductState {
  products: Product[];
  categories: string[];
  filteredProducts: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentCategory: string | null;
  sortBy: SortOption;
  sortDirection: SortDirection;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  filteredProducts: [],
  status: 'idle',
  error: null,
  currentCategory: null,
  sortBy: 'name',
  sortDirection: 'asc'
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  return await response.json();
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await fetch('https://fakestoreapi.com/products/categories');
  return await response.json();
});

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string) => {
    const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
    return await response.json();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    filterByCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
      if (action.payload === null) {
        state.filteredProducts = state.products;
      } else {
        state.filteredProducts = state.products.filter(
          product => product.category === action.payload
        );
      }
    },
    sortProducts: (state, action: PayloadAction<{ sortBy: SortOption; direction: SortDirection }>) => {
      const { sortBy, direction } = action.payload;
      state.sortBy = sortBy;
      state.sortDirection = direction;
      
      state.filteredProducts = [...state.filteredProducts].sort((a, b) => {
        if (sortBy === 'name') {
          return direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else {
          return direction === 'asc' ? a.price - b.price : b.price - a.price;
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredProducts = action.payload;
        state.currentCategory = action.meta.arg;
      });
  }
});

export const { filterByCategory, sortProducts } = productSlice.actions;
export default productSlice.reducer;