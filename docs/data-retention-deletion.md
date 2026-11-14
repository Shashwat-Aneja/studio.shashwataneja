# Enquiry retention and deletion procedure

Owner: Shashwat Aneja; privacy/customer grievances: studio@shashwataneja.com. Approved 14 November 2026. This is a manual operating procedure, not deployed automation or proof that historical records have been deleted.

## Ordinary unconverted enquiries

Keep necessary enquiry correspondence for six calendar months after the last substantive interaction: a customer message or meaningful operator response about that enquiry. Automated acknowledgments, retries, opens, bounces, security events and internal label changes do not reset it. Do not send artificial follow-ups to extend retention. For a new unrelated project, record a separate enquiry; do not indefinitely extend an older thread.

Use the actual latest qualifying message timestamp in UTC. Calculate the due date six calendar months later, clamping to the last day when that month lacks the original day. Example: 31 August → 28 February (29 in leap years). Converted projects move to a separately approved contract/accounting schedule, not an indefinite exemption.

The operator must maintain a private access-controlled register outside Git: Build ID or minimal case reference, category, last qualifying interaction date, due date, message pointers, approved hold and reason, next review date, locations checked, deletion date/outcome. Avoid copying message contents, tokens, phone numbers or PDFs into this register. Register creation, historic inventory and daily operation remain owner tasks; this execution created no private customer register.

## Storage inventory and evidence

| Location | Evidence / scope | Required action and unresolved limitation |
| --- | --- | --- |
| Function memory / generated PDF | Source generates PDFs in memory; no application booking database or runtime file write | Request lifetime only in application logic; provider memory/log lifecycle is separate. Do not infer zero provider retention. |
| Resend emails, attachments and delivery metadata | Source sends two messages per complete first request. Account inspection found zero webhooks | [Published provider policy](https://resend.com/security/gdpr) says standard plans retain email/log data 30 days and backups seven days; enterprise varies. Individual sent-email removal requires support, not a deletion API. Confirm actual plan/contract; record provider request/outcome. Do not extend provider copies to six months merely to match a maximum enquiry policy. |
| Cloudflare Email Routing → Gmail | Prior verified release describes forwarding; current Cloudflare account settings not inspected | Confirm destinations, workers, activity/email-preview storage, failed-message queues and subprocessor/backup terms. No assumption that routing has no stored metadata or copies. |
| Gmail mailbox, Sent, All Mail, Spam, Trash and replies | Prior inbox delivery evidence; no mailbox inventory or deletion in this stage | Review whole conversation and attachments, including sent replies and aliases. [Gmail deletion guidance](https://support.google.com/mail/answer/7401) distinguishes Trash from permanent deletion. Permanently delete only reviewed eligible messages; confirm any Workspace/Vault hold, synced mail client or backup first. |
| Vercel function/edge/firewall logs and traces | Current API runs on Vercel; source previously emitted no custom outcomes | New source logs only event/status/outcome. [Runtime-log retention is plan dependent](https://vercel.com/docs/logs/runtime); it is not a verified 180-day archive. Confirm enabled tracing, drains, redaction, regions and actual retention. Do not export customer bodies for monitoring. |
| Cloudflare security/access logs | No connected account access; public header result does not prove proxy configuration | Inspect zone proxy status, client-IP handling, WAF, Logpush/destinations, retention and location. Resolve before claiming production coverage. |
| Local/exported PDFs, downloads and backups | Test PDFs exist under output/pdf and /private/tmp/studio-pricing-pdf-checks; synthetic only | Operator inventories real downloads, desktop/mobile mail attachments, exports, synced folders and backups. Delete eligible real copies by case; no bulk directory deletion. Record backup expiry and re-delete on restore. Test data is not evidence of customer purge. |
| Browser | Theme localStorage and signed retry metadata in sessionStorage | No raw contact/PDF in app storage. Retry identity expires after 23 hours; browser bytes can outlive expiry. User clearing storage is separate from server/provider erasure. |
| Customer inbox | Acknowledgment and PDF sent to supplied address | Outside Studio control; do not claim remote erasure. Address ownership is not independently verified; report misuse through Studio contact. |
| Contracts, invoices, complaints, security incidents and holds | No final invoice/payment in this application | Separate category-specific lawful retention, access and review dates; adviser approval needed. Minimize retained evidence, do not use blanket permanent holds. |

## Manual execution

1. Check new correspondence and complaints daily; record the qualifying date and due date. Review upcoming expiries weekly and schedule deletion on the due date. A weekly-only purge can exceed six months; if a deadline is missed, record it as an exception and rectify promptly.
2. Before deletion, check conversion, unresolved complaint, tax/accounting duty, litigation or security hold. Record necessity, minimum data, legal basis, approver and review/release date. Do not silently change the six-month policy.
3. Locate all Studio-controlled copies by Build ID and the originating address. Review thread context; do not delete unrelated projects in a shared conversation. Coordinate applicable provider removal/expiry and backup limitations.
4. Delete only reviewed eligible records. Verify mailbox search and local inventory afterward. Keep a minimal deletion outcome, not the deleted contact details or full PDF. The deletion audit itself needs an approved short, justified schedule before operation.
5. On a deletion request, verify through the originating email and Build ID proportionately; do not routinely seek identity documents or reveal whether a different person submitted. Acknowledge, apply applicable grievance deadlines, stop optional follow-up, delete eligible copies and explain any restricted holds/provider exceptions. Do not claim complete provider erasure without evidence.
6. Run a synthetic lifecycle exercise before launch: create case, advance due date in a test register, identify copies, simulate hold and release, perform test-only deletion, verify and record results. This stage documents but does not claim completion of that operational exercise.

## Legal exceptions and future conflict

CERT-In directions may require 180-day ICT logs in India for covered entities; this is distinct from six calendar months of enquiry correspondence. Confirm applicability and provider export/location capability. Security logs do not require routine retention of full enquiry PDFs by default.

Future DPDP Rules 6(1)(e) and 8(3) contain one-year retention provisions, including personal data/traffic/logs under Rule 8(3), not just anonymized metrics. They are in the eighteen-month commencement tranche due May 2027. Before then, counsel must resolve their category scope and conflict with this six-month policy, and provider capabilities, without silently overriding the owner decision. See the [official Rules](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf). Current provider defaults are not proof of future compliance.
