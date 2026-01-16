import {
  MirrorRepositoryControllerClient,
  MirrorRepositoryControllerDefinition,
  MirrorRepositoryCreateMirrorRequest,
  RepositoryCreationControllerClient,
  RepositoryCreationControllerDefinition,
  RepositoryCreationCreateRequest,
  RepositoryCreationMigrateRequest,
  RepositoryCreationMigrateFromExternalRequest,
  TaskStatusControllerClient,
  TaskStatusControllerDefinition,
  TaskStatusGetStatusRequest,
} from '../proto/repositories';
import { channel, clientFactory } from '../utils/grpc';

class UserRepoService {
  private creationClient: RepositoryCreationControllerClient;
  private mirrorClient: MirrorRepositoryControllerClient;
  private statusClient: TaskStatusControllerClient;

  constructor() {
    this.creationClient = clientFactory.create(RepositoryCreationControllerDefinition, channel);
    this.mirrorClient = clientFactory.create(MirrorRepositoryControllerDefinition, channel);
    this.statusClient = clientFactory.create(TaskStatusControllerDefinition, channel);
  }

  async createRepository(payload: RepositoryCreationCreateRequest) {
    return this.creationClient.create(payload);
  }

  async migrateRepository(payload: RepositoryCreationMigrateRequest) {
    return this.creationClient.migrate(payload);
  }

  async migrateFromExternal(payload: RepositoryCreationMigrateFromExternalRequest) {
    return this.creationClient.migrateFromExternal(payload);
  }

  async createMirror(payload: MirrorRepositoryCreateMirrorRequest) {
    return this.mirrorClient.createMirror(payload);
  }

  async getStatus(payload: TaskStatusGetStatusRequest) {
    return this.statusClient.getStatus(payload);
  }
  
}

export const userRepoService = new UserRepoService();
