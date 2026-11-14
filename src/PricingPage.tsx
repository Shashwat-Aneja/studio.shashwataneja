import {useEffect,useState} from "react";
import "./styles/app.css";

import {services,type Service} from "./data/packages";
import BookingFlow from "./components/BookingFlow";
const serviceVisuals:Record<string,string>={
 "Web Development":"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85",
 "UI/UX & Design":"https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1800&q=85",
 "Branding":"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1800&q=85",
 "Content":"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=85",
 "Launch & Infrastructure":"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85",
 "SEO & Growth":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=85",
 "E-commerce":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85",
 "Automation":"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85",
 "Care":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85"
};

function PricingModal({service,onClose,selectedTier,onChoose}:{service:Service;onClose:()=>void;selectedTier:string;onChoose:(tier:string)=>void}){
 useEffect(()=>{const previous=document.body.style.overflow;document.body.style.overflow="hidden";const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")onClose()};window.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",onKey)}},[onClose]);
 return <div className="pricing-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="pricing-modal" role="dialog" aria-modal="true" aria-labelledby="pricing-modal-title">
   <header className="pricing-modal-head"><span className="mono">{service.number} / SERVICE DETAIL</span><button type="button" aria-label="Close service details" onClick={onClose}>×</button></header>
   <div className="pricing-modal-content">
    <section className="service-editorial-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(8,8,8,.62),rgba(8,8,8,.08)),url("${serviceVisuals[service.name]}")`}}>
     <div className="service-editorial-side mono">STUDIO / {service.number}<br/>SERVICE PROFILE</div>
     <div className="service-editorial-copy"><span className="mono">A CONSIDERED APPROACH TO</span><h2 id="pricing-modal-title">{service.name}</h2><p>{service.detail}</p></div>
     <span className="service-editorial-index mono">SHASHWAT ANEJA / STUDIO</span>
    </section>
    <div className="service-editorial-intro"><span className="mono">THE STUDIO PERSPECTIVE</span><p>{service.overview}</p></div>
    <div className="service-editorial-columns">
     <article className="service-editorial-benefits"><span className="mono">01 / WHAT YOU GET</span><h3>Built around<br/><i>the details.</i></h3><ul>{service.deliverables.map((item,index)=><li key={item}><b>0{index+1}</b><span>{item}</span></li>)}</ul></article>
     <article className="service-editorial-process"><span className="mono">02 / HOW IT COMES TOGETHER</span><h3>A clear route<br/><i>from brief to build.</i></h3><ol>{service.process.map((item,index)=><li key={item}><b>0{index+1}</b><span>{item}</span></li>)}</ol><div className="service-editorial-note"><span className="mono">THE OUTCOME</span><p>{service.tiers[1].summary}</p></div></article>
    </div>
    <div className="pricing-modal-plan-head"><span className="mono">SELECT A SERVICE LEVEL</span><h3>Choose the right scope.</h3><p>All prices are starting prices. The final deliverables and scope are confirmed before work begins.</p></div>
    <div className="pricing-modal-plans">{service.tiers.map((tier,index)=><article className={`pricing-modal-plan ${index===1?"is-professional":""} ${selectedTier===tier.name?"is-selected":""}`} key={tier.name}>
      <div className="pricing-modal-plan-top"><span className="mono">0{index+1} / {tier.name.toUpperCase()}</span>{index===1&&<b>MOST CHOSEN</b>}</div><h4>{tier.name}</h4><strong>{tier.price}</strong><p>{tier.summary}</p><ul>{tier.features.map(feature=><li key={feature}>{feature}</li>)}</ul><button type="button" onClick={()=>onChoose(tier.name)}>{selectedTier===tier.name?"Selected ✓":"Choose "+tier.name+" ↗"}</button>
     </article>)}</div>
    <p className="pricing-modal-footnote">{service.monthly?"Care plans are billed monthly.":"A “+” indicates that the final price depends on project scope and complexity."} Choose a level to submit a booking request for review. No payment is collected.</p>
   </div>
  </section>
 </div>
}

