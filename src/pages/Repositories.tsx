import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchRepositories, deleteRepository } from '../store/slices/repositoriesSlice'
import './Repositories.css'

function Repositories() {
  const dispatch = useDispatch()
  const { items, loading, error, totalCount } = useSelector((state) => state.repositories)

  useEffect(() => {
    dispatch(fetchRepositories())
  }, [dispatch])

  const handleDelete = async (repositoryId, name) => {
    if (window.confirm(`Are you sure you want to delete repository "${name}"?`)) {
      try {
        await dispatch(deleteRepository({ repositoryId, force: false })).unwrap()
      } catch (err) {
        alert(`Failed to delete repository: ${err}`)
      }
    }
  }

  const handleSync = async (repositoryId) => {
    try {
      const { syncRepository } = await import('../store/slices/repositoriesSlice')
      await dispatch(syncRepository(repositoryId)).unwrap()
      alert('Repository sync started successfully!')
      dispatch(fetchRepositories())
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
                  <span className="label">Type:</span>
                  <span className="value">{repo.source_type || 'N/A'}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Branch:</span>
                  <span className="value">{repo.default_branch || 'main'}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Commits:</span>
                  <span className="value">{repo.total_commits || 0}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Visibility:</span>
                  <span className="value">{repo.is_public ? 'Public' : 'Private'}</span>
                </div>
              </div>

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
                  <small>Last synced: {new Date(repo.last_synced_at).toLocaleString()}</small>
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
