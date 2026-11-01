# Input validation

Accept unknown input, validate types and bounds at runtime, then normalize.
Share validation between both entry points through the service. Return error codes;
the UI translates them. Do not trust HTML constraints or TypeScript alone.
