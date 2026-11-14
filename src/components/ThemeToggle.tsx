import { useState } from "react";
export type ThemeMode="paper"|"void"|"terminal"|"dusk";
type Props={mode:ThemeMode;onChange:(mode:ThemeMode)=>void};
const themes:Array<[ThemeMode,string,string]>=[["paper","Paper","Warm editorial"],["void","Void","Cinematic dark"],["terminal","Terminal","Technical"],["dusk","Dusk","Blue-hour"]];
export default function ThemeToggle({mode,onChange}:Props){
 const [open,setOpen]=useState(false); const current=themes.find(([id])=>id===mode)??themes[0];
 return <div className="atmosphere"><button className="atmosphere-trigger" type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span className="atmosphere-dot"/><span>Change the atmosphere</span><strong>{current[1]}</strong><span>{open?"↑":"↓"}</span></button>
 {open&&<div className="atmosphere-menu" role="menu">{themes.map(([id,label,description])=><button key={id} type="button" role="menuitemradio" aria-checked={mode===id} className={mode===id?"atmosphere-option active":"atmosphere-option"} onClick={()=>{onChange(id);setOpen(false)}}><span className={`theme-swatch theme-swatch--${id}`}/><span><b>{label}</b><small>{description}</small></span><span className="mono">{mode===id?"ACTIVE":id.toUpperCase()}</span></button>)}</div>}</div>;
}