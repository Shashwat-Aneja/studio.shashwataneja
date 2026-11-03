export default function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }
  const env = process.env;
  const checkoutConfigured = env.PAYMENTS_ENABLED === "true" &&
    Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.RAZORPAY_WEBHOOK_SECRET &&
      env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
  res.statusCode = 200;
  res.end(JSON.stringify({
    service: "studio",
    status: "online",
    checkout: checkoutConfigured ? "configured" : "disabled",
    message: checkoutConfigured
      ? "Payment environment variables are present; run the payment and database acceptance tests before launch."
      : "Studio is available in preview mode. Online checkout is disabled until pricing terms and provider configuration are approved."
  }));
}
