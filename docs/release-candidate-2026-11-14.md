# Studio release candidate — publication held

Date: 14 November 2026. Owner explicitly answered **“hold publication”** during this release task because the business-address disclosure remains unresolved. No merge, application deployment, public alias change, DNS change, protection change or production-control activation is authorized while that hold remains. Continue only preparation and review.

## Candidate and Git review

Branch: release/studio-production-2026-11-14, based directly on Stage 2 HEAD93b78ccd751a7c5697c66e92dc1feb80f83be49c. It preserves Stage1bfbc67c and customer-email implementation3c83526. Remote feature/studio-foundation was verified at b2d74bf87db39d2aa69e11382f96bbbe8a13df3d; remote main at49263b7063379c1c09aa17f1a6e5b2714535a4f2. Neither has been merged into or overwritten by this preparation.

Release-branch Git-deployment suppression and its regression check are added beyond Stage2 runtime/configuration. The existing pricing test output directory is also made portable for Linux CI; its assertions are unchanged. Packages, package features, estimator, email/PDF templates, signed identities and retry algorithms are unchanged from the verified Stage2 implementation. Existing historical SQL files remain dormant; do not run migrations or activate payment/dashboard/database code.

The full main-to-candidate diff is necessarily large because main is the coming-soon site. The candidate was recovered through the existing feature history, not reconstructed or combined with unrelated branches. Existing draft PR1 has outdated payment/dashboard prose and is not the release approval. The new release review must describe the email-only implementation accurately and remain draft/unmerged.

## Git transport and review identity

The terminal push was rejected with GitHub403: its active account lacks repository write access. No remote ref was created by that attempt. The connected GitHub app reports repository push/admin permission and a Git object write succeeded. The fallback is to import the exact reviewed Git tree through that connection as one consolidated release commit parented on remote b2d74bf, then verify tree equality before creating the deployment-disabled release ref. Local Stage1/Stage2 commits remain preserved; remote commit identifiers differ from the local originals because this is a consolidated import. Record the final remote SHA and PR in the completion response. Do not describe the failed terminal push as successful.

## Git push safety

Before preparing a review push, the Vercel domain inventory returned exactly the public branch-linked domain and the default Vercel domain. No domain is bound to this release branch. The public domain remains linked to feature/studio-foundation.

