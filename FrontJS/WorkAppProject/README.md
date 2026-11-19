# Workx.am Clone

A working two-role job board, not a mockup: real accounts in a database,
hashed passwords, JWT sessions that survive a reload, email confirmation,
employer verification, applications, favourites and file uploads.

```
WorkAppProject/
├── backend/     Express 5 + Prisma 7 + SQLite   ->  http://localhost:5001
└── frontend/    React 19 + Vite + Zustand       ->  http://localhost:5173
```

---

## 1. Requirements

* **Node.js 20.19+** (22 LTS recommended) — Vite 8 and Prisma 7 need it
* npm
* Internet access on first install (Prisma downloads its engine)

```bash
node -v    
```

---

## 2. Run it

Two terminals.

### Terminal 1 — backend

```bash
cd backend
cp .env.example .env     # required: without JWT_SECRET the server refuses to start
npm install              # also runs `prisma generate`
npm run setup            # creates dev.db from the schema, then seeds demo data
npm run dev              # http://localhost:5001
```

### Terminal 2 — frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

Open <http://localhost:5173>.

### Demo accounts

Password for all of them: **`Password123`**

| Email                | Role     | State                                        |
| -------------------- | -------- | -------------------------------------------- |
| `worker@test.com`    | Worker   | email confirmed, can apply                   |
| `provider@test.com`  | Employer | verified company — can publish jobs          |
| `pending@test.com`   | Employer | **not** verified — shows the publishing gate |
| `admin@workx.local`  | Admin    | reviews company verification requests        |

---

## 3. Email without an SMTP server

`MAIL_TRANSPORT=console` (the default) never opens a network connection.
Every message is printed in the backend terminal, and the confirmation / reset
link is also returned in the API response as `devLink`, so you can click
straight through the flow:

```
──────── EMAIL (console transport) ────────
To:      worker@test.com
Subject: Confirm your email - Workx Clone
Confirm your email address by opening this link (valid for 24 hours):
http://localhost:5173/verify-email?token=8f3c...
───────────────────────────────────────────
```

For real delivery set `MAIL_TRANSPORT=smtp` and fill in the `SMTP_*` values.

---

## 4. What the roles can do

### Chat
* One thread per (job, candidate) pair. A job seeker can open it only after
  applying; an employer only with someone who applied to their own job.
  Everyone else gets a 403 — including other employers.
* Real Unicode emoji via a built-in picker (categories, search, recently used),
  stored as ordinary UTF-8 text. Flags, skin tones and ZWJ sequences
  (👨‍👩‍👧‍👦) round-trip unchanged.
* File attachments up to 5 MB: images preview inline, everything else becomes
  a download row with the original name and size. Allowed: png, jpg, webp, gif,
  pdf, txt, doc(x), xls(x), zip. Executables are rejected.
* Unread badges in the navbar and in the thread list; opening a thread marks
  the other side's messages read. New messages arrive by polling every 4 s —
  no WebSocket server to run.
* Entry points: **Message employer** on *My applications*, **Message** next to
  each applicant on an employer's applicants page.

### Job seeker
* Register → confirm email → upload a CV
* Search jobs by keyword, category, location, work mode, employment type, salary; sort and paginate
* Open a job, apply with a cover letter (the CV is attached and snapshotted)
* Save jobs to favourites
* Track every application and its status; withdraw one
* Edit the profile, upload an avatar, change the password, read an activity log

### Employer
* Register with a company name → confirm email → **submit company documents**
* Publish jobs **only** once the email is confirmed *and* the company is verified
* Create, edit, close/reopen and delete listings
* See applicants per job or across all jobs, read cover letters, open CVs
* Move an application through Pending → Reviewed → Accepted / Declined (the candidate is notified)

### Admin (`ADMIN_EMAIL` in `.env`)
* `GET /api/verification/requests?status=PENDING`
* `POST /api/verification/:id/review` with `{ "status": "VERIFIED" }` or `{ "status": "REJECTED", "note": "…" }`

Set `VERIFICATION_MODE=auto` in `.env` to approve submissions instantly — handy for a demo.

---

## 5. Ports

| Part                  | Port   | Set in                                             |
| --------------------- | ------ | -------------------------------------------------- |
| Frontend (Vite)       | `5173` | `frontend/vite.config.js` + the npm script         |
| Backend (Express)     | `5001` | `backend/.env` → `PORT`, read by `config/env.js`   |

