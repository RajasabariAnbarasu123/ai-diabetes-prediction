import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../../services/reportService';

export const uploadReport = createAsyncThunk(
  'report/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await reportService.uploadReport(formData);
      return data; // { report, extractedData, aiSummary }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchReports = createAsyncThunk(
  'report/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const data = await reportService.getReports(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  reports: [],
  currentUpload: null, // { report, extractedData, aiSummary }
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    clearCurrentUpload: (state) => {
      state.currentUpload = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload = action.payload;
        state.reports.unshift(action.payload.report);
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.content || [];
        state.pagination = {
          page: action.payload.number || 0,
          size: action.payload.size || 10,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentUpload } = reportSlice.actions;
export default reportSlice.reducer;