import React from 'react'
import Navigation from './Navigation'

interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
}

interface AppLayoutProps {
  user: User | null;
  children: React.ReactNode;
  onLogout: () => void;
}

function AppLayout({ user, children, onLogout }: AppLayoutProps) {
  return (
    <div className="app">
      <Navigation user={user} onLogout={onLogout} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
