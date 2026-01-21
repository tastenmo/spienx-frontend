import React from 'react';

export interface TableRowProps {
  /** CSS class names to apply */
  className?: string;
  /** Table row children (TableCell components) */
  children: React.ReactNode;
  /** Whether this is a header row */
  header?: boolean;
  /** Click handler for interactive rows */
  onClick?: () => void;
}

/**
 * Table row component for both header and data rows
 */
export const TableRow: React.FC<TableRowProps> = ({
  className = '',
  children,
  header = false,
  onClick,
  ...props
}) => {
  const rowClasses = [
    'sphinx-table__row',
    header && 'sphinx-table__row--header',
    onClick && 'sphinx-table__row--clickable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <tr 
      className={rowClasses} 
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </tr>
  );
};