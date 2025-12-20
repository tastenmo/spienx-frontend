import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMirrors, deleteMirror, createMirror } from '../store/slices/mirrorsSlice'
import './Mirrors.css'

function Mirrors() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.mirrors)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sourceUrl: '',
    sourceType: 'git',
    description: '',
    organisationId: 1,
    autoSync: false,
    syncInterval: 3600,
  })

  useEffect(() => {
    dispatch(fetchMirrors())
  }, [dispatch])

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }))
  }

  const handleCreateMirror = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createMirror(formData)).unwrap()
      alert('Mirror created successfully!')
      setFormData({
        name: '',
        sourceUrl: '',
        sourceType: 'git',
        description: '',
        organisationId: 1,
        autoSync: false,
        syncInterval: 3600,
      })
      setShowForm(false)
      dispatch(fetchMirrors())
    } catch (err) {
      alert(`Failed to create mirror: ${err}`)
    }
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete mirror "${name}"?`)) {
      try {
        await dispatch(deleteMirror(id)).unwrap()
        alert('Mirror deleted successfully!')
      } catch (err) {
        alert(`Failed to delete mirror: ${err}`)
      }
    }
  }

  if (loading && items.length === 0) {
    return (
      <div className="page mirrors-page">
        <div className="loading">Loading mirrors...</div>
      </div>
    )
  }

  return (
    <div className="page mirrors-page">
      <div className="page-header">
        <h1>Repository Mirrors</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '✕ Cancel' : '+ Create Mirror'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <div className="mirror-form-container">
          <form onSubmit={handleCreateMirror} className="mirror-form">
            <div className="form-group">
              <label>Mirror Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., upstream-repo"
                required
              />
            </div>

            <div className="form-group">
              <label>Source URL *</label>
              <input
                type="url"
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                placeholder="e.g., https://github.com/user/repo.git"
                required
              />
            </div>

            <div className="form-group">
              <label>Source Type</label>
              <select
                name="sourceType"
                value={formData.sourceType}
                onChange={handleInputChange}
              >
                <option value="git">Git</option>
                <option value="hg">Mercurial</option>
                <option value="svn">Subversion</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional description..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Organisation ID *</label>
              <input
                type="number"
                name="organisationId"
                value={formData.organisationId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="autoSync"
                  checked={formData.autoSync}
                  onChange={handleInputChange}
                />
                Auto Sync
              </label>
            </div>

            <div className="form-group">
              <label>Sync Interval (seconds)</label>
              <input
                type="number"
                name="syncInterval"
                value={formData.syncInterval}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Mirror
            </button>
          </form>
        </div>
      )}

      <div className="mirrors-stats">
        <p>Total Mirrors: <strong>{items.length}</strong></p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h2>No Mirrors Found</h2>
          <p>Create a mirror to automatically sync an external repository.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create First Mirror
          </button>
        </div>
      ) : (
        <div className="mirrors-grid">
          {items.map((mirror) => (
            <div key={mirror.id} className="mirror-card">
              <div className="mirror-header">
                <h3>{mirror.name}</h3>
                <span className={`status-badge status-${mirror.status || 'active'}`}>
                  {mirror.status || 'active'}
                </span>
              </div>

              <p className="mirror-description">
                {mirror.description || 'No description provided'}
              </p>

              <div className="mirror-meta">
                <div className="meta-item">
                  <span className="label">Source Type:</span>
                  <span className="value">{mirror.sourceType || 'git'}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Auto Sync:</span>
                  <span className="value">{mirror.autoSync ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {mirror.localPath && (
                <div className="mirror-local-path">
                  <h4>Local Path</h4>
                  <div className="path-display">
                    <code>{mirror.localPath}</code>
                    <button 
                      onClick={() => copyToClipboard(mirror.localPath, 'Local Path')}
                      className="btn btn-sm btn-secondary"
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="mirror-source-url">
                <h4>Source URL</h4>
                <a 
                  href={mirror.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="source-url-link"
                >
                  {mirror.sourceUrl}
                </a>
              </div>

              <div className="mirror-actions">
                <button 
                  onClick={() => handleDelete(mirror.id, mirror.name)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>

              {mirror.createdAt && (
                <div className="mirror-footer">
                  <small>Created: {new Date(mirror.createdAt).toLocaleString()}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Mirrors
