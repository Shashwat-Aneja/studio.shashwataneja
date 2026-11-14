# Stage 2 production readiness — 14 November 2026

## Outcome

Local implementation and review completed to the safe boundary. **Not ready for final production release integration** until the owner, provider, operational and release-transition gates below are resolved. No application deployment, firewall activation, DNS change, main merge or GitHub push occurred. No real emails were sent or real customer records deleted.

Branch: **work/studio-stage-2-readiness**. Verified Stage1 parent: **bfbc67c**; implementation commit: **8c5dcc26ebced07e3ca80a0ca7724f6c5c052d61**. The following documentation commit contains this report and the companion runbooks. Its exact SHA is reported in the completion response and Git history rather than self-embedded here.

## Repository and preservation evidence

Initial working tree was clean at bfbc67c, following b2d74bf and customer-email commit3c83526. A baseline pnpm build passed37tests, both TypeScript checks and Vite build before implementation. GitHub compare returned feature/studio-foundation identical to b2d74bf both during the preceding Stage1 verification and the final Stage2 check. Stage1 and Stage2 remain local.

Stage2 leaves packages.ts, estimator calculations, PDF template/assets, signed identity/receipt algorithms, dependencies and lockfile unchanged. All27 prices are asserted through the rendered UI, authoritative server and mocked email/PDF flow. Visual identity, request architecture, separate recipients, provisional zero-payment state and disabled legacy payment routes are preserved. UI changes are disclosure/payment-guidance text only; no payment, dashboard, account, database or new service was introduced.

## Implemented changes

1. Enforce24000-byte raw JSON string/Buffer limit before parsing; retain parsed-body limit and reject malformed Content-Length. Covers whitespace and UTF-8 byte expansion; it does not claim platform edge-body enforcement.
2. Add allowlisted aggregate API response logs with event/status/outcome. No contact data, IP, Build ID, token, PDF or provider error is logged by this code. Logger exceptions cannot break a response. These logs exist locally; no production alert pipeline was configured.
3. Prepare host-only HSTS max-age86400 in vercel.json, preserving existing security headers. No includeSubDomains/preload added and no production header release attempted.
4. Correct the prepared live-host rule specification: exact studio.shashwataneja.com + POST + /api/booking-request, covering the hostname regardless of Vercel target classification. It is not a provider-validated payload or active rule. Observation, schema, traffic, proxy/IP and overlap checks remain before enforcement.
5. Update local privacy/terms to v4 with approved six-month manual enquiry policy, Shashwat Aneja as privacy/customer Grievance Officer, city-level Delhi disclosure with address caveat, and non-exclusive Delhi preference preserving mandatory remedies. No DPO or full-compliance claim.
6. Align snapshot/email/PDF legal-version metadata, including customer text/HTML. Audit existing60% advance/2% booking/15-day guidance; mark it under review and remove the FAQ's unconditional remaining40% requirement. Estimator calculations and package prices remain unchanged. No replacement refund, penalty, deposit, milestone or IP-transfer term invented.

## Verification results

| Check | Actual result / boundary |
| --- | --- |
| Baseline full build | 37tests passed before edits; both TypeScript checks and Vite passed |
| Final full build | **51tests in5files passed**; frontend tsc -b and API tsc -p tsconfig.api.json passed; Vite built43modules |
| Existing pricing and booking regressions | All27 price assertions; authoritative pricing ignores supplied price; monthly/custom estimates; independent messages and identical attachments; deterministic PDFs; signed identities/receipts, expiry/tampering/retry and both partial-failure directions passed |
| New security tests | Raw whitespace/Buffer sizes, UTF-8 expansion, malformed lengths, same-origin versus cross-site behavior, privacy-safe logs/logger failure, legal versions and prepared header/rule scope passed |
| Dependency audit | pnpm audit --json:0info/low/moderate/high/critical advisories; no dependency changes. This is an advisory snapshot, not a vulnerability-free claim |
| Browser | Local Chrome1440×1000 and390×844: unchecked declarations, keyboard adult control, eligibility gate, partial/reverse partial messages, stable-ID receipt retry, non-JSON429 feedback, successful dual-acceptance screen, closing, legal routes200 and v4 decisions. No page errors; all API responses mocked, no inbox delivery claim |
| Visual review | Desktop and mobile booking screenshots inspected; existing presentation retained. Mobile legal pages captured and their text/links checked. No physical-device, screen-reader or full accessibility certification |
| PDF scope | Provisional attachment generation, byte identity and determinism passed. No new visual PDF page rendering or extracted-text audit; unchanged PDF template with updated version strings |
| Headers | Source-config assertions passed. Public and preview unauthenticated responses observed302Vercel SSO, not final application responses; provider redirect headers do not verify app CSP/HSTS |
| Rule verification | Local matching tests exclude other hosts, paths, GET and OPTIONS; active provider config read back unchanged. No provider validation, burst test, new429enforcement or executed live rollback claimed |
| Source/diff | git diff --check passed. No diff to Stage1 package data, estimator, PDF template, identity code, package.json or lockfile |

First expanded test run correctly failed an older test expecting environment=production and the old draft marker. That test was updated to assert exact live-host scope and retained non-activation/rate/observation safeguards. The succeeding full build passed51tests. Initial local server/browser launches were blocked by execution permissions, then succeeded with authorized local execution. No application defect was hidden by these setup failures.

