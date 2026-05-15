import { createChannel, createClientFactory, FetchTransport, Metadata } from 'nice-grpc-web';

const GRPC_BACKEND_URL = import.meta.env.VITE_GRPC_BACKEND_URL || 'https://hub.tastenmo.de';

export const channel = createChannel(GRPC_BACKEND_URL, FetchTransport({
  credentials: 'include'
}));

export const clientFactory = createClientFactory().use(async function* middleware(call, options) {
  const metadata = new Metadata(options.metadata || {});

  return yield* call.next(call.request, {
    ...options,
    metadata,
  });
});
