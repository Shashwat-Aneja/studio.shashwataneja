import {serviceCatalog,type ServiceItem} from "../data/catalog.js";
import type {ProjectRequirement} from "./requirements.js";
export const pricingRules={rush:1.20,priority:1.25,bookingRate:0.02,extraIntegration:2499,bundleDiscount:[0.05,0.15] as const,multiServiceDiscount:[0.05,0.10] as const};
export type Estimate={breakdown:{label:string;low:number;high:number}[];low:number;high:number;booking:number;discount:number;services:ServiceItem[];notes:string[];confidence:"indicative"};
const featureRanges:Record<string,readonly [number,number]>={
 "CMS":[5000,12000],"Blog":[3000,8000],"Booking":[5000,12000],"Payments":[5000,12000],
 "Analytics":[2000,5000],"SEO":[3000,8000],"Automation":[5000,15000],"Dashboard":[8000,20000],
 "Authentication":[5000,15000],"API":[5000,20000]
};
const goalDefaults:Record<ProjectRequirement["goal"],string>={presence:"business-website",commerce:"ecommerce",application:"web-app",brand:"logo-identity",growth:"seo-audit",technical:"simple-api"};
export function calculateEstimate(r:ProjectRequirement,selectedIds?:string[]):Estimate{
 const ids=selectedIds?.length?selectedIds:[goalDefaults[r.goal]];
 const services=ids.map(id=>serviceCatalog.find(s=>s.id===id)).filter(Boolean) as ServiceItem[];
 const scaleFactor=r.scale==="lean"?.9:r.scale==="advanced"?1.35:1;
 const designFactor=r.designLevel==="focused"?.9:r.designLevel==="signature"?1.25:1;
 const breakdown=services.map(s=>({label:s.name+" ("+r.scale+" scope / "+r.designLevel+" design)",low:s.range[0]*scaleFactor*designFactor,high:s.range[1]*scaleFactor*designFactor}));
 const add=(label:string,low:number,high:number)=>breakdown.push({label,low,high});
 for(const feature of r.features){const range=featureRanges[feature];if(range)add(feature,range[0],range[1]);}
 if(r.contentRequirement==="assisted")add("Assisted content",1500,4000);else if(r.contentRequirement==="full")add("Full content",5000,12000);
 if(r.infrastructureRequirement)add("Launch infrastructure",1500,4000);
 if(r.seoRequirement==="foundation")add("SEO foundation",3000,8000);else if(r.seoRequirement==="growth")add("SEO growth",7000,18000);
 if(r.automationRequirement==="light")add("Light automation",2500,7000);else if(r.automationRequirement==="advanced")add("Advanced automation",10000,25000);
 if(r.integrations.length)add("Integrations: "+r.integrations.join(", "),r.integrations.length*pricingRules.extraIntegration,r.integrations.length*pricingRules.extraIntegration*1.5);
 let low=breakdown.reduce((n,x)=>n+x.low,0),high=breakdown.reduce((n,x)=>n+x.high,0);
 if(r.deliverySpeed!=="standard"){const m=r.deliverySpeed==="rush"?pricingRules.rush:pricingRules.priority;add(r.deliverySpeed+" delivery adjustment",low*(m-1),high*(m-1));low*=m;high*=m;}
 let discount=0;
 if(services.length>=3)discount=Math.min(.15,.05+(services.length-3)*.025);
 if(services.length>=2)discount=Math.max(discount,Math.min(.10,.05+(services.length-2)*.025));
 if(discount)add("Bundle / multi-service adjustment",-low*discount,-high*discount);
 low=Math.max(4999,Math.round(low*(1-discount)/100)*100);high=Math.max(low,Math.round(high*(1-discount)/100)*100);
 for(const item of breakdown){item.low=Math.round(item.low);item.high=Math.round(item.high);}
 const adjustment={label:"Rounding / minimum project adjustment",low:low-breakdown.reduce((n,x)=>n+x.low,0),high:high-breakdown.reduce((n,x)=>n+x.high,0)};
 if(adjustment.low||adjustment.high)breakdown.push(adjustment);
 const booking=Math.round(low*.02);
 return{breakdown,low,high,booking,discount,services,confidence:"indicative",notes:["Indicative custom-project estimate only. The final fixed quotation determines the actual 2% booking payment.","Third-party provider costs and taxes are separate.","Design level: "+r.designLevel+". Content support: "+r.contentRequirement+".","Infrastructure: "+(r.infrastructureRequirement?"included as an estimate modifier":"not selected")+". SEO: "+r.seoRequirement+". Automation: "+r.automationRequirement+".",Math.round(discount*100)+"% bundle/multi-service adjustment applied."]};
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
