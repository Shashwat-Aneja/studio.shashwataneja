import {parseRequest} from '../server/request.js';
import {buildPdf} from '../server/pdf.js';
import {issueIdentity,providerKey,verifyIdentity} from '../server/booking-identity.js';
export const config={maxDuration:30};
const respond=(res:any,status:number,body:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
const validSender=(from:string)=>!/[\x00-\x1f\x7f]/.test(from)&&/^(?:[^<>]+ <)?[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-z0-9-]+\.)*shashwataneja\.com>?$/i.test(from);
export default async function handler(req:any,res:any){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(res,405,{error:'Method not allowed.'});}
 try{const origin=new URL(req.headers.origin);if(origin.protocol!=='https:'&&!(origin.protocol==='http:'&&origin.hostname==='localhost'))throw Error();if(origin.host!==req.headers.host)throw Error();}catch{return respond(res,403,{error:'Origin is not allowed.'});}
 if(!/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type']||'')))return respond(res,415,{error:'JSON required.'});
 if(Number(req.headers['content-length']||0)>24000)return respond(res,413,{error:'Request too large.'});
 let body=req.body;
 try{if(typeof body==='string')body=JSON.parse(body);if(Buffer.byteLength(JSON.stringify(body??{}))>24000)return respond(res,413,{error:'Request too large.'});}catch{return respond(res,400,{error:'Invalid JSON.'});}
 let snapshot;try{snapshot=parseRequest(body);if(body.action!=='prepare'&&body.action!=='submit')throw Error('Invalid request action.');}catch(err){return respond(res,400,{error:err instanceof Error?err.message:'Invalid request.'});}
 const {RESEND_API_KEY:key,STUDIO_FROM_EMAIL:from}=process.env;
 if(!key||!from||!validSender(from))return respond(res,503,{error:'Booking email is not configured yet. Please contact studio@shashwataneja.com.'});
 // No database, in-memory deduplication, or customer account is involved.
 if(body.action==='prepare')return respond(res,200,{identity:issueIdentity(snapshot,from,key)});
 let identity;try{identity=verifyIdentity(body.identity,snapshot,from,key);}catch(err){return respond(res,409,{error:(err as Error).message});}
 try{
  const pdf=await buildPdf(snapshot,identity.buildId,identity.issuedAt);
  const text=[`BUILD-${identity.buildId}`,`Submission date: ${identity.issuedAt}`,`Project: ${snapshot.title}`,'Status: PROVISIONAL / PENDING REVIEW','No payment has been collected. Payment received: ₹0. Amount payable now: ₹0. Final quotation: Pending approval.',`Customer name: ${snapshot.contact.name}`,`Customer email: ${snapshot.contact.email}`,`Customer phone: ${snapshot.contact.phone}`,`Indicative price: ${snapshot.estimate}`,`Estimated timeline: ${snapshot.timeline}`,'Project breakdown:',...snapshot.items.map(item=>`${item.label}: ${item.amount}`),'Complete requirements:',...snapshot.specifications,`Additional requirements: ${snapshot.contact.notes||'None provided'}`,'Review scope and availability, contact the customer, then manually approve the final quotation. Do not treat this document as a confirmed booking, paid invoice or tax invoice.'].join('\n\n');
  const email=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':providerKey(identity)},body:JSON.stringify({from,to:['studio@shashwataneja.com'],reply_to:snapshot.contact.email,subject:`[Studio Booking] BUILD-${identity.buildId} | ${snapshot.title}`,text,attachments:[{filename:`BUILD-DETAILS-${identity.buildId}-provisional.pdf`,content:pdf.toString('base64')}]})});
  if(!email.ok){
   // Do not leak provider responses or customer information to logs or browsers.
   if(email.status===409)return respond(res,409,{error:'This Build ID needs manual review. Contact Studio before starting another request.',reference:identity.buildId});
   throw Error('provider rejection');
  }
  const receipt=await email.json();if(typeof receipt.id!=='string'||!receipt.id)throw Error('invalid receipt');
  return respond(res,200,{reference:identity.buildId,status:'pending_review'});
 }catch{return respond(res,503,{reference:identity.buildId,error:'We could not confirm email acceptance. Retry this unchanged request with the same Build ID, or contact studio@shashwataneja.com. The original attempt may still arrive.'});}
}
