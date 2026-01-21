import React from 'react';

export interface TableBodyProps {
  /** CSS class names to apply */
  className?: string;
  /** Table body children (TableRow components) */
  children: React.ReactNode;
}

/**
 * Table body component for data rows
 */
export const TableBody: React.FC<TableBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  const bodyClasses = [
    'sphinx-table__body',
    className,
  ].filter(Boolean).join(' ');

  return (
    <tbody className={bodyClasses} {...props}>
      {children}
    </tbody>
  );
};