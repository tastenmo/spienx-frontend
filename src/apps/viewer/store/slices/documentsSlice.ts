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

interface DocumentsState {
  list: {
    items: DocumentMetadata[];
    loading: boolean;
    error: string | null;
  };
  current: {
    document: DocumentMetadata | null;
    pages: DocumentPage[];
    loading: boolean;
    error: string | null;
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
    loading: false,
    error: null
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
 * Fetch a specific document by ID
 */
export const fetchDocument = createAsyncThunk(
  'documents/fetchDocument',
  async (documentId: number, { rejectWithValue }) => {
    try {
      const document = await documentService.getDocument(documentId);
      const pages = await documentService.getDocumentPages(documentId);
      return { document, pages };
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
        loading: false,
        error: null
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
  }
});

export const { clearCurrentDocument, clearDocumentError, clearListError } = documentsSlice.actions;
export default documentsSlice.reducer;
