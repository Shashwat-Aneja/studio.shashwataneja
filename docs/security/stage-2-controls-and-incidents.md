# Security controls and incident response — 14 November 2026

Operator/responder: Shashwat Aneja, studio@shashwataneja.com. Prepared local implementation and runbook; not a certificate or proof of staffed monitoring. No DNS, domain, application deployment or firewall mutation occurred in Stage 2.

## Current inspected infrastructure

Vercel is the verified application/API host: project prj_y7kOXRlxs6qvfWpn7rZpIBbFfXYU, team team_re3Jg4lvj432x0wJ61w7xbxP. Public alias maps to dpl_G4sPydL3L9UY8A3pAvb48UQuQ84z, source a15822bed35308e70bae784f6fe2b26625b4f94d, target null, iad1. Domain is linked to feature/studio-foundation. This hosted source predates dual-email and pricing integration. A null/Preview target is not isolation from public users.

Active firewall read-back: enabled, version2; existing valid preview-only rule rule_studio_booking_requests_preview_observation_klMhWm, exact POST /api/booking-request, fixed-window20/IP/60s. CRS gen/rce/sqli/xss are active in log mode; logging is not blocking. No separate production rate-limit rule was found. Existing preview rule may cover this branch-host deployment, but enforcement on the public hostname was not burst-tested or claimed.

Both unauthenticated public /pricing and known preview /pricing returned HTTP302 to Vercel SSO on 14 November 2026. Public redirect had HSTS max-age=63072000; provider preview redirect included includeSubDomains/preload. These are observed provider protection responses, not application headers and not settings enabled by this work. Final app CSP/HSTS remain unverified in this stage. TLS handshake succeeded; no child-subdomain HTTPS coverage is inferred.

Cloudflare account proxy, WAF, logs, routing and client-IP provenance could not be inspected: no connected tools, and plugin discovery returned no matching connection. Public responses identified Vercel but do not establish all DNS/proxy settings. Do not weaken protection or use unverified proxy headers to infer a client IP.

## Local hardening completed; not deployed

- Existing authoritative prices, strict contact/custom-option/adult/terms validation, same-origin policy, honeypot, signed identities/receipts, two independent messages and bounded retries preserved.
- Raw string/Buffer request size checked before JSON parsing, as well as parsed size; malformed Content-Length rejected. Application limit remains24000 UTF-8 bytes. Platform body parsing still precedes handler execution on some paths; this is not edge-level volumetric protection.
- One allowlisted structured log per handled response: event studio.booking.response, HTTP status and outcome prepared/accepted/partial/rejected/unavailable. No raw body, contact, IP, token, Build ID, attachment or provider error. Logging failure cannot break the response. Provider edge metadata has separate retention/privacy implications. Function timeouts/crashes before a handled response require platform monitoring.
- Host-only HSTS max-age=86400 prepared in vercel.json; no includeSubDomains/preload added. Existing CSP/DENY/no-referrer/nosniff/permissions/COOP/CORP retained. This requires a later isolated release; no standalone header activation was attempted.

## Abuse assessment and prepared rule

Origin and honeypot can be forged by non-browser clients; IP rules do not stop distributed attacks. Supplied email ownership is unverified and acknowledgments/PDFs can be sent to an uninvolved address. Provider syntax/acceptance does not prove deliverability. No CAPTCHA, verified-address flow, global recipient suppression ledger or durable cross-request deduplication was added. These need a reviewed product/security decision if risk exceeds the minimal launch profile. Do not claim complete spam prevention.

The revised production-rate-limit.proposed.json uses exact host + path + method and no production-environment-only predicate, because the live host is branch-linked. It is a review spec, not an accepted API payload. A first attempt uses prepare+submit, so20/min permits roughly ten complete first attempts per shared IP; NAT and retries can collide. There is no representative traffic/IP-provenance evidence to establish that threshold is safe for live users.

Activation is held under the user's safety condition. Before activation: inspect Cloudflare proxy/client IP, current rule order/drafts/overlap and actual provider schema; create narrowly scoped observation first, collect representative counts without customer payloads, then validate the threshold and false positives. Test in isolation with invalid bodies (no emails), validate GET/OPTIONS/other paths/hosts remain unaffected, and record rollback. The test suite validates proposed matching logic, not provider acceptance or enforcement.

Rollback preparation: snapshot active version/rule IDs; if a new rule misbehaves, disable only its exact new rule ID or return it to log mode, read back active config and verify healthy controlled requests/non-booking routes. Preserve existing firewall and preview rule. This procedure is not an executed live rollback test. Source HSTS rollback requires an authorized header deployment; max-age=0 affects clients only after they receive it, existing provider/inherited policy may persist. Do not promise instant HSTS reversal. Alias recovery reference is the original deployment above; Stage 2 never reassigns it.

## Monitoring operating procedure

| Signal | Source and action | Status / gap |
| --- | --- | --- |
| API failures/partial outcomes | Filter booking path and aggregate response event/status; inspect5xx/202 counts, latency, invocation failures/timeouts; investigate sustained changes without copying customer data | Structured source implemented locally. No production alert destination or log drain activated. |
| Sending/delivery/bounces/complaints | Resend dashboard: distinguish acceptance from delivery; review rejected/deferred/bounced/complained emails and available usage counters daily during operation | Account inspection found0webhooks. No automatic delivery feedback/alert pipeline. Manual owner review required; do not send repeated acknowledgments to known bad/misused addresses. |
| Rate-limit violations/volumes | Vercel Firewall dashboard by exact host/path/rule; check shared-IP false positives and ratio of prepare to submit | Existing preview rule only. Host-specific observation/alert not activated. |
| Provider quota/budget | Confirm account plan, actual quotas, overage setting and available budget alerts; account for two emails per request and other apps sharing quota | Plan/budget not independently verified. Do not change billing or enable overages. |
| Config changes | Review provider audit/activity and GitHub changes for firewall, aliases, domains, protection, credentials and forwarders | No verified alert subscription/secondary responder. Operator must record baseline and review after every change. |
| Availability | Controlled GET health/legal checks with authorized access and known expected body/status; separately track provider outages | Current unauthenticated SSO redirect must not be mistaken for app health or public readiness. |

Before launch, choose and test the alert destination, escalation cover, review cadence and incident thresholds. Proposed starting investigation triggers: any partial/5xx burst, any unexpected alias/security change, any complaint event, unusual quota acceleration or sustained429s. These are recommendations, not configured alerts. Avoid automated contact with customers based solely on unverified bounce/abuse signals.

## Incidents and legal reporting

Record UTC detection/notification time, minimal facts, affected systems and responder. Contain credential/mailbox/deployment exposure; preserve necessary evidence securely without dumping bodies/tokens to logs. Revoking a sending key can invalidate signed retries; reconcile affected Build IDs and keep payments/dashboard disabled.

[CERT-In directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) require in-scope entities to report listed incidents within six hours of noticing/being informed, designate a contact, synchronize clocks and maintain rolling180-day ICT logs in India. Current direct retrieval timed out; the [official FAQ](https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf) was retrieved. Assess commercial operator applicability with a responder; individual-citizen exclusion is not assumed to cover this business. Provider retention defaults and US function region do not prove these obligations satisfied. Verify current official reporting channels at incident time, report initial available facts without waiting for a completed investigation, and follow up.

Future DPDP breach/security duties remain a separate May2027 readiness gate. Do not replace current CERT-In timing with a universal72-hour rule. Confirm provider agreements, contact/reporting ownership, secure India archive/export feasibility, clock evidence, backup access/deletion and a tabletop exercise before launch. No operational compliance is asserted from this runbook.
