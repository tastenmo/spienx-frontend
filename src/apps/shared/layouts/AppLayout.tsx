import React, { useState, useEffect } from 'react';
import { ThemeToggleButton, MenuButton } from '../components';
import { SpieLogoIcon } from '../icons';

type Theme = 'light' | 'dark' | 'doc';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: { username: string; email?: string; avatarUrl?: string } | null;
  onMenuClick?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onMenuClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'doc'].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark-mode', 'doc-mode');
    if (newTheme === 'dark') {
      root.classList.add('dark-mode');
    } else if (newTheme === 'doc') {
      root.classList.add('doc-mode');
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleThemeToggle = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'doc'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <div className="app-layout">
      <header className="app-layout-header">
        <div className="app-header-left">
          <SpieLogoIcon height={40} className="app-logo" />
        </div>

        <div className="app-header-right">
          <ThemeToggleButton 
            theme={theme}
            onClick={handleThemeToggle}
          />

          <MenuButton 
            isOpen={menuOpen}
            onClick={handleMenuToggle}
          />
          
          {user && (
            <div className="app-user">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username} 
                  className="app-user-avatar"
                />
              ) : (
                <div className="app-user-avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="app-user-name">{user.username}</span>
            </div>
          )}
        </div>
      </header>

      <main className="app-layout-main">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
