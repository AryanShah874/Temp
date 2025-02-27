// src/redux/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, SortOption, SortDirection } from '../../types';
import { 
  fetchAllProducts, 
  fetchProductsByCategoryApi, 
  fetchCategories as fetchCategoriesApi 
} from '../../services/api';

interface ProductState {
  products: Product[];
  categories: string[];
  filteredProducts: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentCategory: string | null;
  sortBy: SortOption;
  sortDirection: SortDirection;
  priceRange: {
    min: number;
    max: number;
  };
}

const initialState: ProductState = {
  products: [],
  categories: [],
  filteredProducts: [],
  status: 'idle',
  error: null,
  currentCategory: null,
  sortBy: 'name',
  sortDirection: 'asc',
  priceRange: {
    min: 0,
    max: Infinity
  }
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  return await fetchAllProducts();
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  return await fetchCategoriesApi();
});

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string) => {
    return await fetchProductsByCategoryApi(category);
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
      
      // Apply price filter
      state.filteredProducts = state.filteredProducts.filter(
        product => product.price >= state.priceRange.min && product.price <= state.priceRange.max
      );
      
      // Apply sorting
      state.filteredProducts = sortProductsHelper(
        state.filteredProducts, 
        state.sortBy, 
        state.sortDirection
      );
    },
    sortProducts: (state, action: PayloadAction<{ sortBy: SortOption; direction: SortDirection }>) => {
      const { sortBy, direction } = action.payload;
      state.sortBy = sortBy;
      state.sortDirection = direction;
      
      state.filteredProducts = sortProductsHelper(
        state.filteredProducts,
        sortBy,
        direction
      );
    },
    filterByPrice: (state, action: PayloadAction<{ min: number; max: number }>) => {
      const { min, max } = action.payload;
      state.priceRange = { min, max };
      
      // Apply category filter first
      let filtered = state.currentCategory === null
        ? [...state.products]
        : state.products.filter(product => product.category === state.currentCategory);
      
      // Then apply price filter
      filtered = filtered.filter(
        product => product.price >= min && product.price <= max
      );
      
      // Then apply sorting
      state.filteredProducts = sortProductsHelper(
        filtered,
        state.sortBy,
        state.sortDirection
      );
    },
    resetFilters: (state) => {
      state.currentCategory = null;
      state.priceRange = { min: 0, max: Infinity };
      state.sortBy = 'name';
      state.sortDirection = 'asc';
      state.filteredProducts = [...state.products];
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
        
        // Re-apply price filters when category changes
        if (state.priceRange.min > 0 || state.priceRange.max < Infinity) {
          state.filteredProducts = state.filteredProducts.filter(
            product => product.price >= state.priceRange.min && 
                       product.price <= state.priceRange.max
          );
        }
        
        // Re-apply sorting
        state.filteredProducts = sortProductsHelper(
          state.filteredProducts,
          state.sortBy,
          state.sortDirection
        );
      });
  }
});

// Helper function for sorting products
const sortProductsHelper = (
  products: Product[], 
  sortBy: SortOption, 
  direction: SortDirection
): Product[] => {
  return [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else {
      return direction === 'asc' ? a.price - b.price : b.price - a.price;
    }
  });
};

export const { filterByCategory, sortProducts, filterByPrice, resetFilters } = productSlice.actions;
export default productSlice.reducer;