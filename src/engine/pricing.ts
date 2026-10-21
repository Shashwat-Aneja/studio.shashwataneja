import {serviceCatalog,type ServiceItem} from "../data/catalog";
import type {ProjectRequirement} from "./requirements";
export const pricingRules={rush:1.20,priority:1.25,minimumBooking:4999,bookingRate:0.02,extraIntegration:2499,bundleDiscount:[0.05,0.15] as const,multiServiceDiscount:[0.05,0.10] as const};
export type Estimate={low:number;high:number;booking:number;discount:number;services:ServiceItem[];notes:string[];confidence:"indicative"};
const featureRanges:Record<string,readonly [number,number]>={
 "CMS":[5000,12000],"Blog":[3000,8000],"Booking":[5000,12000],"Payments":[5000,12000],
 "Analytics":[2000,5000],"SEO":[3000,8000],"Automation":[5000,15000],"Dashboard":[8000,20000],
 "Authentication":[5000,15000],"API":[5000,20000]
};
const goalDefaults:Record<ProjectRequirement["goal"],string>={presence:"business-website",commerce:"ecommerce",application:"web-app",brand:"logo-identity",growth:"seo-audit",technical:"simple-api"};
export function calculateEstimate(r:ProjectRequirement,selectedIds?:string[]):Estimate{
 const ids=selectedIds?.length?selectedIds:[goalDefaults[r.goal]];
 const services=ids.map(id=>serviceCatalog.find(s=>s.id===id)).filter(Boolean) as ServiceItem[];
 let low=services.reduce((s,x)=>s+x.range[0],0),high=services.reduce((s,x)=>s+x.range[1],0);
 const scaleFactor=r.scale==="lean"?.9:r.scale==="advanced"?1.35:1;low*=scaleFactor;high*=scaleFactor;
 for(const feature of r.features){const range=featureRanges[feature];if(range){low+=range[0];high+=range[1];}}
 low+=r.integrations.length*pricingRules.extraIntegration;high+=r.integrations.length*pricingRules.extraIntegration*1.5;
 if(r.deliverySpeed!=="standard"){const m=r.deliverySpeed==="rush"?pricingRules.rush:pricingRules.priority;low*=m;high*=m;}
 let discount=0;
 if(services.length>=3)discount=Math.min(.15,.05+(services.length-3)*.025);
 if(services.length>=2)discount=Math.max(discount,Math.min(.10,.05+(services.length-2)*.025));
 low=Math.max(4999,Math.round(low*(1-discount)/100)*100);high=Math.max(low,Math.round(high*(1-discount)/100)*100);
 const booking=Math.max(4999,Math.round(low*.02/100)*100);
 return{low,high,booking,discount,services,confidence:"indicative",notes:["Indicative range only; confirm detailed service pricing and scope before booking.","Third-party provider costs and taxes are separate.",Math.round(discount*100)+"% bundle/multi-service adjustment applied."]};
}

export type BudgetFit="within"|"below"|"over";
const budgetBounds:Record<ProjectRequirement["budgetRange"],readonly [number,number]>={
 "under-10k":[0,10000],"10-25k":[10000,25000],"25-50k":[25000,50000],"50-100k":[50000,100000],"100k-plus":[100000,Number.POSITIVE_INFINITY]
};
export function assessBudgetFit(estimate:Estimate,budget:ProjectRequirement["budgetRange"]):BudgetFit{
 const [minimum,maximum]=budgetBounds[budget];
 if(estimate.low>maximum)return "over";
 if(estimate.high<minimum)return "below";
 return "within";
}
