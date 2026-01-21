import React from 'react';
import JsxRenderer from '../../shared/components/JsxRenderer';
import { Link } from './Link';
import { Table, TableHead, TableBody, TableFoot, TableRow, TableCell } from './Table';
import { CodeBlock } from './CodeBlock';
import { Note } from './Note';
import { Section } from './Section';
import { SectionRef } from './SectionRef';
import { SectionResponse } from '../../../proto/documents';

export interface PageProps {
    /** The HTML content to render as a string */
    content?: string;
    /** Sections from the backend */
    sections?: SectionResponse[];
    /** Bindings/Context for JSX variables */
    bindings?: Record<string, any>;
    /** Optional CSS class name to apply to the page container */
    className?: string;
    /** Optional title for the page */
    title?: string;
    /** Callback function for handling internal link navigation */
    onNavigate?: (href: string) => void;
    /** Document ID for constructing full paths */
    documentId?: string;
    /** Enable debug mode for troubleshooting */
    debug?: boolean;
}

/**
 * A container component that renders HTML content using html-react-parser.
 * Designed specifically for Sphinx-generated HTML content.
 */
export const Page: React.FC<PageProps> = ({
    content,
    sections,
    bindings,
    className = '',
    title,
    onNavigate,
    documentId,
    debug = true,
}) => {


    const componentsMap = {
                        Table: Table as any,
                        TableHead: TableHead as any,
                        TableBody: TableBody as any,
                        TableFoot: TableFoot as any,
                        TableRow: TableRow as any,
                        TableCell: TableCell as any,
                        CodeBlock: CodeBlock as any,
                        Note: Note as any,
                        // Enhanced Link component with navigation support
                        // Map 'to' prop from backend to 'href' prop for Link component
                        Link: (props: any) => {
                            const rawHref = props.to || props.href || '';
                            let fullHref = rawHref;
                            
                            // For relative paths, prepend /documents/${documentId}/
                            if (documentId && rawHref && !rawHref.startsWith('http') && !rawHref.startsWith('/')) {
                                fullHref = `/documents/${documentId}/${rawHref}`;
                            }
                            
                            return (
                                <Link
                                    {...props}
                                    href={fullHref}
                                />
                            );
                        },
                        Section: Section as any,
                        SectionRef: (props: any) => (
                            <SectionRef
                                {...props}
                                sections={sections}
                                components={componentsMap}
                                bindings={bindings}
                            />
                        ),
                        // Also include common HTML elements that might be in the JSX
                        a: (props: any) => <a {...props} />,
                        p: (props: any) => <p {...props} />,
                        div: (props: any) => <div {...props} />,
                        span: (props: any) => <span {...props} />,
                        ul: (props: any) => <ul {...props} />,
                        li: (props: any) => <li {...props} />,
                        code: (props: any) => <code {...props} />,
                        strong: (props: any) => <strong {...props} />,
                        em: (props: any) => <em {...props} />,
                        section: (props: any) => <section {...props} />,
                        h1: (props: any) => <h1 {...props} />,
                        h2: (props: any) => <h2 {...props} />,
                        h3: (props: any) => <h3 {...props} />,
                        h4: (props: any) => <h4 {...props} />,
                        h5: (props: any) => <h5 {...props} />,
                        h6: (props: any) => <h6 {...props} />,
                        nav: (props: any) => <nav {...props} />,
                        pre: (props: any) => <pre {...props} />,
                        img: (props: any) => <img {...props} />,
                        input: (props: any) => <input {...props} />,
                        br: (props: any) => <br {...props} />,
                        hr: (props: any) => <hr {...props} />,
    };

    const containerClasses = [
        'sphinx-page',
        className,
    ].filter(Boolean).join(' ');

    let parsedContent;
 
    if (content) {
        // Check if content contains JSX components

        if (debug) console.log('Content has JSX components, attempting conversion from HTML');

        try {
            // Fallback to JSX parser if HTML conversion fails
            parsedContent = (
                <JsxRenderer
                    jsxContent={content}
                    context={bindings}
                    components={componentsMap}
                />
            );
            if (debug) console.log('JSX parser succeeded');
        } catch (jsxError) {
            if (debug) console.warn('JSX parser failed, trying HTML parser:', jsxError);
        }


    } 

    if (debug) {
        console.log('Page Debug Info:', {
            title,
            contentLength: content ? content.length : sections?.length || 0,
            contentPreview: content ? content.substring(0, 200) + (content.length > 200 ? '...' : '') : 'Sections mode',
            containerClasses: containerClasses
        });
    }

    return (
        <div className={containerClasses}>
            <main className="content" role="main">
                {parsedContent}
            </main>
            {debug && (
                <div className="debug">
                    <strong>Page Debug:</strong><br />
                    Content Length: {content ? content.length : sections?.length || 0}<br />
                </div>
            )}
        </div>
    );
};