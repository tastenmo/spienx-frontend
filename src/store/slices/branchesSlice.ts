import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gitService } from '../../services/gitService';

interface Branch {
  name: string;
  commit: string;
  protected: boolean;
}

interface BranchesState {
  items: Branch[];
  repositoryId: number | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
}

// Async thunk for fetching branches
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (repositoryId: number, { rejectWithValue }) => {
    try {
      const response = await gitService.getRepositoryBranches(repositoryId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch branches');
    }
  }
);

const initialState: BranchesState = {
  items: [],
  repositoryId: null,
  totalCount: 0,
  loading: false,
  error: null
};

// Branches slice
const branchesSlice = createSlice({
  name: 'branches',
  initialState: initialState,
  reducers: {
    clearBranches: (state) => {
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
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.branches;
        state.repositoryId = action.payload.repositoryId;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearBranches, clearError } = branchesSlice.actions;
export default branchesSlice.reducer;
