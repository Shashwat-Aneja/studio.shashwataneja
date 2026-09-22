import {serviceCatalog,type ServiceItem} from "../data/catalog";
import type {ProjectRequirement} from "./requirements";
export const pricingRules={rush:1.20,priority:1.25,minimumBooking:4999,bookingRate:0.02,extraPage:999,extraIntegration:2499,extraRevision:1.10,bundleDiscount:[0.05,0.15] as const,multiServiceDiscount:[0.05,0.10] as const};
export type Estimate={low:number;high:number;booking:number;discount:number;services:ServiceItem[];notes:string[];confidence:"indicative"};
const goalDefaults:Record<ProjectRequirement["goal"],string>={presence:"business-website",commerce:"ecommerce",application:"web-app",brand:"logo-identity",growth:"seo-audit",technical:"simple-api"};
export function calculateEstimate(r:ProjectRequirement,selectedIds?:string[]):Estimate{
 const ids=selectedIds?.length?selectedIds:[goalDefaults[r.goal]];
 const services=ids.map(id=>serviceCatalog.find(s=>s.id===id)).filter(Boolean) as ServiceItem[];
 let low=services.reduce((s,x)=>s+x.range[0],0),high=services.reduce((s,x)=>s+x.range[1],0);
 const scaleFactor=r.scale==="lean"?.9:r.scale==="advanced"?1.35:1;low*=scaleFactor;high*=scaleFactor;
 low+=r.features.length*pricingRules.extraPage;high+=r.features.length*pricingRules.extraPage*1.5;
 low+=r.integrations.length*pricingRules.extraIntegration;high+=r.integrations.length*pricingRules.extraIntegration*1.5;
 if(r.deliverySpeed!=="standard"){const m=r.deliverySpeed==="rush"?pricingRules.rush:pricingRules.priority;low*=m;high*=m;}
 let discount=0;
 if(services.length>=3)discount=Math.min(.15,.05+(services.length-3)*.025);
 if(services.length>=2)discount=Math.max(discount,Math.min(.10,.05+(services.length-2)*.025));
 low=Math.max(4999,Math.round(low*(1-discount)/100)*100);high=Math.max(low,Math.round(high*(1-discount)/100)*100);
 const booking=Math.max(4999,Math.round(low*.02/100)*100);
 return{low,high,booking,discount,services,confidence:"indicative",notes:["Indicative range; final scope is confirmed before booking.","Third-party provider costs and taxes are separate.",Math.round(discount*100)+"% bundle/multi-service adjustment applied."]};
}