export default function PricingPage(){
 const [booking,setBooking]=useState<{serviceId:string;tier:string}|null>(null);
 const [activeService,setActiveService]=useState<Service|null>(null);
 const [selectedTiers,setSelectedTiers]=useState<Record<string,string>>({});
 const closeModal=()=>setActiveService(null);
 return <main className="studio-site pricing-page">
  <header className="site-nav"><a className="wordmark" href="/">SA<span>/</span>STUDIO</a><nav aria-label="Pricing navigation"><a href="/#services">Services</a><a href="/#workshop">Workshop</a><a href="/#faq">FAQs</a></nav><a className="pricing-nav-cta" href="/#workshop">Plan a project ↗</a></header>
  <section className="pricing-hero"><span className="mono">STUDIO / PRICING</span><h1>Clear scope.<br/><i>Thoughtful investment.</i></h1><p>Explore each service, understand what is included and choose the level that fits your requirements. Final scope and terms are confirmed before work begins.</p><div className="pricing-hero-meta mono"><span>PRICES IN INR</span><span>THREE SERVICE LEVELS</span><span>NO PAYMENT REQUIRED HERE</span></div></section>
  <section className="pricing-tiers"><div className="pricing-section-head"><span className="mono">01 / SERVICE PRICING</span><h2>Find the right fit.<br/><i>Explore the details.</i></h2><p>Hover over a service card for a closer look. Open its details to compare the full scope and choose a service level.</p></div>
   <div className="service-pricing-grid">{services.map(service=><article className="service-price-card" key={service.number}>
    <div className="service-price-head"><span className="mono">{service.number} / SERVICE</span>{service.monthly&&<b>MONTHLY</b>}</div>
    <h3>{service.name}</h3><p>{service.detail}</p>
    <div className="service-price-tiers">{service.tiers.map((tier,index)=><div className={index===1?"is-professional":""} key={tier.name}><span>{tier.name}</span><strong>{tier.price}</strong>{index===1&&<b>POPULAR</b>}</div>)}</div>
    <div className="service-price-hover"><span className="mono">EXPLORE THIS SERVICE</span><p>{service.overview}</p><ul>{service.deliverables.slice(0,3).map(item=><li key={item}>{item}</li>)}</ul></div>
    <button className="service-price-more" type="button" onClick={()=>setActiveService(service)}>Know more <span>↗</span></button>
   </article>)}</div>
  </section>
  <section className="custom-pricing-section"><div className="custom-pricing-copy"><span className="mono">02 / CUSTOM PROJECTS</span><h2>Something beyond<br/><i>a standard service?</i></h2><p>Custom websites, applications, SaaS products, multi-service engagements and complex workflows are priced individually after discovery and scope assessment.</p><ul><li>Requirement and deliverable breakdown</li><li>Effort, complexity and risk assessment</li><li>Fixed project quotation with milestones</li><li>Optional scope alternatives where useful</li></ul></div><article className="custom-price-card"><span className="mono">SCOPE-BASED QUOTATION</span><h3>Custom pricing</h3><strong>Individually quoted</strong><p>Indicative project bands</p><div><span>Small</span><b>₹4,999 – ₹14,999</b></div><div><span>Medium</span><b>₹14,999 – ₹39,999</b></div><div><span>Large</span><b>₹39,999 – ₹99,999</b></div><div><span>Bespoke</span><b>₹99,999+</b></div><small>These are planning bands, not fixed package prices. Your written quotation determines the final amount.</small></article></section>
  <section className="pricing-terms"><span className="mono">03 / CUSTOM QUOTATION METHOD</span><h2>Understand the work.<br/><i>Then agree the price.</i></h2><div className="pricing-steps">{[["01","Discovery","Understand the outcome, audience, constraints and budget."],["02","Scope","Break the project into features, deliverables and exclusions."],["03","Estimate","Assess effort, complexity, third-party costs and delivery risk."],["04","Quotation","Receive a fixed project price, timeline and payment milestones."]].map(([n,title,desc])=><article key={n}><span className="mono">{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div><div className="pricing-policy-grid"><article><span className="mono">STANDARD SERVICES</span><strong>60% advance</strong><p>Existing guidance, under review before launch. Final payment terms require written agreement. No payment is collected.</p></article><article><span className="mono">CUSTOM PROJECTS</span><strong>2% booking</strong><p>Existing credited booking guidance, under review before launch. Any amount requires written approval; none is due for an enquiry.</p></article><article><span className="mono">QUOTATION VALIDITY</span><strong>15 calendar days</strong><p>Existing validity guidance, under review before launch. The approved written quotation must state its validity.</p></article></div><p className="pricing-disclaimer">Displayed service prices are starting prices. Advanced tiers marked “+” are scope-dependent. Custom project bands are indicative only. Third-party services, hosting, domains, licences and provider charges are itemized separately where applicable. Any applicable taxes and final commercial terms are confirmed in the written quotation. Booking requests are provisional and subject to Studio review. No payment is collected.</p><a className="pricing-back-link" href="/#workshop">Start a project workshop ↗</a></section>
  <footer className="pricing-footer"><span>SHASHWAT ANEJA / STUDIO</span><a href="/">BACK TO STUDIO ↗</a><span>INDIA / ONLINE</span></footer>
  {activeService&&<PricingModal service={activeService} onClose={closeModal} selectedTier={selectedTiers[activeService.name]||""} onChoose={tier=>{setSelectedTiers(current=>({...current,[activeService.name]:tier}));setBooking({serviceId:activeService.number,tier});closeModal();}}/>}
  {booking&&<BookingFlow selection={booking} onClose={()=>setBooking(null)}/>}
 </main>
}
