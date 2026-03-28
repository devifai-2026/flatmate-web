import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { updateUser } from './authSlice';

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.get('/users/me');
    const data = res.data.data;
    dispatch(updateUser(data));
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updatePreferences = createAsyncThunk('user/updatePreferences', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/users/preferences', data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update preferences');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updatePreferences.fulfilled, (state, action) => { state.profile = action.payload; });
  },
});

export default userSlice.reducer;
