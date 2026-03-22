import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRequirements = createAsyncThunk('requirements/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/requirements', { params });
    return { ...res.data, append: params?.append };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch requirements');
  }
});

export const createRequirement = createAsyncThunk('requirements/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/requirements', data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create requirement');
  }
});

const requirementSlice = createSlice({
  name: 'requirements',
  initialState: { list: [], pagination: null, loading: false, error: null },
  reducers: {
    clearRequirements(state) { state.list = []; state.pagination = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequirements.pending, (state) => { state.loading = true; })
      .addCase(fetchRequirements.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          const existingIds = new Set(state.list.map((r) => r._id));
          const newItems = (action.payload.requirements || []).filter((r) => !existingIds.has(r._id));
          state.list = [...state.list, ...newItems];
        } else {
          state.list = action.payload.requirements;
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRequirements.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createRequirement.fulfilled, (state, action) => { state.list.unshift(action.payload); });
  },
});

export const { clearRequirements } = requirementSlice.actions;
export default requirementSlice.reducer;
