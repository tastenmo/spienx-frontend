import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button, Nav, NavItem, NavList, ToolbarItem } from '@patternfly/react-core';
import SunIcon from '@patternfly/react-icons/dist/esm/icons/sun-icon';
import MoonIcon from '@patternfly/react-icons/dist/esm/icons/moon-icon';
import { GridPageLayout } from '../../../../design-system/src/layouts/GridPageLayout';
import logoLight from '../../../../design-system/assets/logos/spie.svg?url';
import logoDark from '../../../../design-system/assets/logos/spie-dark.svg?url';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: { username: string; email?: string; avatarUrl?: string } | null;
  onLogout?: () => void | Promise<void>;
  sidebarExtra?: React.ReactNode;
}

type Theme = 'light' | 'dark' | 'doc';

const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onLogout, sidebarExtra }) => {
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>('light');

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

  const handleThemeToggle = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'doc'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const logoSrc = theme === 'dark' ? logoDark : logoLight;
  const isDocumentViewerRoute = /^\/documents\/[^/]+/.test(location.pathname);

  const navItem = (to: string, label: string) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(`${to}/`));

    return (
      <NavItem isActive={isActive}>
        <NavLink to={to} className="spie-nav-link">
          {label}
        </NavLink>
      </NavItem>
    );
  };

  const headerActions = (
    <>
      <ToolbarItem>
        <Button
          variant="plain"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          icon={theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        />
      </ToolbarItem>
      {user && (
        <ToolbarItem>
          <span className="spie-layout-user">{user.username}</span>
        </ToolbarItem>
      )}
      {onLogout && (
        <ToolbarItem>
          <Button variant="secondary" onClick={onLogout}>
            Sign out
          </Button>
        </ToolbarItem>
      )}
    </>
  );

  const sidebar = (
    isDocumentViewerRoute && sidebarExtra ? (
      <>{sidebarExtra}</>
    ) : (
      <>
        <Nav aria-label="Primary">
          <NavList>
            {navItem('/', 'Home')}
            {navItem('/repositories', 'Repositories')}
            {navItem('/documents', 'Documents')}
            {navItem('/user-profile', 'User Profile')}
          </NavList>
        </Nav>
        {sidebarExtra && <div className="spie-sidebar-extra">{sidebarExtra}</div>}
      </>
    )
  );

  return (
    <GridPageLayout
      logoSrc={logoSrc}
      logoAlt="SPIE Hub"
      title="SPIE Hub"
      sidebar={sidebar}
      headerActions={headerActions}
    >
      {children}
    </GridPageLayout>
  );
};

export default AppLayout;
