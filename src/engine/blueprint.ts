import type {ProjectRequirement} from "./requirements";
import {calculateEstimate,type Estimate} from "./pricing";
import {buildTimeline,type TimelinePhase} from "./timeline";
import {recommendServices,type Recommendation} from "./recommendation";
export type ProjectBlueprint={title:string;objective:string;summary:string[];recommendations:Recommendation[];estimate:Estimate;timeline:TimelinePhase[];nextSteps:string[]};
export function createBlueprint(r:ProjectRequirement,selectedIds?:string[]):ProjectBlueprint{
 const estimate=calculateEstimate(r,selectedIds);
 return{title:r.goal==="presence"?"Digital Presence Build":r.goal==="commerce"?"Commerce Build":r.goal==="application"?"Application Build":r.goal==="brand"?"Brand System":r.goal==="growth"?"Growth Route":"Technical Build",objective:"Create a "+r.scale+" "+r.goal+" route for a "+r.audience+" audience.",summary:[r.scale+" scope",r.designLevel+" design",r.deliverySpeed+" delivery",r.contentRequirement+" content"],recommendations:recommendServices(r),estimate,timeline:buildTimeline(r),nextSteps:["Review the generated scope","Adjust requirements if needed","Confirm the final route","Proceed to agreement and 2% booking"]};
}
