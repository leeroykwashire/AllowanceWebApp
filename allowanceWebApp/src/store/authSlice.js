import { createSlice } from '@reduxjs/toolkit';

// Load persisted auth state from localStorage
const persistedAuth = (() => {
  try {
    const raw = localStorage.getItem('allowance_auth');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
})();

const initialState = {
  user: persistedAuth.user || null,
  accessToken: persistedAuth.accessToken || null,
  refreshToken: persistedAuth.refreshToken || null,
  isAuthenticated: !!persistedAuth.accessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      // Persist to localStorage
      try {
        localStorage.setItem('allowance_auth', JSON.stringify({ user, accessToken, refreshToken }));
      } catch {}
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      try {
        localStorage.removeItem('allowance_auth');
      } catch {}
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
