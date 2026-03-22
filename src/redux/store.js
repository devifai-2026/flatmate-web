import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import roomReducer from './slices/roomSlice';
import requirementReducer from './slices/requirementSlice';
import matchReducer from './slices/matchSlice';
import chatReducer from './slices/chatSlice';
import wishlistReducer from './slices/wishlistSlice';
import walletReducer from './slices/walletSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    rooms: roomReducer,
    requirements: requirementReducer,
    matches: matchReducer,
    chat: chatReducer,
    wishlist: wishlistReducer,
    wallet: walletReducer,
  },
});
