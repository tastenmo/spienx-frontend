import { createClient, createChannel } from 'nice-grpc-web';
import { 
  GitRepositoryControllerDefinition, 
  GitRepositoryControllerClient,
  GitRepositoryCreationControllerDefinition,
  GitRepositoryCreationControllerClient
} from '../proto/repositories';

// Configure the gRPC-Web client
const GRPC_BACKEND_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'http://localhost:8000';

class GitService {
  private client: GitRepositoryControllerClient;
  private creationClient: GitRepositoryCreationControllerClient;

  constructor() {
    const channel = createChannel(GRPC_BACKEND_URL);
    this.client = createClient(GitRepositoryControllerDefinition, channel);
    this.creationClient = createClient(GitRepositoryCreationControllerDefinition, channel);
  }

  // Initialize a new repository
  async initRepository(name: string, organisationId: number, description: string) {
    const response = await this.creationClient.init({
      name,
      organisationId,
      description
    });
    return {
      id: response.id,
      localPath: response.localPath
    };
  }

  // List all repositories
  async listRepositories() {
    const response = await this.client.list({});
    return {
      repositories: response.results.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        sourceUrl: repo.sourceUrl,
        sourceType: repo.sourceType,
        localPath: repo.localPath,
        status: repo.status,
        isMirror: repo.isMirror,
        isBare: repo.isBare,
        defaultBranch: repo.defaultBranch,
        lastSyncedAt: repo.lastSyncedAt,
        lastCommitHash: repo.lastCommitHash,
        totalCommits: repo.totalCommits,
        isPublic: repo.isPublic,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        organisationId: repo.organisation,
      })),
      totalCount: response.results.length
    };
  }

  // Get a single repository by ID
  async getRepository(id: number) {
    const repo = await this.client.retrieve({ id });
    return {
      repository: {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        sourceUrl: repo.sourceUrl,
        sourceType: repo.sourceType,
        localPath: repo.localPath,
        status: repo.status,
        isMirror: repo.isMirror,
        isBare: repo.isBare,
        defaultBranch: repo.defaultBranch,
        lastSyncedAt: repo.lastSyncedAt,
        lastCommitHash: repo.lastCommitHash,
        totalCommits: repo.totalCommits,
        isPublic: repo.isPublic,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        organisationId: repo.organisation,
      }
    };
  }

  // Create a new repository
  async createRepository(data: {
    name: string;
    description?: string;
    sourceUrl?: string;
    sourceType?: string;
    organisationId: number;
    isPublic?: boolean;
  }) {
    const repo = await this.client.create({
      name: data.name,
      description: data.description,
      sourceUrl: data.sourceUrl || '',
      sourceType: data.sourceType,
      localPath: '', // Will be set by backend
      isPublic: data.isPublic,
      organisation: data.organisationId,
    });

    return {
      repository: {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        sourceUrl: repo.sourceUrl,
        sourceType: repo.sourceType,
        localPath: repo.localPath,
        status: repo.status,
        organisationId: repo.organisation,
      }
    };
  }

  // Update a repository
  async updateRepository(id: number, data: any) {
    // Note: Using update with potentially missing required fields (they will be default values)
    // This matches previous behavior
    const repo = await this.client.update({
      id: id,
      name: data.name || '',
      description: data.description,
      sourceUrl: data.sourceUrl || '',
      sourceType: data.sourceType,
      localPath: '',
      isPublic: data.isPublic,
      organisation: 0,
    });

    return {
      repository: {
        id: repo.id,
        name: repo.name,
        description: repo.description,
      }
    };
  }

  // Delete a repository
  async deleteRepository(id: number) {
    await this.client.destroy({ id });
    return { success: true };
  }

  // Sync a repository (not in generated proto - would need custom RPC)
  async syncRepository(_repositoryId: number) {
    return Promise.reject(new Error('syncRepository not implemented in proto'));
  }

  // Migrate a repository (not in generated proto - would need custom RPC)
  async migrateRepository(_repositoryId: number, _sourceUrl: string, _force = false) {
    return Promise.reject(new Error('migrateRepository not implemented in proto'));
  }

  // Get repository branches (not in generated proto - would need custom RPC)
  async getRepositoryBranches(_repositoryId: number) {
    return Promise.reject(new Error('getRepositoryBranches not implemented in proto'));
  }

  // Get repository commits (not in generated proto - would need custom RPC)
  async getRepositoryCommits(_params: { repositoryId: number; branch?: string; limit?: number; offset?: number }) {
    return Promise.reject(new Error('getRepositoryCommits not implemented in proto'));
  }
}

// Export singleton instance
export const gitService = new GitService();
