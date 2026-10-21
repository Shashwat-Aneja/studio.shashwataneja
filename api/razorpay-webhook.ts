import { createHmac, timingSafeEqual } from "node:crypto";

export const config = { api: { bodyParser: false } };

async function rawBody(req: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}
function json(res: any, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!secret || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 503, { error: "Payment webhook is not configured." });
  }
  try {
    const raw = await rawBody(req);
    const received = String(req.headers["x-razorpay-signature"] || "");
    const expected = createHmac("sha256", secret).update(raw).digest("hex");
    const a = Buffer.from(received);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return json(res, 400, { error: "Invalid signature." });

    const event = JSON.parse(raw.toString("utf8"));
    if (event.event !== "payment.captured") return json(res, 200, { received: true, ignored: true });
    const payment = event.payload?.payment?.entity;
    if (!payment?.id || !payment?.order_id || payment.captured !== true) return json(res, 400, { error: "Invalid captured-payment payload." });

    const auth = "Basic " + Buffer.from(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET).toString("base64");
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders/" + encodeURIComponent(payment.order_id), { headers: { Authorization: auth } });
    const order = await orderResponse.json();
    if (!orderResponse.ok || order.id !== payment.order_id || order.status !== "paid" ||
        Number(order.amount) !== Number(payment.amount) || order.currency !== payment.currency ||
        !order.notes?.bookingReference || Number(order.notes?.bookingAmountPaise) !== Number(payment.amount)) {
      return json(res, 400, { error: "Payment and order details did not match." });
    }
    const eventId = String(req.headers["x-razorpay-event-id"] || payment.id).slice(0,200);
    const rpc = await fetch(SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/confirm_studio_payment", {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: "Bearer " + SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        p_provider_event_id: eventId, p_order_id: order.id, p_payment_id: payment.id,
        p_amount_paise: Number(payment.amount), p_currency: payment.currency, p_notes: order.notes
      })
    });
    if (!rpc.ok) {
      console.error("Verified payment could not be persisted", rpc.status, await rpc.text());
      return json(res, 500, { error: "Verified payment persistence failed; provider will retry the webhook." });
    }
    return json(res, 200, { received: true });
  } catch (error) {
    console.error("Payment webhook processing failed", error);
    return json(res, 500, { error: "Webhook processing failed." });
  }
}
