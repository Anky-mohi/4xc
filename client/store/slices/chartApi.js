import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch historical data
export const fetchHistoricalData = createAsyncThunk(
  'chart/fetchHistoricalData',
  async (asset, { rejectWithValue }) => {
    try {
      const data = JSON.stringify({
        "ticks_history": asset,
        "adjust_start_time": 1,
        "count": 30,
        "end": "latest",
        "granularity": 120,
        "start": 1,
        "style": "ticks"
      });

      const config = {
        method: 'post',
        url: 'http://localhost:5000/api/v1/user/tick/history',
        headers: {
          'derivtoken': 'a1-AkctADlOjmoMuYNrpdWQy9IlIriQ7',
          'Content-Type': 'application/json',
        },
        data: data,
      };

      const response = await axios(config);
      return response.data; // Ensure we return the entire response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching data');
    }
  }
);

// Initial state
const initialState = {
  dataPoints: [],
  candleData: [],
  loading: false,
  error: null,
};

// Redux slice
const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    fetchHistoricalDataStart: (state) => {
        state.loading = false; // Set loading to true when fetching starts
    },
    fetchHistoricalDataSuccess: (state, action) => {
        state.dataPoints = action.payload; // Set the fetched data
        state.loading = false; // Set loading to false when fetching is done
    },
    fetchHistoricalDataFailure: (state) => {
        state.loading = false; // Set loading to false on failure
    },
    addDataPoint: (state, action) => {
      state.dataPoints.push(action.payload);
    },
    addCandleData: (state, action) => {
      state.candleData.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoricalData.pending, (state) => {
        state.loading = false;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.loading = false;
        // Extract and set dataPoints and candleData from action.payload
        state.dataPoints = action.payload.history.prices.map((price, index) => ({
          time: action.payload.history.times[index],
          value: price,
        }));

        state.candleData = action.payload.history.prices.map((price, index) => ({
          time: action.payload.history.times[index],
          open: price, // Adjust as per your actual data structure
          close: price, // Adjust as per your actual data structure
          high: price + 0.5, // Example: you may want to calculate the high/low properly
          low: price - 0.5,
        }));
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addDataPoint, addCandleData } = chartSlice.actions;
export default chartSlice.reducer;
