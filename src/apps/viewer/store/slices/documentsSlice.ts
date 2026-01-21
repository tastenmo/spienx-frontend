import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { documentService } from '../../../../services/documentService';
import {
  DocumentReadControllerDefinition,
  DocumentReadControllerClient,
  DocumentListRequest,
  DocumentRetrieveRequest,
  DocumentReadStreamPagesRequest,
  DocumentResponse,
  PageResponse
} from '../../../../proto/documents';

interface ContentBlockResponse {
  contentHash: string;
  jsxContent: string;
}

interface SectionResponse {
  title: string;
  sphinxId: string;
  hash: string;
  sourcePath: string;
  startLine: number;
  endLine: number;
  contentBlock?: ContentBlockResponse;
}

interface DocumentMetadata {
  id?: number;
  title: string;
  source: number;
  reference: string;
  workdir: string;
  confPath: string;
  lastBuildAt?: string;
  globalContext?: Record<string, any>;
}

interface DocumentPage extends PageResponse {
  sections: SectionResponse[];
}

interface DocumentBuild {
  id: number;
  document: number;
  reference: string;
  lastBuildAt?: string;
}

interface DocumentsState {
  list: {
    items: DocumentMetadata[];
    loading: boolean;
    error: string | null;
  };
  current: {
    document: DocumentMetadata | null;
    pages: DocumentPage[];
    builds: DocumentBuild[];
    loading: boolean;
    error: string | null;
    buildsLoading: boolean;
  };
}

const initialState: DocumentsState = {
  list: {
    items: [],
    loading: false,
    error: null
  },
  current: {
    document: null,
    pages: [],
    builds: [],
    loading: false,
    error: null,
    buildsLoading: false
  }
};

/**
 * Fetch all documents
 */
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { rejectWithValue }) => {
    try {
      const result = await documentService.listDocuments();
      return result.documents;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Fetch builds for a document
 */
export const fetchDocumentBuilds = createAsyncThunk(
  'documents/fetchDocumentBuilds',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const builds = await documentService.listBuilds(documentId);
      return builds.map(b => ({
        id: b.id || 0,
        document: b.document,
        reference: b.reference,
        lastBuildAt: b.lastBuildAt
      }));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/**
 * Fetch a specific document by ID
 */
export const fetchDocument = createAsyncThunk(
  'documents/fetchDocument',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const document = await documentService.getDocument(documentId);
      const builds = await documentService.listBuilds(documentId);
      const latestBuild = builds && builds.length > 0 ? builds[0] : null;
      
      // Merge document with globalContext from the latest build
      const documentWithContext = {
        ...document,
        globalContext: latestBuild?.globalContext || {},
        reference: latestBuild?.reference || '',
        lastBuildAt: latestBuild?.lastBuildAt || undefined,
      };
      
      // Fetch pages from the latest build
      const pages = latestBuild ? await documentService.getDocumentPages(latestBuild.id) : [];
      return { document: documentWithContext, pages };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearCurrentDocument: (state) => {
      state.current = {
        document: null,
        pages: [],
        builds: [],
        loading: false,
        error: null,
        buildsLoading: false
      };
    },
    clearDocumentError: (state) => {
      state.current.error = null;
    },
    clearListError: (state) => {
      state.list.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.list.loading = false;
        state.list.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.payload as string;
      });

    // Fetch single document
    builder
      .addCase(fetchDocument.pending, (state) => {
        state.current.loading = true;
        state.current.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.current.loading = false;
        state.current.document = action.payload.document;
        state.current.pages = action.payload.pages;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.current.loading = false;
        state.current.error = action.payload as string;
      });

    // Fetch document builds
    builder
      .addCase(fetchDocumentBuilds.pending, (state) => {
        state.current.buildsLoading = true;
      })
      .addCase(fetchDocumentBuilds.fulfilled, (state, action) => {
        state.current.buildsLoading = false;
        state.current.builds = action.payload;
      })
      .addCase(fetchDocumentBuilds.rejected, (state, action) => {
        state.current.buildsLoading = false;
        // We might want to store build error separately or just log it, 
        // effectively treating it as empty list with error in console or global error
        // For now, let's not block the document view if builds fail
        console.error('Failed to fetch builds:', action.payload);
      });
  }
});

export const { clearCurrentDocument, clearDocumentError, clearListError } = documentsSlice.actions;
export default documentsSlice.reducer;
