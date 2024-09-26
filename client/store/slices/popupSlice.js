import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPopupData = createAsyncThunk(
    'popup/fetchPopupData',
    async ()=>{
        const response = await fetch('http://localhost:5000/api/v1/user/assests');
        const data = await response.json();
        return data.data;
    }
)
  const popupSlice = createSlice({
    name : 'popup',
    initialState: {
        isVisible: false,
        data: [], 
        loading: false,
        error: null,
        searchTerm: "", // Redux state for search term
        tabValue: "commodities", // Redux state for current tab value
    },
    reducers: {
        showPopup:(state)=>{
            state.isVisible = true;
        },
        hidePopup:(state)=>{
            state.isVisible = false;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
          },
          setTabValue: (state, action) => {
            state.tabValue = action.payload;
          }
    },
    extraReducers: (builder)=> {
        builder
        .addCase(fetchPopupData.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPopupData.fulfilled, (state,action)=>{
            state.loading = false;
            state.data = action.payload;
        })
        .addCase(fetchPopupData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });    
    }
  })

  export const { showPopup, hidePopup , setSearchTerm, setTabValue } = popupSlice.actions;

  export default popupSlice.reducer;
