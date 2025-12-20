import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { userRepoService } from '../../services/userService';

interface Repository {
  id: number;
  name: string;
  description?: string;
  localPath?: string;
  gitUrl?: string;
  isBare?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  organisationId: number;
  owner?: number;
}

interface RepositoriesState {
  items: Repository[];
  currentRepository: Repository | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  filters: {
    organisationId: number;
    status: string;
    limit: number;
    offset: number;
  };
}

// Async thunks for repository operations
export const fetchRepositories = createAsyncThunk(
  'repositories/fetchRepositories',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminService.listRepositories();
      return {
        repositories: response.results || [],
        totalCount: (response.results || []).length
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch repositories');
    }
  }
);

export const fetchRepository = createAsyncThunk(
  'repositories/fetchRepository',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await adminService.getRepository(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch repository');
    }
  }
);

interface CreateRepositoryData {
  name: string;
  description?: string;
  sourceUrl?: string;
  sourceType?: string;
  organisationId: number;
  isPublic?: boolean;
}

export const createRepository = createAsyncThunk(
  'repositories/createRepository',
  async (data: CreateRepositoryData, { rejectWithValue }) => {
    try {
      const response = await userRepoService.createRepository({
        name: data.name,
        organisationId: data.organisationId,
        description: data.description || '',
        isPublic: data.isPublic ?? true,
      });
      
      return {
        id: response.id,
        localPath: response.localPath,
        gitUrl: response.gitUrl,
        name: data.name,
        description: data.description || '',
        organisationId: data.organisationId,
        isPublic: data.isPublic ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create repository');
    }
  }
);

export const migrateRepository = createAsyncThunk(
  'repositories/migrateRepository',
  async ({ repositoryId, sourceUrl, force }: { repositoryId: number; sourceUrl: string; force?: boolean }, { rejectWithValue }) => {
    try {
      const response = await gitService.migrateRepository(repositoryId, sourceUrl, force);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to migrate repository');
    }
  }
);

export const syncRepository = createAsyncThunk(
  'repositories/syncRepository',
  async (repositoryId: number, { rejectWithValue }) => {
    try {
      const response = await gitService.syncRepository(repositoryId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync repository');
    }
  }
);

export const deleteRepository = createAsyncThunk(
  'repositories/deleteRepository',
  async ({ repositoryId, force }: { repositoryId: number; force?: boolean }, { rejectWithValue }) => {
    try {
      await adminService.deleteRepository(repositoryId);
      return { repositoryId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete repository');
    }
  }
);

// Repositories slice
const initialState: RepositoriesState = {
    items: [],
    currentRepository: null,
    totalCount: 0,
    loading: false,
    error: null,
    filters: {
      organisationId: 0,
      status: '',
      limit: 50,
      offset: 0
    }
};

const repositoriesSlice = createSlice({
  name: 'repositories',
  initialState: initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<RepositoriesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentRepository: (state) => {
      state.currentRepository = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch repositories
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.repositories;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single repository
    builder
      .addCase(fetchRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRepository = action.payload;
      })
      .addCase(fetchRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create repository
    builder
      .addCase(createRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Migrate repository
    builder
      .addCase(migrateRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(migrateRepository.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(migrateRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync repository
    builder
      .addCase(syncRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncRepository.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete repository
    builder
      .addCase(deleteRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (repo) => repo.id !== action.payload.repositoryId
        );
        state.totalCount -= 1;
      })
      .addCase(deleteRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearCurrentRepository, clearError } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;
