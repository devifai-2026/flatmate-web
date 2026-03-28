import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Send OTP to phone
export const sendOtp = createAsyncThunk('auth/sendOtp', async ({ phone }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/send-otp', { phone });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
  }
});

// Verify OTP → returns JWT + user
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ phone, otp }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-otp', { phone, otp });
    localStorage.setItem('token', res.data.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.data.user));
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: token || null,
    loading: false,
    otpSent: false,
    isNewUser: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.isNewUser = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
    resetOtpState(state) {
      state.otpSent = false;
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isNewUser = action.payload.isNewUser;
        state.otpSent = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, resetOtpState, updateUser } = authSlice.actions;
export default authSlice.reducer;
