import React from 'react';

export interface NoteProps {
  /** The type of admonition (note, warning, tip, etc.) */
  type?: string;
  /** Optional title override */
  title?: string;
  /** Content of the note */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
}

export const Note: React.FC<NoteProps> = ({ 
  type = 'note', 
  title, 
  children, 
  className = '' 
}) => {
  // Map common Sphinx admonition types to titles if not provided
  const getTitle = () => {
    if (title) return title;
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className={`admonition admonition-${type} ${className}`}>
      <p className="admonition-title">{getTitle()}</p>
      {children}
    </div>
  );
};
