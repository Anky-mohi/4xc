import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './authSlice';
import popupReducer from './slices/popupSlice';
import dataReducer from './slices/dataSlice';
import dashboardApi from "./slices/dashboardApi";
import getBalance from "./slices/walletSlice.js";


// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, dataReducer);

const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    data: persistedReducer,
    dashboardApi: dashboardApi,
    getBalance: getBalance,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