vercel.json now explicitly sets git.deploymentEnabled=false for release/studio-production-2026-11-14, while retaining the existing feature-branch suppression. [Vercel's documented Git configuration](https://vercel.com/docs/project-configuration/git-configuration) disables Git-triggered deployment for listed branches. The two GitHub workflows execute verification only and do not deploy; PRs targeting main trigger both workflows. No manual deployment is used, avoiding the path involved in the previous alias incident. This is a Git-review-only path, not proof that arbitrary manual deployment is isolated. Verify deployment history and alias again after any push/PR operation.

## Verification performed in this release task

- pnpm build: **52tests in5files passed**, both frontend/API TypeScript checks passed, Vite production build passed43modules. Node24.21.0 used locally; hosted CI uses its configured Node22.
- All27 approved price values asserted through rendered pricing and booking summaries, authoritative server selection, separate mocked Studio/customer email payloads and identical provisional attachment bytes. Advanced plus signs and Care monthly labels retained.
- Extracted text from all27 generated package PDFs independently verified exact service/tier/price, Build ID, provisional status, zero received/payable, not-tax-invoice statement and v4 legal metadata. Package/custom samples also passed text assertions.
- Inspected all five rendered sample pages: two-page package and three-page long custom PDF. Hero, cream itemization, page transitions, amounts and approval/version metadata were readable without observed overlap or clipped content. No PDF presentation code was changed.
- Built-site local Chrome tests at1440×1000 and390×844 passed package flow, required unchecked declarations, keyboard interaction, both partial-failure directions, signed-receipt presentation/retry, non-JSON429feedback, legal routes/v4 text and closing. Added full homepage → seven-step custom workshop → blueprint → enquiry → mocked dual acceptance. Zero page errors. API responses were intercepted; no actual email was sent.
- pnpm audit --json:0reported advisories at every severity. Bundle scan for configured credential names/live key prefixes returned0matches. Neither is a complete security certification.
- git diff --check passed; package data, estimator calculations, signing code and PDF template unchanged from Stage2.

The first GitHub PR run failed only because the pricing test used /private/tmp, a macOS-specific path that Linux could not create. It was corrected to the repository-relative ignored output/pdf/package-pricing directory using node:path.resolve. All27 pricing/email/PDF assertions remain intact. Hosted CI must pass after this fix before the review package is considered verified. The initial failed runs are43594546256and43594546277; their failures are not reported as passes.

Synthetic evidence is local and ignored under output/release-candidate: build.log, dependency-audit.json, browser.log, browser-check.cjs, pdf-checks.json and package/custom rendered PNGs. The local preview is a built artifact check; Vite preview does not enforce Vercel response headers.

## Actual hosted baseline

Vercel project prj_y7kOXRlxs6qvfWpn7rZpIBbFfXYU, team team_re3Jg4lvj432x0wJ61w7xbxP. Public alias still maps to **dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z**, studio-shashwataneja-itrgnoros-shashwat-anejas-projects.vercel.app. Its previously inspected source is a15822bed35308e70bae784f6fe2b26625b4f94d, not this candidate. Latest listed deployment remains the earlier3c83526preview dpl_4uCZ17sYemoW2FCr1W12dAoQzTiw.

Public DNS read returned A76.76.21.21, no AAAA/CNAME answer from the queried resolver. This is an observed answer, not a Cloudflare account export or proof of every authoritative setting. No DNS change occurred. Actual /pricing returned HTTP302to Vercel sign-in with provider HSTS max-age63072000 and X-Frame-Options DENY. This does not prove final application CSP/HSTS or public availability of the new site.

Firewall read-back stayed enabled at version2, updated2026-11-14T05:51:43.249Z, with the existing valid preview-scoped20/IP/60s exact booking POST rule. No new enforcement or monitoring setting activated. Branch/Preview classification may include the public hostname; configuration presence is not a new live enforcement test.

## Requirement classification

| Requirement | Local candidate | Actual production domain |
| --- | --- | --- |
| All27 prices, Advanced plus and monthly Care | VERIFIED by independent expectations and PDF text | BLOCKED: candidate unpublished |
| Package/custom enquiry submissions | VERIFIED with mocked provider/API regression and browser tests | BLOCKED: no candidate release/smoke test |
| Studio/customer recipients, Reply-To, pricing, attachments | VERIFIED mocked payloads | NOT TESTED for this candidate; no real mail sent |
| Actual authorized-inbox delivery | NOT TESTED in this task; earlier3c83526evidence is historical only | BLOCKED until an authorized tested release path |
| PDFs: data, appearance, Build ID and zero payment | VERIFIED generated samples/text/rendering | BLOCKED for live attachments |
| Adult/terms declarations, validation, partials/retries | VERIFIED local tests | BLOCKED for candidate live verification |
| Responsive website/navigation/legal links/custom workshop | VERIFIED built local desktop/mobile flow | BLOCKED; observed /pricing redirects to sign-in |
| Approved published legal pages | BLOCKED by address and commercial approval | BLOCKED; v4 remains unpublished |
| HTTPS | VERIFIED successful TLS request to actual hostname | VERIFIED for the protection redirect only |
| HSTS/CSP/origin and request limits | VERIFIED source/config/negative tests; HSTS prepared | Final application headers and enforcement NOT TESTED in this task |
| Rate limiting | Prepared scope tests; existing rule read-back VERIFIED | New host-specific activation BLOCKED; no burst test |
| Monitoring/abuse/incident operations | Aggregate logging implemented; runbooks prepared | Operational coverage BLOCKED/unverified; no new alerting activated |
| No exposed credentials | Source/bundle checks VERIFIED within stated scope | No new deployment to inspect; full leakage assessment NOT TESTED |
| Git PR/merge | Draft review only; exact link/status to be reported after creation | Main merge BLOCKED by owner hold and launch gates |
| Hosting migration | Vercel retained as safest immediate architecture proposal | NOT IMPLEMENTED; no Pages or Cloudflare migration |
| Cutover/rollback | Baseline and conditional procedure recorded | NOT EXECUTED; no production change to roll back |

## Minimum actions before publication can resume

1. Owner must lift the explicit hold and provide an approved lawful business-address/contact solution, or obtain a qualified applicability determination supporting the intended disclosure. “Delhi, India” is not certified sufficient by the [current e-commerce disclosure rule](https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf). Do not infer or retrieve a residential address.
2. Approve exact enquiry/project commercial wording. The [decision register](commercial-terms-review.md) covers quote validity, payment/commencement, cancellation before/after work, refund basis/timing, scope changes, client delays, rights/licences/transfer, support/handover and disputes. Existing v4 is review copy, not approved final binding policy. No percentages, penalty, deposit or transfer conditions may be invented to unblock release.
3. Verify the provider/operational gates in [the launch checklist](production-launch-checklist.md): proxy/client-IP and rule overlap/false positives, actual quota/budget and alert ownership, final headers, provider/access/retention/backup arrangements, manual complaint/deletion operation and applicable incident/log duties. Future DPDP tranche readiness is tracked separately from current law; it is not falsely presented as already operative.
4. Resolve signed-request and idempotent-email transition before cutover. Old versions/prices are part of signed snapshots and new email/PDF bytes differ. Do not reset keys or silently reprepare pending requests. Use an approved drain/reconciliation process or separately implement/test exact-version compatibility.
5. Obtain approval of the verified candidate and a concrete no-surprise deployment/domain-binding procedure. Current custom domain remains branch-linked; do not casually push that branch or treat a Preview label as isolation.

## Hosting and rollback proposal — not approved for execution

Retain Vercel frontend plus same-origin Functions for the immediate release. This preserves /api/booking-request, current Origin enforcement, server secrets, PDF assets and retries. Moving the frontend to Pages now would require a separate verified API domain/proxy, exact-origin CORS/preflight and CSP changes plus Cloudflare access. It adds risk without resolving the present publication hold.

After all gates and candidate approval: verify project/production-branch settings; stage the exact production build without domain assignment; verify protected staged behavior and authorized controlled delivery; record the candidate deployment ID and compare its artifact. Before merging or changing the domain's branch association, demonstrate a provider-supported sequence that cannot briefly expose the coming-soon/main or another preview build. The current compact project response is insufficient to certify that transition. Present exact mapping/operation order for approval before execution. No DNS change is proposed for the immediate Vercel release.

Baseline recovery target: public alias → dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z; retain its existing branch association and original DNS record until the approved transition. On a later failed release, restore the recorded mapping/binding and verify actual hostname routes/headers/API; disable only any newly introduced misbehaving firewall rule, leaving existing rules intact. HSTS rollback requires receiving a new header and is not guaranteed instantaneous. No live rollback exercise was performed during the hold.

Final intended URL remains https://studio.shashwataneja.com. **The deployment objective is not complete; publication is explicitly held.**

## Review status

Draft review: https://github.com/Shashwat-Aneja/studio.shashwataneja/pull/2. Publication remains held. The public alias was read back unchanged after branch and PR creation; Vercel listed zero deployments for the release branch. No main merge occurred. Exact remote HEAD and final hosted-check results are reported in the completion response.
