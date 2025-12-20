import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchRepository, 
  deleteRepository,
  clearCurrentRepository 
} from '../store/slices/repositoriesSlice'
import { fetchBranches } from '../store/slices/branchesSlice'
import { fetchCommits } from '../store/slices/commitsSlice'
import './RepositoryDetail.css'

function RepositoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentRepository, loading, error } = useSelector((state) => state.repositories)
  const { items: branches } = useSelector((state) => state.branches)
  const { items: commits } = useSelector((state) => state.commits)

  useEffect(() => {
    if (id) {
      dispatch(fetchRepository(parseInt(id)))
      dispatch(fetchBranches(parseInt(id)))
      dispatch(fetchCommits({ repositoryId: parseInt(id), limit: 10 }))
    }

    return () => {
      dispatch(clearCurrentRepository())
    }
  }, [id, dispatch])

  const handleSync = async () => {
    try {
      alert('Sync functionality coming soon')
      // TODO: Implement sync using GitRepositorySyncController
    } catch (err) {
      alert(`Failed to sync repository: ${err}`)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete repository "${currentRepository?.name}"?`)) {
      try {
        await dispatch(deleteRepository({ repositoryId: parseInt(id), force: false })).unwrap()
        alert('Repository deleted successfully!')
        navigate('/repositories')
      } catch (err) {
        alert(`Failed to delete repository: ${err}`)
      }
    }
  }

  if (loading && !currentRepository) {
    return (
      <div className="page repository-detail-page">
        <div className="loading">Loading repository...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page repository-detail-page">
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
        <Link to="/repositories" className="btn btn-secondary">← Back to Repositories</Link>
      </div>
    )
  }

  if (!currentRepository) {
    return (
      <div className="page repository-detail-page">
        <div className="empty-state">
          <h2>Repository Not Found</h2>
          <Link to="/repositories" className="btn btn-secondary">← Back to Repositories</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page repository-detail-page">
      <div className="page-header">
        <Link to="/repositories" className="back-link">← Back to Repositories</Link>
        <h1>{currentRepository.name}</h1>
        <div className="header-actions">
          <button onClick={handleSync} className="btn btn-secondary">
            🔄 Sync
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="repository-overview">
        <div className="overview-section">
          <h2>Overview</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Visibility:</label>
              <span>{currentRepository.isPublic ? 'Public' : 'Private'}</span>
            </div>
            <div className="info-item">
              <label>Bare:</label>
              <span>{currentRepository.isBare ? 'Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <label>Created:</label>
              <span>
                {currentRepository.createdAt 
                  ? new Date(currentRepository.createdAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <label>Updated:</label>
              <span>
                {currentRepository.updatedAt 
                  ? new Date(currentRepository.updatedAt).toLocaleString()
                  : 'N/A'}
              </span>
            </div>
          </div>

          {currentRepository.description && (
            <div className="description">
              <h3>Description</h3>
              <p>{currentRepository.description}</p>
            </div>
          )}

          {(currentRepository.gitUrl || currentRepository.localPath) && (
            <div className="git-url">
              <h3>Git URL</h3>
              <code>{currentRepository.gitUrl || currentRepository.localPath}</code>
            </div>
          )}

          {currentRepository.localPath && (
            <div className="local-path">
              <h3>Local Path</h3>
              <code>{currentRepository.localPath}</code>
            </div>
          )}
        </div>

        <div className="branches-section">
          <h2>Branches ({branches.length})</h2>
          {branches.length > 0 ? (
            <ul className="branches-list">
              {branches.map((branch) => (
                <li key={branch.name} className="branch-item">
                  <span className="branch-name">
                    {branch.name}
                    {branch.is_default && <span className="default-badge">default</span>}
                  </span>
                  <span className="branch-commit">{branch.commit_hash?.substring(0, 7)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">No branches found</p>
          )}
        </div>

        <div className="commits-section">
          <h2>Recent Commits</h2>
          {commits.length > 0 ? (
            <div className="commits-list">
              {commits.map((commit) => (
                <div key={commit.commit_hash} className="commit-item">
                  <div className="commit-header">
                    <code className="commit-hash">{commit.commit_hash.substring(0, 7)}</code>
                    <span className="commit-author">{commit.author_name}</span>
                  </div>
                  <p className="commit-message">{commit.message}</p>
                  <span className="commit-date">
                    {new Date(commit.committed_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">No commits found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RepositoryDetail
