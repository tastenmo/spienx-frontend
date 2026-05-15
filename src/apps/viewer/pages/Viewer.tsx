import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDocument, fetchDocumentBuilds } from '../store/slices/documentsSlice';
import { ViewerAppDispatch, ViewerRootState } from '../store/store';
import { Page } from '../components/Page';
import './Viewer.css';
import '../../../../design-system/scss/main.scss';

const Viewer: React.FC = () => {
  const dispatch = useDispatch<ViewerAppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const { document: currentDocument, pages, builds, loading, error, buildsLoading } = useSelector(
    (state: ViewerRootState) => state.documents.current
  );

  const pagePath = React.useMemo(() => {
    if (!id) {
      return '';
    }

    const basePath = `/documents/${id}`;
    if (!location.pathname.startsWith(basePath)) {
      return '';
    }

    const remainder = location.pathname.slice(basePath.length);
    return remainder.replace(/^\//, '');
  }, [id, location.pathname]);
  const actualPath = pagePath || currentDocument?.globalContext?.master_doc || '';

  const currentPage = actualPath ? pages.find(p => p.path === actualPath) : pages[0];

  useEffect(() => {
    if (id) {
      const docId = parseInt(id, 10);
      dispatch(fetchDocument(docId));
      dispatch(fetchDocumentBuilds(docId));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = decodeURIComponent(location.hash.substring(1));
    const sectionByHash = currentPage?.sections?.find((section) => section.hash === targetId);
    const candidateAnchors = [targetId];

    if (sectionByHash?.sphinxId) {
      candidateAnchors.push(sectionByHash.sphinxId);
    }

    const target = candidateAnchors
      .map((anchor) => document.getElementById(anchor) || document.querySelector(`[data-sphinx-id="${anchor}"]`))
      .find(Boolean) as HTMLElement | null;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, currentPage?.path]);

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

  if (!currentDocument) {
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

  const handleLinkNavigation = (href: string) => {
    if (!id) {
      return;
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      window.location.href = href;
      return;
    }

    const cleanHref = href.startsWith('/') ? href.substring(1) : href;
    const [pathPart, hashPart] = cleanHref.split('#');
    const effectivePath = pathPart || currentPage.path;
    navigate(`/documents/${id}/${effectivePath}${hashPart ? `#${hashPart}` : ''}`);
  };

  return (
    <div className="viewer-container">
      <header className="viewer-header">
        <h1 className="viewer-title">{currentDocument.title}</h1>
        <div className="viewer-metadata">
          <span className="metadata-item">
            <strong>Reference:</strong> {currentDocument.reference}
          </span>
          {currentDocument.lastBuildAt && (
            <span className="metadata-item">
              <strong>Last Built:</strong> {new Date(currentDocument.lastBuildAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </header>

      <main className="viewer-main-layout">
        <section className="viewer-content">
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
            content={currentPage.jsxContent}
            bindings={currentPage.context}
            onNavigate={handleLinkNavigation}
            documentId={id}
            debug={false}
          />
        </section>
      </main>
    </div>
  );
};

export default Viewer;
