# Input validation

Accept unknown input, validate types and bounds at runtime, then normalize.
Share one validator between service, direct-call adapter, and the oRPC Standard Schema.
The RPC schema infers a typed input and enforces validation on untyped HTTP callers. Return error codes;
the UI translates them. Do not trust HTML constraints or TypeScript alone.
