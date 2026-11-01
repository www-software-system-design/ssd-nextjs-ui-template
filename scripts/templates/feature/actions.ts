"use server";

// Server Actions for this feature. Export named async functions such as
// createInvoiceAction or updateProfileAction; add only real operations.
// Keep serializable state/types and initial state in model/, outside this module.
// With useActionState, accept (previousState, formData); a plain form action accepts
// (formData). Validate untrusted fields via the feature service, and authenticate
// and authorize protected operations on every invocation. Return expected failures
// as data. Invalidate affected caches after a successful write; redirect last.
// See docs/server-implementation.md for the runnable example and naming contract.
