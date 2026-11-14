export type AcceptanceStatus='accepted'|'rejected'|'unconfirmed';
export type EmailStatuses={studio:{status:AcceptanceStatus};customer:{status:AcceptanceStatus}};
export function bookingStatusMessage(emails:EmailStatuses){
 if(emails.studio.status==='accepted'&&emails.customer.status==='accepted')return 'Both the Studio notification and your acknowledgment email were accepted by the email provider. Inbox delivery is not guaranteed. Studio will review your requirements and contact you.';
 if(emails.studio.status==='accepted')return 'The Studio notification was accepted, but your acknowledgment email is not confirmed as accepted. Retry the unchanged request with the same Build ID, or contact Studio. Check your email address before starting a replacement request.';
 if(emails.customer.status==='accepted')return 'Your acknowledgment email was accepted, but the Studio notification is not confirmed as accepted. Retry the unchanged request with the same Build ID, or contact Studio.';
 return 'Neither email is confirmed as accepted. Retry the unchanged request with the same Build ID, or contact Studio. An unconfirmed attempt may still arrive.';
}
