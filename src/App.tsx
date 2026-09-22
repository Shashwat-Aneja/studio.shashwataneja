import { useEffect, useMemo, useState } from "react";
import "./styles/app.css";
import { serviceCategories } from "./data/services";
import { estimateProject, formatINR, type DeliverySpeed, type ProjectGoal, type ProjectScale } from "./data/pricing";
import RobotAssistant from "./components/RobotAssistant";
import ThemeToggle, { type ThemeMode } from "./components/ThemeToggle";

const THEME_KEY = "studio-theme";
const goals: { id: ProjectGoal; title: string; note: string }[] = [
  { id:"presence", title:"Digital presence", note:"Website, portfolio or business presence." },
  { id:"commerce", title:"Sell online", note:"Storefront, payments and commerce." },
  { id:"application", title:"Build a product", note:"App, dashboard, SaaS or platform." },
  { id:"brand", title:"Build a brand", note:"Identity, logo and visual system." },
  { id:"growth", title:"Improve what exists", note:"SEO, analytics and conversion." },
];
function getInitialTheme(): ThemeMode { const stored=window.localStorage.getItem(THEME_KEY); return stored==="light"||stored==="dark"||stored==="system"?stored:"system"; }

export default function App(){
 const [theme,setTheme]=useState<ThemeMode>(getInitialTheme);
 const [activeCategory,setActiveCategory]=useState("web");
 const [assistantOpen,setAssistantOpen]=useState(false);
 const [builderOpen,setBuilderOpen]=useState(false);
 const [goal,setGoal]=useState<ProjectGoal>("presence");
 const [scale,setScale]=useState<ProjectScale>("standard");
 const [speed,setSpeed]=useState<DeliverySpeed>("standard");
 const activeService=useMemo(()=>serviceCategories.find(c=>c.id===activeCategory)??serviceCategories[0],[activeCategory]);
 const estimate=useMemo(()=>estimateProject(goal,scale,speed),[goal,scale,speed]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;window.localStorage.setItem(THEME_KEY,theme)},[theme]);
 return <main className="studio-shell">
  <header className="topbar"><a className="wordmark" href="/" aria-label="Studio home"><span>SA</span><strong>STUDIO</strong></a><div className="topbar-right"><span className="status-line"><i/> Available for selected projects</span><ThemeToggle mode={theme} onChange={setTheme}/></div></header>
  <section className="hero-grid"><div className="hero-copy-block"><p className="eyebrow">DIGITAL PRODUCT STUDIO / 01</p><h1>Build the digital presence your idea actually needs.</h1><p className="hero-description">Explore capabilities, define the requirement, understand scope and reach a clear project path before anything is booked.</p><div className="hero-actions"><button className="primary-action" onClick={()=>setBuilderOpen(true)}>Build Your Project <span>↗</span></button><button className="secondary-action" onClick={()=>setAssistantOpen(true)}>What Do I Need?</button></div><div className="journey-line">{["Discover","Guide","Configure","Estimate","Book"].map((s,i)=><span key={s}><b>0{i+1}</b>{s}</span>)}</div></div><RobotAssistant message={assistantOpen?"Tell me the outcome you want. I will translate it into a practical Studio route.":"Not sure where to start? I can turn the goal you have in mind into a practical Studio route."} state={assistantOpen?"guiding":builderOpen?"thinking":"idle"} onAction={()=>setAssistantOpen(true)}/></section>
  <section className="capability-section"><div className="section-heading"><div><p className="eyebrow">CAPABILITY FIELD</p><h2>Choose the problem. The route follows.</h2></div><p>Services are grouped by outcome, so you do not need to know the technical solution before starting.</p></div><div className="capability-layout"><nav className="category-list" aria-label="Service categories">{serviceCategories.map(c=><button key={c.id} className={activeCategory===c.id?"category-row active":"category-row"} onClick={()=>setActiveCategory(c.id)}><span>{c.number}</span><strong>{c.name}</strong><span>↗</span></button>)}</nav><article className="service-detail"><p className="service-number">{activeService.number} / {activeService.name.toUpperCase()}</p><h3>{activeService.name}</h3><p>{activeService.description}</p><ul>{activeService.services.map(s=><li key={s}>{s}</li>)}</ul><button className="text-action" onClick={()=>setBuilderOpen(true)}>Configure this route <span>↗</span></button></article></div></section>
  <section className="tool-strip"><div><p className="eyebrow">STUDIO TOOLS / 02</p><h2>Useful before the first call.</h2></div><div className="tool-grid">{[["01","What Do I Need?","Translate a goal into a service path."],["02","Budget Optimizer","See what can fit without guessing."],["03","Project Blueprint","Turn an idea into a structured scope."],["04","Timeline Builder","Understand the delivery sequence."]].map(([n,t,d])=><button className="tool-card" key={n} onClick={()=>setBuilderOpen(true)}><span>{n}</span><strong>{t}</strong><p>{d}</p><em>Open tool ↗</em></button>)}</div></section>
  <section className="process-section">{[["01","Discover","Start with an outcome, not a technical checklist."],["02","Configure","Shape the scope with guided requirements and add-ons."],["03","Estimate","See pricing logic, delivery range and what is included."],["04","Book","Review the summary, accept the agreement and pay the 2% booking amount."]].map(([n,t,d])=><article className="process-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</section>
  <footer className="footer-line"><span>SHASHWAT ANEJA / STUDIO</span><span>Discovery → Booking → Dashboard handoff</span></footer>
  {builderOpen&&<div className="builder-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setBuilderOpen(false)}}><section className="builder-panel" role="dialog" aria-modal="true"><div className="builder-header"><div><p className="eyebrow">BUILD YOUR PROJECT / 03</p><h2>Start with the outcome.</h2></div><button className="close-button" onClick={()=>setBuilderOpen(false)}>×</button></div><div className="builder-step"><span>01 / OUTCOME</span><div className="option-grid">{goals.map(g=><button className={goal===g.id?"option-card selected":"option-card"} key={g.id} onClick={()=>setGoal(g.id)}><strong>{g.title}</strong><small>{g.note}</small></button>)}</div></div><div className="builder-step"><span>02 / SCALE</span><div className="segmented">{[["lean","Lean","Focused scope"],["standard","Standard","Most common"],["advanced","Advanced","Complex build"]].map(([id,t,n])=><button key={id} className={scale===id?"selected":""} onClick={()=>setScale(id as ProjectScale)}><strong>{t}</strong><small>{n}</small></button>)}</div></div><div className="builder-step"><span>03 / DELIVERY</span><div className="segmented">{[["standard","Standard","Normal schedule"],["priority","Priority","+25%"],["rush","Rush","+20%"]].map(([id,t,n])=><button key={id} className={speed===id?"selected":""} onClick={()=>setSpeed(id as DeliverySpeed)}><strong>{t}</strong><small>{n}</small></button>)}</div></div><div className="estimate-panel"><div><span>INDICATIVE PROJECT RANGE</span><strong>{formatINR(estimate.low)} – {formatINR(estimate.high)}</strong><small>Third-party costs and taxes are separate. Final scope is confirmed before booking.</small></div><div className="estimate-booking"><span>2% BOOKING</span><strong>{formatINR(estimate.booking)}</strong></div></div><button className="primary-action full-width" onClick={()=>setAssistantOpen(true)}>Continue with guidance <span>↗</span></button></section></div>}
 </main>;
}