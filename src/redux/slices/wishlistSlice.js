import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load saved items');
  }
});

export const fetchSavedIds = createAsyncThunk('wishlist/fetchIds', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist/ids');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load');
  }
});

export const toggleSave = createAsyncThunk('wishlist/toggle', async ({ itemType, itemId }, { rejectWithValue }) => {
  try {
    const res = await api.post('/wishlist/toggle', { itemType, itemId });
    return { itemType, itemId, saved: res.data.data.saved };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    savedIds: {}, // { "room_abc123": true, "pg_xyz456": true }
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(fetchSavedIds.fulfilled, (state, action) => { state.savedIds = action.payload; })
      .addCase(toggleSave.fulfilled, (state, action) => {
        const key = `${action.payload.itemType}_${action.payload.itemId}`;
        if (action.payload.saved) {
          state.savedIds[key] = true;
        } else {
          delete state.savedIds[key];
          state.items = state.items.filter((i) => !(i.itemType === action.payload.itemType && i.itemId === action.payload.itemId));
        }
      });
  },
});

export default wishlistSlice.reducer;
