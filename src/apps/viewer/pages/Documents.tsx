import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDocuments } from '../store/slices/documentsSlice';
import { ViewerAppDispatch, ViewerRootState } from '../store/store';
import './Documents.css';

const Documents: React.FC = () => {
  const dispatch = useDispatch<ViewerAppDispatch>();
  const { items, loading, error } = useSelector(
    (state: ViewerRootState) => state.documents.list
  );

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="documents-container">
        <div className="documents-loading">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="documents-container">
        <div className="documents-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className="documents-title">Available Documents</h1>
        <Link to="/documents/new" className="btn btn-primary" style={{textDecoration: 'none', padding: '0.5rem 1rem', background: '#007bff', color: 'white', borderRadius: '4px'}}>
          + Add Document
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="documents-empty">
          <p>No documents available.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {items.map((doc) => (
            <Link 
              key={doc.id} 
              to={`/documents/${doc.id}`}
              className="document-card"
            >
              <div className="card-header">
                <h2 className="card-title">{doc.title}</h2>
              </div>
              <div className="card-body">
                <p className="card-description">{doc.reference}</p>
                <div className="card-meta">
                  {doc.lastBuildAt && (
                    <span className="meta-item">
                      Built: {new Date(doc.lastBuildAt).toLocaleDateString()}
                    </span>
                  )}
                  <span className="meta-item">
                    Workspace: {doc.workdir}
                  </span>
                </div>
              </div>
              <div className="card-footer">
                <span className="read-more">Read Document →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
