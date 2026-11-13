import {createHash} from 'node:crypto';
import {parseRequest} from '../server/request.js';
import {buildPdf} from '../server/pdf.js';
export const config={maxDuration:30};
const respond=(res:any,status:number,body:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
export default async function handler(req:any,res:any){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(res,405,{error:'Method not allowed.'});}
 try{
  const origin=new URL(req.headers.origin);if(origin.protocol!=='https:'&&origin.hostname!=='localhost')throw Error();if(origin.host!==req.headers.host&&origin.origin!==process.env.STUDIO_ALLOWED_ORIGIN)throw Error();
 }catch{return respond(res,403,{error:'Origin is not allowed.'});}
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return respond(res,415,{error:'JSON required.'});
 if(Number(req.headers['content-length']||0)>24000)return respond(res,413,{error:'Request too large.'});
 let body=req.body;
 try{if(typeof body==='string')body=JSON.parse(body);if(Buffer.byteLength(JSON.stringify(body??{}))>24000)return respond(res,413,{error:'Request too large.'});}catch{return respond(res,400,{error:'Invalid JSON.'});}
 let snapshot;try{snapshot=parseRequest(body);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId))throw Error('Invalid request reference.');}catch(err){return respond(res,400,{error:err instanceof Error?err.message:'Invalid request.'});}
 const env=process.env;
 if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY||!env.RESEND_API_KEY||!env.STUDIO_FROM_EMAIL||!env.BOOKING_RATE_LIMIT_SECRET)return respond(res,503,{error:'Booking requests are not configured yet. Please contact studio@shashwataneja.com.'});
 const headers={apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'};
 const root=env.SUPABASE_URL.replace(/\/$/,'')+'/rest/v1';
 const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
 try{
  // Vercel overwrites x-vercel-forwarded-for; do not trust browser-controlled forwarded headers.
  const ip=String(req.headers['x-vercel-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];
  const stored=await fetch(root+'/rpc/submit_studio_request',{method:'POST',headers,signal:AbortSignal.timeout(8000),body:JSON.stringify({p_id:body.requestId,p_hash:hash(JSON.stringify(snapshot)),p_snapshot:snapshot,p_rate_key:hash(env.BOOKING_RATE_LIMIT_SECRET+ip)})});
  if(!stored.ok)throw Error('storage');const row=await stored.json();
  if(row.error==='rate_limit')return respond(res,429,{error:'Too many requests. Please try again in an hour.'});
  if(row.error==='conflict')return respond(res,409,{error:'This request was already submitted with different details. Reopen the form to create a new request.'});
  if(row.email_status==='sent')return respond(res,200,{reference:row.id,status:'pending_review'});
  // Provider deduplication expires after 24h. Older ambiguous sends require manual reconciliation.
  if(Date.now()-Date.parse(row.created_at)>23*3600000)return respond(res,409,{error:'Your request is saved and needs manual review. Contact studio@shashwataneja.com with reference '+row.id});
  const pdf=await buildPdf(row.snapshot,row.id,row.created_at);
  const text=['PROVISIONAL / PENDING REVIEW','Build ID: '+row.id,row.snapshot.title,JSON.stringify(row.snapshot,null,2),'No payment collected. Review before sending a finalized invoice.'].join('\n\n');
  const email=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`studio-request/${row.id}`},body:JSON.stringify({from:env.STUDIO_FROM_EMAIL,to:['studio@shashwataneja.com'],reply_to:row.snapshot.contact.email,subject:`[Pending review] Studio build ${row.id}`,text,attachments:[{filename:`BUILD-DETAILS-${row.id}-provisional.pdf`,content:pdf.toString('base64')}]})});
  if(!email.ok)throw Error('email');const receipt=await email.json();if(!receipt.id)throw Error('email');
  const updated=await fetch(root+'/studio_booking_requests?id=eq.'+row.id,{method:'PATCH',headers,signal:AbortSignal.timeout(8000),body:JSON.stringify({email_status:'sent',email_provider_id:receipt.id})});
  if(!updated.ok)throw Error('receipt');
  return respond(res,200,{reference:row.id,status:'pending_review'});
 }catch{return respond(res,503,{error:'Submission could not finish. If saved, retrying this form safely resumes the same request. Please retry or contact studio@shashwataneja.com.'});}
}
