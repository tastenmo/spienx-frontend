import { configureStore } from '@reduxjs/toolkit';
import documentsReducer from './slices/documentsSlice';

export const viewerStore = configureStore({
  reducer: {
    documents: documentsReducer
  }
});

export type ViewerRootState = ReturnType<typeof viewerStore.getState>;
export type ViewerAppDispatch = typeof viewerStore.dispatch;
