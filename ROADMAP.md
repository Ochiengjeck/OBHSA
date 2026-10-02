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

### 5. Credential verification & reference checking — ✅ Done (2026-10-02)

Wired up `Credential::verify()`/`reject()` and `ApplicationRequirement::markComplete()`/`markFailed()` — all four built in Phase 1, none ever called until now.

**Delivered:**

- Verify/Reject actions on the dossier's Credentials card auto-resolve the matching `license_verification`/`certification_verification` requirement (setting the previously-unused `related_credential_id` link) on every one of the candidate's applications where it's still unresolved — a past, already-decided application's requirement is never rewritten
- Reference checks (`ReferenceCheck` model) log against a candidate's existing employment-history entries, reusing the `supervisor_name`/`supervisor_contact` the Phase 2 wizard already collects — no new data asked of candidates. Outcome is Positive / Negative / Unable to Reach; append-only, same spirit as `ApplicationCommunication`
- A generic Pass/Fail override on any `not_started` requirement in `ApplicationPanel`, resolving `employment_history_verification`/`education_verification` — the two requirement types Phase 2 seeds but nothing else can ever complete
- 5 new Pest tests covering requirement auto-resolution (and that it skips already-decided applications), rejection notes, reference-check logging, the manual override, and editor access being forbidden
- Real bug found & fixed while writing the migration: `reference_checks.employment_history_id`'s `constrained()` guessed the table name `employment_histories`, but Phase 1's table is singular `employment_history` — fixed by passing the table name explicitly

### 6. Background screening — ✅ Done (2026-10-02)

No background-check vendor has been chosen for this project and no API credentials exist, so — confirmed with the user — this phase builds manual tracking, not a real provider integration: a recruiter records that a check was initiated with whichever provider they actually used (typed freeform) and later records the result. The shape (`initiate` → external process → `record result`) mirrors a real integration closely enough that swapping in a vendor's API later is a follow-up, not a rewrite.

**Delivered:**

- `BackgroundCheck` model — a per-application log (a candidate can be re-checked), `recordResult()`/`cancel()` mirroring `Interview`'s outcome-mutation pattern
- A new "Background Check" section in `ApplicationPanel`: "Initiate Background Check" (provider, freeform) and, once initiated, "Record Result" (Clear / Consider / Flagged / Cancelled)
- Recording a `clear` result passes the application's `background_check` requirement; `consider`/`flagged` fails it — same unresolved-only guard as Phase 5's credential-driven resolution, so a past decided application is never rewritten
- `ApplyController::submit()` now seeds a `background_check` requirement on every submission (consent for it is always collected at wizard step 7, unlike the conditional requirements seeded from what the candidate actually provided)
- 5 new Pest tests; updated one pre-existing Phase 2 wizard test whose requirement-count assertion needed to account for the new requirement

### 7. Competency assessments — ✅ Done (2026-10-02)

Gives the `assessment` application status (reserved since Phase 1) real behavior. Unlike Phases 3–6, the user explicitly asked for both delivery modes (candidates can take an assessment themselves online, or staff can administer/record one directly) and per-question structured scoring rather than a single typed-in number — the largest phase since Phase 2, since it adds a real (deliberately simple — no timers, no randomization) candidate-facing test-taking flow alongside the admin side.

**Delivered:**

- `Assessment` (definitions, each owning its own question bank via `AssessmentQuestion` — multiple-choice, auto-graded, or short-answer, staff-graded) + `AssessmentAttempt`/`AssessmentResponse`, with a new "Assessments" and "Assessment Questions" admin area
- Both delivery modes share one data model and one admin review screen (`/admin/assessment-attempts/{attempt}`) — they differ only in how a response row gets filled in: a candidate self-submits online, or staff types it in directly. A `pending` attempt is fully editable (entry mode); a `submitted` self-service attempt shows its multiple-choice answers read-only with correctness and only exposes an editable points field for short-answer questions; `completed`/`cancelled` is read-only
- A real (if simple) candidate-facing flow: `AssessmentTakingController` + `routes/assessments.php`, reusing `Application::issueResumeToken()`'s exact hashed-token pattern from Phase 2 for the emailed access link, including the same non-leaking invalid-vs-expired distinction
- Assigning an assessment snapshots its current question bank (including each multiple-choice question's correct answer) into the attempt's responses, so later edits to the bank never retroactively change a past attempt's grading — same reasoning as Phase 4's interview-response snapshotting
- A new cross-candidate "Assessment Attempts" list with a "Needs Grading" quick filter for self-service attempts sitting at `submitted`
- Real bugs caught before they shipped: the entry/grading page's "set state then immediately submit" first draft relied on a stale React state read (fixed by passing the payload directly to `router.put` instead of `useForm`'s async `setData`); the public show page was missing the plaintext `token` prop entirely, which the submit button needs to build its own URL; Laravel's shallow nested resource (`assessments.questions`) names its edit/update/destroy routes under the bare child resource (`admin.questions.*`), not nested under the parent — caught three wrong route calls via `npm run build`'s route-name check before they ever reached a browser
- 9 new Pest tests across two files, covering both delivery modes, auto-grading, the awaiting-grading hand-off, `max_attempts`, and expired/invalid tokens

