# Privacy and email operations — proposed runbook

14 November 2026. This is an executable operating procedure for owner adoption, not evidence that historical requests, retention controls or breach exercises have already been completed. Operator: Shashwat Aneja. Public business address and formal grievance responsibility need confirmation. Use studio@shashwataneja.com as the published contact, without claiming a designated officer exists.

## Processing inventory and grounds

| Entry / location | Data and purpose | Basis assessment / controls | Actual retention evidence |
|---|---|---|---|
| Pricing/custom booking form | Name, email, phone, notes, allowlisted scope; review requested service | Voluntary specified-purpose enquiry; terms agreement and adult declaration separate. Future DPDP s7(a) may apply; review actual facts. No marketing or additional blanket privacy checkbox. | No app database; request memory exists during processing. Provider logs/email persist independently. |
| Server/PDF | Same details plus server estimate, UUID, timestamp, legal versions, self-declared adult status | Provisional review and immediate customer copy; same PDF sent to Studio and entered address. No finalized invoice, collection or provisioning. | No intentional filesystem PDF archive on server; transient buffers do not imply all provider copies are deleted. |
| Resend | Two recipients/messages/attachments, status and metadata | Transactional processing, restricted sender/key; open/click tracking observed disabled. | Account retention/log deletion not verified. 24-hour idempotency is NOT email retention. |
| Cloudflare → Gmail | Incoming Studio alias forwarded to owner; mailbox copies and attachments | Service handling; access only for authorized operator; forwarding destination is not published in customer copy. | No approved mailbox/backup/deletion schedule, Gmail Vault/legal holds or automatic purge verified. |
| Vercel | Request IP/headers, function/edge/security logs; US runtime observed | Security/service operation; exclude raw form body, email, signed identities and secrets from app logs. | Plan-specific retention, export location and provider deletion need confirmation. No India 180-day log archive configured. |
| Browser | Theme localStorage; retry identity/receipts in sessionStorage keyed by form hash | Functionality, no marketing analytics. Hash/tokens remain linkable; not anonymous. Browser may preserve sessions on restore. | Theme until cleared; session data browser-managed, no promised exact deletion deadline. Signed identity expires after23h but stored bytes can remain. |
| Public images | Unsplash requests expose IP/referrer metadata; no enquiry content in image URLs | Presentation; no tracking script found in source. Referrer-Policy no-referrer. | Third-party logs not inspected. External image failure does not affect request validation. |
| Contact links / replies | Voluntary email and follow-up details | Requested conversation; unsolicited sensitive/child data needs triage | Mailbox/provider schedule pending. No hidden contact database found. |

No analytics SDK, marketing subscription, third-party iframe or Supabase booking operation was found in the inspected source. Hosting protection cookies and account-level analytics configuration need separate verification; source inspection alone cannot prove there are no platform cookies.

## Rights, withdrawal, deletion and complaints

1. Monitor the published Studio mailbox. Record receipt time, Build ID, type, deadline, responsible person and outcome in an access-controlled owner register (not public Git). This register is proposed; none was fabricated during audit.
2. Acknowledge promptly. If E-Commerce Rules apply, operationally meet their48-hour acknowledgement and one-month redress. SPDI Rule5 grievance timelines and future DPDP Rule14 requirements need applicability review. Future DPDP maximum90-day grievance provision is not permission to ignore a shorter currently applicable rule.
3. Verify proportionately using the originating address and Build ID. Do not routinely request Aadhaar, DOB, passport or other ID. Do not reveal whether another address made a booking.
4. Locate both messages/PDFs, Gmail folders/Trash/forwarded copies, Resend records, relevant Vercel logs and any manual exports. Coordinate provider requests with their actual contractual tools. A correction may require a clearly labeled superseding PDF; do not silently rewrite historical evidence.
5. Stop optional follow-up and future consent-based processing when requested, subject to necessary lawful retention. Explain any service consequences. Separate consent withdrawal from deletion and from final-contract cancellation.
6. Delete or restrict applicable copies after checking tax/dispute/security/legal holds. Document exceptions, provider backup limitations and actual result. Do not promise immediate global deletion. Notify the requester of completed actions and unresolved provider retention.
7. Escalate unresolved statutory complaints through applicable consumer mechanisms/courts and, when legally available, DPDP machinery. Publish the confirmed officer/address before launch where required.

## Retention decision required

Owner and adviser must set categories, periods, trigger events, legal grounds/holds, storage region, access, deletion owner and provider verification. Separate unconverted enquiries, approved contracts/tax records, incident/security logs, delivery metadata, retry tokens and backups. Do not impose a universal short purge or a universal one-year rule. Existing unknown retention is disclosed in the policy. No destructive mailbox purge, account deletion or DNS change was performed.

## Incident handling

- Immediately contain the affected credential/deployment/mailbox, preserve minimal relevant evidence, note UTC time first noticed and who was notified. Rotate compromised keys securely; do not paste them into chats/logs. Rotation invalidates existing signatures, so reconcile active Build IDs manually.
- Assess affected data, recipients, route, scale and AnnexI CERT-In categories with a qualified responder. Where directions apply, report listed incidents within **six hours of noticing or being informed**; do not wait for a complete investigation. Use the official CERT-In reporting contacts/forms from its current site. Nominate the required contact and confirm synchronized clocks and the180-day India-log arrangements.
- Notify affected people factually where law/contract requires; do not claim an unconfirmed breach or falsely assure no exposure. Preserve updates and follow-up findings.
- Prepare separately for future DPDP Rule7: initial notices without delay and Board detail within72hours (or allowed extension), once operative. This is not today's universal72-hour reporting rule and does not replace CERT-In's shorter clock.
- Reconcile provider delivery/bounce events. “Accepted” can later bounce; no webhook currently changes the stateless browser status. Contact the customer through the validated alternate channel only where appropriate. Never mark paid or confirmed based on email status.

## Access and supplier review before launch

Confirm MFA, least privilege, active users/sessions, mailbox forwarding/filters, device security, export controls, subprocessors, processing agreements, storage/backup regions and deletion support across GitHub/Vercel/Resend/Cloudflare/Google. These account controls were not certified by this source audit. Run a tabletop incident and a correction/deletion exercise with synthetic records; record actual results without customer data in the repository.
