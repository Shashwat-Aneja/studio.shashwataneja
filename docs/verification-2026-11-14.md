# Implementation and verification report — 14 November 2026

## Tested revision and deployment

- Repository: Shashwat-Aneja/studio.shashwataneja; branch **feature/studio-foundation**. No main change or merge.
- Tested implementation commit: **3c83526ff346371c420f652d0f8a91e3f1597371**, tree acb09302562f1b7af12c4004481ef4c0541435af. A later documentation-only commit records this evidence and the alias incident; it does not change the tested runtime.
- READY Preview: **https://studio-shashwataneja-ab9jvylr0-shashwat-anejas-projects.vercel.app/pricing**; deployment dpl_4uCZ17sYemoW2FCr1W12dAoQzTiw, target null (Preview), iad1.
- Preview remains protected by the project's Vercel access controls; temporary1200-second test sharing was revoked after verification. Sign in with the authorized account to view it.
- [Studio quality checks](https://github.com/Shashwat-Aneja/studio.shashwataneja/actions/runs/43567648110) and [Studio CI](https://github.com/Shashwat-Aneja/studio.shashwataneja/actions/runs/43567648076): success for the tested implementation commit.

## Implemented behavior

Both package pricing and the seven-step custom workshop use one validated request flow. Studio receives full contact/scope/notes; the customer receives separate restrained HTML/plain-text acknowledgment. Both get the same deterministic provisional PDF. Subjects and idempotency keys are distinct. Customer reply-to is Studio; owner reply-to is the customer. No marketing subscription, payment, account, dashboard or database was introduced.

Strict adult and terms booleans are checked server-side. Separate unchecked checkboxes, keyboard operation, privacy notice and under18 instructions appear before submission. The signed request records timestamp, adult self-declaration and legal document versions. No DOB or ID fields were added. No age-verification or parental-consent claim is made.

Only dual acceptance returns success. Partial acceptance returns202 with per-message status and signed acceptance receipt; retries skip an accepted side. Neither confirmed returns503. Timeout/429/409/5xx remain unconfirmed; errors do not expose provider text/credentials. After23hours, forged, changed or future identities are rejected. Lost browser receipts still use provider24-hour idempotency; no persistent global deduplication, guaranteed delivery or exactly-once claim is made.

PDF presentation retains the warm interior full-width hero, dark gradient, oversized white heading, cream itemization and metadata. It states PROVISIONAL / PENDING REVIEW, received ₹0, payable now ₹0, final quotation pending approval, payment method not selected/disabled. Customer copy is immediate and provisional; no finalized/tax invoice is issued.

## Automated and browser evidence

- `pnpm build`: **36 tests passed**, frontend and API TypeScript checks passed, Vite production build passed. A separate archive of the committed tree, excluding unrelated working pricing edits, also passed36tests, both TypeScript checks and Vite build using the same installed locked dependencies. The archive's pnpm wrapper initially refused an external node_modules symlink; the actual test/compiler/build binaries then passed from the archive. This was a verification setup issue, not an app build failure.
- Coverage: independent recipients and identical PDF; partial outcomes both directions; receipt tampering and skip/retry; duplicate keys/PDF determinism; timeout/rejection/malformed provider response; expiry/future/content tampering; missing configuration; strict adult/terms, contacts, JSON/body/origin checks and injection; monthly/custom pricing; legacy endpoints410; security headers and draft production-rule scope. Real provider failures were mocked, not deliberately induced on customer mail.
- Local Chrome1440×1000 and390×844: both declarations unchecked, adult gate, keyboard Space operation, correct partial feedback, accepted-side receipt retry, reverse partial, non-JSON429 safe feedback, dialog closing, legal links200, no DOB field and no application page errors. Mock responses verified failure presentation without sending email. Mobile is a responsive browser viewport test, not a physical-device/screen-reader certification.
- Deployed Chrome: actual pricing → package → submit, custom workshop → blueprint → submit, HTTP200 dual acceptance, stable-ID provider retry, legal routes200, health checkout/dashboard disabled, zero application page errors.
- Five rendered sample pages inspected: package2pages, long custom3pages. Itemization, page breaks, zero-payment state, self-declaration and legal-version metadata readable. No claim of exact fidelity to the unavailable original reference attachment.
- Dependency audit: initial dev-only critical/moderate test-runner advisories remediated by Vitest4.1.12; final `pnpm audit --json`: **0 reported vulnerabilities** at every severity. This is not a vulnerability-free certification. Deprecation notices for transitive packages remain informational.
- Committed browser bundle credential-name/token-pattern scan:0matches. No configured lint tool exists; `git diff --check` passed. No full penetration test, external load test or ASVS certification was performed.

## Live mail evidence

Only owner-controlled test addresses were used: Studio notification to studio@shashwataneja.com, customer role to connect@shashwataneja.com. Every request was labeled STUDIO QA VERIFICATION ONLY, no payment and no customer booking.

| Route / Build ID | Studio Resend ID | Customer Resend ID | Observed result |
|---|---|---|---|
| Package / 92dda475-7992-490a-81d9-77459d9de14b | 01a1d8ce-867d-7a9c-83ca-ae48252c949a | 01a1d8ce-8681-7071-aeba-28db38ac15a3 | Both accepted; both delivered; both found in Gmail INBOX with306972-byte PDFs. |
| Custom / cc1ce7bf-eec3-47e3-be9b-fff043be046f | 01a1d8ce-a27e-75d6-a5da-53ae00e4ebc3 | 01a1d8ce-a276-714d-b646-a23b7faf6dfa | Both accepted; both delivered; both found in Gmail INBOX with308170-byte PDFs. |

A repeated package submit with the same identity and no acceptance receipts returned200/the same reference; Resend/Gmail inspection showed only the original pair, not an extra pair. This is bounded observed deduplication, not a global guarantee. Customer bodies were retrieved and checked for provisional/no-payment language, greeting, summary, contact and legal links, and absence of internal owner instructions/phone/notes. Each of the four provider attachment listings showed one application/pdf with matching pair size/name. Unit tests additionally compared identical attachment bytes.

## Security configuration and deployment incident

Deployed responses verified restrictive CSP, no-referrer, DENY, nosniff and same-origin COOP/CORP. **No Strict-Transport-Security header was observed** in the final response; add and test an appropriate policy before public launch rather than claiming platform HSTS. HTTPS was used; no cipher-suite audit is claimed.

Active firewall read-back: rule_studio_booking_requests_preview_observation_klMhWm, active/valid, rate_limit20/IP/60s fixed window, exact POST /api/booking-request AND environment preview. Preview enforcement and an actual429 had been verified in the preceding authorized workflow; this audit used a mocked429 and did not repeat a burst. Production is outside this rule. Proposed production JSON is a reviewed draft, not a directly importable API payload and was **not applied**.

The project domain is linked to the feature branch. Git-triggered deployment was disabled for this branch in vercel.json; main/other branches were untouched. However the explicit manual file-source deployment with feature-branch metadata **unexpectedly reassigned studio.shashwataneja.com** to the audit preview. After detection, the original mapping to dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z / studio-shashwataneja-itrgnoros-shashwat-anejas-projects.vercel.app was restored and read back. The audit preview's current alias listing is empty. The first restoration attempt was rejected by automatic review as a new public release; after showing the recorded original/current mapping, restoration was permitted. Do not describe production as unchanged throughout: a brief unintended routing change occurred and was corrected. No main merge or production promotion occurred. Future manual deploys need an explicit, verified no-assignment path; Git deploymentEnabled alone does not provide it.

## Owner decisions and launch gates

Confirmed: operator Shashwat Aneja, no GST registration. Still pending: public business address, grievance designation/contact, jurisdiction preference, retention/deletion schedule, final project cancellation/refund/IP/commercial agreements and accounting/registration review. Do not infer exemption from GST registration merely from current non-registration.

Operational gaps: supplier agreements/access/MFA, mailbox/provider retention and backups, proportional rights/deletion process, CERT-In applicability/POC/clock/India180-day logs, production rate-limit rollout and provider abuse budgets/monitoring. DMARC remains monitoring; no DNS enforcement change was made. Future DPDP readiness must be reviewed before its operative tranche. The public legal pages currently remain on the original deployment; updated v3 documents are review copy on this preview. Customer links deliberately use the canonical public domain, so publication/version consistency is a launch gate, not evidence that the revised policies are already live there.

The separate package-price edits in the shared working directory were left uncommitted and were not included in this implementation revision. Its pricing matches the original repository baseline; coordinate the separate approved pricing release before launch.

See [legal matrix](legal-compliance-matrix.md), [privacy operations](privacy-operations.md), [security findings](security-audit.md), [production proposal](security/production-security-plan.md), [Privacy](../public/privacy.html) and [Terms](../public/terms.html). The audit identifies verified controls and unresolved legal/operational matters; it does not certify compliance.
