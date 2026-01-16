import React from 'react';
import JsxParser from 'jsx-parser';

interface JsxRendererProps {
  jsxContent: string;
  context?: Record<string, any>;
  className?: string;
}

/**
 * JsxRenderer component renders JSX-HTML content from backend (e.g., sphinx-generated content)
 * Uses jsx-parser to safely parse and render JSX strings as React components
 */
const JsxRenderer: React.FC<JsxRendererProps> = ({ jsxContent, context = {}, className }) => {
  if (!jsxContent) {
    return null;
  }

  try {
    return (
      <div className={className}>
        <JsxParser
          jsx={jsxContent}
          components={{}}
          bindings={context}
          onError={(error) => {
            console.error('Error rendering JSX content:', error);
            return <div>Error rendering content</div>;
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Failed to parse JSX content:', error);
    return <div className={className}>Failed to render content</div>;
  }
};

export default JsxRenderer;
