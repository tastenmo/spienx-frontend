import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDocument } from '../store/slices/documentsSlice';
import { ViewerAppDispatch, ViewerRootState } from '../store/store';
import JsxRenderer from '../../shared/components/JsxRenderer';
import './Viewer.css';

const Viewer: React.FC = () => {
  const dispatch = useDispatch<ViewerAppDispatch>();
  const { id } = useParams<{ id: string }>();
  
  const { document, pages, loading, error } = useSelector(
    (state: ViewerRootState) => state.documents.current
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDocument(parseInt(id, 10)));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="viewer-container">
        <div className="viewer-loading">Loading document...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewer-container">
        <div className="viewer-error">Error: {error}</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="viewer-container">
        <div className="viewer-empty">No document found</div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <header className="viewer-header">
        <h1 className="viewer-title">{document.title}</h1>
        <div className="viewer-metadata">
          <span className="metadata-item">
            <strong>Reference:</strong> {document.reference}
          </span>
          {document.lastBuildAt && (
            <span className="metadata-item">
              <strong>Last Built:</strong> {new Date(document.lastBuildAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>

      <main className="viewer-content">
        {pages.length === 0 ? (
          <div className="viewer-empty">No pages available</div>
        ) : (
          pages.map((page, pageIndex) => (
            <section key={pageIndex} className="viewer-page">
              <h2 className="page-title">{page.title}</h2>
              
              {page.sections && page.sections.length > 0 ? (
                <div className="sections-list">
                  {page.sections.map((section, sectionIndex) => (
                    <article 
                      key={sectionIndex} 
                      className="section" 
                      id={section.sphinxId}
                    >
                      <h3 className="section-title">{section.title}</h3>
                      
                      {section.contentBlock && section.contentBlock.jsxContent && (
                        <JsxRenderer
                          jsxContent={section.contentBlock.jsxContent}
                          context={page.context || document.globalContext}
                          className="section-content"
                        />
                      )}

                      {section.sourcePath && (
                        <footer className="section-footer">
                          <small>
                            Source: {section.sourcePath} (lines {section.startLine}-{section.endLine})
                          </small>
                        </footer>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-page">No sections in this page</p>
              )}
            </section>
          ))
        )}
      </main>
    </div>
  );
};

export default Viewer;
