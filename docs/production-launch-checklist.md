# Production launch gates — Stage 2

Status: NOT READY FOR PRODUCTION RELEASE. Local application integration is verified; owner, provider and deployment gates remain. Do not interpret a checked engineering item as approval to publish.

## Verified locally

- [x] Stage 1 base bfbc67c preserved; all27 package prices remain unchanged.
- [x] 51 automated tests pass, including authoritative package pricing, dual mocked emails, provisional attachments, signed retries/receipts, partial failures, adult declaration and API negative cases.
- [x] Frontend/API TypeScript and production build pass; dependency audit reports0advisories.
- [x] v4 privacy/terms and email/PDF snapshot version references align locally.
- [x] Six-month manual enquiry procedure, designated owner grievance contact and cautious Delhi preference documented.
- [x] Commercial uncertainties audited; existing guidance labelled under review, no replacement binding terms invented.
- [x] Raw request bounds and aggregate outcome logs implemented; HSTS and host-scoped rate-limit proposal prepared.
- [x] Desktop1440×1000/mobile390×844 browser checks pass using mocked API responses; no application page errors.

## Owner approvals and actual operations

- [ ] Resolve complete business-address applicability and an owner-approved lawful correspondence address; city-only Delhi is not certified sufficient. Confirm any mandatory public telephone disclosures.
- [ ] Approve final quote validity, payment/commencement, cancellation/refund method/timing, scope changes, acceptance, client delays, rights/transfer/licences and support/handover terms. See commercial-terms-review.md.
- [ ] Review legal form, Delhi registration/premises/staff obligations, turnover/supply/GST and invoices with appropriate advisers. Non-registration is not exemption evidence.
- [ ] Create private retention/complaint register, inventory historical copies and perform synthetic complaint/deletion drill; set separate contract/security/complaint/audit-record schedules and accountable cover.
- [ ] Confirm provider contracts, regions, retention/backup deletion, access/MFA, synced clients/exports and third-party asset licences.
- [ ] Resolve future DPDP one-year retention conflict and provider support before May2027; recheck commencement/amendments before launch.
- [ ] Resolve CERT-In applicability, nominated contact, clocks, reporting procedure and rolling180-day India logs where required; run a tabletop exercise.

## Production security and provider verification

- [ ] Inspect Cloudflare proxy/routing/WAF/log settings and client-IP provenance. No account access was available in this execution.
- [ ] Validate proposed rule in actual provider schema, existing-rule overlap and representative traffic; observe false positives before enforcement. Prepare and verify exact-rule rollback without changing other rules.
- [ ] Configure/test alert recipient, thresholds/coverage, Resend delivery/bounce/complaint review and actual quota/budget controls; zero webhooks were found. Do not claim automated monitoring is active.
- [ ] Verify final authenticated application response headers. Current unauthenticated SSO redirects do not prove application HSTS/CSP. Host-only max-age86400 is local source only.
- [ ] Verify actual public-access behavior; both tested hostnames returned Vercel sign-in redirects during Stage2. Do not disable protection casually to pass a test.

## Release integration and safe deployment

- [ ] Review exact local commits and full diff. Do not push the Stage2 branch while automatic-deployment/alias isolation is unresolved; its name is not covered by the feature-only Git suppression.
- [ ] Use an isolated staging target with no public branch-domain assignment; read back deployment/project/environment/aliases before and after any future operation. Preserve original deployment dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z.
- [ ] Plan the v3→v4 signed-snapshot transition: legal versions are part of the signature, and email version text affects provider idempotent payload bytes. Do not automatically reprepare a pending request after409 or reuse old provider keys with changed content. Drain/resolve old requests or implement and test an explicit compatible transition before release. Stage2 does not deploy or reset tokens.
- [ ] Publish approved canonical legal versions together with the matching API/UI, verify customer links, mail/PDF version text and actual controlled delivery if separately authorized.
- [ ] Present tested integration, remaining approvals, exact alias/DNS plan, acceptance checks and rollback before any main merge or cutover.
- [ ] GitHub Pages frontend/Vercel backend migration remains a later stage: current same-origin fetch, Origin restrictions and CSP require a separately tested migration. No Pages/DNS/main action is authorized here.