The frontend calls `/api/*` and `/uploads/*`; Vite proxies both to
`http://localhost:5001`. The backend's CORS whitelist allows only
`http://localhost:5173`, so both ports are pinned with `strictPort: true` —
otherwise Vite quietly moves to 5174 and every request starts failing CORS.

---

## 6. API

### Auth
| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Create an account (rate limited) |
| `POST` | `/api/auth/login` | — | Sign in (rate limited) |
| `GET` | `/api/auth/me` | Bearer | Validate the token, return the fresh user |
| `POST` | `/api/auth/logout` | Bearer | Audit the sign-out |
| `POST` | `/api/auth/verify-email` | — | Confirm the address with a token |
| `POST` | `/api/auth/resend-verification` | Bearer | New confirmation email |
| `POST` | `/api/auth/forgot-password` | — | Send a reset link |
| `POST` | `/api/auth/reset-password` | — | Set a new password with a token |
| `POST` | `/api/auth/change-password` | Bearer | Change it while signed in |

### Jobs
| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/jobs` | optional | Public board. `?search= &category= &location= &workMode= &employmentType= &minSalary= &maxSalary= &sort= &page= &limit=` |
| `GET` | `/api/jobs/meta` | — | Values for the filter dropdowns |
| `GET` | `/api/jobs/:id` | optional | Details (+ `isFavorite`, `hasApplied`) |
| `GET` | `/api/jobs/mine` | Employer | Only the caller's listings |
| `POST` | `/api/jobs` | Employer + email + company verified | Publish |
| `PATCH` | `/api/jobs/:id` | Employer, owner | Edit / close |
| `DELETE` | `/api/jobs/:id` | Employer, owner | Delete |

### Applications · Favourites · Profile · Verification
| Method | Route | Auth |
| --- | --- | --- |
| `POST` | `/api/applications/jobs/:jobId` | Worker + confirmed email + CV on file |
| `GET` | `/api/applications/mine` | Worker |
| `DELETE` | `/api/applications/:id` | Worker, owner |
| `GET` | `/api/applications/received` | Employer |
| `GET` | `/api/applications/jobs/:jobId` | Employer, job owner |
| `PATCH` | `/api/applications/:id/status` | Employer, job owner |
| `GET`/`POST`/`DELETE` | `/api/favorites`, `/api/favorites/:jobId[/toggle]` | Worker |
| `GET`/`PATCH` | `/api/profile` | Bearer |
| `POST` | `/api/profile/avatar`, `/api/profile/cv` | Bearer (multipart) |
| `GET` | `/api/profile/public/:id` | — |
| `GET`/`POST` | `/api/profile/notifications[/:id/read]` | Bearer |
| `GET`/`POST` | `/api/verification/status`, `/api/verification` | Employer |
| `GET`/`POST` | `/api/verification/requests`, `/api/verification/:id/review` | Admin |

### Chat
| Method | Route | Auth |
| --- | --- | --- |
| `GET` | `/api/chat/conversations` | Bearer |
| `GET` | `/api/chat/unread-count` | Bearer |
| `POST` | `/api/chat/conversations/job/:jobId` | Bearer + confirmed email (worker must have applied; employer must own the job and pass `workerId`) |
| `GET` | `/api/chat/conversations/:id` | Participant only |
| `GET` | `/api/chat/conversations/:id/messages` | Participant only. `?after=<id>` returns just the newer ones |
| `POST` | `/api/chat/conversations/:id/messages` | Participant only. JSON `{ body }` or multipart with `file` |
| `POST` | `/api/chat/conversations/:id/read` | Participant only |

---

## 7. How the security rules work

* Passwords are hashed with **bcrypt, 12 rounds**; a hash is never serialised to the client (`lib/serialize.js` is the only place that shapes a user).
* `role` is whitelisted at registration, so a client cannot POST `role: "ADMIN"` and receive a token for it.
* `requireAuth` re-reads the user from the database on every request. A role change, a deleted account or a fresh verification status takes effect immediately instead of living inside a week-old JWT — and a tampered `localStorage` snapshot cannot fake a status.
* Login answers the same `401 Invalid email or password` for an unknown address and a wrong password, and `forgot-password` always answers `200`, so neither endpoint reveals who has an account.
* Email tokens are single-use, expire (24 h / 1 h) and invalidate the previous unused token of the same type.
* Every write checks **ownership**, not just the role: one employer cannot edit, delete, read the applicants of, or change the application status on another employer's job.
* Uploads are renamed server-side (the client filename is never trusted), restricted by MIME **and** extension, size-capped, and served with `X-Content-Type-Options: nosniff` and a locked-down CSP.
* `/api/auth/login` and `/register` are rate limited (20 attempts / 15 min per IP).
* CORS is a whitelist, not `cors()` with no options.

---

## 8. Project layout

```
backend/
├── config/env.js            validates .env at startup, exits with a clear message
├── lib/
│   ├── prisma.js            one shared PrismaClient
│   ├── validators.js        every request body is validated here
│   ├── serialize.js         the only place that shapes API output
│   ├── tokens.js            single-use email tokens
│   ├── mailer.js            console or SMTP transport
│   ├── notify.js            in-app notifications
│   ├── activity.js          audit log
│   └── constants.js         allowed enum values
├── middleware/
│   ├── auth.js              requireAuth, optionalAuth, requireRole,
│   │                        requireVerifiedEmail, requireVerifiedCompany, requireAdmin
│   ├── upload.js            multer: avatars, CVs, company documents
│   ├── rateLimit.js         in-memory limiter, no extra dependency
│   └── errorHandler.js      404, central errors, asyncHandler
├── controllers/             auth · job · application · favorite · profile · verification
├── routes/
├── prisma/schema.prisma     10 models
├── seed.js
└── server.js

