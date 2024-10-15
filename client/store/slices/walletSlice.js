import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for fetching balances
export const fetchRealBalance = createAsyncThunk('wallet/fetchRealBalance', async (loginId) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_DB_BASE_URL}/api/v1/user/wallet/balance`,
    { "balance": 1,
    "subscribe": 1,
    loginid: loginId },
    {
      headers: {
        'Content-Type': 'application/json',
        'derivtoken': 'a1-BsO8xEzIIvfzcAW8PxHJZfW6HmhOh', 
      },
    }
  );
  return response.data.balance.balance;
});

export const fetchVRTBalance = createAsyncThunk('wallet/fetchVRTBalance', async (loginId) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_DB_BASE_URL}/api/v1/user/wallet/balance`,
    { "balance": 1,
    "subscribe": 1, 
    loginid: loginId },
    {
      headers: {
        'Content-Type': 'application/json',
        'derivtoken': 'a1-BsO8xEzIIvfzcAW8PxHJZfW6HmhOh', 
      },
    }
  );
  return response.data.balance.balance;
});

// Wallet slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    realBalance: 0,  
    virtualBalance: 0,  
    status: 'idle',  
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRealBalance.fulfilled, (state, action) => {
        state.realBalance = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchRealBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchVRTBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVRTBalance.fulfilled, (state, action) => {
        state.virtualBalance = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchVRTBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default walletSlice.reducer;
