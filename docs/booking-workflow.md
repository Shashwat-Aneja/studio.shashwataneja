# Email-only booking operations

## Current workflow

Pricing packages and the seven-step custom workshop use the same contact/terms form. The server validates contact details, separate strict adult/terms declarations, honeypot and allowlisted project choices and calculates the scope and pricing itself. It issues a UUID Build ID, timestamp and HMAC-signed retry identity. The same endpoint then creates the provisional A4 BUILD DETAILS PDF and sends the complete request through Resend to **studio@shashwataneja.com**, with the validated customer email as reply-to, and separately sends the customer a restrained acknowledgment with the same provisional PDF. Both use Resend. Success requires acceptance of both messages, not delivery.

The owner reviews the email, contacts the customer and approves the final quotation manually. No database, account, customer dashboard, payment capture or finalized customer invoice is used. The immediate customer PDF is provisional. The old order and webhook routes return 410. Historical Supabase migrations remain in source control for reference but are not launch requirements and must not be applied for this workflow.

## Required configuration

Only `RESEND_API_KEY` and `STUDIO_FROM_EMAIL` are required. Both are server-only. The preview uses `Studio <studio@mail.shashwataneja.com>` on the verified Resend sending subdomain, with a sending-only key restricted to that domain. Incoming `studio@shashwataneja.com` is a separate Cloudflare forwarding route to the owner's Gmail inbox.

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BOOKING_RATE_LIMIT_SECRET`, `STUDIO_ALLOWED_ORIGIN` and `DASHBOARD_URL` are not read by booking requests. Old project-level Supabase/dashboard variables are left untouched because other or historical functionality may use them. The unused Supabase JavaScript package and unused frontend booking contracts were removed. No database migration is needed.

## Identity, retries and delivery guarantees

The prepare action sends no email. It creates the UUID on the server and signs the normalized request, approved sender, Build ID and timestamp. Submit requires those signed details. Changed content, forged IDs, future timestamps and identities older than 23 hours are rejected before sending. Sender/key rotation or a changed pricing/terms snapshot invalidates old retry identities; contact Studio rather than silently generating a replacement.

The browser retains the identity while the form is open and in sessionStorage indexed by a SHA-256 fingerprint of the form data. Contact data itself is not put in sessionStorage. Re-entering identical details in the same browser session reuses the identity, including after a reload. Clearing storage, a new browser session, changed details or separate devices may create a new Build ID and duplicate mail. Do not treat this as global deduplication.

Resend's distinct `Idempotency-Key` values use the Build ID hash plus `studio` or `customer`. Signed acceptance receipts let an unchanged retry skip an already-accepted side; forged receipts are ignored and provider deduplication remains the fallback. Retries use identical subject, text, sender, timestamp and deterministic PDF bytes. Resend retains idempotency keys for **24 hours**: https://resend.com/docs/dashboard/emails/idempotency-keys . Our 23-hour window leaves a safety margin. After ambiguous timeout/rejection, retry unchanged details within that window. After expiry, contact Studio with the Build ID to reconcile before submitting again. Each click attempts each unconfirmed message once, with a 10-second provider timeout; there are no automatic background retries or queues.

Without persistent application state, exactly-once delivery is not guaranteed. The provider may accept a timed-out request, and an accepted notification can still bounce. Success means provider acceptance, not delivery, a confirmed booking or approved quotation. Check Resend delivery status and the owner inbox during incident investigation. The complete booking record is in the email/PDF, not a Studio database.

## Abuse controls

Same-origin checks, JSON/body-size limits, allowlisted inputs, email-header injection checks and a real offscreen honeypot are enforced and covered by tests. No per-instance in-memory counter pretends to provide shared rate limiting.

A Vercel WAF rule is scoped to **POST /api/booking-request in preview only**, with a 20-request/IP/60-second fixed window. A normal submission uses two requests (prepare then submit); unchanged retries use one. It was first configured in observation mode, then the owner explicitly approved preview enforcement and testing. Verify the active rule and an actual 429 response before calling the limit tested. Production is intentionally outside this rule and needs its own reviewed rollout before a public launch. Counters are regional, not a globally exact cap. Shared-IP users can share a bucket; distributed abuse may need tighter platform protection. Do not claim production rate limiting from preview evidence.

## PDF and commercial state

A4 portrait, full-width warm interior photograph, dark gradient, white BUILD DETAILS heading, cream body, itemized indicative prices, customer/Build metadata and payment summary are retained. The PDF prominently says PROVISIONAL / PENDING REVIEW, Payment received: ₹0, Amount payable now: ₹0, Final quotation: Pending approval. It is not a paid or tax invoice. The original reference attachment is unavailable, so exact visual fidelity is not claimed. Render package and long custom samples and inspect every page when changing layout.

## Verification

`pnpm build` runs tests, frontend and API TypeScript checks and production build. `PDF_SAMPLES=1 pnpm test` writes ignored samples under output/pdf. There is no configured lint tool; use `git diff --check` plus the existing TypeScript unused-symbol checks instead of inventing a lint result.

Tests cover package/custom sends, server pricing, options and contact validation, missing configuration, no-Supabase operation, owner-only recipient, subject/body/PDF, provider failure/timeout, immutable retry bytes, identity forgery/content changes/expiry and disabled legacy endpoints. Browser checks must cover both entry points, same-ID retry after rejection, monthly Care display and mobile layout. Final live acceptance must send clearly labelled owner-only test requests and inspect Resend's delivery status; do not infer delivery from a successful HTTP response alone.

## Dual-message outcomes and privacy operations

Both accepted: HTTP200 and pending_review. One accepted: HTTP202 with accurate partial feedback and per-message signed receipt. Neither accepted/ambiguous: HTTP503 with no delivery claim. Rejected addresses can be syntactically valid and later bounce; browser status has no webhook-backed inbox knowledge. Lost receipts do not bypass provider keys. After23hours reconcile with Studio before a new Build ID; no after-expiry automatic resend. The browser v2 session key contains only a hash, identity and signed receipts, which remain linkable metadata.

Separate required adult and terms checkboxes start unchecked. Privacy notice supplies purposes/providers without bundling marketing consent. Legal versions, timestamp and self-declared status are included in the signed snapshot and PDF/email, not a durable independent consent ledger. See [legal matrix](legal-compliance-matrix.md), [privacy operations](privacy-operations.md), [security findings](security-audit.md) and the [unapplied production plan](security/production-security-plan.md).

The public domain is branch-linked: do not push/deploy this branch under the assumption that “Preview” means no live-domain update. Use a detached isolated source deployment and verify aliases; no main merge or production promotion is authorized.

The revised `vercel.json` disables Git-triggered deployment specifically for `feature/studio-foundation` to prevent automatic movement of its linked public domain. Other branches are untouched. Manual file-source Preview deployment remains available; verify its aliases are empty and the public alias remains on its prior deployment. See [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration) and [branch-domain behavior](https://vercel.com/docs/cli/alias). Restore automatic branch deployment only with approval of its live-domain effect.
