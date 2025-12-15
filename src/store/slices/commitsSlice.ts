import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gitService } from '../../services/gitService';

interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
}

interface CommitsState {
  items: Commit[];
  repositoryId: number | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  filters: {
    branch: string;
    limit: number;
    offset: number;
  };
}

interface FetchCommitsParams {
  repositoryId: number;
  branch?: string;
  limit?: number;
  offset?: number;
}

// Async thunk for fetching commits
export const fetchCommits = createAsyncThunk(
  'commits/fetchCommits',
  async (params: FetchCommitsParams, { rejectWithValue }) => {
    try {
      const response = await gitService.getRepositoryCommits(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch commits');
    }
  }
);

const initialState: CommitsState = {
  items: [],
  repositoryId: null,
  totalCount: 0,
  loading: false,
  error: null,
  filters: {
    branch: '',
    limit: 50,
    offset: 0
  }
};

// Commits slice
const commitsSlice = createSlice({
  name: 'commits',
  initialState: initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CommitsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCommits: (state) => {
      state.items = [];
      state.repositoryId = null;
      state.totalCount = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.commits;
        state.repositoryId = action.payload.repositoryId;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCommits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearCommits, clearError } = commitsSlice.actions;
export default commitsSlice.reducer;
