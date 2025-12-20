import { createChannel, createClient } from 'nice-grpc-web';
import {
  GitMirrorRepositoryMirroringControllerClient,
  GitMirrorRepositoryMirroringControllerDefinition,
  GitMirrorRepositoryMirroringCreateMirrorRequest,
  GitRepositoryCreationControllerClient,
  GitRepositoryCreationControllerDefinition,
  GitRepositoryCreationCreateRequest,
  GitRepositoryMigrationControllerClient,
  GitRepositoryMigrationControllerDefinition,
  GitRepositoryMigrationMigrateRequest,
  GitRepositoryMigrationMigrateFromExternalRequest,
  TaskStatusControllerClient,
  TaskStatusControllerDefinition,
  TaskStatusGetStatusRequest,
} from '../proto/repositories';

const GRPC_BACKEND_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'http://localhost:8000';

class UserRepoService {
  private creationClient: GitRepositoryCreationControllerClient;
  private migrationClient: GitRepositoryMigrationControllerClient;
  private mirrorClient: GitMirrorRepositoryMirroringControllerClient;
  private statusClient: TaskStatusControllerClient;

  constructor() {
    const channel = createChannel(GRPC_BACKEND_URL);
    this.creationClient = createClient(GitRepositoryCreationControllerDefinition, channel);
    this.migrationClient = createClient(GitRepositoryMigrationControllerDefinition, channel);
    this.mirrorClient = createClient(GitMirrorRepositoryMirroringControllerDefinition, channel);
    this.statusClient = createClient(TaskStatusControllerDefinition, channel);
  }

  async createRepository(payload: GitRepositoryCreationCreateRequest) {
    return this.creationClient.create(payload);
  }

  async migrateRepository(payload: GitRepositoryMigrationMigrateRequest) {
    return this.migrationClient.migrate(payload);
  }

  async migrateFromExternal(payload: GitRepositoryMigrationMigrateFromExternalRequest) {
    return this.migrationClient.migrateFromExternal(payload);
  }

  async createMirror(payload: GitMirrorRepositoryMirroringCreateMirrorRequest) {
    return this.mirrorClient.createMirror(payload);
  }

  async getStatus(payload: TaskStatusGetStatusRequest) {
    return this.statusClient.getStatus(payload);
  }
  
}

export const userRepoService = new UserRepoService();
