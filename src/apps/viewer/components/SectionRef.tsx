import React from 'react';
import JsxRenderer from '../../shared/components/JsxRenderer';
import { SectionResponse } from '../../../proto/documents';

export interface SectionRefProps {
  /** The hash identifier of the section to render */
  hash: string;
  /** List of all sections available in the page */
  sections?: SectionResponse[];
  /** Component map for recursive rendering */
  components?: Record<string, any>;
  /** Bindings context */
  bindings?: Record<string, any>;
}

/**
 * Component to render a referenced section within the content flow.
 * Used when one section includes another via the <SectionRef> tag.
 */
export const SectionRef: React.FC<SectionRefProps> = ({ 
  hash, 
  sections, 
  components, 
  bindings 
}) => {
  const section = sections?.find(s => s.hash === hash);

  if (!section) {
    console.warn(`SectionRef: Could not find section with hash ${hash}`);
    return null;
  }

  // Render the section's JSX content directly without wrapping
  // The content already contains the section tag with all necessary attributes
  if (!section.contentBlock?.jsxContent) {
    return null;
  }

  return (
    <JsxRenderer
      jsxContent={String(section.contentBlock.jsxContent)}
      context={bindings}
      components={components}
    />
  );
};

