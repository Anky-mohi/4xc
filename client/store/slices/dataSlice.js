import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  apiData: null,
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setApiData: (state, action) => {
      state.apiData = action.payload;
    },
    clearApiData: (state) => {
      state.apiData = null;
    },
  },

})

export const { setApiData, clearApiData } = dataSlice.actions;
export default dataSlice.reducer;