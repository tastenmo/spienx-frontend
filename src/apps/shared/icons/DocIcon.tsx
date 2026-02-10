import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

const DocIcon: React.FC<IconProps> = ({ width = 20, height = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="13" x2="8" y2="13"></line>
    <line x1="12" y1="17" x2="8" y2="17"></line>
    <polyline points="9 9 8 9 8 8"></polyline>
  </svg>
);

export default DocIcon;
