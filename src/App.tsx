import {useEffect,useMemo,useState,type CSSProperties} from "react";
import "./styles/app.css";
import {serviceCategories} from "./data/services";
import {formatINR} from "./data/pricing";
import {defaultRequirement,type ProjectGoal,type ProjectScale, type DeliverySpeed, type ProjectRequirement} from "./engine/requirements";
import {createBlueprint} from "./engine/blueprint";
import {recommendServices} from "./engine/recommendation";
import RobotAssistant from "./components/RobotAssistant";
import ThemeToggle,{type ThemeMode} from "./components/ThemeToggle";

const outcomes:Array<[string,string,string,ProjectGoal]>=[
 ["01","I need a stronger online presence.","Website, landing page, portfolio or business presence.","presence"],
 ["02","I need to sell online.","Storefront, catalogue, payments and commerce workflows.","commerce"],
 ["03","I need software built.","Web app, dashboard, SaaS MVP or custom platform.","application"],
 ["04","I need a brand people remember.","Identity, visual direction and brand systems.","brand"],
 ["05","I need more people to find and convert.","SEO, analytics, content and conversion work.","growth"],
 ["06","I need technical help.","APIs, deployment, automation and infrastructure.","technical"]
];
const featureOptions=["CMS","Blog","Booking","Payments","Analytics","SEO","Automation","Dashboard","Authentication","API"];
const tools=[
 ["01","What Do I Need?","Answer a few questions and get a route."],
 ["02","Budget Optimizer","See what can fit without quietly changing the brief."],
 ["03","Project Blueprint","Turn a rough idea into a buildable outline."],
 ["04","Timeline Builder","See the phases before you commit."],
 ["05","Digital Presence Score","Find the gaps worth fixing first."]
];

