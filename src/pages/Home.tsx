import React from 'react'
import {
  Card,
  CardBody,
  CardTitle,
  Gallery,
  GalleryItem,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core'
import './Home.css'

function Home() {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <div>
          <Title headingLevel="h1" size="3xl">Welcome to Spienx</Title>
          <p>PatternFly 6 shell, SPIE design system tokens, and gRPC-backed repository tools.</p>
        </div>
      </PageSection>

      <PageSection variant={PageSectionVariants.default}>
        <Gallery hasGutter minWidths={{ default: '100%', md: '20rem' }}>
          <GalleryItem>
            <Card>
              <CardTitle>Getting started</CardTitle>
              <CardBody>
                Navigate with the left rail, inspect repositories, and jump into documents from the same shell.
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card>
              <CardTitle>Repository management</CardTitle>
              <CardBody>
                List, create, sync, and inspect Git repositories through the gRPC-Web API.
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card>
              <CardTitle>PatternFly 6 UI</CardTitle>
              <CardBody>
                The app now uses the SPIE design-system submodule on top of PatternFly 6 tokens and components.
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card>
              <CardTitle>Next steps</CardTitle>
              <CardBody>
                Continue by moving the create, detail, and document views onto the same component library and spacing scale.
              </CardBody>
            </Card>
          </GalleryItem>
        </Gallery>
      </PageSection>
    </>
  )
}

export default Home
