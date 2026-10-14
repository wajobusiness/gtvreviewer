/**
 * lib/reports.ts
 *
 * Facade providing backward-compatible access to the decoupled Audit Repository.
 * All data access is resolved through IAuditRepository (supporting local filesystem
 * and future cloud/database storage drivers).
 */

export * from "./repository";
