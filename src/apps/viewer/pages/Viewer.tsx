import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDocument, fetchDocumentBuilds } from '../store/slices/documentsSlice';
import { ViewerAppDispatch, ViewerRootState } from '../store/store';
import { Page } from '../components/Page';
import '../../../../design-system/scss/main.scss';

const Viewer: React.FC = () => {
  const dispatch = useDispatch<ViewerAppDispatch>();
  const navigate = useNavigate();
  const { id, pagePath } = useParams<{ id: string; pagePath?: string }>();
  
  const { document, pages, builds, loading, error, buildsLoading } = useSelector(
    (state: ViewerRootState) => state.documents.current
  );

  const actualPath = pagePath || document?.globalContext?.master_doc || "";

  // Find the current page by path
  const currentPage = actualPath ? pages.find(p => p.path === actualPath) : pages[0];

  // Debug logging
  useEffect(() => {
    console.log("=== Viewer Debug ===");
    console.log("pagePath:", pagePath);
    console.log("actualPath:", actualPath);
    console.log("document:", document);
    console.log("document?.globalContext?.master_doc:", document?.globalContext?.master_doc);
    console.log("builds:", builds);
    console.log("pages:", pages);
    console.log("currentPage:", currentPage);
  }, [pagePath, actualPath, currentPage, document, pages, builds]);

  useEffect(() => {
    if (id) {
      const docId = parseInt(id, 10);
      dispatch(fetchDocument(docId));
      dispatch(fetchDocumentBuilds(docId));
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

  if (pages.length === 0) {
    return (
      <div className="viewer-container">
        <div className="viewer-empty">No pages available</div>
      </div>
    );
  }

  // Ensure currentPage exists and is valid
  if (!currentPage) {
    return (
      <div className="viewer-container">
        <div className="viewer-empty">Page not found</div>
      </div>
    );
  }

  // Navigation handlers using page paths
  const handlePreviousPage = () => {
    if (currentPage?.previousPage) {
      navigate(`/documents/${id}/pages/${currentPage.previousPage}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage?.nextPage) {
      navigate(`/documents/${id}/pages/${currentPage.nextPage}`);
    }
  };

  // Handle internal link navigation with document ID preserved
  const handleLinkNavigation = (href: string) => {
    // Remove leading slash if present
    const cleanHref = href.startsWith('/') ? href.substring(1) : href;
    
    // Split path and hash
    const [path, hash] = cleanHref.split('#');
    
    // Build full path with document ID
    const fullPath = `/documents/${id}/${path}${hash ? '#' + hash : ''}`;
    navigate(fullPath);
  };

  return (
    <div className="viewer-container">
      <header className="viewer-header">
        <a href="/" className="header-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1"/>
            <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" fill="currentColor" strokeWidth="1.5" stroke="currentColor"/>
          </svg>
          <span className="logo-text">Spienx</span>
        </a>
        <nav className="header-nav"></nav>
      </header>

      <main className="viewer-content">
        <div>
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
        </div>
        
        {/* Recent Builds Summary */}
        <div className="builds-summary">
          <strong>Build Configurations:</strong>
          {buildsLoading ? (
            <span> Loading...</span>
          ) : builds && builds.length > 0 ? (
            <div className="builds-list-mini">
              {builds.slice(0, 3).map(build => (
                <div key={build.id} className="build-item-mini">
                  <span>#{build.id}</span>
                  <span className="build-status">{build.reference}</span>
                  {build.lastBuildAt && (
                      <span className="build-date">{new Date(build.lastBuildAt).toLocaleDateString()}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span> No builds found</span>
          )}
        </div>

        <Page
          title={currentPage.title}
          sections={currentPage.sections}
          content= {currentPage.jsxContent}
          bindings={currentPage.context}
          onNavigate={handleLinkNavigation}
          documentId={id}
          debug={true}
        />
      </main>

      {/* Page Navigation Footer */}
      <footer className="viewer-footer">
        <div className="page-navigation">
          <button
            onClick={handlePreviousPage}
            disabled={!currentPage?.previousPage}
            className="nav-button"
          >
            ← Previous
          </button>
          <div className="page-indicator">
            {currentPage.path}
          </div>
          <button
            onClick={handleNextPage}
            disabled={!currentPage?.nextPage}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Viewer;
