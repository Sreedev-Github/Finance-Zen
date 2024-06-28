import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
  loading: true, // Add loading state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
      state.loading = false; // Update loading state
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.loading = false; // Update loading state
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
