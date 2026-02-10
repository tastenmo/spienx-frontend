import React from 'react';
import { SunIcon, MoonIcon, DocIcon } from '../icons';

type Theme = 'light' | 'dark' | 'doc';

interface ThemeToggleButtonProps {
  theme: Theme;
  onClick: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, onClick }) => {
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon />;
      case 'dark':
        return <MoonIcon />;
      case 'doc':
        return <DocIcon />;
      default:
        return <SunIcon />;
    }
  };

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'doc' : 'light';

  return (
    <button 
      className="theme-toggle-button"
      onClick={onClick}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Current: ${theme} mode`}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggleButton;
