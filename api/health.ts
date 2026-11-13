export default function handler(req:any,res:any){
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.statusCode=req.method==='GET'?200:405;
 const e=process.env;
 res.end(JSON.stringify({service:'studio',status:'online',checkout:'disabled',dashboard:'disabled',booking: e.SUPABASE_URL&&e.SUPABASE_SERVICE_ROLE_KEY&&e.RESEND_API_KEY&&e.STUDIO_FROM_EMAIL&&e.BOOKING_RATE_LIMIT_SECRET?'configuration_present_unverified':'configuration_missing'}));
}
