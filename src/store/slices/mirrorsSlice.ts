import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { userRepoService } from '../../services/userService';

interface Mirror {
  id: number;
  name: string;
  description?: string;
  sourceUrl: string;
  sourceType?: string;
  localPath?: string;
  status?: string;
  isBare?: boolean;
  isPublic?: boolean;
  autoSync?: boolean;
  syncInterval?: number;
  createdAt?: string;
  updatedAt?: string;
  organisation: number;
  owner?: number;
}

interface MirrorsState {
  items: Mirror[];
  currentMirror: Mirror | null;
  loading: boolean;
  error: string | null;
}

export const fetchMirrors = createAsyncThunk(
  'mirrors/fetchMirrors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.listMirrors();
      return {
        mirrors: response.results || [],
        totalCount: (response.results || []).length
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch mirrors');
    }
  }
);

export const fetchMirror = createAsyncThunk(
  'mirrors/fetchMirror',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await adminService.getMirror(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch mirror');
    }
  }
);

interface CreateMirrorData {
  name: string;
  sourceUrl: string;
  sourceType?: string;
  description?: string;
  organisationId: number;
  autoSync?: boolean;
  syncInterval?: number;
}

export const createMirror = createAsyncThunk(
  'mirrors/createMirror',
  async (data: CreateMirrorData, { rejectWithValue }) => {
    try {
      const response = await userRepoService.createMirror({
        name: data.name,
        organisationId: data.organisationId,
        sourceUrl: data.sourceUrl,
        sourceType: data.sourceType || 'git',
        description: data.description || '',
        autoSync: data.autoSync || false,
        syncInterval: data.syncInterval || 3600,
      });
      
      return {
        id: response.id,
        name: data.name,
        sourceUrl: data.sourceUrl,
        localPath: response.localPath,
        status: response.status,
        organisationId: data.organisationId,
        description: data.description || '',
        autoSync: data.autoSync || false,
        syncInterval: data.syncInterval || 3600,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create mirror');
    }
  }
);

export const updateMirror = createAsyncThunk(
  'mirrors/updateMirror',
  async (data: Partial<Mirror> & { id: number }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateMirror({
        id: data.id,
        name: data.name || '',
        PartialUpdateFields: Object.keys(data),
        description: data.description,
        sourceUrl: data.sourceUrl || '',
        sourceType: data.sourceType,
        autoSync: data.autoSync,
        syncInterval: data.syncInterval,
        isBare: data.isBare,
        isPublic: data.isPublic,
        organisation: data.organisation || 0,
        owner: data.owner,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update mirror');
    }
  }
);

export const deleteMirror = createAsyncThunk(
  'mirrors/deleteMirror',
  async (id: number, { rejectWithValue }) => {
    try {
      await adminService.deleteMirror(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete mirror');
    }
  }
);

const initialState: MirrorsState = {
  items: [],
  currentMirror: null,
  loading: false,
  error: null,
};

const mirrorsSlice = createSlice({
  name: 'mirrors',
  initialState,
  reducers: {
    clearCurrentMirror: (state) => {
      state.currentMirror = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMirrors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMirrors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.mirrors;
      })
      .addCase(fetchMirrors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchMirror.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMirror.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMirror = action.payload;
      })
      .addCase(fetchMirror.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createMirror.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMirror.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createMirror.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateMirror.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMirror.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMirror.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteMirror.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMirror.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(mirror => mirror.id !== action.payload.id);
      })
      .addCase(deleteMirror.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentMirror, clearError } = mirrorsSlice.actions;
export default mirrorsSlice.reducer;
