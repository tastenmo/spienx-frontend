import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRepositories, deleteRepository } from '../store/slices/repositoriesSlice'
import './Repositories.css'

function Repositories() {
  const dispatch = useDispatch()
  const { items, loading, error, totalCount } = useSelector((state) => state.repositories)

  useEffect(() => {
    dispatch(fetchRepositories())
  }, [dispatch])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const handleDelete = async (repositoryId, name) => {
    if (window.confirm(`Are you sure you want to delete repository "${name}"?`)) {
      try {
        await dispatch(deleteRepository({ repositoryId, force: false })).unwrap()
        alert('Repository deleted successfully!')
      } catch (err) {
        alert(`Failed to delete repository: ${err}`)
      }
    }
  }

  const handleSync = async (repositoryId) => {
    try {
      alert('Sync functionality coming soon')
      // TODO: Implement sync using GitRepositorySyncController
    } catch (err) {
      alert(`Failed to sync repository: ${err}`)
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="page repositories-page">
        <div className="loading">Loading repositories...</div>
      </div>
    )
  }

  return (
    <div className="page repositories-page">
      <div className="page-header">
        <h1>Repositories</h1>
        <Link to="/repositories/new" className="btn btn-primary">
          + Create Repository
        </Link>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="repositories-stats">
        <p>Total Repositories: <strong>{totalCount}</strong></p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>No Repositories Found</h2>
          <p>Get started by creating your first repository.</p>
          <Link to="/repositories/new" className="btn btn-primary">
            Create Repository
          </Link>
        </div>
      ) : (
        <div className="repositories-grid">
          {items.map((repo) => (
            <div key={repo.id} className="repository-card">
              <div className="repository-header">
                <h3>
                  <Link to={`/repositories/${repo.id}`}>{repo.name}</Link>
                </h3>
                <span className={`status-badge status-${repo.status}`}>
                  {repo.status}
                </span>
              </div>

              <p className="repository-description">
                {repo.description || 'No description provided'}
              </p>

              <div className="repository-meta">
                <div className="meta-item">
                  <span className="label">Visibility:</span>
                  <span className="value">{repo.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Bare:</span>
                  <span className="value">{repo.isBare ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {(repo.gitUrl || repo.localPath) && (
                <div className="repository-git-url">
                  <h4>Git URL</h4>
                  <div className="git-url-display">
                    <code>{repo.gitUrl || repo.localPath}</code>
                    <button 
                      onClick={() => copyToClipboard(repo.gitUrl || repo.localPath, 'Git URL')}
                      className="btn btn-sm btn-secondary"
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              )}

              {repo.source_url && (
                <div className="repository-source">
                  <a 
                    href={repo.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                  >
                    🔗 Source URL
                  </a>
                </div>
              )}

              <div className="repository-actions">
                <Link to={`/repositories/${repo.id}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
                <button 
                  onClick={() => handleSync(repo.id)}
                  className="btn btn-secondary btn-sm"
                >
                  Sync
                </button>
                <button 
                  onClick={() => handleDelete(repo.id, repo.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>

              {repo.last_synced_at && (
                <div className="repository-footer">
                  <small>Created: {new Date(repo.createdAt).toLocaleString()}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Repositories
