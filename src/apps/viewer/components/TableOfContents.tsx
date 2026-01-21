import React from 'react';
import parse from 'html-react-parser';
// import './TableOfContents.css';

export interface TableOfContentsProps {
  /** The HTML content for the table of contents */
  toc: string;
  /** Whether to display the table of contents */
  display?: boolean;
  /** Optional title for the TOC */
  title?: string;
  /** Whether to make the TOC sticky on scroll */
  sticky?: boolean;
  /** Custom CSS class name */
  className?: string;
}

/**
 * A table of contents component for Sphinx documentation navigation
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({
  toc,
  display = true,
  title = 'Contents',
  sticky = false,
  className = '',
}) => {
  if (!display || !toc.trim()) {
    return null;
  }

  const containerClasses = [
    'toc-drawer',
    sticky ? 'toc-sticky' : '',
    className,
  ].filter(Boolean).join(' ');

  // Parse TOC content and add smooth scrolling to links after render
  const parsedContent = parse(toc);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const element = document.getElementById(href.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without triggering page reload
          window.history.pushState(null, '', href);
        }
      }
    }
  };

  return (
    <nav className={containerClasses} role="navigation" aria-label="Table of contents">
      <div className="toc-header">
        <h2 className="toc-title-text">{title}</h2>
      </div>
      <div className="toc-scroll" onClick={handleLinkClick}>
        {parsedContent}
      </div>
    </nav>
  );
};