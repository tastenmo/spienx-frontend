import React from 'react';

export interface TableCellProps {
  /** CSS class names to apply */
  className?: string;
  /** Cell content */
  children: React.ReactNode;
  /** Whether this is a header cell */
  header?: boolean;
  /** Column span */
  colSpan?: number;
  /** Row span */
  rowSpan?: number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Vertical alignment */
  valign?: 'top' | 'middle' | 'bottom';
  /** Scope for header cells */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
}

/**
 * Table cell component for both header and data cells
 */
export const TableCell: React.FC<TableCellProps> = ({
  className = '',
  children,
  header = false,
  colSpan,
  rowSpan,
  align,
  valign,
  scope,
  ...props
}) => {
  const cellClasses = [
    header ? 'sphinx-table__header-cell' : 'sphinx-table__cell',
    align && `sphinx-table__cell--align-${align}`,
    valign && `sphinx-table__cell--valign-${valign}`,
    className,
  ].filter(Boolean).join(' ');

  const CellComponent = header ? 'th' : 'td';

  return (
    <CellComponent
      className={cellClasses}
      colSpan={colSpan}
      rowSpan={rowSpan}
      scope={header ? scope : undefined}
      {...props}
    >
      {children}
    </CellComponent>
  );
};