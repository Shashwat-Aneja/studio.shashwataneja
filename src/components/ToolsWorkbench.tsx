import {useMemo,useState,type CSSProperties} from "react";
import type {ProjectRequirement} from "../engine/requirements";
import {createBlueprint} from "../engine/blueprint";
import {formatINR} from "../data/pricing";

type Props={requirement:ProjectRequirement;onStart:(goal?:ProjectRequirement["goal"])=>void};

const toolCopy=[
 {id:"need",n:"01",title:"What Do I Need?",desc:"Start with the outcome, not the service name."},
 {id:"budget",n:"02",title:"Budget Optimizer",desc:"See how scope can be phased around an investment range."},
 {id:"blueprint",n:"03",title:"Project Blueprint",desc:"Turn requirements into a route you can actually review."},
 {id:"timeline",n:"04",title:"Timeline Builder",desc:"See delivery phases and how speed changes them."},
 {id:"presence",n:"05",title:"Digital Presence Score",desc:"A structured self-assessment across visibility, trust and conversion."},
 {id:"roi",n:"06",title:"ROI Calculator",desc:"Model an outcome using your own assumptions — never a promise."},
 {id:"style",n:"07",title:"Design Style Generator",desc:"Choose the visual character before design starts."},
 {id:"package",n:"08",title:"Package Finder",desc:"See a sensible service combination for the route you selected."},
 {id:"bundle",n:"09",title:"Smart Bundles",desc:"Understand where related services can be grouped."}
] as const;

