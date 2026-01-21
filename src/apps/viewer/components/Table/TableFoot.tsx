import React from 'react';

export interface TableFootProps {
  /** CSS class names to apply */
  className?: string;
  /** Table foot children (TableRow components) */
  children: React.ReactNode;
}

/**
 * Table foot component for footer rows
 */
export const TableFoot: React.FC<TableFootProps> = ({
  className = '',
  children,
  ...props
}) => {
  const footClasses = [
    'sphinx-table__foot',
    className,
  ].filter(Boolean).join(' ');

  return (
    <tfoot className={footClasses} {...props}>
      {children}
    </tfoot>
  );
};