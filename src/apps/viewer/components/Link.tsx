import React from 'react';

export interface LinkProps {
  /** The target URL/path for the link */
  href: string;
  /** Link text content */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Callback function when link is clicked */
  onClick?: (href: string) => void;
  /** Whether this is an internal documentation link */
  internal?: boolean;
}

/**
 * A link component that handles both internal navigation and external links
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  onClick,
  internal = true,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (internal && onClick) {
      e.preventDefault();
      onClick(href);
    }
    // For external links, let the default behavior handle it
  };

  const linkClasses = [
    'sphinx-link',
    internal ? 'sphinx-link--internal' : 'sphinx-link--external',
    className,
  ].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      className={linkClasses}
      onClick={handleClick}
      aria-describedby={internal ? 'internal-link-description' : undefined}
    >
      {children}
      {internal && (
        <span id="internal-link-description" className="sr-only">
          Navigate to {href}
        </span>
      )}
    </a>
  );
};