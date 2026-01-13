import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from './components/AppLayout'
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

// ...existing code...

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    checkAuthStatus();
  };

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
            <Route path="/" element={<AppLayout user={user} onLogout={handleLogout}><Home /></AppLayout>} />
            <Route path="/about" element={<AppLayout user={user} onLogout={handleLogout}><About /></AppLayout>} />
            <Route path="/contact" element={<AppLayout user={user} onLogout={handleLogout}><Contact /></AppLayout>} />
            <Route path="/repositories" element={<AppLayout user={user} onLogout={handleLogout}><Repositories /></AppLayout>} />
            <Route path="/repositories/new" element={<AppLayout user={user} onLogout={handleLogout}><CreateRepository /></AppLayout>} />
            <Route path="/repositories/:id" element={<AppLayout user={user} onLogout={handleLogout}><RepositoryDetail /></AppLayout>} />
            <Route path="/mirrors" element={<AppLayout user={user} onLogout={handleLogout}><Mirrors /></AppLayout>} />
            <Route path="/migrations" element={<AppLayout user={user} onLogout={handleLogout}><Migrations /></AppLayout>} />
            <Route path="*" element={<AppLayout user={user} onLogout={handleLogout}><NotFound /></AppLayout>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App
