import {
  DocumentControllerDefinition,
  DocumentControllerClient,
  BuildReadControllerDefinition,
  BuildReadControllerClient,
  DocumentListRequest,
  DocumentRetrieveRequest,
  BuildListRequest,
  BuildReadStreamPagesRequest,
  PageResponse,
  DocumentCreateAndStartBuildRequest
} from '../proto/documents';
import { channel, clientFactory } from '../utils/grpc';

class DocumentService {
  private docClient: DocumentControllerClient;
  private buildClient: BuildReadControllerClient;

  constructor() {
    this.docClient = clientFactory.create(DocumentControllerDefinition, channel);
    this.buildClient = clientFactory.create(BuildReadControllerDefinition, channel);
  }

  /**
   * List all available documents
   */
  async listDocuments() {
    const request: DocumentListRequest = {};
    const response = await this.docClient.list(request);
    return {
      documents: (response.results || []).map(doc => ({
        id: doc.id,
        title: doc.title,
        source: doc.source,
      })),
      totalCount: (response.results || []).length
    };
  }

  /**
   * List builds for a document
   */
  async listBuilds(documentId: number) {
    const request: BuildListRequest = { documentId };
    const response = await this.buildClient.list(request);
    return response.results || [];
  }

  /**
   * Retrieve a specific document by ID
   */
  async getDocument(documentId: number) {
    const request: DocumentRetrieveRequest = { id: documentId };
    const response = await this.docClient.retrieve(request);
    return {
      id: response.id,
      title: response.title,
      source: response.source,
    };
  }

  /**
   * Create and start a build
   */
  async createAndStartBuild(data: {
    title: string;
    source: number;
    reference: string;
    workdir: string;
    confPath: string;
    startImmediately: boolean;
  }) {
    const request: DocumentCreateAndStartBuildRequest = {
      title: data.title,
      source: data.source,
      reference: data.reference,
      workdir: data.workdir,
      confPath: data.confPath,
      startImmediately: data.startImmediately
    };
    return await this.docClient.createAndStartBuild(request);
  }

  /**
   * Stream pages from a build 
   */
  async *streamPages(buildId: number): AsyncGenerator<PageResponse, void, unknown> {
    const request: BuildReadStreamPagesRequest = { buildId };
    const stream = this.buildClient.streamPages(request);
    
    for await (const page of stream) {
      yield page;
    }
  }

  /**
   * Helper method to collect all pages from a build stream, mapped by path
   */
  async getDocumentPages(buildId: number): Promise<PageResponse[]> {
    const pagesMap = new Map<string, PageResponse>();
    for await (const page of this.streamPages(buildId)) {
      if (page.path) {
        pagesMap.set(page.path, page);
      }
    }
    return Array.from(pagesMap.values());
  }
}

export const documentService = new DocumentService();
