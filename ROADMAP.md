# Recruitment & Credentialing Platform — Roadmap

Status tracker for OBHSA's move from a single-page job-application form to a staged recruitment → verification → credentialing → activation platform, modeled on IntelyCare's real application flow (see `artifacts/`). Each phase gets its own design pass before implementation starts on it; this file is updated as phases move between states.

**Legend:** ✅ Done · 🚧 In progress · ⏳ Not started

---

### 1. Data-model foundation — ✅ Done (2026-10-02)

Candidate/Application split, a 16-state application lifecycle with an immutable audit trail, structured Credentials/Documents/EmploymentHistory/Education. The existing single-page apply form and admin review screen were rewired onto the new schema so the app stayed fully functional throughout — no wizard required for the new model to go live.

**Delivered:**

- Models: `Candidate`, `Application`, `ApplicationStageHistory`, `ApplicationRequirement`, `Credential`, `Document`, `EmploymentHistory`, `Education`
- `Application::transitionTo()` + `ApplicationStateMachine` — the only way an application's status can change, validated against an explicit allow-list, every change audited in `application_stage_history`
- `JobApplicationIntakeService` — compatibility layer so the legacy single-page form keeps working unchanged from a candidate's perspective
- `job_applications` table dropped; `App\Models\JobApplication` removed
- 52 passing Pest tests (3 new, covering legal/illegal transitions and audit history)
- Real bug found & fixed: `Application::create()` left `status` unset in memory (Eloquent doesn't refetch DB column defaults after insert), which PHP 8.5 silently coerced to `0` when passed to the backed enum — fixed with an in-memory attribute default matching the migration

### 2. Public multi-step application wizard — ✅ Done (2026-10-02)

Replaced the single-page form with a staged flow (contact → location/eligibility check → work preferences → employment/education → credentials/documents → consent → review → submit), plus draft save/resume via an emailed magic link. The legacy single-page form (`/jobs/{listing}/apply`) is left in place but unused by the frontend.

**Delivered:**

- `ApplyController` + `routes/apply.php` — 8-step public wizard (`/apply`), gated by a `wizard.application_id` session key set at step 1
- Resume-link mechanics: `Application::issueResumeToken()` stores only a SHA-256 hash (never the plaintext) with a 14-day expiry; `/apply/resume/{token}` verifies the candidate's email and restores the wizard at their first incomplete step; expired/invalid tokens get distinct, non-leaking responses; `/apply/resend` issues a fresh link
- `EligibilityService` — admin-configurable state allow-list (`service_area_states` Site Setting, reusing the existing `general` group so it needed no admin UI changes); a failed check hard-stops the application into the terminal `Ineligible` status
- Fixed a real gap in Phase 1's state machine: `started → ineligible` wasn't a legal transition, which the wizard's eligibility hard-stop needs
- `App\Support\CaregiverSpecialties`, new `applications` columns for preferences/consent (`primary_specialty`, `work_settings`, `consent_accepted_at`, etc.)
- Same-email restarts reuse the candidate's open draft instead of creating duplicates; a job listing's "Apply" button now carries straight into the wizard with that listing pre-associated
- 7 new Pest tests covering the full happy path, the eligibility hard-stop, duplicate-draft reuse, job-listing pre-association, and all three resume-link outcomes (valid/expired/invalid)

### 3. Recruiter processing pipeline — ✅ Done (2026-10-02)

Gave staff a workable queue and a single place to review a candidate, including past applications (re-applications are possible since Phase 1/2). The admin-side pipeline was previously a flat per-application table; this phase replaces the per-application show page with a candidate-centric dossier and finally wires up `assigned_recruiter_id` and `is_blocking`, both reserved but unused since Phase 1.

**Delivered:**

- `Admin\CandidateController::show` — a new candidate-centric dossier (`/admin/candidates/{candidate}`) aggregating every application a candidate has made plus their credentials, documents, employment history, and education; replaces the old per-application `admin/job-applications/show` page entirely
- Recruiter assignment (`Admin\JobApplicationController::assignRecruiter`) and a "what's blocking this candidate" callout surfaced from the existing `is_blocking` requirement flag — both previously-reserved, unused columns from Phase 1
- Structured review decisions: `reason_code` (a small curated list, `App\Support\ReviewReasonCodes`) now recorded alongside the existing free-text reason on every status change
- Admin-editable communication templates (`CommunicationTemplate` + a new "Message Templates" admin screen) with `{{candidate_name}}`/`{{position}}` placeholders; recruiters pick one from the dossier, edit it, and send a real email (`CandidateMessage`), logged to `application_communications`
- The applications index gained stage quick-filters with live counts, a "Days in Stage" column, and a "Recruiter" column; its status filter dropdown — previously hardcoded to a stale, incomplete subset of statuses — now lists every `ApplicationStatus` case
- 6 new Pest tests covering the dossier, recruiter assign/unassign, templated message sending + logging, and the structured reason code

### 4. Interview workflow — ✅ Done (2026-10-02)

Gave the `interview` application status (reserved since Phase 1's state machine) real behavior: recruiters schedule interviews from the candidate dossier, interviewers score a snapshotted question bank and leave an overall recommendation, and a new cross-candidate list shows every interview, past and upcoming.

**Delivered:**

- `Interview` + `InterviewQuestionResponse` models — scheduling an interview snapshots the active question bank matching the candidate's specialty (general questions always included) into per-interview response rows, so later edits to the question bank never retroactively change a past interview's record
- `InterviewQuestion` admin-managed question bank, scoped by `CaregiverSpecialties` (or general), with a new "Interview Questions" admin screen
- A new "Interviews" admin screen (`/admin/interviews`) listing every interview across all candidates, filterable by interviewer and status — plus each interview's own scoring workspace (`/admin/interviews/{interview}`) for recording per-question scores, an overall recommendation (Recommend / Maybe / Do Not Recommend), and marking it completed/cancelled/no-show
- `ApplicationPanel` (the dossier's per-application card) gained a "Schedule Interview" mini-form and a compact interview list with status/recommendation badges
- Scheduling an interview does not auto-transition the application's status — recruiters still move `credentialing → interview` themselves via the existing status form, consistent with every other stage
- 4 new Pest tests covering specialty-scoped question snapshotting, scoring + completing an interview, the interviews list filters, and editor access being forbidden

### 5. Credential verification & reference checking — ⏳ Not started

Admin verification actions on `credentials`, reference-check workflow.

### 6. Background screening — ⏳ Not started

Status-tracking subsystem now exists on `application_requirements`; a real provider integration needs a vendor chosen first.

### 7. Competency assessments — ⏳ Not started

Assessment definitions, attempts, scoring, pass/retry.

### 8. Offer → Onboarding → Activation — ⏳ Not started

Offer generation/acceptance, a checklist-driven onboarding engine, a deterministic activation-eligibility check, and Employee record creation.

### 9. Continuous compliance — ⏳ Not started

Staged credential-expiry warnings and notifications once people are active.

### 10. Facility / Shift / deployment matching — ⏳ Not started

A genuinely new domain — OBHSA doesn't model client facilities or shifts at all today.

### 11. AI copilot — ⏳ Not started

Tool-calling orchestrator, permission-inherited actions, a RAG layer over policy docs, a confirmation-level policy for high-impact actions, and a full audit log. Needs an LLM provider/budget and a vector-DB decision before it can be scoped concretely.
