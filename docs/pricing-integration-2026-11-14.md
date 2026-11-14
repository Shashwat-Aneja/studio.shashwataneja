# Pricing integration — 14 November 2026

## Scope and recovery

Base: b2d74bf87db39d2aa69e11382f96bbbe8a13df3d on feature/studio-foundation, including customer-email implementation 3c83526. GitHub compare API returned identical for base versus the current feature branch. Branch search returned feature/studio-foundation and main. Shell GitHub access was unavailable; connected GitHub tools supplied remote evidence.

Recovered original commit 8a8a9ae8495bcfc2bc0d41ff7ab5c85044cd9217 from /tmp/studio-pricing-commit-20261114. Its packages.ts patch exactly matches the pre-existing workspace patch. User separately confirmed all seven prices in this chat. The old commit's single-recipient test edit was not transplanted over the newer dual-email tests.

| Service | Tier | Before | Approved |
| --- | --- | --- | --- |
| Web Development | Essential | ₹5,999 | ₹3,999 |
| Web Development | Professional | ₹14,999 | ₹7,999 |
| Web Development | Advanced | ₹29,999+ | ₹11,999+ |
| UI/UX & Design | Advanced | ₹17,999+ | ₹10,999+ |
| Branding | Advanced | ₹14,999+ | ₹11,999+ |
| Content | Professional | ₹4,999 | ₹3,999 |
| Content | Advanced | ₹9,999+ | ₹7,999+ |

## Verification performed on integrated working tree

- Full pnpm build passed: 37 tests in four files, frontend and API TypeScript checks, Vite production bundle. Initial attempt failed because node was absent from PATH; rerun used installed Node v24.21.0. No dependency changes.
- Added all-27-package integration test: rendered pricing cards and booking summaries, authoritative server selection (ignoring injected client price), both separate mocked email payloads, identical PDF attachment bytes for both recipients.
- Existing 36 tests remain passing, including partial acceptance, signed receipts/retries, deterministic PDF generation, custom estimates, monthly plans, declaration checks and disabled legacy routes.
- Generated 27 PDF samples in /private/tmp/studio-pricing-pdf-checks; checked PDF headers and EOF markers. No new visual layout review or extracted PDF-text assertion was performed. PDF template and email implementation are unchanged.
- Independent comparison verified 27 prices total, exactly seven changed, all remaining package data byte-identical after removing price values. git diff --check passed.
- No live emails sent or new hosted preview created. Historical live-delivery evidence in verification-2026-11-14.md is earlier evidence, not a new delivery test of this revision.

## Deployment inspection and holds

Vercel project prj_y7kOXRlxs6qvfWpn7rZpIBbFfXYU, team team_re3Jg4lvj432x0wJ61w7xbxP. Live domain read-back remains branch-linked to feature/studio-foundation and mapped to dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z / studio-shashwataneja-itrgnoros-shashwat-anejas-projects.vercel.app. Latest listed project deployment is the earlier READY preview dpl_4uCZ17sYemoW2FCr1W12dAoQzTiw, target null. These are different deployments.

vercel.json disables Git deployment for this feature branch; this alone does not guarantee manual deployment isolation, as the previous alias incident demonstrated. Current workflows run checks but do not implement a Pages release. This stage makes no push, deployment, alias, DNS or main change. The integrated result is local only.

Production gates remain unresolved from the earlier audit: business address, grievance contact/designation, retention/deletion decisions, final commercial terms/jurisdiction, applicable accounting/registration and incident/log arrangements, provider/access/monitoring operations, production abuse controls and verified HSTS. These are recorded outstanding items; this stage did not conduct a new legal or operational audit. Revised legal-page publication and version consistency with canonical customer-email links must also be verified before release.

## Subsequent stages — proposal only

1. Review this local integration and full diff. Before any push or preview, verify a deployment path that cannot assign the public domain. Prefer a separate isolated staging project with no public domain; explicitly inspect domain/branch bindings and deployment settings before and after. Do not rely on a Preview label. Preserve the original deployment ID as rollback evidence.
2. Resolve the production gates independently. Verify actual abuse-rule environment/path/method scope and enforcement, headers on final responses, credentials in the intended environment, legal versions and operational ownership. Run staged end-to-end tests with owner-controlled recipients only after separately authorized.
3. Prepare hybrid hosting on an isolated test hostname: Pages frontend plus Vercel Functions backend. Current frontend fetches /api/booking-request; current backend rejects cross-site requests and requires Origin host to equal request Host. Current CSP permits only self connections. Therefore migration requires a configured backend URL, exact allowed origins and preflight handling, reviewed cross-site protection, appropriate frontend CSP, and regression tests for allowed and rejected origins. Retain secrets and authoritative prices/PDF generation on the backend. Verify backend availability independently of frontend hosting.
4. Verify Pages build artifact/routing, /pricing and legal URLs, assets, API POST/OPTIONS, all 27 prices, custom estimates, retries/partial outcomes, both emails and PDF attachments. Determine how required headers will actually be served by the selected frontend delivery path; Vercel's frontend header configuration cannot be assumed to accompany static files elsewhere. Inspect DNS/TLS and Pages domain requirements before designing exact records.
5. Present the exact tested commit/artifacts, domain mappings, DNS record changes, release order, acceptance checks and rollback steps for approval before main merge or cutover. Record current DNS values and TLS state at that time. Keep the old frontend/deployment and backend available through validation. Rollback must restore recorded DNS/alias routing and compatible frontend/backend configuration; account for DNS caching. No cutover commands or infrastructure changes are executed by this proposal.
