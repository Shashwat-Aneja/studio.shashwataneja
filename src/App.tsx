import {useEffect,useMemo,useState} from "react";
import "./styles/app.css";
import {serviceCategories} from "./data/services";
import RobotAssistant from "./components/RobotAssistant";
import ThemeToggle,{type ThemeMode} from "./components/ThemeToggle";
const THEME_KEY="studio-theme";
function getInitialTheme():ThemeMode{const stored=window.localStorage.getItem(THEME_KEY);return stored==="light"||stored==="dark"||stored==="system"?stored:"system"}
export default function App(){
 const [theme,setTheme]=useState<ThemeMode>(getInitialTheme);
 const [activeCategory,setActiveCategory]=useState("web");
 const [assistantOpen,setAssistantOpen]=useState(false);
 const activeService=useMemo(()=>serviceCategories.find(c=>c.id===activeCategory)??serviceCategories[0],[activeCategory]);
 useEffect(()=>{document.documentElement.dataset.theme=theme;window.localStorage.setItem(THEME_KEY,theme)},[theme]);
 const assistantMessage=assistantOpen?"Tell me what you are trying to build. I will help translate the outcome into the right service path.":"Not sure where to start? I can turn the goal you have in mind into a practical Studio route.";
 return <main className="studio-shell">
  <header className="topbar"><a className="wordmark" href="/" aria-label="Shashwat Aneja Studio home"><span>SA</span><strong>STUDIO</strong></a><div className="topbar-right"><span className="status-line"><i/> Available for selected projects</span><ThemeToggle mode={theme} onChange={setTheme}/></div></header>
  <section className="hero-grid"><div className="hero-copy-block"><p className="eyebrow">DIGITAL PRODUCT STUDIO / 01</p><h1>Build the digital presence your idea actually needs.</h1><p className="hero-description">Explore capabilities, define the requirement, understand scope and reach a clear project path before anything is booked.</p><div className="hero-actions"><button className="primary-action" type="button" onClick={()=>setAssistantOpen(true)}>Build Your Project <span>↗</span></button><button className="secondary-action" type="button" onClick={()=>setAssistantOpen(true)}>What Do I Need?</button></div><div className="journey-line">{["Discover","Guide","Configure","Estimate","Book"].map((step,i)=><span key={step}><b>{String(i+1).padStart(2,"0")}</b>{step}</span>)}</div></div><RobotAssistant message={assistantMessage} state={assistantOpen?"guiding":"idle"} onAction={()=>setAssistantOpen(true)}/></section>
  <section className="capability-section" aria-labelledby="capability-heading"><div className="section-heading"><div><p className="eyebrow">CAPABILITY FIELD</p><h2 id="capability-heading">Choose the problem. The route follows.</h2></div><p>Services are grouped by outcome so you do not need to know the technical solution before starting.</p></div><div className="capability-layout"><nav className="category-list" aria-label="Service categories">{serviceCategories.map(c=><button key={c.id} type="button" className={activeCategory===c.id?"category-row active":"category-row"} onClick={()=>setActiveCategory(c.id)}><span>{c.number}</span><strong>{c.name}</strong><span aria-hidden="true">↗</span></button>)}</nav><article className="service-detail"><div><p className="service-number">{activeService.number} / {activeService.name.toUpperCase()}</p><h3>{activeService.name}</h3><p>{activeService.description}</p></div><ul>{activeService.services.map(s=><li key={s}>{s}</li>)}</ul><button className="text-action" type="button" onClick={()=>setAssistantOpen(true)}>Configure this route <span aria-hidden="true">↗</span></button></article></div></section>
  <section className="process-section">{[["01","Discover","Start with an outcome, not a technical checklist."],["02","Configure","Shape the scope with guided requirements and add-ons."],["03","Estimate","See pricing logic, delivery range and what is included."],["04","Book","Review the summary, accept the agreement and pay the 2% booking amount."]].map(([n,t,d])=><article className="process-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</section>
  <footer className="footer-line"><span>SHASHWAT ANEJA / STUDIO</span><span>Discovery → Booking → Dashboard handoff</span></footer>
 </main>
}