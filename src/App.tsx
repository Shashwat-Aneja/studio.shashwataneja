import {useEffect,useMemo,useState,type CSSProperties} from "react";
import "./styles/app.css";
import {serviceCategories} from "./data/services";
import {formatINR} from "./data/pricing";\nimport {assessBudgetFit} from "./engine/pricing";
import {defaultRequirement,type ProjectGoal,type ProjectScale, type DeliverySpeed, type ProjectRequirement} from "./engine/requirements";
import {createBlueprint} from "./engine/blueprint";
import {recommendServices} from "./engine/recommendation";
import RobotAssistant from "./components/RobotAssistant";
import ThemeToggle,{type ThemeMode} from "./components/ThemeToggle";
import BookingFlow from "./components/BookingFlow";

const outcomes:Array<[string,string,string,ProjectGoal]>=[
 ["01","I need a stronger online presence.","Website, landing page, portfolio or business presence.","presence"],
 ["02","I need to sell online.","Storefront, catalogue, payments and commerce workflows.","commerce"],
 ["03","I need software built.","Web app, dashboard, SaaS MVP or custom platform.","application"],
 ["04","I need a brand people remember.","Identity, visual direction and brand systems.","brand"],
 ["05","I need more people to find and convert.","SEO, analytics, content and conversion work.","growth"],
 ["06","I need technical help.","APIs, deployment, automation and infrastructure.","technical"]
];
const featureOptions=["CMS","Blog","Booking","Payments","Analytics","SEO","Automation","Dashboard","Authentication","API"];

