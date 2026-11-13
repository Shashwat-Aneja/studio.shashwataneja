# Booking requests and operational handoff

## Configuration blockers found on 13 November 2026

- Connected Supabase `studio` project `rcayefwtodtklawrupfg` is INACTIVE; schema inspection returns “Database is possibly not accessible at the moment”. No live migration was applied.
- Vercel project `studio-shashwataneja` has Supabase URL/service role entries, but no RESEND_API_KEY, STUDIO_FROM_EMAIL or BOOKING_RATE_LIMIT_SECRET. Secret contents were not read or copied.
- Restore the database, inspect its existing schema, then apply `supabase/migrations/20261113145105_studio_booking_requests.sql`. Validate RLS and service-only RPC grants before enabling submissions. Use an isolated preview database if available.
- Configure the three missing variables directly in Vercel, scoped to Preview / feature/studio-foundation. Use an authenticated sender domain and sending-only email key. Generate a random rate-limit secret. Redeploy the feature preview. Never add credentials to frontend variables or source control.
- The exact original BUILD DETAILS attachment is unavailable in the referenced chat export. The implementation follows the supplied design description using a bundled warm interior photograph and Noto Sans. Review the sample PDF before adopting the design.

## Delivery and retries

The database RPC serializes request-ID and hashed-IP locks, enforces five new requests per IP per hour, and stores immutable scope, normalized contact details, consent version and timestamp. The table has RLS, no public access, and only service-role grants. The RPC is SECURITY INVOKER and executable only by service_role. Rate keys are salted hashes, not raw IP addresses. Review retention periodically and remove expired customer records according to Studio policy; deleting a row also removes its retry protection.

A request UUID survives retries while the form remains open. Reusing it with different details returns 409. After an error, retry unchanged details; reopen the form for a new request. Resend receives a deterministic attachment and request-specific idempotency key. Provider failures leave the row pending. If receipt persistence fails after acceptance, retry uses the same provider key. Ambiguous pending requests older than 23 hours require manual reconciliation before resending because provider deduplication expires after 24 hours. Do not blindly resend them. Pending rows can be reviewed by the owner in Supabase; no automatic background queue or delivery webhook is provisioned in this phase.

The provider's accepted message ID is recorded; `email_status=sent` means accepted, not confirmed inbox delivery. Check provider delivery/bounce status when investigating missing notifications. No customer email is automatically sent. Review scope, price, availability, taxes and milestones, then manually approve and prepare the final quotation/invoice. Never infer payment from a request or mark a request paid.

## Verification

`pnpm build` runs frontend/API type checks plus tests for package pricing authority, custom inputs, methods/origins/body limits, missing configuration, storage-before-email, fixed recipient and PDF attachment, duplicate completion, conflicts, throttling, provider failures, deterministic retries, stale retries and disabled payment endpoints. `PDF_SAMPLES=1 pnpm test` creates ignored PDFs under output/pdf for visual review.

Live acceptance after configuration: submit a test package and custom request; confirm exactly one row and one Studio notification for each, inspect attachments, retry the same request ID, confirm no customer recipient, no auth user/project/payment record, and zero money collected. Live success is blocked until the database and email settings above are restored. Validate migration permissions with anon/authenticated negative checks and service-role positive checks before calling it production ready.
