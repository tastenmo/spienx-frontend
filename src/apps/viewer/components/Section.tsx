import React from 'react';

export interface SectionProps {
  id?: string;
  source?: string;
  line?: string | number;
  dataSphinxId?: string;
  level?: number;
  title?: string;
  secnumber?: string;
  children?: React.ReactNode;
}

/**
 * Section component for Sphinx JSX output
 * Renders a semantic section with optional metadata attributes.
 * The section content (including headings) is passed as children.
 */
export const Section: React.FC<SectionProps> = ({ id, source, line, dataSphinxId, children }) => {
  return (
    <section id={id} data-source={source} data-line={line} data-sphinx-id={dataSphinxId}>
      {children}
    </section>
  );
};

export default Section;