export default function App(){
 const [activeCategory,setActiveCategory]=useState("web");
 const [builderOpen,setBuilderOpen]=useState(false);
 const [step,setStep]=useState(1);
 const [requirement,setRequirement]=useState<ProjectRequirement>(defaultRequirement);
 const [selectedFeatures,setSelectedFeatures]=useState<string[]>([]);
 const [theme,setTheme]=useState<ThemeMode>(()=>(localStorage.getItem("studio-theme") as ThemeMode)||"paper");
 const [faq,setFaq]=useState<number|null>(null);
 const [blueprintOpen,setBlueprintOpen]=useState(false);
 const [blueprintReveal,setBlueprintReveal]=useState(false);
 const [bookingOpen,setBookingOpen]=useState(false);
 const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
 const [briefCopied,setBriefCopied]=useState(false);

 const active=useMemo(()=>serviceCategories.find(c=>c.id===activeCategory)??serviceCategories[0],[activeCategory]);
 const liveRequirement=useMemo(()=>({...requirement,features:selectedFeatures}),[requirement,selectedFeatures]);
 const blueprint=useMemo(()=>createBlueprint(liveRequirement),[liveRequirement]);
 const recommendations=useMemo(()=>recommendServices(liveRequirement).slice(0,5),[liveRequirement]);

 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("studio-theme",theme)},[theme]);
 useEffect(()=>{
   const es=[...document.querySelectorAll<HTMLElement>("[data-reveal]")];
   const ob=new IntersectionObserver(xs=>xs.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.12});
   es.forEach(e=>ob.observe(e));return()=>ob.disconnect();
 },[]);

 useEffect(()=>{
   if(!builderOpen&&!bookingOpen)return;
   const previousOverflow=document.body.style.overflow;
   document.body.style.overflow="hidden";
   const onKeyDown=(event:KeyboardEvent)=>{
     if(event.key==="Escape"){
       if(bookingOpen)setBookingOpen(false);
       else if(builderOpen)setBuilderOpen(false);
     }
   };
   addEventListener("keydown",onKeyDown);
   return()=>{
     removeEventListener("keydown",onKeyDown);
     document.body.style.overflow=previousOverflow;
   };
 },[builderOpen,bookingOpen]);

 const open=(goal?:ProjectGoal)=>{setRequirement(r=>({...r,goal:goal??r.goal}));setSelectedFeatures([]);setStep(1);setBlueprintOpen(false);setBlueprintReveal(false);setBuilderOpen(true)};
 const update=(patch:Partial<ProjectRequirement>)=>setRequirement(r=>({...r,...patch}));
 const toggleFeature=(f:string)=>setSelectedFeatures(v=>v.includes(f)?v.filter(x=>x!==f):[...v,f]);
 const copyBrief=()=>{const text=[blueprint.title,blueprint.objective,"Estimate: "+formatINR(blueprint.estimate.low)+" — "+formatINR(blueprint.estimate.high),"Provisional booking: "+formatINR(blueprint.estimate.booking),"Timeline: "+blueprint.timeline.reduce((total,phase)=>total+phase.duration,0)+" days",...blueprint.summary,...blueprint.recommendations.map(x=>x.serviceId+": "+x.reason),"Timeline phases:",...blueprint.timeline.map(x=>x.name+": "+x.duration+" days"),"Notes: "+blueprint.estimate.notes.join(" ")].join("\n");void navigator.clipboard.writeText(text).then(()=>setBriefCopied(true)).catch(()=>setBriefCopied(false));};
 const catGoal=(id:string):ProjectGoal=>id==="commerce"?"commerce":id==="application"?"application":id==="branding"?"brand":id==="growth"?"growth":id==="automation"?"technical":"presence";

 return <main className="studio-site">
  <header className="site-nav"><a className="wordmark" href="#top" onClick={()=>setMobileMenuOpen(false)}>SA<span>/</span>STUDIO</a><nav className={mobileMenuOpen?"is-open":""} aria-label="Main navigation"><a href="#services" onClick={()=>setMobileMenuOpen(false)}>Services</a><a href="#workshop" onClick={()=>setMobileMenuOpen(false)}>Workshop</a><a href="#process" onClick={()=>setMobileMenuOpen(false)}>Process</a><a href="#proof" onClick={()=>setMobileMenuOpen(false)}>Work</a><a href="#contact" onClick={()=>setMobileMenuOpen(false)}>Start</a></nav><div className="nav-controls"><button className="mobile-menu-toggle" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen?"Close navigation":"Open navigation"} onClick={()=>setMobileMenuOpen(v=>!v)}>{mobileMenuOpen?"CLOSE":"MENU"} <span>{mobileMenuOpen?"−":"+"}</span></button><ThemeToggle mode={theme} onChange={setTheme}/></div></header>
  <RobotAssistant onOpenBuilder={()=>open()}/>
  <section className="hero" id="top"><span className="hero-noise mono">INDEPENDENT DIGITAL STUDIO</span><div className="hero-inner"><span className="mono hero-kicker" data-reveal>YOU HAVE THE IDEA. LET’S BUILD WHAT IT NEEDS.</span><h1 data-reveal>You have the idea.<br/><i>Let’s build what it needs.</i></h1><p data-reveal>Websites, software, design, branding, infrastructure, automation and growth — shaped around the outcome, not a generic package.</p><div className="hero-actions" data-reveal><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Build your project <span>↘</span></button><a className="hero-cta" href="#discover">I'm not sure what I need <span>↘</span></a></div><div className="hero-meta mono" data-reveal><span>FROM ₹4,999</span><span>PROVISIONAL BOOKING TERMS</span><span>NO ACCOUNT TO EXPLORE</span></div></div><span className="hero-index mono">01 / STUDIO</span><span className="hero-coordinate mono">INDIA · WORKING WORLDWIDE</span></section>

  <section className="recognition" id="discover"><div className="section-head" data-reveal><span className="mono">02 / WHAT YOU NEED</span><h2>Start with the thing<br/><i>that needs to change.</i></h2></div><div className="recognition-grid">{outcomes.map(([n,t,c,g],i)=><button className="recognition-card" data-reveal key={n} onClick={()=>open(g)} style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><h3>{t}</h3><p>{c}</p><b>FIND MY ROUTE ↗</b></button>)}</div></section>

  <section className="services" id="services"><div className="section-head split" data-reveal><div><span className="mono">03 / SERVICES</span><h2>Choose a capability.<br/><i>Watch it become specific.</i></h2></div><span className="mono">09 CAPABILITIES</span></div><div className="service-field"><div className="service-list">{serviceCategories.map(c=><button key={c.id} className={activeCategory===c.id?"service-row active":"service-row"} onClick={()=>setActiveCategory(c.id)}><span className="mono">{c.number}</span><strong>{c.name}</strong><em>↗</em></button>)}</div><article className="service-canvas" key={active.id}><div className="service-orbit"/><span className="mono">CONFIGURE / {active.number}</span><h3>{active.name}</h3><p>{active.description}</p><div className="service-tags">{active.services.map(s=><span key={s}>{s}</span>)}</div><button className="text-action" onClick={()=>open(catGoal(active.id))}>Configure this route ↗</button></article></div></section>

  <section className="workshop" id="workshop"><div className="workshop-copy" data-reveal><span className="mono">04 / PROJECT WORKSHOP</span><h2>Don't know the service?<br/><i>Build the answer.</i></h2><p>Studio asks the useful questions first: outcome, audience, scale, features, experience, speed and investment. Then it turns the answers into a project blueprint.</p><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Open the workshop <span>↘</span></button></div><div className="workshop-visual" data-reveal><span className="mono">START WITH AN IDEA</span><strong>01 <i>→</i> 07</strong><p>Seven practical decisions. One clearer brief.</p><button className="text-action" onClick={()=>open()}>Open the project workshop ↗</button></div></section>

  <section className="estimate" id="estimate"><div data-reveal><span className="mono">05 / ESTIMATE</span><h2>Know the shape of the investment <i>before the sales call.</i></h2><p>These are provisional ranges from the current requirement model, not a final quote. Detailed service pricing will be confirmed before launch. Third-party costs and taxes stay separate.</p></div><div className="estimate-ledger" data-reveal><span className="mono">INDICATIVE PROJECT RANGE</span><strong>{formatINR(blueprint.estimate.low)} <i>— {formatINR(blueprint.estimate.high)}</i></strong><div><span>Provisional booking (2% / ₹4,999 floor)</span><b>{formatINR(blueprint.estimate.booking)}</b></div><small>{requirement.goal} / {requirement.scale} / {requirement.deliverySpeed} / {selectedFeatures.length} feature modifiers</small></div></section>

  <section className="process" id="process"><div className="section-head" data-reveal><span className="mono">06 / HOW IT WORKS</span><h2>A sales journey that behaves<br/><i>like a product.</i></h2></div><div className="process-rail">{[["01","Discover","Start with the outcome."],["02","Configure","Shape scope and requirements."],["03","Estimate","See investment and timeline."],["04","Review","Confirm the route and agreement."],["05","Book","Pay 2%; then initialize the project."]].map(([n,t,c],i)=><article key={n} data-reveal style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><div/><h3>{t}</h3><p>{c}</p></article>)}</div></section>

  <section className="tools" id="proof"><div className="section-head split" data-reveal><div><span className="mono">07 / SELECTED WORK</span><h2>Selected work.<br/><i>Built in the open.</i></h2></div><span className="mono">PUBLIC PROJECTS</span></div><div className="work-index"><a href="https://shashwataneja.com" target="_blank" rel="noreferrer"><span className="mono">01</span><strong>Personal portfolio</strong><span>Design / Front-end</span><b>VISIT ↗</b></a><a href="https://github.com/Shashwat-Aneja/WIZARD-HomeAutomation" target="_blank" rel="noreferrer"><span className="mono">02</span><strong>WIZARD</strong><span>Hardware / Automation</span><b>REPOSITORY ↗</b></a><a href="https://github.com/Shashwat-Aneja/Xylo-business-automation-suite" target="_blank" rel="noreferrer"><span className="mono">03</span><strong>Xylo</strong><span>Business software</span><b>REPOSITORY ↗</b></a><a href="https://github.com/Shashwat-Aneja/100-Days-of-Code-UPES" target="_blank" rel="noreferrer"><span className="mono">04</span><strong>100 Days of Code</strong><span>Programming / Practice</span><b>REPOSITORY ↗</b></a></div></section>

  <section className="faq" id="faq"><div className="section-head" data-reveal><span className="mono">08 / QUESTIONS</span><h2>Before you<br/><i>start building.</i></h2></div><div className="faq-list">{[["Do I need a technical brief?","No. Start with the outcome and Studio translates it into a route."],["Can I see pricing before booking?","Yes. The estimator calculates an indicative range. The booking formula and ₹4,999 minimum are provisional and will be confirmed before launch."],["Are third-party costs included?","No. Provider fees, taxes and other third-party charges stay separate."],["When is a project record created?","Only after a confirmed payment webhook. Browsing, estimation and blueprint generation do not create a permanent client/project record."]].map(([q,a],i)=><button key={q} onClick={()=>setFaq(faq===i?null:i)} aria-expanded={faq===i}><span className="mono">0{i+1}</span><div><h3>{q}</h3>{faq===i&&<p>{a}</p>}</div><b>{faq===i?"−":"+"}</b></button>)}</div></section>

  <section className="contact" id="contact"><div data-reveal><span className="mono">09 / CONTACT</span><h2>You have the idea.<br/><i>Let's shape the build.</i></h2><p>Bring a complete brief, a half-formed idea or simply a business problem. The Studio route starts there.</p><div className="contact-actions"><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Build my project <span>↘</span></button><a className="hero-cta" href="mailto:studio@shashwataneja.com">Ask a question <span>↗</span></a></div></div><footer><span>SHASHWAT ANEJA / STUDIO</span><span>INDIA / ONLINE</span><span>2% BOOKING</span><a href="https://shashwataneja.com">PARENT ↗</a></footer></section>

  {builderOpen&&<div className="builder-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setBuilderOpen(false)}><section className="builder-panel" role="dialog" aria-modal="true" aria-labelledby="workshop-dialog-title">
   <div className="builder-head"><div><span className="mono">WORKSHOP / {String(step).padStart(2,"0")} OF 07</span><h2 id="workshop-dialog-title">{step===1?"What are you trying to achieve?":step===2?"Who is this for?":step===3?"How much build do you need?":step===4?"What should it include?":step===5?"How should it feel?":step===6?"How quickly do you need it?":"What should we build around?"}</h2></div><button onClick={()=>setBuilderOpen(false)}>×</button></div>
   <div className="builder-progress"><span style={{width:(step/7*100)+"%"}}/></div>
   {step===1&&<div className="builder-options">{outcomes.map(([n,t,c,g])=><button key={g} className={requirement.goal===g?"active":""} onClick={()=>update({goal:g})}><span className="mono">{n}</span><div><strong>{t}</strong><small>{c}</small></div><b>↗</b></button>)}</div>}
   {step===2&&<div className="builder-options three">{[["personal","Personal"],["business","Business"],["customers","Customers"],["internal","Internal team"],["mixed","Mixed audience"]].map(([v,t])=><button key={v} className={requirement.audience===v?"active":""} onClick={()=>update({audience:v as ProjectRequirement["audience"]})}><strong>{t}</strong><small>Shape the audience assumption.</small></button>)}</div>}
   {step===3&&<div className="builder-options three">{[["lean","Lean","Focused launch or smaller scope."],["standard","Standard","Complete business-ready build."],["advanced","Advanced","Complex product or platform."]].map(([v,t,c])=><button key={v} className={requirement.scale===v?"active":""} onClick={()=>update({scale:v as ProjectScale})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===4&&<div><div className="builder-options three">{featureOptions.map(f=><button key={f} className={selectedFeatures.includes(f)?"active":""} onClick={()=>toggleFeature(f)}><strong>{f}</strong><small>{selectedFeatures.includes(f)?"Included":"Add to scope"}</small></button>)}</div><p className="builder-note">Selected features become scope modifiers in the pricing engine. Integrations are priced separately when configured.</p></div>}
   {step===5&&<div className="builder-options three">{[["focused","Focused","Clear, efficient interface."],["custom","Custom","Designed around your brand and users."],["signature","Signature","Distinctive interaction-led experience."]].map(([v,t,c])=><button key={v} className={requirement.designLevel===v?"active":""} onClick={()=>update({designLevel:v as ProjectRequirement["designLevel"]})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===6&&<div className="builder-options three">{[["standard","Standard","Normal delivery"],["priority","Priority","+25%"],["rush","Rush","+20%"]].map(([v,t,c])=><button key={v} className={requirement.deliverySpeed===v?"active":""} onClick={()=>update({deliverySpeed:v as DeliverySpeed})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===7&&<div className="builder-final"><div className="speed-options">{[["under-10k","Under ₹10k"],["10-25k","₹10k–₹25k"],["25-50k","₹25k–₹50k"],["50-100k","₹50k–₹1L"],["100k-plus","₹1L+"]].map(([v,t])=><button key={v} className={requirement.budgetRange===v?"active":""} onClick={()=>update({budgetRange:v as ProjectRequirement["budgetRange"]})}><strong>{t}</strong><span>Budget signal</span></button>)}</div><div className="builder-summary"><span className="mono">PROJECT OUTLINE</span><strong>{formatINR(blueprint.estimate.low)} — {formatINR(blueprint.estimate.high)}</strong><div><span>Provisional booking (2% / ₹4,999 floor)</span><b>{formatINR(blueprint.estimate.booking)}</b></div><p>{blueprint.objective}</p><p className="budget-fit">Budget signal: {assessBudgetFit(blueprint.estimate,requirement.budgetRange)==="within"?"The estimate overlaps your selected budget.":assessBudgetFit(blueprint.estimate,requirement.budgetRange)==="over"?"The estimate is above your selected budget; reduce scope or revise the budget.":"The estimate is below your selected budget; you may be able to include more scope."}</p><button className="text-action" onClick={()=>setBlueprintOpen(!blueprintOpen)}>{blueprintOpen?"Hide project outline":"View project outline"} ↗</button></div></div>}
   {blueprintOpen&&(<>
    <div className={blueprintReveal?"blueprint-reveal is-revealed":"blueprint-reveal"} aria-hidden={!blueprintReveal}><span className="mono">BLUEPRINT SIGNAL</span><i/><i/><i/></div>
    <div className="builder-blueprint"><span className="mono">PROJECT OUTLINE</span><h3>{blueprint.title}</h3><p>{blueprint.objective}</p><div className="blueprint-grid"><div><b>RECOMMENDED</b>{recommendations.map(x=><span key={x.serviceId}>{x.serviceId.replaceAll("-"," ")}</span>)}</div><div><b>ESTIMATED DURATION</b><span>{blueprint.timeline.reduce((total,phase)=>total+phase.duration,0)} days across {blueprint.timeline.length} phases</span>{blueprint.timeline.map(x=><span key={x.name}>{x.name} / {x.duration}d</span>)}</div></div></div>
    <div className="blueprint-actions"><button className="hero-cta" onClick={copyBrief}>{briefCopied?"Brief copied ✓":"Copy project brief ↗"}</button><button className="hero-cta hero-cta--solid" onClick={()=>{setBuilderOpen(false);setBookingOpen(true)}}>Review &amp; book ↘</button><button className="hero-cta" onClick={()=>{setBlueprintOpen(false);setBlueprintReveal(false);setStep(6)}}>Modify route ↖</button></div>
   </>)}
   <div className="builder-footer"><button className="text-action" onClick={()=>step>1?setStep(step-1):setBuilderOpen(false)}>{step>1?"Back":"Close"} ↖</button>{step<7?<button className="hero-cta hero-cta--solid" onClick={()=>setStep(step+1)}>Continue ↘</button>:<button className="hero-cta hero-cta--solid" onClick={()=>{setBlueprintOpen(true);setBlueprintReveal(true);}}>Generate blueprint ↘</button>}</div>
  </section></div>}
  {bookingOpen&&<BookingFlow blueprint={blueprint} onClose={()=>setBookingOpen(false)}/>}
 </main>;
}
