import { createSlice } from '@reduxjs/toolkit';

// This slice holds patient-specific UI data like dashboard cards, tips, etc.
const initialState = {
  dashboardStats: {
    currentRisk: null,
    lastHbA1c: null,
    currentBMI: null,
    healthScore: null,
    totalPredictions: 0,
    improvementPercentage: 0,
  },
  healthTip: null,
  latestRecommendation: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setHealthTip: (state, action) => {
      state.healthTip = action.payload;
    },
    setLatestRecommendation: (state, action) => {
      state.latestRecommendation = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDashboardStats,
  setHealthTip,
  setLatestRecommendation,
  setLoading,
  setError,
} = patientSlice.actions;
export default patientSlice.reducer;