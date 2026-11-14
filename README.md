# Studio by Shashwat Aneja

Service discovery, indicative project planning and email-based booking requests.

## Development

Use Node 22+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. `pnpm build` runs all tests, frontend and API TypeScript checks, and a Vite production build. Vite alone serves the UI; API integration requires Vercel or a Vercel development server.

## Booking workflow

Pricing tier selection and custom workshop requests open the same contact/terms form. POST `/api/booking-request` validates inputs and derives scope/pricing server-side. A server-issued UUID and signed retry token are prepared before a notification and provisional BUILD DETAILS PDF are sent to **studio@shashwataneja.com only**. Customer email is reply-to, never a recipient. A successful response means the provider accepted the notification, not inbox delivery or project approval.

Every request is pending review. No payment is collected, no dashboard account is provisioned, and no finalized invoice is sent. The legacy order/webhook endpoints return 410 regardless of old environment settings. Historical payment/dashboard migrations remain for existing data; this workflow does not invoke them.

Booking requests require only `RESEND_API_KEY` and a verified `STUDIO_FROM_EMAIL`. No Supabase URL, service key, table or RPC is required. Historical migrations are retained but unused by this workflow.

See [booking operations and configuration](docs/booking-workflow.md). Work is restricted to `feature/studio-foundation`; do not merge or deploy production without separate authorization.
