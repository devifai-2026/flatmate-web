import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/rooms', { params });
    return { ...res.data, append: params?.append };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch rooms');
  }
});

export const fetchRoomById = createAsyncThunk('rooms/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/rooms/${id}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch room');
  }
});

export const createRoom = createAsyncThunk('rooms/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/rooms', data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create room');
  }
});

const roomSlice = createSlice({
  name: 'rooms',
  initialState: { list: [], current: null, pagination: null, loading: false, error: null },
  reducers: {
    clearCurrentRoom(state) { state.current = null; },
    clearRooms(state) { state.list = []; state.pagination = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          // Append for infinite scroll — dedup by _id
          const existingIds = new Set(state.list.map((r) => r._id));
          const newRooms = (action.payload.rooms || []).filter((r) => !existingIds.has(r._id));
          state.list = [...state.list, ...newRooms];
        } else {
          state.list = action.payload.rooms;
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRooms.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchRoomById.pending, (state) => { state.loading = true; })
      .addCase(fetchRoomById.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchRoomById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createRoom.fulfilled, (state, action) => { state.list.unshift(action.payload); });
  },
});

export const { clearCurrentRoom, clearRooms } = roomSlice.actions;
export default roomSlice.reducer;