export default function App(){
 const [activeCategory,setActiveCategory]=useState("web");
 const [builderOpen,setBuilderOpen]=useState(false);
 const [step,setStep]=useState(1);
 const [requirement,setRequirement]=useState<ProjectRequirement>(defaultRequirement);
 const [selectedFeatures,setSelectedFeatures]=useState<string[]>([]);
 const [theme,setTheme]=useState<ThemeMode>(()=>(localStorage.getItem("studio-theme") as ThemeMode)||"paper");
 const [faq,setFaq]=useState<number|null>(null);
 const [blueprintOpen,setBlueprintOpen]=useState(false);

 const active=useMemo(()=>serviceCategories.find(c=>c.id===activeCategory)??serviceCategories[0],[activeCategory]);
 const liveRequirement=useMemo(()=>({...requirement,features:selectedFeatures}),[requirement,selectedFeatures]);
 const blueprint=useMemo(()=>createBlueprint(liveRequirement),[liveRequirement]);
 const recommendations=useMemo(()=>recommendServices(liveRequirement).slice(0,5),[liveRequirement]);

 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("studio-theme",theme)},[theme]);
 useEffect(()=>{
   const root=document.documentElement;let tx=0,ty=0,cx=0,cy=0,raf=0;
   const move=(e:PointerEvent)=>{tx=e.clientX;ty=e.clientY};
   const tick=()=>{cx+=(tx-cx)*.14;cy+=(ty-cy)*.14;root.style.setProperty("--cursor-x",cx+"px");root.style.setProperty("--cursor-y",cy+"px");root.style.setProperty("--pointer-x",(tx/innerWidth-.5)+"");root.style.setProperty("--pointer-y",(ty/innerHeight-.5)+"");raf=requestAnimationFrame(tick)};
   addEventListener("pointermove",move,{passive:true});raf=requestAnimationFrame(tick);
   return()=>{removeEventListener("pointermove",move);cancelAnimationFrame(raf)};
 },[]);
 useEffect(()=>{
   const es=[...document.querySelectorAll<HTMLElement>("[data-reveal]")];
   const ob=new IntersectionObserver(xs=>xs.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.12});
   es.forEach(e=>ob.observe(e));return()=>ob.disconnect();
 },[]);
 useEffect(()=>{const s=()=>document.documentElement.style.setProperty("--scroll-progress",Math.min(100,scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+"%");addEventListener("scroll",s,{passive:true});s();return()=>removeEventListener("scroll",s)},[]);

 const open=(goal?:ProjectGoal)=>{setRequirement(r=>({...r,goal:goal??r.goal}));setSelectedFeatures([]);setStep(1);setBlueprintOpen(false);setBuilderOpen(true)};
 const update=(patch:Partial<ProjectRequirement>)=>setRequirement(r=>({...r,...patch}));
 const toggleFeature=(f:string)=>setSelectedFeatures(v=>v.includes(f)?v.filter(x=>x!==f):[...v,f]);
 const catGoal=(id:string):ProjectGoal=>id==="commerce"?"commerce":id==="application"?"application":id==="branding"?"brand":id==="growth"?"growth":id==="automation"?"technical":"presence";

 return <main className="studio-site">
  <div className="studio-environment" aria-hidden="true"><div className="ambient-orb orb-a"/><div className="ambient-orb orb-b"/><div className="ambient-grid"/><div className="grain"/></div>
  <div className="custom-cursor" aria-hidden="true"><span/></div>
  <header className="site-nav"><a className="wordmark" href="#top">SA<span>/</span>STUDIO</a><nav><a href="#services">Services</a><a href="#workshop">Workshop</a><a href="#tools">Tools</a><a href="#contact">Start</a></nav><ThemeToggle mode={theme} onChange={setTheme}/></header>
  <div className="scroll-codebar"><b className="mono">&lt;/&gt;</b></div><RobotAssistant/>
  <section className="hero" id="top"><span className="hero-noise mono">STUDIO / DIGITAL SERVICES / 001</span><div className="hero-inner"><span className="mono hero-kicker" data-reveal>YOU BRING THE PROBLEM. THE STUDIO BUILDS THE ROUTE.</span><h1 data-reveal>Build what your<br/><i>business needs.</i></h1><p data-reveal>Websites, software, design, branding, infrastructure, automation and growth — shaped around the outcome, not a generic package.</p><div className="hero-actions" data-reveal><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Build my project <span>↘</span></button><a className="hero-cta" href="#discover">I'm not sure yet <span>↘</span></a></div><div className="hero-meta mono" data-reveal><span>FROM ₹4,999</span><span>2% BOOKING</span><span>NO ACCOUNT TO EXPLORE</span></div></div><span className="hero-index mono">01 / ENTRY</span><span className="hero-coordinate mono">STUDIO / INDIA / ONLINE</span><span className="hero-word">STUDIO</span></section>

  <section className="recognition" id="discover"><div className="section-head" data-reveal><span className="mono">02 / RECOGNITION ENGINE</span><h2>Start with the thing<br/><i>that needs to change.</i></h2></div><div className="recognition-grid">{outcomes.map(([n,t,c,g],i)=><button className="recognition-card" data-reveal key={n} onClick={()=>open(g)} style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><h3>{t}</h3><p>{c}</p><b>FIND MY ROUTE ↗</b></button>)}</div></section>

  <section className="services" id="services"><div className="section-head split" data-reveal><div><span className="mono">03 / SERVICE FIELD</span><h2>Choose a capability.<br/><i>Watch it become specific.</i></h2></div><span className="mono">09 CAPABILITIES</span></div><div className="service-field"><div className="service-list">{serviceCategories.map(c=><button key={c.id} className={activeCategory===c.id?"service-row active":"service-row"} onClick={()=>setActiveCategory(c.id)}><span className="mono">{c.number}</span><strong>{c.name}</strong><em>↗</em></button>)}</div><article className="service-canvas" key={active.id}><div className="service-orbit"/><span className="mono">CONFIGURE / {active.number}</span><h3>{active.name}</h3><p>{active.description}</p><div className="service-tags">{active.services.map(s=><span key={s}>{s}</span>)}</div><button className="text-action" onClick={()=>open(catGoal(active.id))}>Configure this route ↗</button></article></div></section>

  <section className="workshop" id="workshop"><div className="workshop-copy" data-reveal><span className="mono">04 / THE WORKSHOP</span><h2>Don't know the service?<br/><i>Build the answer.</i></h2><p>Studio asks the useful questions first: outcome, audience, scale, features, experience, speed and investment. Then it turns the answers into a project blueprint.</p><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Open the workshop <span>↘</span></button></div><div className="workshop-visual" data-reveal><div className="workshop-screen"><span className="mono">LIVE SCOPE ENGINE</span><strong>{formatINR(blueprint.estimate.low)}</strong><small>— {formatINR(blueprint.estimate.high)}</small><div className="scope-lines"><i/><i/><i/><i/></div></div><div className="floating-chip chip-one">REQUIREMENTS</div><div className="floating-chip chip-two">SCOPE</div><div className="floating-chip chip-three">BLUEPRINT</div></div></section>

  <section className="estimate" id="estimate"><div data-reveal><span className="mono">05 / PRICE CONFIDENCE</span><h2>Know the shape of the investment <i>before the sales call.</i></h2><p>Indicative ranges are calculated from the current requirement model. Third-party costs and taxes stay separate.</p></div><div className="estimate-card" data-reveal><span className="mono">LIVE PROJECT RANGE</span><strong>{formatINR(blueprint.estimate.low)} <i>— {formatINR(blueprint.estimate.high)}</i></strong><div><span>2% booking</span><b>{formatINR(blueprint.estimate.booking)}</b></div><small>{requirement.goal} / {requirement.scale} / {requirement.deliverySpeed} / {selectedFeatures.length} feature modifiers</small></div></section>

  <section className="process" id="process"><div className="section-head" data-reveal><span className="mono">06 / THE ROUTE</span><h2>A sales journey that behaves<br/><i>like a product.</i></h2></div><div className="process-rail">{[["01","Discover","Start with the outcome."],["02","Configure","Shape scope and requirements."],["03","Estimate","See investment and timeline."],["04","Review","Confirm the route and agreement."],["05","Book","Pay 2%; then initialize the project."]].map(([n,t,c],i)=><article key={n} data-reveal style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><div/><h3>{t}</h3><p>{c}</p></article>)}</div></section>

  <section className="tools" id="tools"><div className="section-head split" data-reveal><div><span className="mono">07 / FREE TOOLS</span><h2>Useful enough to try<br/><i>before you buy.</i></h2></div><span className="mono">NO SIGN-UP / PREVIEW</span></div><div className="tool-list">{tools.map(([n,t,c],i)=><button key={n} data-reveal style={{"--i":i} as CSSProperties} onClick={()=>open()}><span className="mono">{n}</span><div><h3>{t}</h3><p>{c}</p></div><b>TRY IT ↗</b></button>)}</div></section>

  <section className="proof"><div className="section-head" data-reveal><span className="mono">08 / TRUST WITHOUT THEATRE</span><h2>Clarity is part of<br/><i>the product.</i></h2></div><div className="proof-grid">{[["Real capabilities","No invented client logos, testimonials or vanity numbers."],["Transparent starting points","Indicative ranges appear before booking."],["Technical handoff","Confirmed bookings can move into the dedicated dashboard."],["Human judgment","The system guides; the final scope is confirmed with you."]].map(([t,c],i)=><article key={t} data-reveal><span className="mono">0{i+1}</span><h3>{t}</h3><p>{c}</p></article>)}</div></section>

  <section className="faq"><div className="section-head" data-reveal><span className="mono">09 / QUESTIONS</span><h2>Before you<br/><i>start building.</i></h2></div><div className="faq-list">{[["Do I need a technical brief?","No. Start with the outcome and Studio translates it into a route."],["Can I see pricing before booking?","Yes. The estimator calculates an indicative range and the 2% booking amount."],["Are third-party costs included?","No. Provider fees, taxes and other third-party charges stay separate."],["When is a project record created?","Only after a confirmed payment webhook. Browsing, estimation and blueprint generation do not create a permanent client/project record."]].map(([q,a],i)=><button key={q} onClick={()=>setFaq(faq===i?null:i)}><span className="mono">0{i+1}</span><div><h3>{q}</h3>{faq===i&&<p>{a}</p>}</div><b>{faq===i?"−":"+"}</b></button>)}</div></section>

  <section className="contact" id="contact"><div data-reveal><span className="mono">10 / START HERE</span><h2>You have the idea.<br/><i>Let's shape the build.</i></h2><p>Bring a complete brief, a half-formed idea or simply a business problem. The Studio route starts there.</p><div className="contact-actions"><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Build my project <span>↘</span></button><a className="hero-cta" href="mailto:studio@shashwataneja.com">Ask a question <span>↗</span></a></div></div><footer><span>SHASHWAT ANEJA / STUDIO</span><span>INDIA / ONLINE</span><span>2% BOOKING</span><a href="https://shashwataneja.com">PARENT ↗</a></footer></section>

  {builderOpen&&<div className="builder-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setBuilderOpen(false)}><section className="builder-panel" role="dialog" aria-modal="true">
   <div className="builder-head"><div><span className="mono">WORKSHOP / {String(step).padStart(2,"0")} OF 07</span><h2>{step===1?"What are you trying to achieve?":step===2?"Who is this for?":step===3?"How much build do you need?":step===4?"What should it include?":step===5?"How should it feel?":step===6?"How quickly do you need it?":"What should we build around?"}</h2></div><button onClick={()=>setBuilderOpen(false)}>×</button></div>
   <div className="builder-progress"><span style={{width:(step/7*100)+"%"}}/></div>
   {step===1&&<div className="builder-options">{outcomes.map(([n,t,c,g])=><button key={g} className={requirement.goal===g?"active":""} onClick={()=>update({goal:g})}><span className="mono">{n}</span><div><strong>{t}</strong><small>{c}</small></div><b>↗</b></button>)}</div>}
   {step===2&&<div className="builder-options three">{[["personal","Personal"],["business","Business"],["customers","Customers"],["internal","Internal team"],["mixed","Mixed audience"]].map(([v,t])=><button key={v} className={requirement.audience===v?"active":""} onClick={()=>update({audience:v as ProjectRequirement["audience"]})}><strong>{t}</strong><small>Shape the audience assumption.</small></button>)}</div>}
   {step===3&&<div className="builder-options three">{[["lean","Lean","Focused launch or smaller scope."],["standard","Standard","Complete business-ready build."],["advanced","Advanced","Complex product or platform."]].map(([v,t,c])=><button key={v} className={requirement.scale===v?"active":""} onClick={()=>update({scale:v as ProjectScale})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===4&&<div><div className="builder-options three">{featureOptions.map(f=><button key={f} className={selectedFeatures.includes(f)?"active":""} onClick={()=>toggleFeature(f)}><strong>{f}</strong><small>{selectedFeatures.includes(f)?"Included":"Add to scope"}</small></button>)}</div><p className="builder-note">Selected features become scope modifiers in the pricing engine. Integrations are priced separately when configured.</p></div>}
   {step===5&&<div className="builder-options three">{[["focused","Focused","Clear, efficient interface."],["custom","Custom","Designed around your brand and users."],["signature","Signature","Distinctive interaction-led experience."]].map(([v,t,c])=><button key={v} className={requirement.designLevel===v?"active":""} onClick={()=>update({designLevel:v as ProjectRequirement["designLevel"]})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===6&&<div className="builder-options three">{[["standard","Standard","Normal delivery"],["priority","Priority","+25%"],["rush","Rush","+20%"]].map(([v,t,c])=><button key={v} className={requirement.deliverySpeed===v?"active":""} onClick={()=>update({deliverySpeed:v as DeliverySpeed})}><strong>{t}</strong><small>{c}</small></button>)}</div>}
   {step===7&&<div className="builder-final"><div className="speed-options">{[["under-10k","Under ₹10k"],["10-25k","₹10k–₹25k"],["25-50k","₹25k–₹50k"],["50-100k","₹50k–₹1L"],["100k-plus","₹1L+"]].map(([v,t])=><button key={v} className={requirement.budgetRange===v?"active":""} onClick={()=>update({budgetRange:v as ProjectRequirement["budgetRange"]})}><strong>{t}</strong><span>Budget signal</span></button>)}</div><div className="builder-summary"><span className="mono">BLUEPRINT PREVIEW</span><strong>{formatINR(blueprint.estimate.low)} — {formatINR(blueprint.estimate.high)}</strong><div><span>2% booking</span><b>{formatINR(blueprint.estimate.booking)}</b></div><p>{blueprint.objective}</p><button className="text-action" onClick={()=>setBlueprintOpen(!blueprintOpen)}>{blueprintOpen?"Hide blueprint":"Reveal blueprint"} ↗</button></div></div>}
   {blueprintOpen&&<div className="builder-blueprint"><span className="mono">GENERATED ROUTE</span><h3>{blueprint.title}</h3><p>{blueprint.objective}</p><div className="blueprint-grid"><div><b>RECOMMENDED</b>{recommendations.map(x=><span key={x.serviceId}>{x.serviceId.replaceAll("-"," ")}</span>)}</div><div><b>TIMELINE</b>{blueprint.timeline.map(x=><span key={x.name}>{x.name} / {x.duration}d</span>)}</div></div></div>}
   <div className="builder-footer"><button className="text-action" onClick={()=>step>1?setStep(step-1):setBuilderOpen(false)}>{step>1?"Back":"Close"} ↖</button>{step<7?<button className="hero-cta hero-cta--solid" onClick={()=>setStep(step+1)}>Continue ↘</button>:<button className="hero-cta hero-cta--solid" onClick={()=>setBlueprintOpen(true)}>Generate blueprint ↘</button>}</div>
  </section></div>}
 </main>;
}
