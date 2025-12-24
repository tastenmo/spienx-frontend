import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getCookie } from '../utils/csrf'
import './Navigation.css'

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
}

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

function Navigation({ user, onLogout }: NavigationProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const csrfToken = getCookie('csrftoken');
      const API_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'https://hub.tastenmo.de';
      await fetch(`${API_URL}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/">Spienx</NavLink>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/repositories" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Repositories
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/mirrors" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Mirrors
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/migrations" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Migrations
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        <div className="nav-user">
          {user && (
            <>
              <span className="user-email">{user.email || user.username}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
