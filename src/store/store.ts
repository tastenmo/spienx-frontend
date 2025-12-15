import { configureStore } from '@reduxjs/toolkit';
import repositoriesReducer from './slices/repositoriesSlice';
import branchesReducer from './slices/branchesSlice';
import commitsReducer from './slices/commitsSlice';

export const store = configureStore({
  reducer: {
    repositories: repositoriesReducer,
    branches: branchesReducer,
    commits: commitsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['repositories/fetchRepositories/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.date']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
