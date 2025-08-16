import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './authSlice';
import { authApiSlice } from './slices/authApiSlice';
import { ratesApiSlice } from './slices/ratesApiSlice';
import { transactionApiSlice } from './slices/transactionApiSlice';
import { adsApiSlice } from './slices/adsApiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [ratesApiSlice.reducerPath]: ratesApiSlice.reducer,
    [transactionApiSlice.reducerPath]: transactionApiSlice.reducer,
  auth: authReducer,
  [adsApiSlice.reducerPath]: adsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(ratesApiSlice.middleware)
  .concat(transactionApiSlice.middleware)
  .concat(adsApiSlice.middleware),
});