### 8. Offer → Onboarding → Activation — ✅ Done (2026-10-02)

Gives the `offer_pending`/`offer_accepted`/`onboarding`/`activation_review` statuses (reserved since Phase 1) real behavior: offer generation with full self-service acceptance, an admin-configurable onboarding checklist engine layered onto the existing requirement system, a deterministic activation gate, and Employee record creation the moment an application goes active.

**Delivered:**

- `Offer` model — extend/accept/decline/withdraw, reusing `Application::issueResumeToken()`'s exact hashed-token pattern for the emailed accept/decline link (`OfferResponseController` + `routes/offers.php`, same non-leaking invalid-vs-expired distinction as Phases 2/7); staff retain a manual override (`Admin\OfferController::update`) for a verbal/phone acceptance, both self-service and staff paths converging on the same `accept()`/`decline()`/`withdraw()` model methods
- `OnboardingChecklistTemplate`/`OnboardingChecklistTemplateItem` — admin-configurable checklists (new "Onboarding Checklists" admin area, mirroring Phase 4's question-bank CRUD) whose items are instantiated as `ApplicationRequirement` rows (`requirement_type = "onboarding:{task_key}"`) the moment an application enters `onboarding`, reusing the existing Pass/Fail UI with no schema change; `firstOrCreate` per item so re-entering onboarding from `on_hold` never duplicates rows
- A deterministic activation gate in `Admin\JobApplicationController::update()`: transitioning to `active` is blocked by a new `BlockingRequirementsIncompleteException` until every `is_blocking` requirement has passed, naming exactly which ones are outstanding
- `Employee` model, auto-created (`firstOrCreate` on `candidate_id`) the moment an application legally transitions to `active`, snapshotting specialty and the accepted offer's pay rate, then assigning its `EMP-00001`-style number; new "Employees" admin area (list + profile)
- `ApplicationPanel` gained an "Offer" section (extend-offer form, status, manual accept/decline/withdraw overrides); new public `offers/{show,thank-you,link-issue}` pages structurally identical to Phase 7's assessment pages
- Real bug found & fixed before it shipped: `Offer`'s `#[Fillable]` list omitted `extended_by`/`extended_at`, so `Admin\OfferController::store()`'s mass-assignment silently dropped who extended the offer and when — caught by a failing Pest assertion, not by PHPStan (mass-assignment of a non-fillable attribute fails silently rather than throwing in this app's config)
- 16 new Pest tests across three files, covering both offer-response paths, the activation blocking-gate (including that it's bypassed once requirements pass), onboarding-template instantiation and its non-duplication on re-entry, Employee auto-creation, the "only one default template" rule, and editor access being forbidden

### 9. Continuous compliance — ✅ Done (2026-10-02)

Introduces Laravel's scheduler to this app for the first time, to keep watching credentials after a candidate becomes an `Employee` — something nothing in Phases 1–8 did once an application left the pipeline.

**Delivered:**

- `CredentialExpiryNotification` — an immutable per-credential, per-stage log (`overdue`/`7_day`/`30_day`/`60_day`), unique on `(credential_id, stage)` at the schema level as a second line of defense alongside the application-level check
- `App\Console\Commands\CheckCredentialExpirations` (`compliance:check-credential-expirations`), scheduled daily via `bootstrap/app.php`'s new `->withSchedule()`: for every credential with an `expiry_date` belonging to a candidate with an `active` `Employee`, computes the most urgent applicable stage and — only the first time a given credential reaches a given stage — queues `CredentialExpiryWarning` to the employee and `CredentialExpiryStaffAlert` to the site contact email (`SiteSetting::get('email', ...)`, the same fallback used by Phases 1–3's own notification emails), then logs the notification
- A new "Compliance" admin screen (`/admin/compliance`) listing active employees' credentials expiring within 90 days, most urgent first, with an "Overdue" quick filter; the Employee show page's Credentials card gained a compliance view — an amber expiry date inside the 90-day window and each credential's notification-stage history as badges
- Real bug caught before it shipped — not by PHPStan, by re-deriving the logic by hand: the stage-threshold lookup's `match`-style ordering checked widest-window-first (60/30/7/overdue), which would have mis-classified a 5-days-left credential as "60_day" instead of "7_day" — fixed by checking narrowest (most urgent) window first
- 6 new Pest tests covering all four stages, the beyond-window no-op, the inactive-employee skip, and that a second run never re-sends a stage already logged

### 10. Facility / Shift / deployment matching — ⏳ Not started

A genuinely new domain — OBHSA doesn't model client facilities or shifts at all today.

### 11. AI copilot — ⏳ Not started

Tool-calling orchestrator, permission-inherited actions, a RAG layer over policy docs, a confirmation-level policy for high-impact actions, and a full audit log. Needs an LLM provider/budget and a vector-DB decision before it can be scoped concretely.
