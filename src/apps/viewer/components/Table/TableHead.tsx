import React from 'react';

export interface TableHeadProps {
  /** CSS class names to apply */
  className?: string;
  /** Table head children (TableRow components) */
  children: React.ReactNode;
}

/**
 * Table head component for header rows
 */
export const TableHead: React.FC<TableHeadProps> = ({
  className = '',
  children,
  ...props
}) => {
  const headClasses = [
    'sphinx-table__head',
    className,
  ].filter(Boolean).join(' ');

  return (
    <thead className={headClasses} {...props}>
      {children}
    </thead>
  );
};