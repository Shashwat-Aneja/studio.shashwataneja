import {useEffect,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent} from "react";

type Props={section?:string;onOpenBuilder?:()=>void};
type RobotState="idle"|"rest"|"moving"|"observing"|"celebrate"|"drag";
const points=[
  {id:"top",label:"START",x:.86,y:.2},
  {id:"services",label:"SERVICES",x:.14,y:.38},
  {id:"discover",label:"DISCOVER",x:.82,y:.52},
  {id:"process",label:"PROCESS",x:.18,y:.67},
  {id:"tools",label:"TOOLS",x:.78,y:.8},
  {id:"contact",label:"BOOK",x:.2,y:.9}
];

export default function RobotAssistant({section="START",onOpenBuilder}:Props){
  const [pos,setPos]=useState({x:.86,y:.2});
  const [look,setLook]=useState({x:0,y:0});
  const [drag,setDrag]=useState(false);
  const [label,setLabel]=useState(section);
  const [state,setState]=useState<RobotState>("idle");
  const p=useRef(pos);
  const target=useRef(pos);
  const offset=useRef({x:0,y:0});

  useEffect(()=>{
    let raf=0;
    const tick=()=>{
      const a=p.current,b=target.current,e=drag?.22:.065;
      const n={x:a.x+(b.x-a.x)*e,y:a.y+(b.y-a.y)*e};
      p.current=n;setPos(n);raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(raf);
  },[drag]);

  useEffect(()=>{
    const move=(e:PointerEvent)=>{
      setLook({x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5});
      if(drag){
        target.current={x:Math.min(.94,Math.max(.06,(e.clientX-offset.current.x)/innerWidth)),y:Math.min(.92,Math.max(.08,(e.clientY-offset.current.y)/innerHeight))};
        setState("drag");setLabel("DROP ME");
      }
    };
    const up=()=>{
      if(drag){setDrag(false);setState("rest");setLabel("STUDIO GUIDE");}
    };
    addEventListener("pointermove",move,{passive:true});addEventListener("pointerup",up);
    return()=>{removeEventListener("pointermove",move);removeEventListener("pointerup",up);};
  },[drag]);

  useEffect(()=>{
    const update=()=>{
      const marker=scrollY+innerHeight*.42;
      let current=points[0];
      for(const point of points){const el=document.getElementById(point.id);if(el&&el.offsetTop<=marker)current=point;}
      if(!drag){
        target.current={x:current.x,y:current.y};setLabel(current.label);
        setState(current.id==="contact"?"celebrate":current.id==="tools"?"observing":"moving");
      }
    };
    update();addEventListener("scroll",update,{passive:true});
    return()=>removeEventListener("scroll",update);
  },[drag]);

  const down=(e:ReactPointerEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    const rect=e.currentTarget.getBoundingClientRect();
    offset.current={x:e.clientX-(rect.left+rect.width/2),y:e.clientY-(rect.top+rect.height/2)};
    setDrag(true);setState("drag");setLabel("DROP ME");
  };

  return <button type="button" className={`guide-robot is-${state}`} aria-label="Drag the Studio guide; double-click to open the project builder" onPointerDown={down} onDoubleClick={()=>onOpenBuilder?.()} style={{"--rx":`${pos.x*100}vw`,"--ry":`${pos.y*100}vh`,"--look-x":look.x,"--look-y":look.y} as CSSProperties}>
    <span className="guide-robot__antenna"/>
    <span className="guide-robot__head"><i className="guide-robot__eye"/><i className="guide-robot__eye"/></span>
    <span className="guide-robot__neck"/>
    <span className="guide-robot__body"><i className="guide-robot__panel"/><b className="guide-robot__indicator"/></span>
    <span className="guide-robot__arm guide-robot__arm--left"/>
    <span className="guide-robot__arm guide-robot__arm--right"/>
    <span className="guide-robot__hand guide-robot__hand--left"/>
    <span className="guide-robot__hand guide-robot__hand--right"/>
    <span className="guide-robot__leg guide-robot__leg--left"/>
    <span className="guide-robot__leg guide-robot__leg--right"/>
    <span className="guide-robot__foot guide-robot__foot--left"/>
    <span className="guide-robot__foot guide-robot__foot--right"/>
    <span className="guide-robot__signal"/>
    <span className="guide-robot__label mono">{label}</span>
  </button>;
}
