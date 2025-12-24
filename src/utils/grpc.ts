import { createChannel, createClientFactory, FetchTransport, Metadata } from 'nice-grpc-web';
import { getCookie } from './csrf';

const GRPC_BACKEND_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'https://hub.tastenmo.de';

export const channel = createChannel(GRPC_BACKEND_URL, FetchTransport({
  credentials: 'include'
}));

export const clientFactory = createClientFactory().use(async function* middleware(call, options) {
  const csrfToken = getCookie('csrftoken');
  const metadata = new Metadata(options.metadata || {});
  if (csrfToken) {
    metadata.set('x-csrftoken', csrfToken);
  }
  
  return yield* call.next(call.request, {
    ...options,
    metadata,
  });
});
