// Allowed values for the string columns (SQLite has no enum type).
// Exported both as named constants and as a default object, because different
// modules use each style.
export const ROLES = ['WORKER', 'PROVIDER'];

export const CATEGORIES = ['IT', 'DESIGN', 'MARKETING', 'SALES', 'FINANCE', 'OTHER'];
export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
export const WORK_MODES = ['ONSITE', 'HYBRID', 'REMOTE'];
export const JOB_STATUSES = ['ACTIVE', 'CLOSED'];

export const APPLICATION_STATUSES = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];
export const VERIFICATION_STATUSES = ['NONE', 'PENDING', 'VERIFIED', 'REJECTED'];

export const TOKEN_TYPES = {
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

// How long a one-time email token stays valid
export const VERIFY_EMAIL_TTL_MS = 24 * 60 * 60 * 1000; // 24 h
export const RESET_PASSWORD_TTL_MS = 60 * 60 * 1000; // 1 h

export default {
  ROLES,
  CATEGORIES,
  EMPLOYMENT_TYPES,
  WORK_MODES,
  JOB_STATUSES,
  APPLICATION_STATUSES,
  VERIFICATION_STATUSES,
  TOKEN_TYPES,
  VERIFY_EMAIL_TTL_MS,
  RESET_PASSWORD_TTL_MS,
};
