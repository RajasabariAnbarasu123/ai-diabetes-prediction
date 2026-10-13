import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import predictionReducer from './slices/predictionSlice';
import reportReducer from './slices/reportSlice';
import aiChatReducer from './slices/aiChatSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';
import themeReducer from './slices/themeSlice';
import { injectStore } from '../services/axiosInstance';

const rootReducer = combineReducers({
  auth: authReducer,
  patient: patientReducer,
  prediction: predictionReducer,
  report: reportReducer,
  aiChat: aiChatReducer,
  notification: notificationReducer,
  admin: adminReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'], // only persist auth and theme
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

injectStore(store);

export const persistor = persistStore(store);