Local evidence copies (ignored build output, synthetic data): output/stage-2/build.log, dependency-audit.json, browser-check.cjs, booking-desktop.png, booking-mobile.png, terms-mobile.png, privacy-mobile.png. Browser command used the bundled Playwright and installed Chrome with a local Vite server on127.0.0.1:5177; it is not a hosted end-to-end test. No new production secrets were obtained or printed.

## Deployment and active-control evidence

Vercel project prj_y7kOXRlxs6qvfWpn7rZpIBbFfXYU in team team_re3Jg4lvj432x0wJ61w7xbxP. Before/after alias read-back remained **dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z**, URL studio-shashwataneja-itrgnoros-shashwat-anejas-projects.vercel.app, alias updatedAt1794638680366. Deployment metadata reports source **a15822bed35308e70bae784f6fe2b26625b4f94d**, target null, source git, iad1. Thus the live mapping predates the customer-email and pricing implementation; local success is not production completion.

Domain remains branch-linked to feature/studio-foundation. vercel.json suppresses that branch's Git deployments; the Stage2 branch is not suppressed and must not be pushed under current uncertainty. Earlier manual Preview deployment reassigned the alias, so no push/manual deployment was attempted. Full automatic-assignment settings were not exposed by the compact project response; no assumption of isolation was made.

Firewall stayed enabled at version2, updatedAt2026-11-14T05:51:43.249Z; existing preview-only rule rule_studio_booking_requests_preview_observation_klMhWm remained active/valid. It limits exact booking POSTs20/IP/60s. Selected CRS categories are log-only. No separate production rule was found or activated. Because the public deployment has target null, do not equate that absence with proof the existing preview rule has no live-host effect.

Public /pricing HEAD returned302to Vercel sign-in with HSTS max-age63072000; preview /pricing returned302with provider includeSubDomains/preload policy. This work did not enable either policy. No final authenticated application header audit was possible through the available path; protection was not disabled or broadened. Cloudflare account settings were inaccessible; plugin discovery returned no matching connection. A public Vercel server header does not establish zone proxy configuration or client-IP correctness.

Resend account inspection returned0webhooks. No webhook, automated alert, overage/billing or provider retention setting was changed. See [active/proposed control and incident register](security/stage-2-controls-and-incidents.md).

## Legal and commercial evidence

The [updated matrix](legal-compliance-matrix.md) links primary government sources and distinguishes current versus future obligations. Official DPDP commencement/Rules, corrigendum and2026order were retrieved. The one-year tranche is current; substantive duties remain in the eighteen-month tranche due May2027. The2026e-commerce commencement was confirmed from the official indexed PDF extract; direct retrieval timed out. Some SPDI/Contract/CERT-In directions endpoints were unavailable, explicitly noted in the matrix. This is not a complete legal opinion or amendment search guarantee.

City-only address sufficiency is unresolved under conditional e-commerce requirements; no residential address was sought. Owner grievance designation is based on the approved contact and absence of an independent-officer bar in the reviewed rule, not legal certification. The2021amendment is applied rather than the superseded incorporation restriction. Non-registration is not a GST exemption finding; the current available CGST consolidation and notification are linked for accountant review.

[Retention/deletion procedure](data-retention-deletion.md) inventories actual source processing and verified/historical provider paths separately from uninspected account retention. It defines the clock, manual register, due-date deletion, holds, verification and provider/customer-copy limits. No automatic six-month deletion or completed mailbox purge is claimed. Future one-year provisions need separate reconciliation before commencement, not a silent override.

[Commercial review](commercial-terms-review.md) addresses all12requested policy areas, alternatives and pending approvals. v4 public files are local review copy; final project commercial provisions remain unapproved and canonical hosted links still reach the older deployment. Do not release the API/UI while its promised legal versions remain unpublished.

## Files changed relative to Stage1

Application/configuration: api/booking-request.ts; server/request.ts; server/booking-email.ts; public/privacy.html; public/terms.html; src/App.tsx; src/PricingPage.tsx; src/components/BookingFlow.tsx; vercel.json.

Tests/specification: server/stage-2-security.test.ts; docs/security-config.test.ts; docs/security/production-rate-limit.proposed.json.

Documentation: docs/stage-2-production-readiness.md; docs/legal-compliance-matrix.md; docs/privacy-operations.md; docs/data-retention-deletion.md; docs/commercial-terms-review.md; docs/production-launch-checklist.md; docs/security/production-security-plan.md; docs/security/stage-2-controls-and-incidents.md.

## Remaining blockers and release decision

- Owner/adviser: complete address and any required phone disclosures; final commercial terms; actual business-form/registration/GST/rights advice. No address publication or new commercial policy was inferred.
- Operations: private retention/grievance register and drill, historical-copy inventory, supplier/access/MFA/backup/retention review, applicable CERT-In contact/clocks/India logs and incident exercise. Documents do not prove operation.
- Security: Cloudflare proxy/IP/config inspection, representative traffic and safe rule observation/threshold/rollback evidence, live header verification, Resend quota/budget and tested monitoring/alert ownership. New HSTS/rate controls remain prepared only.
- Release: isolated staging/deployment path; legal publication consistency; signed v3→v4 transition. Legal versions are signature inputs and email body changes affect provider idempotency. Existing pending requests must drain/be reconciled or use a separately implemented/tested compatibility path before release; never auto-reprepare on409or reset keys merely to force success.
- Future readiness: resolve DPDP one-year retention conflict/provider support before May2027; recheck2026e-commerce changes for1January2027.

See [launch checklist](production-launch-checklist.md). No main merge, Pages migration, production cutover or DNS change is authorized by this report. **Ready for review of the local changes; not ready for final production integration/cutover.**
