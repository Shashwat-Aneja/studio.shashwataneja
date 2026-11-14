import {createHash,createHmac,randomUUID,timingSafeEqual} from 'node:crypto';
import type {RequestSnapshot} from './request.js';
export type BookingIdentity={buildId:string;issuedAt:string;signature:string};
export const RETRY_WINDOW_MS=23*60*60*1000;
const signature=(id:Omit<BookingIdentity,'signature'>,snapshot:RequestSnapshot,from:string,key:string)=>createHmac('sha256',key).update('studio-email-booking-v1\n'+JSON.stringify({id,snapshot,from})).digest('hex');
export function issueIdentity(snapshot:RequestSnapshot,from:string,key:string):BookingIdentity{
 const id={buildId:randomUUID(),issuedAt:new Date().toISOString()};
 return {...id,signature:signature(id,snapshot,from,key)};
}
export function verifyIdentity(value:any,snapshot:RequestSnapshot,from:string,key:string):BookingIdentity{
 if(!value||typeof value.buildId!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.buildId)||typeof value.issuedAt!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value.issuedAt)||typeof value.signature!=='string'||!(/^[a-f0-9]{64}$/).test(value.signature))throw Error('Invalid retry details. Reopen the form to prepare a request.');
 const id={buildId:value.buildId,issuedAt:value.issuedAt};const expected=signature(id,snapshot,from,key);
 if(!timingSafeEqual(Buffer.from(value.signature,'hex'),Buffer.from(expected,'hex')))throw Error('Request details changed. Contact Studio with the Build ID before starting a replacement.');
 const age=Date.now()-Date.parse(value.issuedAt);
 if(!Number.isFinite(age)||age<0||age>RETRY_WINDOW_MS)throw Error('The retry window has ended. Contact Studio with your Build ID before submitting again.');
 return {...id,signature:value.signature};
}
// Provider keys contain no customer information.
export const providerKey=(id:BookingIdentity)=>'studio-booking/'+createHash('sha256').update(id.buildId).digest('hex');
