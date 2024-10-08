// dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk('dashboard/loginUser', async (token) => {
  const response = await axios.post('http://localhost:5000/api/v1/user/auth/deriv/login', {
    token,
  });
  return response.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    apiData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setApiData: (state, action) => {
      state.apiData = action.payload;
    },
    clearApiData: (state) => {
      state.apiData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.apiData = action.payload; // Assuming the payload contains the user data
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setApiData, clearApiData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
