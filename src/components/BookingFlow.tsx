import {useEffect,useRef,useState} from "react";
import type {ProjectBlueprint} from "../engine/blueprint";
import type {ProjectRequirement} from "../engine/requirements";
import {services} from "../data/packages";
import {formatINR} from "../data/pricing";

type RetryIdentity={buildId:string;issuedAt:string;signature:string};
type Props={blueprint?:ProjectBlueprint;requirement?:ProjectRequirement;selection?:{serviceId:string;tier:string};onClose:()=>void};
export default function BookingFlow({blueprint,requirement,selection,onClose}:Props){
 const [contact,setContact]=useState({name:"",email:"",phone:"",notes:""});
 const [accepted,setAccepted]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState(""),[reference,setReference]=useState("");
 const [website,setWebsite]=useState("");
 const panel=useRef<HTMLElement>(null);
 const [attempt,setAttempt]=useState<RetryIdentity|null>(null);
 const service=services.find(s=>s.number===selection?.serviceId),tier=service?.tiers.find(t=>t.name===selection?.tier);
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;panel.current?.focus();const old=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{document.body.style.overflow=old;previous?.focus();};},[]);
 async function submit(e:React.FormEvent){
  e.preventDefault();if(pending)return;setPending(true);setError("");
  const payload={kind:selection?"package":"custom",selection,requirement,contact,agreementAccepted:accepted,website};
  async function post(value:unknown){
   const response=await fetch("/api/booking-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(value),signal:AbortSignal.timeout(20000)});
   let result;try{result=await response.json();}catch{throw new Error(response.status===429?"Too many requests. Please wait before retrying.":"We could not confirm receipt. Retry the same request or contact Studio.");}
   if(!response.ok)throw new Error(result.error||"We could not confirm receipt. Retry the same request or contact Studio.");
   return result;
  }
  try{
   const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload))))).map(x=>x.toString(16).padStart(2,'0')).join('');
   const storageKey='studio-booking-v1:'+digest;
   let identity=attempt;
   if(!identity){try{const saved=sessionStorage.getItem(storageKey);if(saved)identity=JSON.parse(saved);}catch{/* Storage can be unavailable; the open form still retains retries. */}}
   if(!identity){const prepared=await post({...payload,action:'prepare'});identity=prepared.identity;}
   if(!identity?.buildId||!identity.signature)throw new Error("Studio could not prepare the request. Please try again.");
   setAttempt(identity);
   try{sessionStorage.setItem(storageKey,JSON.stringify(identity));}catch{/* No contact information is stored in the browser. */}
   const result=await post({...payload,action:'submit',identity});
   setReference(result.reference);
  }catch(err){setError(err instanceof Error&&err.name!=='TimeoutError'?err.message:"We could not confirm email acceptance. Retry the unchanged request using the same Build ID. The original attempt may still arrive.");}finally{setPending(false);}
 }

 return <div className="booking-backdrop"><section ref={panel} tabIndex={-1} className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" onKeyDown={e=>{if(e.key==="Escape"&&!pending)onClose();if(e.key==="Tab"){const items=panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled):not([tabindex="-1"]), textarea:not(:disabled), a');if(!items?.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}}>
 <header className="booking-head"><div><span className="mono">STUDIO / PENDING REVIEW</span><h2 id="booking-dialog-title">{reference?"Your request has been received.":"Let’s review your build."}</h2></div><button disabled={pending} aria-label="Close booking request" onClick={onClose}>×</button></header>
 {reference?<div className="payment-card success"><strong>{reference}</strong><p>Studio will review your project requirements and contact you. The email provider has accepted your provisional request; this is not a confirmed booking or payment receipt.</p><button onClick={onClose}>Return to Studio ↗</button></div>:<form onSubmit={submit}><fieldset disabled={pending||Boolean(attempt)} className="booking-fields">
 <div className="booking-review"><h3>{service?`${service.name} / ${tier?.name}`:blueprint?.title}</h3><p>{tier?.summary||blueprint?.objective}</p><strong>{tier?.price||(blueprint&&`${formatINR(blueprint.estimate.low)} — ${formatINR(blueprint.estimate.high)}`)}</strong><p>Indicative pricing only. Final scope, timeline, taxes and commercial terms require Studio approval. Nothing is payable now.</p>{tier&&<ul>{tier.features.map(f=><li key={f}>{f}</li>)}</ul>}</div>
 <div className="booking-form">{([['name','Name'],['email','Email'],['phone','Phone']] as const).map(([key,label])=><label key={key}>{label}<input required type={key==='email'?'email':key==='phone'?'tel':'text'} autoComplete={key==='phone'?'tel':key} maxLength={key==='name'?120:key==='email'?200:30} value={contact[key]} onChange={e=>setContact({...contact,[key]:e.target.value})}/></label>)}<label>Project details / additional requirements<textarea maxLength={2000} value={contact.notes} onChange={e=>setContact({...contact,notes:e.target.value})}/></label></div>
 <div className="agreement-card"><label><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> I agree to the <a href="/terms.html" target="_blank" rel="noreferrer">service terms</a> and <a href="/privacy.html" target="_blank" rel="noreferrer">privacy notice</a>, and understand this is a provisional request pending review.</label><p>No payment is collected. No dashboard account is created. A finalized invoice is sent only after approval.</p></div>
 <label className="booking-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></fieldset>
 {attempt&&<p className="booking-reference">Build ID: <strong>{attempt.buildId}</strong>. Retries keep these details unchanged. Contact Studio with this ID if receipt is uncertain.</p>}
 <footer className="booking-footer"><button type="button" disabled={pending} onClick={onClose}>Cancel</button><button className="hero-cta hero-cta--solid" disabled={pending||!accepted}>{pending?"Submitting request…":"Submit booking request ↗"}</button></footer>{error&&<p className="booking-errors" role="alert">{error}</p>}
 </form>}</section></div>;
}
