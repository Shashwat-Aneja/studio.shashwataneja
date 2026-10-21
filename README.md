# Studio by Shashwat Aneja

Independent digital studio website for service discovery, project planning, indicative estimates and booking preparation.

## Preview and deployment
- Branch: `feature/studio-foundation`
- Custom branch domain: https://studio.shashwataneja.com
- Vercel project: `studio-shashwataneja`
- Pull request: https://github.com/Shashwat-Aneja/studio.shashwataneja/pull/1

The custom domain is mapped to the feature branch so the Studio site can be reviewed without merging to `main`. The portfolio site remains separate.

## Local development
```bash
npm install
npm run dev
npm run build
npm test
```

## Main capabilities
- Responsive editorial homepage and four atmosphere themes
- Nine service categories and outcome-led project workshop
- Indicative pricing engine, budget-fit signal, recommendations and timeline
- Copyable project brief
- Booking flow with contact validation, agreement checkpoint and server-controlled checkout gate
- Privacy and terms review drafts, robots directives and sitemap
- Razorpay order endpoint and signed webhook handler, gated off by default
- Supabase migration for atomic, idempotent creation of client/project/payment records after verified payment capture
- Automated build and unit-test workflow

## Payment launch gate
Online checkout remains disabled by default. Do not enable it until the owner confirms the detailed service prices and whether ₹4,999 is a minimum project value or a minimum booking payment. See [production launch instructions](docs/production-launch.md).

Never commit secrets. Configure Razorpay and Supabase credentials only in Vercel environment settings. The Supabase service-role key must never be exposed to browser code.
