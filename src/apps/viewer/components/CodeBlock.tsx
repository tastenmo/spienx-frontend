import React from 'react';

export interface CodeBlockProps {
  /** The programming language for syntax highlighting */
  language?: string;
  /** The code content to display */
  children: React.ReactNode;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Optional title for the code block */
  title?: string;
  /** Whether the code block is copyable */
  copyable?: boolean;
}

/**
 * A simplified code block component for Sphinx documentation.
 * Syntax highlighting has been temporarily removed to fix build issues.
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = 'text',
  children,
  showLineNumbers = false,
  title,
  copyable = true,
}) => {
  // Convert children to string for copy and display
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node) && node.props.children) {
      return extractText(node.props.children);
    }
    return '';
  };
  
  const codeString = extractText(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="sphinx-codeblock">
      {title && (
        <div className="sphinx-codeblock__title">
          {title}
          {copyable && (
            <button 
              className="sphinx-codeblock__copy-btn"
              onClick={handleCopy}
              aria-label="Copy code to clipboard"
            >
              📋
            </button>
          )}
        </div>
      )}
      <pre className={`sphinx-codeblock__pre language-${language}`}>
        <code>{codeString}</code>
      </pre>
    </div>
  );
};