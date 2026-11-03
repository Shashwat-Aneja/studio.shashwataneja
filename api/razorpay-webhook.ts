import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

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

async function provisionDashboardAccess(projectId: string) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, STUDIO_FROM_EMAIL, DASHBOARD_URL } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !STUDIO_FROM_EMAIL || !DASHBOARD_URL) {
    throw new Error("Dashboard provisioning or email delivery is not configured.");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
  });
  const { data: project, error: projectError } = await supabase
    .from("studio_projects").select("id, client_id, title").eq("id", projectId).single();
  if (projectError || !project) throw new Error("Confirmed Studio project could not be loaded.");

  const { data: client, error: clientError } = await supabase
    .from("studio_clients").select("id, name, email, auth_user_id, dashboard_invited_at")
    .eq("id", project.client_id).single();
  if (clientError || !client) throw new Error("Studio client could not be loaded.");
  if (client.dashboard_invited_at) return;

  let authUser: any = null;
  let actionLink = "";
  let invitation = true;

  if (client.auth_user_id) {
    const { data, error } = await supabase.auth.admin.getUserById(client.auth_user_id);
    if (error || !data.user) throw new Error("Linked Dashboard account could not be loaded.");
    authUser = data.user;
    invitation = false;
  } else {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "invite",
      email: client.email,
      options: {
        data: { full_name: client.name },
        redirectTo: DASHBOARD_URL.replace(/\/$/, "") + "/auth/set-password"
      }
    });
    if (!error && data?.user && data.properties?.action_link) {
      authUser = data.user;
      actionLink = data.properties.action_link;
    } else {
      // A client may already have a Dashboard account created outside this booking.
      let existing: any = null;
      for (let page = 1; page <= 10 && !existing; page += 1) {
        const { data: users, error: listError } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (listError) throw listError;
        existing = users.users.find((user) => user.email?.toLowerCase() === client.email.toLowerCase()) ?? null;
        if (users.users.length < 1000) break;
      }
      if (!existing) throw error ?? new Error("Dashboard invitation could not be generated.");
      authUser = existing;
      invitation = false;
    }
  }

  if (!actionLink) {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: client.email,
      options: { redirectTo: DASHBOARD_URL.replace(/\/$/, "") + "/" }
    });
    if (error || !data?.properties?.action_link) throw error ?? new Error("Dashboard sign-in link could not be generated.");
    actionLink = data.properties.action_link;
  }

  const currentMetadata = authUser.app_metadata ?? {};
  const { error: roleError } = await supabase.auth.admin.updateUserById(authUser.id, {
    app_metadata: { ...currentMetadata, role: currentMetadata.role === "admin" ? "admin" : "client" }
  });
  if (roleError) throw roleError;

  const { error: linkError } = await supabase.from("studio_clients").update({
    auth_user_id: authUser.id
  }).eq("id", client.id);
  if (linkError) throw linkError;

  const dashboardUrl = DASHBOARD_URL.replace(/\/$/, "");
  const actionLabel = invitation ? "Set your password" : "Open your secure sign-in link";
  const subject = "Your Studio Dashboard access";
  const text = [
    "Your Studio booking is confirmed.",
    "",
    "Your Dashboard account is ready.",
    "Dashboard: " + dashboardUrl,
    "Account email: " + client.email,
    actionLabel + ": " + actionLink,
    "",
    invitation
      ? "Use the secure link to set your password, then sign in with your email and password."
      : "You can use your existing password or the secure sign-in link above.",
    "",
    "If you did not make this booking, reply to this email."
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#24231f;line-height:1.6">
    <p style="font-size:11px;letter-spacing:1.5px;color:#873f32;font-weight:700">STUDIO BY SHASHWAT ANEJA</p>
    <h1 style="font-size:25px;line-height:1.2">Your booking is confirmed.</h1>
    <p>Your Dashboard account is ready. Use it to follow your project with Studio.</p>
    <p><strong>Account:</strong> ${client.email}</p>
    <p><a href="${actionLink}" style="display:inline-block;padding:12px 18px;background:#873f32;color:#fff;text-decoration:none;border-radius:7px">${actionLabel}</a></p>
    <p><a href="${dashboardUrl}">Open your Dashboard</a></p>
    <p style="font-size:12px;color:#747168">This secure link is time-limited. Never share it with anyone.</p>
  </div>`;

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: STUDIO_FROM_EMAIL, to: [client.email], subject, text, html })
  });
  if (!emailResponse.ok) {
    console.error("Dashboard access email failed", emailResponse.status, await emailResponse.text());
    throw new Error("Dashboard access email could not be delivered.");
  }

  const { error: sentError } = await supabase.from("studio_clients").update({
    dashboard_invited_at: new Date().toISOString()
  }).eq("id", client.id);
  if (sentError) throw sentError;
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
    const confirmation = await rpc.json();
    if (!confirmation?.project_id) {
      console.error("Payment confirmation returned no project identifier.");
      return json(res, 500, { error: "Payment was recorded but project handoff could not be completed." });
    }
    try {
      await provisionDashboardAccess(String(confirmation.project_id));
    } catch (provisionError) {
      console.error("Dashboard account provisioning failed after payment confirmation", provisionError);
      return json(res, 500, { error: "Payment is confirmed. Dashboard access email is pending and will be retried." });
    }
    return json(res, 200, { received: true, paymentConfirmed: true, dashboardAccess: "sent" });
  } catch (error) {
    console.error("Payment webhook processing failed", error);
    return json(res, 500, { error: "Webhook processing failed." });
  }
}
