import {useMemo,useState} from "react";
import type {ProjectBlueprint} from "../engine/blueprint";
import {createBookingSummary,validateBooking,type BookingDraft} from "../engine/booking";
import {formatINR} from "../data/pricing";

type Props={blueprint:ProjectBlueprint;onClose:()=>void};

export default function BookingFlow({blueprint,onClose}:Props){
 const [stage,setStage]=useState<"review"|"details"|"agreement"|"payment"|"submitted">("review");
 const [draft,setDraft]=useState<BookingDraft>({blueprint,name:"",email:"",phone:"",notes:"",agreementAccepted:false});
 const errors=useMemo(()=>validateBooking(draft),[draft]);
 const summary=createBookingSummary(draft);
 const update=(patch:Partial<BookingDraft>)=>setDraft(d=>({...d,...patch}));
 return <div className="booking-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="booking-panel" role="dialog" aria-modal="true">
  <header className="booking-head"><div><span className="mono">BOOKING / {stage.toUpperCase()}</span><h2>{stage==="review"?"Review the route.":stage==="details"?"Tell us where to send it.":stage==="agreement"?"Confirm the working agreement.":stage==="payment"?"Ready for the booking step.":"Booking initiated."}</h2></div><button onClick={onClose}>×</button></header>
  <div className="booking-progress"><i className={stage==="review"?"active":""}/><i className={stage==="details"?"active":""}/><i className={stage==="agreement"?"active":""}/><i className={stage==="payment"?"active":""}/></div>
  {stage==="review"&&<div className="booking-review"><span className="mono">PROJECT BLUEPRINT</span><h3>{blueprint.title}</h3><p>{blueprint.objective}</p><div className="booking-stats"><span><b>INVESTMENT</b>{formatINR(blueprint.estimate.low)} — {formatINR(blueprint.estimate.high)}</span><span><b>BOOKING</b>{formatINR(blueprint.estimate.booking)}</span><span><b>PHASES</b>{blueprint.timeline.length}</span></div><div className="booking-services">{blueprint.recommendations.slice(0,6).map(x=><span key={x.serviceId}>{x.serviceId.replaceAll("-"," ")}</span>)}</div></div>}
  {stage==="details"&&<div className="booking-form"><label>Name<input value={draft.name} onChange={e=>update({name:e.target.value})}/></label><label>Email<input type="email" value={draft.email} onChange={e=>update({email:e.target.value})}/></label><label>Phone<input value={draft.phone} onChange={e=>update({phone:e.target.value})}/></label><label>Notes (optional)<textarea value={draft.notes} onChange={e=>update({notes:e.target.value})}/></label></div>}
  {stage==="agreement"&&<div className="agreement-card"><span className="mono">AGREEMENT CHECK</span><h3>Scope first. Payment second.</h3><p>This interface records an acceptance intent only. Production agreement generation and storage should happen server-side before a payment session is created.</p><label><input type="checkbox" checked={draft.agreementAccepted} onChange={e=>update({agreementAccepted:e.target.checked})}/> I have reviewed the project route, indicative investment and booking terms.</label></div>}
  {stage==="payment"&&<div className="payment-card"><span className="mono">BOOKING PAYMENT</span><strong>{formatINR(summary.bookingAmount)}</strong><p>{summary.message}</p><div className="payment-boundary"><span>BROWSER</span><b>→</b><span>PAYMENT PROVIDER</span><b>→</b><span>WEBHOOK</span><b>→</b><span>CONFIRMED PROJECT</span></div><button className="hero-cta hero-cta--solid" onClick={()=>setStage("submitted")}>Open payment provider ↗</button><small>Demo boundary only — no live payment is processed in this preview.</small></div>}
  {stage==="submitted"&&<div className="payment-card success"><span className="mono">PAYMENT BOUNDARY</span><strong>Ready for secure handoff.</strong><p>No client/project record is created by this preview. In production, only a verified provider webhook creates the booking, client and project records.</p><button className="hero-cta" onClick={onClose}>Return to Studio ↗</button></div>}
  <footer className="booking-footer"><button className="text-action" onClick={()=>stage==="review"?onClose():setStage(stage==="details"?"review":stage==="agreement"?"details":"agreement")}>↖ Back</button>{stage==="review"&&<button className="hero-cta hero-cta--solid" onClick={()=>setStage("details")}>Continue ↘</button>}{stage==="details"&&<button className="hero-cta hero-cta--solid" disabled={errors.length>0} onClick={()=>setStage("agreement")}>Review agreement ↘</button>}{stage==="agreement"&&<button className="hero-cta hero-cta--solid" disabled={errors.length>0} onClick={()=>setStage("payment")}>Continue to payment ↘</button>}</footer>
  {errors.length>0&&stage!=="review"&&<div className="booking-errors">{errors.join(" · ")}</div>}
 </section></div>;
}
