import React from 'react'
import { Link } from 'react-router-dom'
import { Button, EmptyState, EmptyStateBody, PageSection, Title } from '@patternfly/react-core'
import './NotFound.css'

function NotFound() {
  return (
    <PageSection>
      <EmptyState>
        <Title headingLevel="h1" size="4xl">404</Title>
        <EmptyStateBody>Oops! The page you&apos;re looking for doesn&apos;t exist.</EmptyStateBody>
        <Button component={Link} to="/" variant="primary">
          Go back home
        </Button>
      </EmptyState>
    </PageSection>
  )
}

export default NotFound
