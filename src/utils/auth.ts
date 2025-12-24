import { Metadata } from 'nice-grpc-common';

// With session authentication, we don't need to manually handle tokens
// The browser automatically sends the session cookie with requests

export function setAccessToken(token: string | null) {
  // No-op
}

export function getAuthMetadata(): Metadata {
  return {};
}

export function createAuthenticatedMetadata(): Metadata {
  return {};
}

