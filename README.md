# Spienx Frontend

A modern multi-page React application with gRPC-Web API integration, built with React Router, Redux Toolkit, and Vite.

## Features

- ⚡ Fast development with Vite
- ⚛️ React 18 with modern hooks
- 🛣️ React Router for seamless navigation
- 🔄 Redux Toolkit for state management
- 📡 gRPC-Web API integration
- 🎨 Clean and responsive design
- 📱 Mobile-friendly interface

## Pages

- **Home** - Landing page with overview
- **Repositories** - List and manage Git repositories
  - Create new repositories
  - View repository details
  - Sync with remote sources
  - View branches and commits
  - Delete repositories
- **About** - Information about the application
- **Contact** - Contact form with validation
- **404** - Custom not found page

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Update VITE_GRPC_BACKEND_URL in .env if needed
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## Project Structure

```
spienx-frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   └── Navigation.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── About.jsx
│   │   ├── About.css
│   │   ├── Contact.jsx
│   │   ├── Contact.css
│   │   ├── Repositories.jsx
│   │   ├── Repositories.css
│   │   ├── RepositoryDetail.jsx
│   │   ├── RepositoryDetail.css
│   │   ├── CreateRepository.jsx
│   │   ├── CreateRepository.css
│   │   ├── NotFound.jsx
│   │   └── NotFound.css
│   ├── proto/
│   │   ├── git_pb.js
│   │   └── git_grpc_web_pb.js
│   ├── services/
│   │   └── gitService.js
│   ├── store/
│   │   ├── store.js
│ Redux Toolkit
- React-Redux
- gRPC-Web
- Vite 5
- Modern CSS

## gRPC-Web Integration

The application integrates with the Spienx Hub backend via gRPC-Web. See [GRPC_INTEGRATION.md](GRPC_INTEGRATION.md) for detailed documentation.

### Backend Configuration

Configure the backend URL in `.env`:

```env
VITE_GRPC_BACKEND_URL=http://localhost:8080
```

### API Features

- List repositories with filters
- Create new repositories
- View repository details
- Sync repositories with remote sources
- Delete repositories
- View branches
- View commit history├── repositoriesSlice.js
│   │       ├── branchesSlice.js
│   │       └── commitsSlice.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── .env
└── .env.example
```

## Technologies

- React 18
- React Router 6
- Vite 5
- Modern CSS

## License

MIT