frontend/src/
├── api/axios.js             token header, 401 handling, error normalisation
├── store/                   authStore · jobStore · notificationStore · uiStore (toasts)
├── components/              Navbar · AppLayout · ProtectedRoute · ErrorBoundary
│                            JobCard · Toaster · Modal · Pagination · EmptyState
│                            Spinner · Avatar · Badge · FileField · NotificationBell
│                            ChatWindow · EmojiPicker
├── pages/                   Login · Register · VerifyEmail · ForgotPassword · ResetPassword
│                            Jobs · JobDetails · MyApplications · Favorites · Profile
│                            ProviderJobs · JobForm · JobApplicants · Verification
│                            CompanyProfile · Messages · NotFound
└── styles/                  tokens.css · ui.css · pages.css
```

---

## 9. Design

The palette comes from workx.am itself: brand purple `#863bff` / `#7e14ff` and
lavender `#ede6ff` are the fills in the site's own favicon, `#47bfff` is its
accent, and `#111827` is its `<meta name="theme-color">`. Everything lives in
CSS custom properties in `src/styles/tokens.css`, so re-theming the whole app
means editing one block.

Every list has a loading state (skeletons), an empty state and an error state
with a retry button. Success and failure are reported through toasts, never
`window.alert`. The layout is responsive down to 360 px.

---

## 10. Scripts

**backend** — `start`, `dev` (watch), `seed`, `setup`, `db:push`, `db:migrate`, `db:generate`, `db:studio`
**frontend** — `dev`, `build`, `preview`, `lint`

---

## 11. Notes

* **The backend is ESM** (`"type": "module"` in `backend/package.json`), because
  Prisma 7's `prisma-client` generator emits ESM. The generator block in
  `schema.prisma` must stay in step with it:

  ```prisma
  generator client {
    provider               = "prisma-client"
    output                 = "../generated/prisma"
    moduleFormat           = "esm"
    generatedFileExtension = "js"
    importFileExtension    = "js"
  }
  ```

  `generatedFileExtension` matters: the default is `ts`, and plain `node`
  cannot load a `.ts` file — you would get
  `Cannot find module '../generated/prisma/client'`. If you ever switch the
  backend back to CommonJS, you also have to rewrite every `import` as
  `require`, because `moduleFormat = "cjs"` alone does not make the generated
  client CommonJS.
* `npm run setup` uses `prisma db push`, which creates the database straight
  from `schema.prisma`. If you prefer versioned migration files, run
  `npm run db:migrate` instead — it generates them from the same schema.
* `npm install` in `backend/` needs to reach `binaries.prisma.sh` for the
  Prisma engine. On a restricted network, set
  `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` or pre-seed the engine cache.
* `react/set-state-in-effect` is switched off in `frontend/.oxlintrc.json`.
  It fires on any fetch-on-mount loader (`setLoading(false)` after `await` is
  unavoidable there) and the three warnings it produced were false positives.
