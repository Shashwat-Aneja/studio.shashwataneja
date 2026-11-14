export default function handler(req:any,res:any){
 res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.statusCode=req.method==='GET'?200:405;
 res.end(JSON.stringify({service:'studio',status:'online',checkout:'disabled',dashboard:'disabled',booking:process.env.RESEND_API_KEY&&process.env.STUDIO_FROM_EMAIL?'email_configuration_present_unverified':'email_configuration_missing'}));
}
