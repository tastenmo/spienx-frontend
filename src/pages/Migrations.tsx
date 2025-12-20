import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { migrateRepository, migrateFromExternal } from '../store/slices/migrationsSlice'
import './Migrations.css'

type MigrationType = 'internal' | 'external'

function Migrations() {
  const dispatch = useDispatch()
  const { items: migrations, loading, error } = useSelector((state) => state.migrations)
  const { items: repositories } = useSelector((state) => state.repositories)
  const [showForm, setShowForm] = useState(false)
  const [migrationType, setMigrationType] = useState<MigrationType>('internal')
  const [formData, setFormData] = useState({
    repositoryId: '',
    newOrganisationId: '',
    name: '',
    sourceUrl: '',
    description: '',
    organisationId: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'newOrganisationId' || name === 'organisationId' || name === 'repositoryId') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value) : ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleMigrate = async (e) => {
    e.preventDefault()
    
    try {
      if (migrationType === 'internal') {
        if (!formData.repositoryId || !formData.newOrganisationId) {
          alert('Please fill in all fields')
          return
        }
        await dispatch(migrateRepository({
          repositoryId: formData.repositoryId,
          newOrganisationId: formData.newOrganisationId,
        })).unwrap()
      } else {
        if (!formData.name || !formData.sourceUrl || !formData.organisationId) {
          alert('Please fill in all required fields')
          return
        }
        await dispatch(migrateFromExternal({
          name: formData.name,
          organisationId: formData.organisationId,
          sourceUrl: formData.sourceUrl,
          description: formData.description,
        })).unwrap()
      }
      
      alert('Repository migrated successfully!')
      setFormData({
        repositoryId: '',
        newOrganisationId: '',
        name: '',
        sourceUrl: '',
        description: '',
        organisationId: '',
      })
      setShowForm(false)
    } catch (err) {
      alert(`Failed to migrate repository: ${err}`)
    }
  }

  return (
    <div className="page migrations-page">
      <div className="page-header">
        <h1>Repository Migrations</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? '✕ Cancel' : '+ Migrate Repository'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {showForm && (
        <div className="migration-form-container">
          <div className="migration-type-selector">
            <label>Migration Type:</label>
            <div className="type-buttons">
              <button
                className={`type-btn ${migrationType === 'internal' ? 'active' : ''}`}
                onClick={() => setMigrationType('internal')}
              >
                Move Between Organisations
              </button>
              <button
                className={`type-btn ${migrationType === 'external' ? 'active' : ''}`}
                onClick={() => setMigrationType('external')}
              >
                Clone from External Source
              </button>
            </div>
          </div>

          <form onSubmit={handleMigrate} className="migration-form">
            {migrationType === 'internal' ? (
              <>
                <div className="form-group">
                  <label>Select Repository *</label>
                  <select
                    name="repositoryId"
                    value={formData.repositoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select a repository --</option>
                    {repositories.map(repo => (
                      <option key={repo.id} value={repo.id}>
                        {repo.name} (ID: {repo.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Organisation ID *</label>
                  <input
                    type="number"
                    name="newOrganisationId"
                    value={formData.newOrganisationId}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Repository Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., awesome-project"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Source Git URL *</label>
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
                  <label>Organisation ID *</label>
                  <input
                    type="number"
                    name="organisationId"
                    value={formData.organisationId}
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                    required
                  />
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
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Migrating...' : 'Migrate Repository'}
            </button>
          </form>
        </div>
      )}

      <div className="migrations-stats">
        <p>Total Migrations: <strong>{migrations.length}</strong></p>
      </div>

      {migrations.length === 0 ? (
        <div className="empty-state">
          <h2>No Migrations Found</h2>
          <p>Migrate a repository to move it to a different organisation or clone from an external source.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Perform Migration
          </button>
        </div>
      ) : (
        <div className="migrations-list">
          {migrations.map((migration) => (
            <div key={migration.id} className="migration-card">
              <div className="migration-header">
                <h3>{migration.name || `Migration #${migration.id}`}</h3>
                <span className={`status-badge status-${migration.status}`}>
                  {migration.status}
                </span>
              </div>

              <div className="migration-details">
                {migration.repositoryId && (
                  <>
                    <div className="detail-item">
                      <span className="label">Repository ID:</span>
                      <span className="value">{migration.repositoryId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Target Organisation ID:</span>
                      <span className="value">{migration.newOrganisationId}</span>
                    </div>
                  </>
                )}
                {migration.sourceUrl && (
                  <div className="detail-item">
                    <span className="label">Source URL:</span>
                    <span className="value"><code>{migration.sourceUrl}</code></span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Local Path:</span>
                  <span className="value"><code>{migration.newLocalPath}</code></span>
                </div>
                {migration.message && (
                  <div className="detail-item">
                    <span className="label">Message:</span>
                    <span className="value">{migration.message}</span>
                  </div>
                )}
              </div>

              {migration.createdAt && (
                <div className="migration-footer">
                  <small>Created: {new Date(migration.createdAt).toLocaleString()}</small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Migrations
