import {parseRequest} from '../server/request.js';
import {buildPdf} from '../server/pdf.js';
import {issueIdentity,verifyIdentity} from '../server/booking-identity.js';
import {sendBookingEmail} from '../server/booking-email.js';
export const config={maxDuration:30};
const respond=(res:any,status:number,body:unknown)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body));};
const validSender=(from:string)=>!/[\x00-\x1f\x7f]/.test(from)&&/^(?:[^<>]+ <)?[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-z0-9-]+\.)*shashwataneja\.com>?$/i.test(from);
export default async function handler(req:any,res:any){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return respond(res,405,{error:'Method not allowed.'});}
 try{if(req.headers['sec-fetch-site']==='cross-site')throw Error();const rawOrigin=req.headers.origin;if(typeof rawOrigin!=='string')throw Error();const origin=new URL(rawOrigin);if(origin.origin!==rawOrigin)throw Error();if(origin.protocol!=='https:'&&!(origin.protocol==='http:'&&origin.hostname==='localhost'))throw Error();if(origin.host!==req.headers.host)throw Error();}catch{return respond(res,403,{error:'Origin is not allowed.'});}
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
  const [studio,customer]=await Promise.all([
   sendBookingEmail('studio',snapshot,identity,from,key,pdf,body.receipts?.studio),
   sendBookingEmail('customer',snapshot,identity,from,key,pdf,body.receipts?.customer)
  ]);
  const both=studio.status==='accepted'&&customer.status==='accepted';
  const any=studio.status==='accepted'||customer.status==='accepted';
  return respond(res,both?200:any?202:503,{reference:identity.buildId,status:both?'pending_review':any?'partial':'unconfirmed',emails:{studio,customer},...(!both?{error:'One or both emails have not been confirmed as accepted. Retry the unchanged request with this Build ID, or contact Studio. An unconfirmed attempt may still arrive.'}:{})});
 }catch{return respond(res,503,{reference:identity.buildId,status:'unconfirmed',error:'The request could not finish. Retry unchanged details with the same Build ID or contact Studio. An earlier attempt may still arrive.'});}
}
