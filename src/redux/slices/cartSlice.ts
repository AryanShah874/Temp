// src/redux/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  checkoutComplete: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  checkoutComplete: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      );
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      }
    },
    checkout: (state) => {
      state.checkoutComplete = true;
      state.items = [];
      state.totalAmount = 0;
    },
    resetCheckout: (state) => {
      state.checkoutComplete = false;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  increaseQuantity, 
  decreaseQuantity, 
  checkout,
  resetCheckout
} = cartSlice.actions;
export default cartSlice.reducer;