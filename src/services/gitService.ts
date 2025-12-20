import { createClient, createChannel } from 'nice-grpc-web';
import { 
  GitRepositoryAdminControllerDefinition,
  GitRepositoryAdminControllerClient,
  GitRepositoryCreationControllerDefinition,
  GitRepositoryCreationControllerClient
} from '../proto/repositories';

// Configure the gRPC-Web client
const GRPC_BACKEND_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'http://localhost:8000';

class GitService {
  private adminClient: GitRepositoryAdminControllerClient;
  private creationClient: GitRepositoryCreationControllerClient;

  constructor() {
    const channel = createChannel(GRPC_BACKEND_URL);
    this.adminClient = createClient(GitRepositoryAdminControllerDefinition, channel);
    this.creationClient = createClient(GitRepositoryCreationControllerDefinition, channel);
  }

  // Create a new repository
  async createRepository(name: string, organisationId: number, description: string) {
    const response = await this.creationClient.create({
      name,
      organisationId,
      description,
      isPublic: true
    });
    return {
      id: response.id,
      localPath: response.localPath,
      gitUrl: response.gitUrl
    };
  }

  // List all repositories
  async listRepositories() {
    const response = await this.adminClient.list({});
    return {
      repositories: (response.results || []).map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        localPath: repo.localPath || '',
        isBare: repo.isBare || false,
        isPublic: repo.isPublic || false,
        createdAt: repo.createdAt || '',
        updatedAt: repo.updatedAt || '',
        organisationId: repo.organisation,
        owner: repo.owner,
      })),
      totalCount: (response.results || []).length
    };
  }

  // Get a single repository by ID
  async getRepository(id: number) {
    const repo = await this.adminClient.retrieve({ id });
    return {
      id: repo.id,
      name: repo.name,
      description: repo.description || '',
      localPath: repo.localPath || '',
      isBare: repo.isBare || false,
      isPublic: repo.isPublic || false,
      createdAt: repo.createdAt || '',
      updatedAt: repo.updatedAt || '',
      organisationId: repo.organisation,
      owner: repo.owner,
    };
  }

  // Update a repository
  async updateRepository(id: number, data: any) {
    const repo = await this.adminClient.partialUpdate({
      id,
      name: data.name || '',
      PartialUpdateFields: Object.keys(data),
      description: data.description,
      isBare: data.isBare,
      isPublic: data.isPublic,
      organisation: data.organisationId || 0,
      owner: data.owner,
    });

    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
    };
  }

  // Delete a repository
  async deleteRepository(id: number) {
    await this.adminClient.destroy({ id });
    return { success: true };
  }
}

// Export singleton instance
export const gitService = new GitService();
