import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userRepoService } from '../../services/userService';

interface Migration {
  id: number;
  repositoryId?: number;
  newOrganisationId?: number;
  name?: string;
  sourceUrl?: string;
  success: boolean;
  newLocalPath: string;
  message: string;
  status: string;
  taskId?: number;
  createdAt?: string;
}

interface MigrationsState {
  items: Migration[];
  currentMigration: Migration | null;
  loading: boolean;
  error: string | null;
}

export const migrateRepository = createAsyncThunk(
  'migrations/migrateRepository',
  async (data: { repositoryId: number; newOrganisationId: number }, { rejectWithValue }) => {
    try {
      const response = await userRepoService.migrateRepository({
        repositoryId: data.repositoryId,
        newOrganisationId: data.newOrganisationId,
      });
      
      return {
        id: Math.random(),
        repositoryId: data.repositoryId,
        newOrganisationId: data.newOrganisationId,
        success: response.success,
        newLocalPath: response.newLocalPath,
        message: response.message,
        status: response.success ? 'completed' : 'failed',
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to migrate repository');
    }
  }
);

export const migrateFromExternal = createAsyncThunk(
  'migrations/migrateFromExternal',
  async (data: { name: string; organisationId: number; sourceUrl: string; description?: string }, { rejectWithValue }) => {
    try {
      console.log('Calling migrateFromExternal with:', data);
      const response = await userRepoService.migrateFromExternal({
        name: data.name,
        organisationId: data.organisationId,
        sourceUrl: data.sourceUrl,
        description: data.description || '',
      });
      console.log('migrateFromExternal response:', response);
      
      return {
        id: Math.random(),
        name: data.name,
        sourceUrl: data.sourceUrl,
        success: response.success,
        newLocalPath: response.localPath,
        message: response.message,
        status: response.success ? 'completed' : 'failed',
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('migrateFromExternal error:', error);
      return rejectWithValue(error.message || 'Failed to migrate from external source');
    }
  }
);

export const getMigrationStatus = createAsyncThunk(
  'migrations/getStatus',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const response = await userRepoService.getStatus({ taskId });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get migration status');
    }
  }
);

const initialState: MigrationsState = {
  items: [],
  currentMigration: null,
  loading: false,
  error: null,
};

const migrationsSlice = createSlice({
  name: 'migrations',
  initialState,
  reducers: {
    clearCurrentMigration: (state) => {
      state.currentMigration = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(migrateRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(migrateRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.currentMigration = action.payload;
      })
      .addCase(migrateRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(migrateFromExternal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(migrateFromExternal.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.currentMigration = action.payload;
      })
      .addCase(migrateFromExternal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getMigrationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMigrationStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getMigrationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentMigration, clearError } = migrationsSlice.actions;
export default migrationsSlice.reducer;
