import React from 'react';
import { MenuIcon } from '../icons';

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className={`menu-button ${isOpen ? 'active' : ''}`}
      onClick={onClick}
      aria-label="Menu"
    >
      <MenuIcon />
    </button>
  );
};

export default MenuButton;
