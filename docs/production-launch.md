# Studio production launch

## Current state
The public site and preview can be deployed independently of payment processing. Checkout is deliberately disabled unless `PAYMENTS_ENABLED=true`. Do not enable it until the service catalogue and the ₹4,999 minimum are approved. The current estimator treats that minimum as a booking-payment floor; if it is meant to be a minimum project value instead, update the pricing engine and checkout before enabling payments.

## Payment setup
1. Create a Razorpay account and use test keys first.
2. Create a Supabase project dedicated to Studio.
3. Run `supabase/migrations/202610210001_studio_payment_confirmation.sql` in the Supabase SQL editor.
4. Set the environment variables from `.env.example` in Vercel Preview first. Never expose `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or `SUPABASE_SERVICE_ROLE_KEY` to browser code.
5. Configure a Razorpay webhook URL: `https://studio.shashwataneja.com/api/razorpay-webhook`, subscribe to `payment.captured`, and copy its signing secret into Vercel.
6. Test successful, failed, cancelled, duplicated and mismatched payment events using Razorpay test mode.
7. Only after all tests and owner approval, set `PAYMENTS_ENABLED=true`.

## Security model
- The server recomputes the estimate from validated requirements; it never trusts a browser-supplied price.
- Checkout order creation is same-origin guarded and disabled by default.
- A browser checkout callback is not proof of payment.
- The webhook verifies Razorpay's HMAC signature, fetches the provider order, and checks paid status, currency and amount before calling a service-role-only Supabase RPC.
- The SQL function is transactional and idempotent. Permanent client, project and payment rows are created only after verified payment capture.
- Public and authenticated Supabase roles have no table access. The service-role key is server-only.
- Apply Vercel rate limiting / firewall rules before public payment launch.

## Owner decisions required before live payments
- Confirm whether ₹4,999 is a minimum project value or a minimum booking payment.
- Approve the detailed service catalogue prices and scope add-ons.
- Provide Razorpay and Supabase credentials through Vercel environment settings; do not paste secrets into chat or commit them.
- Review the final privacy notice, cancellation/refund terms and agreement copy before accepting paid bookings.
