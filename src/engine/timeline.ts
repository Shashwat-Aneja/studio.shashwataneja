import type {ProjectRequirement} from "./requirements";
export type TimelinePhase={name:string;duration:number;note:string};
export function buildTimeline(r:ProjectRequirement):TimelinePhase[]{
 const base=r.scale==="lean"?[["Discovery",1],["Design",2],["Build",4],["QA",1],["Launch",1]]:r.scale==="advanced"?[["Discovery",2],["Planning",3],["Design",5],["Build",10],["QA",3],["Launch",2]]:[["Discovery",2],["Planning",2],["Design",4],["Build",7],["QA",2],["Launch",1]];
 const speed=r.deliverySpeed==="rush"?.65:r.deliverySpeed==="priority"?.8:1;
 return base.map(([name,duration])=>({name:String(name),duration:Math.max(1,Math.ceil(Number(duration)*speed)),note:name==="Build"?"Implementation and integrations":name==="Design"?"Visual direction and interface system":"Project phase"}));
}
export function timelineDays(r:ProjectRequirement){return buildTimeline(r).reduce((s,p)=>s+p.duration,0);}
