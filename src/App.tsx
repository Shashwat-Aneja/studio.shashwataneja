import {useEffect,useMemo,useState,type CSSProperties} from "react";
import "./styles/app.css";
import {serviceCategories} from "./data/services";
import {formatINR} from "./data/pricing";
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
 useEffect(()=>{const s=()=>document.documentElement.style.setProperty("--scroll-progress",Math.min(100,scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+"%");addEventListener("scroll",s,{passive:true});s();return()=>removeEventListener("scroll",s)},[]);


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
 const catGoal=(id:string):ProjectGoal=>id==="commerce"?"commerce":id==="application"?"application":id==="branding"?"brand":id==="growth"?"growth":id==="automation"?"technical":"presence";

 return <main className="studio-site">
  <header className="site-nav"><a className="wordmark" href="#top" onClick={()=>setMobileMenuOpen(false)}>SA<span>/</span>STUDIO</a><nav className={mobileMenuOpen?"is-open":""} aria-label="Main navigation"><a href="#services" onClick={()=>setMobileMenuOpen(false)}>Services</a><a href="#workshop" onClick={()=>setMobileMenuOpen(false)}>Workshop</a><a href="#process" onClick={()=>setMobileMenuOpen(false)}>Process</a><a href="#proof" onClick={()=>setMobileMenuOpen(false)}>Work</a><a href="#contact" onClick={()=>setMobileMenuOpen(false)}>Start</a></nav><div className="nav-controls"><button className="mobile-menu-toggle" type="button" aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen?"Close navigation":"Open navigation"} onClick={()=>setMobileMenuOpen(v=>!v)}>{mobileMenuOpen?"CLOSE":"MENU"} <span>{mobileMenuOpen?"−":"+"}</span></button><ThemeToggle mode={theme} onChange={setTheme}/></div></header>
  <RobotAssistant onOpenBuilder={()=>open()}/>
  <section className="hero" id="top"><span className="hero-noise mono">INDEPENDENT DIGITAL STUDIO</span><div className="hero-inner"><span className="mono hero-kicker" data-reveal>YOU HAVE THE IDEA. LET’S BUILD WHAT IT NEEDS.</span><h1 data-reveal>You have the idea.<br/><i>Let’s build what it needs.</i></h1><p data-reveal>Websites, software, design, branding, infrastructure, automation and growth — shaped around the outcome, not a generic package.</p><div className="hero-actions" data-reveal><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Build your project <span>↘</span></button><a className="hero-cta" href="#discover">I'm not sure what I need <span>↘</span></a></div><div className="hero-meta mono" data-reveal><span>FROM ₹4,999</span><span>2% BOOKING</span><span>NO ACCOUNT TO EXPLORE</span></div></div><span className="hero-index mono">01 / STUDIO</span><span className="hero-coordinate mono">INDIA · WORKING WORLDWIDE</span></section>

  <section className="recognition" id="discover"><div className="section-head" data-reveal><span className="mono">02 / WHAT YOU NEED</span><h2>Start with the thing<br/><i>that needs to change.</i></h2></div><div className="recognition-grid">{outcomes.map(([n,t,c,g],i)=><button className="recognition-card" data-reveal key={n} onClick={()=>open(g)} style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><h3>{t}</h3><p>{c}</p><b>FIND MY ROUTE ↗</b></button>)}</div></section>

  <section className="services" id="services"><div className="section-head split" data-reveal><div><span className="mono">03 / SERVICES</span><h2>Choose a capability.<br/><i>Watch it become specific.</i></h2></div><span className="mono">09 CAPABILITIES</span></div><div className="service-field"><div className="service-list">{serviceCategories.map(c=><button key={c.id} className={activeCategory===c.id?"service-row active":"service-row"} onClick={()=>setActiveCategory(c.id)}><span className="mono">{c.number}</span><strong>{c.name}</strong><em>↗</em></button>)}</div><article className="service-canvas" key={active.id}><div className="service-orbit"/><span className="mono">CONFIGURE / {active.number}</span><h3>{active.name}</h3><p>{active.description}</p><div className="service-tags">{active.services.map(s=><span key={s}>{s}</span>)}</div><button className="text-action" onClick={()=>open(catGoal(active.id))}>Configure this route ↗</button></article></div></section>

  <section className="workshop" id="workshop"><div className="workshop-copy" data-reveal><span className="mono">04 / PROJECT WORKSHOP</span><h2>Don't know the service?<br/><i>Build the answer.</i></h2><p>Studio asks the useful questions first: outcome, audience, scale, features, experience, speed and investment. Then it turns the answers into a project blueprint.</p><button className="hero-cta hero-cta--solid" onClick={()=>open()}>Open the workshop <span>↘</span></button></div><div className="workshop-visual" data-reveal><span className="mono">START WITH AN IDEA</span><strong>01 <i>→</i> 07</strong><p>Seven practical decisions. One clearer brief.</p><button className="text-action" onClick={()=>open()}>Open the project workshop ↗</button></div></section>

  <section className="estimate" id="estimate"><div data-reveal><span className="mono">05 / ESTIMATE</span><h2>Know the shape of the investment <i>before the sales call.</i></h2><p>These are provisional ranges from the current requirement model, not a final quote. Detailed service pricing will be confirmed before launch. Third-party costs and taxes stay separate.</p></div><div className="estimate-card estimate-ledger" data-reveal><span className="mono">INDICATIVE PROJECT RANGE</span><strong>{formatINR(blueprint.estimate.low)} <i>— {formatINR(blueprint.estimate.high)}</i></strong><div><span>2% booking</span><b>{formatINR(blueprint.estimate.booking)}</b></div><small>{requirement.goal} / {requirement.scale} / {requirement.deliverySpeed} / {selectedFeatures.length} feature modifiers</small></div></section>

  <section className="process" id="process"><div className="section-head" data-reveal><span className="mono">06 / HOW IT WORKS</span><h2>A sales journey that behaves<br/><i>like a product.</i></h2></div><div className="process-rail">{[["01","Discover","Start with the outcome."],["02","Configure","Shape scope and requirements."],["03","Estimate","See investment and timeline."],["04","Review","Confirm the route and agreement."],["05","Book","Pay 2%; then initialize the project."]].map(([n,t,c],i)=><article key={n} data-reveal style={{"--i":i} as CSSProperties}><span className="mono">{n}</span><div/><h3>{t}</h3><p>{c}</p></article>)}</div></section>

  <section className="tools" id="tools"><div className="section-head split" data-reveal><div><span className="mono">07 / SELECTED WORK</span><h2>Useful enough to try<br/><i>before you buy.</i></h2></div><span className="mono">PUBLIC PROJECTS</span></div><div className="work-index"><a href="https://shashwataneja.com" target="_blank" rel="noreferrer"><span className="mono">01</span><strong>Personal portfolio</strong><span>Design / Front-end</span><b>VISIT ↗</b></a><a href="https://github.com/Shashwat-Aneja/WIZARD-HomeAutomation" target="_blank" rel="noref