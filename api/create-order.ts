import { randomUUID } from "node:crypto";
import { createBlueprint } from "../src/engine/blueprint";
import { serviceCatalog } from "../src/data/catalog";

const json = (res: any, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed." });
  const origin = req.headers.origin;
  const host = req.headers.host;
  const allowedOrigin = process.env.STUDIO_ALLOWED_ORIGIN;
  if (!origin || (new URL(origin).host !== host && origin !== allowedOrigin)) {
    return json(res, 403, { error: "Origin is not allowed." });
  }
  if (process.env.PAYMENTS_ENABLED !== "true") {
    return json(res, 503, { error: "Online booking is not enabled yet. The owner must confirm pricing and booking terms first." });
  }
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return json(res, 503, { error: "Checkout is not configured." });
  }
  const body = req.body ?? {};
  const contact = body.contact ?? {};
  const r = body.requirement;
  if (!r || !["presence","commerce","application","brand","growth","technical"].includes(r.goal) ||
      !["lean","standard","advanced"].includes(r.scale) ||
      !["focused","custom","signature"].includes(r.designLevel) ||
      !["standard","priority","rush"].includes(r.deliverySpeed) ||
      !["personal","business","customers","internal","mixed"].includes(r.audience) ||
      !Array.isArray(r.features) || r.features.length > 10 ||
      !Array.isArray(r.integrations) || r.integrations.length > 8 ||
      typeof contact.name !== "string" || !contact.name.trim() || contact.name.length > 120 ||
      typeof contact.email !== "string" || !/^\S+@\S+\.\S+$/.test(contact.email.trim()) ||
      typeof contact.phone !== "string" || contact.phone.replace(/\D/g, "").length < 7 || contact.phone.replace(/\D/g, "").length > 15 ||
      typeof contact.notes !== "string" || contact.notes.length > 2000 ||
      body.agreementAccepted !== true) {
    return json(res, 400, { error: "Please check your project details and agreement acceptance." });
  }
  try {
    const blueprint = createBlueprint({
      goal: r.goal, audience: r.audience, scale: r.scale, features: r.features,
      integrations: r.integrations, designLevel: r.designLevel,
      contentRequirement: ["provided","assisted","full"].includes(r.contentRequirement) ? r.contentRequirement : "assisted",
      infrastructureRequirement: r.infrastructureRequirement === true,
      seoRequirement: ["none","foundation","growth"].includes(r.seoRequirement) ? r.seoRequirement : "foundation",
      automationRequirement: ["none","light","advanced"].includes(r.automationRequirement) ? r.automationRequirement : "none",
      deliverySpeed: r.deliverySpeed,
      budgetRange: ["under-10k","10-25k","25-50k","50-100k","100k-plus"].includes(r.budgetRange) ? r.budgetRange : "25-50k",
      preferences: Array.isArray(r.preferences) ? r.preferences.slice(0,8) : []
    });
    const amount = blueprint.estimate.booking * 100;
    if (!Number.isSafeInteger(amount) || amount < 100) return json(res, 400, { error: "The calculated booking amount is invalid." });
    const bookingReference = randomUUID();
    const notes = {
      bookingReference, name: contact.name.trim().slice(0,120), email: contact.email.trim().toLowerCase().slice(0,200),
      phone: contact.phone.trim().slice(0,30), projectTitle: blueprint.title.slice(0,200),
      goal: r.goal, scale: r.scale, designLevel: r.designLevel,
      features: r.features.join(", ").slice(0,240), integrations: r.integrations.join(", ").slice(0,240),
      estimateLow: String(blueprint.estimate.low), estimateHigh: String(blueprint.estimate.high),
      bookingAmountPaise: String(amount),
      timelineDays: String(blueprint.timeline.reduce((sum, phase) => sum + phase.duration, 0)),
      notes: contact.notes.trim().slice(0,240)
    };
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(RAZORPAY_KEY_ID + ":" + RAZORPAY_KEY_SECRET).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount, currency: "INR", receipt: bookingReference.replaceAll("-", "").slice(0,40), notes })
    });
    const order = await response.json();
    if (!response.ok || !order.id) {
      console.error("Razorpay order creation failed", response.status);
      return json(res, 502, { error: "The payment provider could not create a checkout. Please try again later." });
    }
    return json(res, 200, {
      keyId: RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency,
      bookingReference, estimate: { low: blueprint.estimate.low, high: blueprint.estimate.high, booking: blueprint.estimate.booking }
    });
  } catch (error) {
    console.error("Checkout initialization failed", error);
    return json(res, 500, { error: "Checkout could not be initialized." });
  }
}
