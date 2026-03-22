import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMatches = createAsyncThunk('matches/fetch', async (userId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/match/${userId}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch matches');
  }
});

const matchSlice = createSlice({
  name: 'matches',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMatches.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMatches.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default matchSlice.reducer;
