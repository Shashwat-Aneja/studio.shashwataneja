export default function handler(_req: any, res: any) {
 res.statusCode = 410;
 res.setHeader("Content-Type", "application/json");
 res.setHeader("Cache-Control", "no-store");
 res.end(JSON.stringify({error:"Payments and dashboard provisioning are disabled. Submit a booking request in Studio."}));
}
