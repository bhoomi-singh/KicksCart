import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/cart', data);
    return res.data.cart;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    return res.data.cart;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data.cart;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return [];
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, isOpen: false },
  reducers: {
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    closeCart: (state) => { state.isOpen = false; },
    // Guest cart (local)
    addItemLocal: (state, action) => {
      const { product, size, quantity, price } = action.payload;
      const existing = state.items.find(i => i.product._id === product._id && i.size === size);
      if (existing) existing.quantity += quantity;
      else state.items.push({ _id: Date.now().toString(), product, size, quantity, price });
    },
    removeItemLocal: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
    },
    clearLocalCart: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => { state.loading = false; state.items = action.payload?.items || []; };
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, (state) => { state.items = []; });
  },
});

export const { toggleCart, closeCart, addItemLocal, removeItemLocal, clearLocalCart } = cartSlice.actions;

// Selectors
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
