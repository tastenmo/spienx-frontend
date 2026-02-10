import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { viewerStore } from './apps/viewer/store/store'
import { store as gitStore } from './store/store'
import AppLayout from './apps/shared/layouts/AppLayout'
import Viewer from './apps/viewer/pages/Viewer'
import Documents from './apps/viewer/pages/Documents'
import AddAndBuild from './apps/viewer/pages/AddAndBuild'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Repositories from './pages/Repositories'
import RepositoryDetail from './pages/RepositoryDetail'
import CreateRepository from './pages/CreateRepository'
import Mirrors from './pages/Mirrors'
import Migrations from './pages/Migrations'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import './App.css'

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
}

import { getCookie } from './utils/csrf';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const API_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'https://hub.tastenmo.de';

  useEffect(() => {
    // Check if user is authenticated
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch(`${API_URL}/api/auth/user/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✓ Auth successful:', data.user);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.log('✗ Auth failed with status:', response.status);
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

  // TODO: Implement logout functionality through menu
  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   setUser(null);
  //   checkAuthStatus();
  // };

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onLoginSuccess={checkAuthStatus} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            {/* Viewer App Routes */}
            <Route path="/documents/*" element={
              <ReduxProvider store={viewerStore}>
                <AppLayout user={user}>
                  <Routes>
                    <Route index element={<Documents />} />
                    <Route path="new" element={<AddAndBuild />} />
                    <Route path=":id" element={<Viewer />} />
                    <Route path=":id/:pagePath" element={<Viewer />} />
                  </Routes>
                </AppLayout>
              </ReduxProvider>
            } />
            
            {/* Git Management App Routes */}
            <Route path="/*" element={
              <ReduxProvider store={gitStore}>
                <AppLayout user={user}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/repositories" element={<Repositories />} />
                    <Route path="/repositories/new" element={<CreateRepository />} />
                    <Route path="/repositories/:id" element={<RepositoryDetail />} />
                    <Route path="/mirrors" element={<Mirrors />} />
                    <Route path="/migrations" element={<Migrations />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ReduxProvider>
            } />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
