import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createRepository } from '../store/slices/repositoriesSlice'
import './CreateRepository.css'

function CreateRepository() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sourceUrl: '',
    sourceType: 'git',
    organisationId: 1,
    isPublic: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await dispatch(createRepository(formData)).unwrap()
      alert('Repository created successfully!')
      navigate('/repositories')
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }

  return (
    <div className="page create-repository-page">
      <div className="page-header">
        <h1>Create New Repository</h1>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="repository-form">
        <div className="form-group">
          <label htmlFor="name">
            Repository Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="my-awesome-repo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="A brief description of your repository"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sourceUrl">
            Source URL <span className="required">*</span>
          </label>
          <input
            type="url"
            id="sourceUrl"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            required
            placeholder="https://github.com/user/repo.git"
          />
          <small className="help-text">
            The Git repository URL to clone from
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="sourceType">Source Type</label>
          <select
            id="sourceType"
            name="sourceType"
            value={formData.sourceType}
            onChange={handleChange}
          >
            <option value="git">Git</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
            <option value="bitbucket">Bitbucket</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="organisationId">Organisation ID</label>
          <input
            type="number"
            id="organisationId"
            name="organisationId"
            value={formData.organisationId}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <span>Make this repository public</span>
          </label>
          <small className="help-text">
            Public repositories can be viewed by anyone
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/repositories')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Repository'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateRepository
