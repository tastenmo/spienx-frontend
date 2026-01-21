import React from 'react';
import JsxParser from 'react-jsx-parser';

interface JsxRendererProps {
  jsxContent: string;
  context?: Record<string, any>;
  components?: Record<string, any>;
  className?: string;
}

/**
 * JsxRenderer component renders JSX-HTML content from backend (e.g., sphinx-generated content)
 * Uses react-jsx-parser to safely parse and render JSX strings as React components
 */
const JsxRenderer: React.FC<JsxRendererProps> = ({ jsxContent, context = {}, components = {}, className }) => {
  if (!jsxContent) {
    return null;
  }

  // Ensure strict string type
  const safeContent = typeof jsxContent === 'string' ? jsxContent : String(jsxContent);

  try {
    return (
      <div className={className}>
        <JsxParser
          jsx={safeContent}
          components={components}
          bindings={context}
          renderInWrapper={false}
          allowUnknownElements={true}
          autoCloseVoidElements={true}
          showWarnings={false}
          onError={(error) => {
            console.error('Error rendering JSX content:', error);
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
