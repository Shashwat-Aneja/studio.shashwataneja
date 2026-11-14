# Studio email-only launch

Follow [booking operations](booking-workflow.md). The historical payment and dashboard migrations are not required. Both legacy payment endpoints return 410 permanently in this phase; environment variables cannot enable them. Do not follow old Razorpay/Supabase launch instructions for the current booking workflow.

Required: configure a sending-only Resend key and verified Studio sender in Vercel, review the preview, publish and test the scoped Vercel rate-limit rule, then run owner-only live email acceptance and delivery checks. Do not activate payment or dashboard features.
