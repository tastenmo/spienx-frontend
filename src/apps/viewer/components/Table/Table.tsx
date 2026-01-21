import React from 'react';

export interface TableProps {
  /** CSS class names to apply to the table */
  className?: string;
  /** Table caption */
  caption?: string;
  /** Whether the table should be responsive */
  responsive?: boolean;
  /** Whether to enable striped rows */
  striped?: boolean;
  /** Whether to enable hover effects */
  hover?: boolean;
  /** Whether the table should be compact */
  compact?: boolean;
  /** Table children (thead, tbody, tfoot) */
  children: React.ReactNode;
  /** Optional table ID */
  id?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
  /** ARIA describedby for accessibility */
  'aria-describedby'?: string;
}

/**
 * Main Table component for rendering structured tabular data
 */
export const Table: React.FC<TableProps> = ({
  className = '',
  caption,
  responsive = true,
  striped = false,
  hover = false,
  compact = false,
  children,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const tableClasses = [
    'sphinx-table',
    striped && 'sphinx-table--striped',
    hover && 'sphinx-table--hover',
    compact && 'sphinx-table--compact',
    className,
  ].filter(Boolean).join(' ');

  const table = (
    <table
      className={tableClasses}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {caption && <caption className="sphinx-table__caption">{caption}</caption>}
      {children}
    </table>
  );

  if (responsive) {
    return (
      <div className="sphinx-table-wrapper">
        {table}
      </div>
    );
  }

  return table;
};