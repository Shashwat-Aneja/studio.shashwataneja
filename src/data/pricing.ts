export type ProjectGoal = "presence" | "commerce" | "application" | "brand" | "growth";
export type ProjectScale = "lean" | "standard" | "advanced";
export type DeliverySpeed = "standard" | "priority" | "rush";

const ranges: Record<ProjectGoal, Record<ProjectScale, [number, number]>> = {
  presence: { lean: [6999, 14999], standard: [14999, 29999], advanced: [29999, 59999] },
  commerce: { lean: [24999, 49999], standard: [49999, 99999], advanced: [99999, 199999] },
  application: { lean: [49999, 99999], standard: [74999, 149999], advanced: [149999, 399999] },
  brand: { lean: [9999, 19999], standard: [19999, 39999], advanced: [39999, 74999] },
  growth: { lean: [4999, 9999], standard: [9999, 19999], advanced: [19999, 49999] },
};
const multipliers: Record<DeliverySpeed, number> = { standard: 1, priority: 1.25, rush: 1.2 };
export function estimateProject(goal: ProjectGoal, scale: ProjectScale, speed: DeliverySpeed) {
  const [low, high] = ranges[goal][scale], multiplier = multipliers[speed];
  const adjustedLow = Math.round((low * multiplier) / 100) * 100;
  const adjustedHigh = Math.round((high * multiplier) / 100) * 100;
  return { low: adjustedLow, high: adjustedHigh, booking: Math.round((adjustedLow * 0.02) / 100) * 100 };
}
export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}
