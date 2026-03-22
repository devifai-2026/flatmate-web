import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBalance = createAsyncThunk('wallet/fetchBalance', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wallet/balance');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchUnlockedIds = createAsyncThunk('wallet/fetchUnlockedIds', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wallet/unlocked');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    unlockedListings: [], // [{ listingType, listingId }]
    loading: false,
  },
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
    },
    addUnlocked(state, action) {
      state.unlockedListings.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      })
      .addCase(fetchUnlockedIds.fulfilled, (state, action) => {
        state.unlockedListings = action.payload;
      });
  },
});

export const { setBalance, addUnlocked } = walletSlice.actions;
export default walletSlice.reducer;
