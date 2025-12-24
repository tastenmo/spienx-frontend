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
import { channel, clientFactory } from '../utils/grpc';

class UserRepoService {
  private creationClient: GitRepositoryCreationControllerClient;
  private migrationClient: GitRepositoryMigrationControllerClient;
  private mirrorClient: GitMirrorRepositoryMirroringControllerClient;
  private statusClient: TaskStatusControllerClient;

  constructor() {
    this.creationClient = clientFactory.create(GitRepositoryCreationControllerDefinition, channel);
    this.migrationClient = clientFactory.create(GitRepositoryMigrationControllerDefinition, channel);
    this.mirrorClient = clientFactory.create(GitMirrorRepositoryMirroringControllerDefinition, channel);
    this.statusClient = clientFactory.create(TaskStatusControllerDefinition, channel);
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
