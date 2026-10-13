import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import predictionService from '../../services/predictionService';

export const createPrediction = createAsyncThunk(
  'prediction/create',
  async (predictionData, { rejectWithValue }) => {
    try {
      const data = await predictionService.createPrediction(predictionData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPredictions = createAsyncThunk(
  'prediction/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await predictionService.getPredictions(params);
      return data; // { predictions, totalPages, totalElements }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const comparePredictions = createAsyncThunk(
  'prediction/compare',
  async (ids, { rejectWithValue }) => {
    try {
      const data = await predictionService.comparePredictions(ids);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  predictions: [],
  currentPrediction: null,
  comparison: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

const predictionSlice = createSlice({
  name: 'prediction',
  initialState,
  reducers: {
    clearCurrentPrediction: (state) => {
      state.currentPrediction = null;
    },
    clearComparison: (state) => {
      state.comparison = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create prediction
      .addCase(createPrediction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPrediction = action.payload;
        state.predictions.unshift(action.payload); // add to top
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch predictions
      .addCase(fetchPredictions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Compare
      .addCase(comparePredictions.pending, (state) => {
        state.loading = true;
      })
      .addCase(comparePredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.comparison = action.payload;
      })
      .addCase(comparePredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPrediction, clearComparison } = predictionSlice.actions;
export default predictionSlice.reducer;