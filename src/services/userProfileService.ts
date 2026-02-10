import {
  CurrentUserControllerClient,
  CurrentUserControllerDefinition,
  CurrentUserProfileControllerClient,
  CurrentUserProfileControllerDefinition,
  CurrentUserUpdateCurrentUserRequest,
  CurrentUserProfileUpdateCurrentUserProfileRequest,
} from '../proto/accounts';
import { channel, clientFactory } from '../utils/grpc';

class UserProfileService {
  private userClient: CurrentUserControllerClient;
  private profileClient: CurrentUserProfileControllerClient;

  constructor() {
    this.userClient = clientFactory.create(CurrentUserControllerDefinition, channel);
    this.profileClient = clientFactory.create(CurrentUserProfileControllerDefinition, channel);
  }

  /**
   * Get the current authenticated user's information
   */
  async getCurrentUser() {
    return this.userClient.getCurrentUser({});
  }

  /**
   * Update the current authenticated user's information
   */
  async updateCurrentUser(payload: CurrentUserUpdateCurrentUserRequest) {
    return this.userClient.updateCurrentUser(payload);
  }

  /**
   * Get the current authenticated user's profile
   */
  async getCurrentUserProfile() {
    return this.profileClient.getCurrentUserProfile({});
  }

  /**
   * Update the current authenticated user's profile
   */
  async updateCurrentUserProfile(payload: CurrentUserProfileUpdateCurrentUserProfileRequest) {
    return this.profileClient.updateCurrentUserProfile(payload);
  }
}

export const userProfileService = new UserProfileService();
