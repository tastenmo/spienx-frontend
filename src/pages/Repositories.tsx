import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  AlertActionCloseButton,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  ClipboardCopy,
  EmptyState,
  EmptyStateBody,
  Gallery,
  GalleryItem,
  Label,
  PageSection,
  PageSectionVariants,
  Spinner,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core'
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
      <PageSection variant={PageSectionVariants.default}>
        <Spinner aria-label="Loading repositories" />
      </PageSection>
    )
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Stack hasGutter>
          <StackItem>
            <div>
              <Title headingLevel="h1" size="3xl">Repositories</Title>
              <p>Manage Git repositories through the SPIE gRPC-Web API.</p>
            </div>
          </StackItem>

          <StackItem>
            <Button component={Link} to="/repositories/new" variant="primary">
              Create repository
            </Button>
          </StackItem>

          <StackItem>
            <Badge isRead>{totalCount} total</Badge>
          </StackItem>
        </Stack>
      </PageSection>

      {error && (
        <PageSection variant={PageSectionVariants.default}>
          <Alert
            variant="danger"
            title="Repository loading failed"
            actionClose={<AlertActionCloseButton onClose={() => null} />}
            isInline
          >
            {error}
          </Alert>
        </PageSection>
      )}

      <PageSection variant={PageSectionVariants.default}>
        {items.length === 0 ? (
          <EmptyState>
            <Title headingLevel="h2" size="lg">No repositories found</Title>
            <EmptyStateBody>Get started by creating your first repository.</EmptyStateBody>
            <Button component={Link} to="/repositories/new" variant="primary">
              Create repository
            </Button>
          </EmptyState>
        ) : (
          <Gallery hasGutter minWidths={{ default: '100%', md: '24rem' }}>
            {items.map((repo) => (
              <GalleryItem key={repo.id}>
                <Card isRounded isFullHeight>
                  <CardTitle>
                    <Stack hasGutter>
                      <StackItem>
                        <Link to={`/repositories/${repo.id}`}>{repo.name}</Link>
                      </StackItem>
                      <StackItem>
                        <Label color={repo.status === 'error' ? 'red' : 'blue'}>{repo.status}</Label>
                      </StackItem>
                    </Stack>
                  </CardTitle>
                  <CardBody>
                    <div>
                      <p>{repo.description || 'No description provided'}</p>
                    </div>

                    <div>
                      <small>Visibility: {repo.isPublic ? 'Public' : 'Private'}</small>
                      <small>Bare: {repo.isBare ? 'Yes' : 'No'}</small>
                    </div>

                    {(repo.gitUrl || repo.localPath) && (
                      <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied" variant="inline-compact">
                        {repo.gitUrl || repo.localPath}
                      </ClipboardCopy>
                    )}
                  </CardBody>
                  <CardFooter>
                    <Button component={Link} to={`/repositories/${repo.id}`} variant="link">
                      View details
                    </Button>
                    <Button variant="secondary" onClick={() => handleSync(repo.id)}>
                      Sync
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(repo.id, repo.name)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </GalleryItem>
            ))}
          </Gallery>
        )}
      </PageSection>
    </>
  )
}

export default Repositories
