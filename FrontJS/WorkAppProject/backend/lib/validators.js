import C from './constants.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const optStr = (v, max = 2000) => {
  const s = str(v);
  return s ? s.slice(0, max) : null;
};
const num = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

/* ------------------------------- auth ----------------------------------- */

function validateRegister(body = {}) {
  const errors = [];
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const role = str(body.role).toUpperCase() || 'WORKER';
  const companyName = optStr(body.companyName, 120);

  if (name.length < 2) errors.push('Name must be at least 2 characters');
  if (name.length > 80) errors.push('Name must be under 80 characters');
  if (!EMAIL_RE.test(email)) errors.push('Enter a valid email address');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (password.length > 128) errors.push('Password is too long');
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    errors.push('Password must contain at least one letter and one digit');
  // Whitelisted: without this a client could register itself with any role.
  if (!C.ROLES.includes(role)) errors.push(`Role must be one of: ${C.ROLES.join(', ')}`);
  if (role === 'PROVIDER' && !companyName) errors.push('Company name is required for employers');

  return { errors, data: { name, email, password, role, companyName } };
}

function validateLogin(body = {}) {
  const errors = [];
  const email = str(body.email).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  return { errors, data: { email, password } };
}

function validatePassword(password, field = 'Password') {
  const errors = [];
  if (typeof password !== 'string' || password.length < 8)
    errors.push(`${field} must be at least 8 characters`);
  else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
    errors.push(`${field} must contain at least one letter and one digit`);
  return errors;
}

/* ------------------------------- jobs ----------------------------------- */

function validateJob(body = {}) {
  const errors = [];

  const title = str(body.title);
  const description = str(body.description);
  const category = (str(body.category) || 'IT').toUpperCase();
  const location = str(body.location) || 'Yerevan';
  const employmentType = (str(body.employmentType) || 'FULL_TIME').toUpperCase();
  const workMode = (str(body.workMode) || 'ONSITE').toUpperCase();
  const currency = (str(body.currency) || 'USD').toUpperCase();
  const status = (str(body.status) || 'ACTIVE').toUpperCase();

  const experienceMin = num(body.experienceMin) ?? 0;
  const experienceMax = num(body.experienceMax);
  const salaryMin = num(body.salaryMin);
  const salaryMax = num(body.salaryMax);

  const skills = Array.isArray(body.skills)
    ? body.skills.map((s) => str(s)).filter(Boolean).slice(0, 20).join(',')
    : str(body.skills)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20)
        .join(',');

  if (title.length < 3) errors.push('Title must be at least 3 characters');
  if (title.length > 120) errors.push('Title must be under 120 characters');
  if (description.length < 20) errors.push('Description must be at least 20 characters');
  if (description.length > 8000) errors.push('Description is too long');
  if (!C.CATEGORIES.includes(category)) errors.push(`Category must be one of: ${C.CATEGORIES.join(', ')}`);
  if (!C.EMPLOYMENT_TYPES.includes(employmentType)) errors.push('Invalid employment type');
  if (!C.WORK_MODES.includes(workMode)) errors.push('Invalid work mode');
  if (!C.JOB_STATUSES.includes(status)) errors.push('Invalid job status');

  if (Number.isNaN(experienceMin) || experienceMin < 0 || experienceMin > 50)
    errors.push('Minimum experience must be between 0 and 50');
  if (experienceMax !== null && (Number.isNaN(experienceMax) || experienceMax < 0 || experienceMax > 50))
    errors.push('Maximum experience must be between 0 and 50');
  if (experienceMax !== null && !Number.isNaN(experienceMax) && experienceMax < experienceMin)
    errors.push('Maximum experience cannot be lower than the minimum');

  // Number('') is 0, Number(undefined) is NaN - both handled by num().
  if (salaryMin !== null && (Number.isNaN(salaryMin) || salaryMin <= 0))
    errors.push('Minimum salary must be a positive number');
  if (salaryMax !== null && (Number.isNaN(salaryMax) || salaryMax <= 0))
    errors.push('Maximum salary must be a positive number');
  if (
    salaryMin !== null && salaryMax !== null &&
    !Number.isNaN(salaryMin) && !Number.isNaN(salaryMax) && salaryMax < salaryMin
  )
    errors.push('Maximum salary cannot be lower than the minimum');
  if (salaryMin === null && salaryMax === null) errors.push('Enter at least one salary value');

  return {
    errors,
    data: {
      title, description, category, location, employmentType, workMode, currency, status,
      experienceMin: Number.isNaN(experienceMin) ? 0 : experienceMin,
      experienceMax: experienceMax === null || Number.isNaN(experienceMax) ? null : experienceMax,
      salaryMin: salaryMin === null || Number.isNaN(salaryMin) ? null : salaryMin,
      salaryMax: salaryMax === null || Number.isNaN(salaryMax) ? null : salaryMax,
      skills,
    },
  };
}

/* ---------------------------- applications ------------------------------ */

function validateApplication(body = {}) {
  const errors = [];
  const coverLetter = str(body.coverLetter);
  if (coverLetter.length > 4000) errors.push('Cover letter is too long (max 4000 characters)');
  return { errors, data: { coverLetter } };
}

function validateApplicationStatus(body = {}) {
  const errors = [];
  const status = str(body.status).toUpperCase();
  if (!C.APPLICATION_STATUSES.includes(status))
    errors.push(`Status must be one of: ${C.APPLICATION_STATUSES.join(', ')}`);
  return { errors, data: { status } };
}

/* ------------------------------ profile --------------------------------- */

function validateProfile(body = {}, role) {
  const errors = [];
  const name = str(body.name);
  if (name && (name.length < 2 || name.length > 80)) errors.push('Name must be 2-80 characters');

  const companyWebsite = optStr(body.companyWebsite, 200);
  if (companyWebsite && !URL_RE.test(companyWebsite))
    errors.push('Company website must start with http:// or https://');

  const data = {
    phone: optStr(body.phone, 30),
    location: optStr(body.location, 80),
    headline: optStr(body.headline, 140),
    bio: optStr(body.bio, 2000),
  };
  if (name) data.name = name;

  if (role === 'WORKER') {
    data.skills = Array.isArray(body.skills)
      ? body.skills.map((s) => str(s)).filter(Boolean).slice(0, 30).join(',')
      : str(body.skills).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 30).join(',');
  } else {
    data.companyName = optStr(body.companyName, 120);
    data.companyWebsite = companyWebsite;
    data.companySize = optStr(body.companySize, 40);
    data.companyAbout = optStr(body.companyAbout, 3000);
  }

  return { errors, data };
}

/* --------------------------- verification ------------------------------- */

function validateVerificationRequest(body = {}) {
  const errors = [];
  const companyName = str(body.companyName);
  const taxId = optStr(body.taxId, 40);

  if (companyName.length < 2) errors.push('Company name is required');
  if (companyName.length > 120) errors.push('Company name is too long');

  return { errors, data: { companyName, taxId } };
}

function validateMessage(body = {}) {
  const errors = [];
  const text = typeof body.body === 'string' ? body.body.trim() : '';

  if (text.length > 4000) errors.push('Message is too long (max 4000 characters)');

  return { errors, data: { body: text } };
}

export {
  validateMessage,
  validateRegister,
  validateLogin,
  validatePassword,
  validateJob,
  validateApplication,
  validateApplicationStatus,
  validateProfile,
  validateVerificationRequest,
};
