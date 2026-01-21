# Spienx Frontend — Copilot Guardrails

## Tooling & Stack
- React 18 + TypeScript via Vite. Keep JSX/TSX idiomatic; prefer function components and hooks.
- State: Redux Toolkit (`react-redux`), keep slices colocated in `src/store` and thunks for async calls.
- Styling: SCSS in `design-system`/`src`; reuse existing variables/mixins. Avoid inline styles unless trivial.
- Lint/format: run `npm run lint`; do not introduce conflicting style choices.

## API & gRPC
- Backend comms are gRPC-Web only. Use the generated TypeScript clients in `src/proto` with `nice-grpc-web`.
- Never hand-edit generated proto/client files. Regenerate instead.
- Generate clients with `npm run generate:proto` (wraps `./generate-proto.sh`); requires `protoc` + `protoc-gen-grpc-web` + `ts-proto` (already in deps).
- Backend proto sources live in `../spienx-hub/src/repositories/grpc` and `../spienx-hub/src/documents/grpc`; edit those protos in the backend repo and regenerate.
- Configure backend URL via `VITE_GRPC_BACKEND_URL` in `.env` (e.g., `http://localhost:8080`).

## Implementation Preferences
- Use the generated service definitions/messages instead of crafting manual request objects.
- Keep API adapters thin; isolate transport in `src/services` and surface typed helpers to components.
- Avoid adding new dependencies without confirmation; if needed, use `npm install <pkg>` and ensure build works with Vite.

## Testing & Commands
- Dev server: `npm run dev`.
- Build: `npm run build`; Preview: `npm run preview`.
- Proto generation: `npm run generate:proto`.
- Lint: `npm run lint`.

## Generated Files
- Do not edit files under `src/proto`; they are generated. Regenerate after backend proto changes.
