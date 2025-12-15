# gRPC-Web Integration

This document describes the gRPC-Web integration with the Spienx backend.

## Overview

The frontend uses gRPC-Web to communicate with the Spienx Hub backend API defined in `/data/dev/spienx/spienx-hub/src/git/protos/git.proto`.

## Architecture

### Proto Files
- `src/proto/git_pb.js` - Message type definitions
- `src/proto/git_grpc_web_pb.js` - gRPC service client

### Service Layer
- `src/services/gitService.js` - Service wrapper for gRPC calls

### State Management (Redux Toolkit)
- `src/store/store.js` - Redux store configuration
- `src/store/slices/repositoriesSlice.js` - Repository state management
- `src/store/slices/branchesSlice.js` - Branch state management
- `src/store/slices/commitsSlice.js` - Commit state management

### Pages
- `src/pages/Repositories.jsx` - List all repositories
- `src/pages/RepositoryDetail.jsx` - View repository details, branches, and commits
- `src/pages/CreateRepository.jsx` - Create new repository

## Available API Endpoints

### GitService
- `CreateRepository` - Create a new repository
- `GetRepository` - Get repository by ID
- `ListRepositories` - List all repositories with filters
- `MigrateRepository` - Migrate a repository from source
- `SyncRepository` - Sync repository with remote
- `DeleteRepository` - Delete a repository
- `GetRepositoryBranches` - Get all branches for a repository
- `GetRepositoryCommits` - Get commits for a repository

## Configuration

Backend URL is configured via environment variable:

```env
VITE_GRPC_BACKEND_URL=http://localhost:8080
```

## Redux Usage Example

### Fetching Repositories

```javascript
import { useDispatch, useSelector } from 'react-redux'
import { fetchRepositories } from './store/slices/repositoriesSlice'

function MyComponent() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.repositories)
  
  useEffect(() => {
    dispatch(fetchRepositories({ limit: 50, offset: 0 }))
  }, [dispatch])
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {items.map(repo => <div key={repo.id}>{repo.name}</div>)}
    </div>
  )
}
```

### Creating a Repository

```javascript
import { useDispatch } from 'react-redux'
import { createRepository } from './store/slices/repositoriesSlice'

function CreateForm() {
  const dispatch = useDispatch()
  
  const handleSubmit = async (formData) => {
    try {
      await dispatch(createRepository({
        name: formData.name,
        description: formData.description,
        sourceUrl: formData.sourceUrl,
        sourceType: 'git',
        organisationId: 1,
        isPublic: true
      })).unwrap()
      
      alert('Repository created successfully!')
    } catch (err) {
      alert(`Error: ${err}`)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

## Production Setup

For production deployment, you should generate the actual gRPC-Web client code using `protoc`:

```bash
# Install protoc and the gRPC-Web plugin
# Then generate the client code
protoc -I=../spienx-hub/src/git/protos \
  --js_out=import_style=commonjs:./src/proto \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./src/proto \
  ../spienx-hub/src/git/protos/git.proto
```

## Backend Requirements

The backend must:
1. Run a gRPC server
2. Run an Envoy proxy or grpcwebproxy to translate gRPC-Web to gRPC
3. Configure CORS headers appropriately

## Development

The current implementation uses simplified proto clients for development. In production, replace with properly generated proto files.

## Testing

Test the API integration:
1. Start the backend server
2. Configure `VITE_GRPC_BACKEND_URL` in `.env`
3. Run `npm run dev`
4. Navigate to `/repositories`
5. Create, view, and manage repositories through the UI
