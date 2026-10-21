import {useEffect,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent} from "react";

type Props={section?:string;onOpenBuilder?:()=>void};
type RobotState="idle"|"rest"|"moving"|"observing"|"celebrate"|"drag";
const points=[
  {id:"top",label:"ORIGIN",x:.78,y:.3},
  {id:"discover",label:"ENTERING",x:.18,y:.24},
  {id:"services",label:"PROJECTS",x:.78,y:.22},
  {id:"workshop",label:"WORKSHOP / THINK",x:.3,y:.72},
  {id:"process",label:"JOURNEY",x:.74,y:.64},
  {id:"proof",label:"SELECTED WORK",x:.2,y:.55},
  {id:"estimate",label:"ESTIMATE",x:.5,y:.78},
  {id:"faq",label:"QUESTIONS",x:.84,y:.72},
  {id:"contact",label:"EDGE / CONNECT",x:.82,y:.42}
];

export default function RobotAssistant({section="ORIGIN",onOpenBuilder}:Props){
  const [pos,setPos]=useState({x:.78,y:.3});
  const [look,setLook]=useState({x:0,y:0});
  const [drag,setDrag]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [state,setState]=useState<RobotState>("idle");
  void section;
  const p=useRef(pos),target=useRef(pos),offset=useRef({x:0,y:0});

  useEffect(()=>{
    let raf=0;
    const tick=()=>{
      const a=p.current,b=target.current,e=drag?.22:.045;
      const n={x:a.x+(b.x-a.x)*e,y:a.y+(b.y-a.y)*e};
      p.current=n;setPos(n);raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[drag]);

  useEffect(()=>{
    const move=(e:PointerEvent)=>{
      setLook({x:Math.max(-1,Math.min(1,(e.clientX/innerWidth-.5)*2)),y:Math.max(-1,Math.min(1,(e.clientY/innerHeight-.5)*2))});
      if(drag){
        target.current={x:Math.min(.94,Math.max(.06,(e.clientX-offset.current.x)/innerWidth)),y:Math.min(.92,Math.max(.08,(e.clientY-offset.current.y)/innerHeight))};
        setState("drag");
      }
    };
    const up=()=>{if(drag){setDrag(false);setState("rest");}};
    addEventListener("pointermove",move,{passive:true});addEventListener("pointerup",up);
    return()=>{removeEventListener("pointermove",move);removeEventListener("pointerup",up);};
  },[drag]);

  useEffect(()=>{
    const update=()=>{
      const marker=scrollY+innerHeight*.46;
      const sections=[...document.querySelectorAll<HTMLElement>("section[id]")];
      const current=sections.find(el=>marker>=el.offsetTop&&marker<el.offsetTop+el.offsetHeight)||sections[0];
      if(!current||drag)return;
      const point=points.find(item=>item.id===current.id);
      if(point){
        target.current={x:point.x,y:point.y};
        setState(current.id==="contact"?"celebrate":current.id==="tools"?"observing":"moving");
      }else{
        target.current={x:.5,y:.3};
        setState("idle");
      }
    };
    update();addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});
    return()=>{removeEventListener("scroll",update);removeEventListener("resize",update);};
  },[drag]);

  const down=(e:ReactPointerEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    const rect=e.currentTarget.getBoundingClientRect();
    offset.current={x:e.clientX-(rect.left+rect.width/2),y:e.clientY-(rect.top+rect.height/2)};
    setDrag(true);setState("drag");
  };

  return <button type="button" className={`guide-robot is-${state}${hovered?" is-hovered":""}`} aria-label="Studio guide. Double-click to open the project builder; drag to reposition." onPointerDown={down} onPointerEnter={()=>{setHovered(true);if(!drag)setState("observing");}} onPointerLeave={()=>{setHovered(false);if(!drag)setState("idle");}} onDoubleClick={()=>onOpenBuilder?.()} style={{"--rx":`${pos.x*100}vw`,"--ry":`${pos.y*100}vh`,"--look-x":look.x,"--look-y":look.y} as CSSProperties}>
    <span className="guide-robot__head"><i className="guide-robot__eye"/><i className="guide-robot__eye"/></span>
    <span className="guide-robot__body"><i className="guide-robot__panel"/><b className="guide-robot__indicator"/></span>
    <span className="guide-robot__arm guide-robot__arm--left"/>
    <span className="guide-robot__arm guide-robot__arm--right"/>
  </button>;
}
