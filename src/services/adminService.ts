import {
  GitMirrorRepositoryAdminControllerClient,
  GitMirrorRepositoryAdminControllerDefinition,
  GitMirrorRepositoryPartialUpdateRequest,
  GitMirrorRepositoryRequest,
  GitRepositoryAdminControllerClient,
  GitRepositoryAdminControllerDefinition,
  GitRepositoryPartialUpdateRequest,
  GitRepositoryRequest,
} from '../proto/repositories';
import { channel, clientFactory } from '../utils/grpc';

class AdminService {
  private repoAdminClient: GitRepositoryAdminControllerClient;
  private mirrorAdminClient: GitMirrorRepositoryAdminControllerClient;

  constructor() {
    this.repoAdminClient = clientFactory.create(GitRepositoryAdminControllerDefinition, channel);
    this.mirrorAdminClient = clientFactory.create(GitMirrorRepositoryAdminControllerDefinition, channel);
  }

  async createRepository(payload: Omit<GitRepositoryRequest, 'id'>) {
    return this.repoAdminClient.create(payload);
  }

  async updateRepository(payload: GitRepositoryPartialUpdateRequest) {
    return this.repoAdminClient.partialUpdate(payload);
  }

  async listRepositories() {
    return this.repoAdminClient.list({});
  }

  async getRepository(id: number) {
    return this.repoAdminClient.retrieve({ id });
  }

  async deleteRepository(id: number) {
    await this.repoAdminClient.destroy({ id });
  }

  async createMirror(payload: Omit<GitMirrorRepositoryRequest, 'id'>) {
    return this.mirrorAdminClient.create(payload);
  }

  async updateMirror(payload: GitMirrorRepositoryPartialUpdateRequest) {
    return this.mirrorAdminClient.partialUpdate(payload);
  }

  async listMirrors() {
    return this.mirrorAdminClient.list({});
  }

  async getMirror(id: number) {
    return this.mirrorAdminClient.retrieve({ id });
  }

  async deleteMirror(id: number) {
    await this.mirrorAdminClient.destroy({ id });
  }
}

export const adminService = new AdminService();
