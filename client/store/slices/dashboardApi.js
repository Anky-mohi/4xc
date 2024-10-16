// dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "dashboard/loginUser",
  async (token) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DB_BASE_URL}/api/v1/user/auth/deriv/login`,
      {
        token,
      }
    );
    return response.data;
  }
);

export const buyProposal = createAsyncThunk(
  "dashboard/buyProposal",
  async (payload) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_DB_BASE_URL}/api/v1/user/buy/proposal`,
      payload,
      {
        headers: {
          derivtoken: "a1-BFrQ1FbWarPTgDFHr40ERAhRVFOQ4",
        },
      }
    );
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    apiData: null,
    proposalData: null,
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
    clearProposalData: (state) => {
      state.proposalData = null;
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
      })
      .addCase(buyProposal.pending, (state) => {
        state.loading = false;
      })
      .addCase(buyProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalData = action.payload;
      })
      .addCase(buyProposal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setApiData, clearApiData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
