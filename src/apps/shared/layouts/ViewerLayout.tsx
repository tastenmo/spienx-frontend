import React from 'react';
import { Link } from 'react-router-dom';
import './ViewerLayout.css';

interface ViewerLayoutProps {
  children: React.ReactNode;
  user?: { username: string; email: string } | null;
  onLogout?: () => void;
}

const ViewerLayout: React.FC<ViewerLayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="viewer-layout">
      <nav className="viewer-nav">
        <div className="viewer-nav-content">
          <div className="viewer-nav-logo">
            <Link to="/">📚 Viewer</Link>
          </div>
          <ul className="viewer-nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/documents">Documents</Link></li>
          </ul>
          <div className="viewer-nav-user">
            {user && (
              <>
                <span className="user-name">{user.username}</span>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="viewer-layout-main">
        {children}
      </main>

      <footer className="viewer-footer">
        <p>&copy; 2026 Spienx Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewerLayout;
