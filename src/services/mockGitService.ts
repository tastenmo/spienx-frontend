// Mock Git Service for development without gRPC backend
// Switch between mock and real service via environment variable

const MOCK_REPOSITORIES = [
  {
    id: 1,
    name: "spienx-hub",
    description: "Backend service for Spienx platform with Git management",
    source_url: "https://github.com/spienx/spienx-hub.git",
    source_type: "github",
    local_path: "/data/repositories/spienx-hub",
    status: "active",
    is_mirror: false,
    is_bare: false,
    default_branch: "main",
    last_synced_at: new Date().toISOString(),
    last_commit_hash: "a1b2c3d4e5f6",
    total_commits: 156,
    is_public: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    organisation_id: 1
  },
  {
    id: 2,
    name: "spienx-frontend",
    description: "React frontend application with Redux and gRPC-Web",
    source_url: "https://github.com/spienx/spienx-frontend.git",
    source_type: "github",
    local_path: "/data/repositories/spienx-frontend",
    status: "active",
    is_mirror: false,
    is_bare: false,
    default_branch: "main",
    last_synced_at: new Date().toISOString(),
    last_commit_hash: "f6e5d4c3b2a1",
    total_commits: 89,
    is_public: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    organisation_id: 1
  },
  {
    id: 3,
    name: "test-repo",
    description: "Test repository for development",
    source_url: "https://gitlab.com/test/test-repo.git",
    source_type: "gitlab",
    local_path: "/data/repositories/test-repo",
    status: "pending",
    is_mirror: true,
    is_bare: true,
    default_branch: "develop",
    last_synced_at: null,
    last_commit_hash: null,
    total_commits: 0,
    is_public: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    organisation_id: 1
  }
];

const MOCK_BRANCHES = {
  1: [
    { name: "main", commit_hash: "a1b2c3d4e5f6", is_default: true, last_updated: new Date().toISOString() },
    { name: "develop", commit_hash: "b2c3d4e5f6a1", is_default: false, last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { name: "feature/grpc-api", commit_hash: "c3d4e5f6a1b2", is_default: false, last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  2: [
    { name: "main", commit_hash: "f6e5d4c3b2a1", is_default: true, last_updated: new Date().toISOString() },
    { name: "feature/redux", commit_hash: "e5d4c3b2a1f6", is_default: false, last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};

const MOCK_COMMITS = {
  1: [
    { commit_hash: "a1b2c3d4e5f6", author_name: "John Doe", author_email: "john@example.com", message: "Add gRPC service implementation", committed_at: new Date().toISOString() },
    { commit_hash: "b2c3d4e5f6a1", author_name: "Jane Smith", author_email: "jane@example.com", message: "Update database models", committed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { commit_hash: "c3d4e5f6a1b2", author_name: "John Doe", author_email: "john@example.com", message: "Fix migration issues", committed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  2: [
    { commit_hash: "f6e5d4c3b2a1", author_name: "Alice Johnson", author_email: "alice@example.com", message: "Implement Redux store", committed_at: new Date().toISOString() },
    { commit_hash: "e5d4c3b2a1f6", author_name: "Bob Wilson", author_email: "bob@example.com", message: "Add repository management pages", committed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};

class MockGitService {
  async listRepositories(params = {}) {
    await this.delay(500);
    return {
      repositories: MOCK_REPOSITORIES,
      totalCount: MOCK_REPOSITORIES.length
    };
  }

  async getRepository(id) {
    await this.delay(300);
    const repository = MOCK_REPOSITORIES.find(r => r.id === id);
    if (!repository) {
      throw new Error(`Repository with id ${id} not found`);
    }
    return { repository, message: "Success" };
  }

  async createRepository(data) {
    await this.delay(500);
    const newRepo = {
      id: Math.max(...MOCK_REPOSITORIES.map(r => r.id)) + 1,
      name: data.name,
      description: data.description,
      source_url: data.sourceUrl,
      source_type: data.sourceType,
      local_path: `/data/repositories/${data.name}`,
      status: "pending",
      is_mirror: false,
      is_bare: false,
      default_branch: "main",
      last_synced_at: null,
      last_commit_hash: null,
      total_commits: 0,
      is_public: data.isPublic,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      organisation_id: data.organisationId
    };
    MOCK_REPOSITORIES.push(newRepo);
    return { repository: newRepo, message: "Repository created successfully" };
  }

  async migrateRepository(repositoryId, sourceUrl, force) {
    await this.delay(1000);
    return {
      repositoryId,
      status: "migrating",
      message: "Migration started",
      taskId: "task_" + Math.random().toString(36).substr(2, 9)
    };
  }

  async syncRepository(repositoryId) {
    await this.delay(1000);
    const repo = MOCK_REPOSITORIES.find(r => r.id === repositoryId);
    if (repo) {
      repo.last_synced_at = new Date().toISOString();
      repo.status = "active";
    }
    return {
      repositoryId,
      status: "synced",
      commitsSynced: Math.floor(Math.random() * 10) + 1,
      message: "Sync completed successfully",
      taskId: "task_" + Math.random().toString(36).substr(2, 9)
    };
  }

  async initRepository(name, organisationId, description) {
    await this.delay(500);
    const newRepo = {
      id: Math.floor(Math.random() * 1000) + 100,
      name,
      description,
      organisation: organisationId,
      local_path: `/data/repos/${organisationId}/${name}`,
      status: 'active',
      is_bare: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_REPOSITORIES.push(newRepo as any);
    return {
      id: newRepo.id,
      localPath: newRepo.local_path
    };
  }

  async deleteRepository(repositoryId, force) {
    await this.delay(500);
    const index = MOCK_REPOSITORIES.findIndex(r => r.id === repositoryId);
    if (index > -1) {
      MOCK_REPOSITORIES.splice(index, 1);
    }
    return {
      success: true,
      message: "Repository deleted successfully"
    };
  }

  async getRepositoryBranches(repositoryId) {
    await this.delay(300);
    const branches = MOCK_BRANCHES[repositoryId] || [];
    return {
      repositoryId,
      branches,
      totalCount: branches.length
    };
  }

  async getRepositoryCommits(params) {
    await this.delay(300);
    const commits = MOCK_COMMITS[params.repositoryId] || [];
    return {
      repositoryId: params.repositoryId,
      commits,
      totalCount: commits.length
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockGitService = new MockGitService();
