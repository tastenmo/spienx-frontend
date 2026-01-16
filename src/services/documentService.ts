import {
  DocumentReadControllerDefinition,
  DocumentReadControllerClient,
  DocumentListRequest,
  DocumentRetrieveRequest,
  DocumentReadStreamPagesRequest,
  DocumentResponse,
  PageResponse
} from '../proto/documents';
import { channel, clientFactory } from '../utils/grpc';

class DocumentService {
  private client: DocumentReadControllerClient;

  constructor() {
    this.client = clientFactory.create(DocumentReadControllerDefinition, channel);
  }

  /**
   * List all available documents
   */
  async listDocuments() {
    const request: DocumentListRequest = {};
    const response = await this.client.list(request);
    return {
      documents: (response.results || []).map(doc => ({
        id: doc.id,
        title: doc.title,
        source: doc.source,
        reference: doc.reference,
        workdir: doc.workdir,
        confPath: doc.confPath,
        lastBuildAt: doc.lastBuildAt,
        globalContext: doc.globalContext
      })),
      totalCount: (response.results || []).length
    };
  }

  /**
   * Retrieve a specific document by ID
   */
  async getDocument(documentId: number) {
    const request: DocumentRetrieveRequest = { id: documentId };
    const response = await this.client.retrieve(request);
    return {
      id: response.id,
      title: response.title,
      source: response.source,
      reference: response.reference,
      workdir: response.workdir,
      confPath: response.confPath,
      lastBuildAt: response.lastBuildAt,
      globalContext: response.globalContext
    };
  }

  /**
   * Stream pages from a document (useful for large documents)
   * Returns an async iterator of PageResponse objects
   */
  async *streamPages(documentId: number): AsyncGenerator<PageResponse, void, unknown> {
    const request: DocumentReadStreamPagesRequest = { documentId };
    const stream = this.client.streamPages(request);
    
    for await (const page of stream) {
      yield page;
    }
  }

  /**
   * Helper method to collect all pages from a document stream
   */
  async getDocumentPages(documentId: number): Promise<PageResponse[]> {
    const pages: PageResponse[] = [];
    for await (const page of this.streamPages(documentId)) {
      pages.push(page);
    }
    return pages;
  }
}

export const documentService = new DocumentService();