export default function ToolsWorkbench({requirement,onStart}:Props){
 const [active,setActive]=useState<(typeof toolCopy)[number]["id"]>("need");
 const [budget,setBudget]=useState(25000);
 const [visitors,setVisitors]=useState(5000);
 const [conversion,setConversion]=useState(2);
 const [value,setValue]=useState(2500);
 const [scores,setScores]=useState([7,6,8,5,7,6]);
 const [style,setStyle]=useState("Editorial");
 const blueprint=useMemo(()=>createBlueprint(requirement),[requirement]);
 const roi=Math.round(visitors*(conversion/100)*value);
 const presence=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length*10);
 const phases=blueprint.timeline;

 return <section className="tool-lab" id="tool-lab">
  <div className="tool-lab-head" data-reveal><div><span className="mono">08 / THE STUDIO LAB</span><h2>Don't just read the service.<br/><i>Interact with the decision.</i></h2></div><span className="mono">07 INSTRUMENTS / LIVE</span></div>
  <div className="tool-lab-layout">
   <aside className="tool-lab-nav">{toolCopy.map(t=><button key={t.id} className={active===t.id?"active":""} onClick={()=>setActive(t.id)}><span className="mono">{t.n}</span><strong>{t.title}</strong><em>↗</em></button>)}</aside>
   <div className="tool-lab-stage" key={active}>
    <div className="tool-lab-intro"><span className="mono">{toolCopy.find(t=>t.id===active)?.n} / INTERACTIVE TOOL</span><h3>{toolCopy.find(t=>t.id===active)?.title}</h3><p>{toolCopy.find(t=>t.id===active)?.desc}</p></div>
    {active==="need"&&<div className="lab-card route-card"><div className="lab-question">What is the closest description of your situation?</div>{[["presence","I need people to understand what I do."],["commerce","I need people to buy from me."],["application","I need a digital product or internal tool."],["brand","I need a clearer identity."],["growth","I need more discovery or conversion."]].map(([g,t])=><button key={g} onClick={()=>onStart(g as ProjectRequirement["goal"])}><span>{t}</span><b>BUILD ROUTE ↗</b></button>)}</div>}
    {active==="budget"&&<div className="lab-card"><label>Available project budget <output>{formatINR(budget)}</output></label><input type="range" min="5000" max="200000" step="1000" value={budget} onChange={e=>setBudget(Number(e.target.value))}/><div className="budget-result"><strong>{budget>=blueprint.estimate.low?"Current route fits":"Current route needs scope adjustment"}</strong><p>{budget>=blueprint.estimate.low?"Your selected budget covers the current indicative lower bound.":"Consider fewer features, a leaner phase or splitting the build into Phase 1 and Phase 2."}</p><button className="hero-cta" onClick={()=>onStart()}>Open budget-aware workshop ↗</button></div></div>}
    {active==="blueprint"&&<div className="lab-card blueprint-tool"><div><span className="mono">CURRENT ROUTE</span><strong>{blueprint.title}</strong><p>{blueprint.objective}</p></div><div className="lab-metrics"><span><b>FROM</b>{formatINR(blueprint.estimate.low)}</span><span><b>BOOKING</b>{formatINR(blueprint.estimate.booking)}</span><span><b>DAYS</b>{phases.reduce((s,p)=>s+p.duration,0)}</span></div><button className="hero-cta hero-cta--solid" onClick={()=>onStart()}>Refine this blueprint ↘</button></div>}
    {active==="timeline"&&<div className="lab-card timeline-tool">{phases.map((p,i)=><div className="timeline-row" key={p.name}><span className="mono">0{i+1}</span><div><strong>{p.name}</strong><small>{p.note}</small></div><b>{p.duration}d</b><i style={{"--phase":p.duration} as CSSProperties}/></div>)}</div>}
    {active==="presence"&&<div className="lab-card score-tool"><div className="score-ring" style={{"--score":presence} as CSSProperties}><strong>{presence}</strong><span>/100</span></div><div className="score-inputs">{["Presence","Discovery","Trust","Conversion","Performance","Infrastructure"].map((name,i)=><label key={name}><span>{name}</span><input type="range" min="0" max="10" value={scores[i]} onChange={e=>setScores(s=>s.map((v,j)=>j===i?Number(e.target.value):v))}/><b>{scores[i]}</b></label>)}</div><p>Self-assessment only. A real scanner can later combine public technical signals with these dimensions.</p></div>}
    {active==="roi"&&<div className="lab-card roi-tool">{[["Monthly visitors",visitors,setVisitors,100,100000,100],["Conversion rate %",conversion,setConversion,.1,20,.1],["Average value ₹",value,setValue,100,50000,100]].map(([label,val,setter,min,max,step])=><label key={label as string}><span>{label}</span><output>{label==="Conversion rate %"?Number(val).toFixed(1):formatINR(Number(val))}</output><input type="range" min={min as number} max={max as number} step={step as number} value={val as number} onChange={e=>(setter as (v:number)=>void)(Number(e.target.value))}/></label>)}<div className="roi-result"><span>Illustrative monthly value</span><strong>{formatINR(roi)}</strong><small>Based only on your assumptions. This is not a forecast or guarantee.</small></div></div>}
    {active==="package"&&<div className="lab-card package-tool"><span className="mono">ROUTE MATCH</span><strong>{blueprint.title}</strong><p>Based on the current requirements, these capabilities form a coherent starting route.</p><div className="package-items">{blueprint.recommendations.slice(0,4).map(x=><span key={x.serviceId}>{x.serviceId.replaceAll("-"," ")}<small>{x.reason}</small></span>)}</div><button className="hero-cta hero-cta--solid" onClick={()=>onStart()}>Configure this route ↘</button></div>}
    {active==="bundle"&&<div className="lab-card bundle-tool"><span className="mono">SMART BUNDLE LOGIC</span><h4>Related work can be planned together.</h4><div className="bundle-lines"><span>Core build <b>{formatINR(blueprint.estimate.low)}</b></span><span>Related services <b>5–15% potential bundle adjustment</b></span><span>Third-party costs <b>separate</b></span></div><p>The bundle engine applies only to configured services. No artificial discounts or expiry timers.</p><button className="hero-cta" onClick={()=>onStart()}>Build a combined route ↗</button></div>}
    {active==="style"&&<div className="lab-card style-tool"><div className="style-options">{["Editorial","Technical","Minimal","Expressive","Corporate","Cinematic","Playful","Architectural"].map(x=><button key={x} className={style===x?"active":""} onClick={()=>setStyle(x)}>{x}</button>)}</div><div className={"style-preview style-"+style.toLowerCase()}><span className="mono">DIRECTION</span><strong>{style}</strong><p>{style==="Editorial"?"Layered typography, generous whitespace and tactile detail.":style==="Technical"?"Precise grids, utility labels and system-like hierarchy.":style==="Minimal"?"Fewer elements, stronger spacing and deliberate contrast.":style==="Expressive"?"More movement, expressive type and unexpected transitions.":style==="Corporate"?"Structured hierarchy with restrained motion and clear information density.":style==="Cinematic"?"Deep pacing, dramatic scale shifts and controlled reveals.":style==="Playful"?"Friendly motion, responsive micro-interactions and softer geometry.":"Architectural composition, lines, grids and spatial rhythm."}</p></div><button className="hero-cta" onClick={()=>onStart()}>Use this direction in my project ↗</button></div>}
   </div>
  </div>
 </section>;
}
