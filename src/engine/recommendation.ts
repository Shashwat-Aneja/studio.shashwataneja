import type {ProjectRequirement} from "./requirements";
export type Recommendation={serviceId:string;reason:string;weight:number};
const map:Record<ProjectRequirement["goal"],string[]>={
 presence:["business-website","landing-page","portfolio","personal-website"],
 commerce:["ecommerce","advanced-ecommerce","payments","shipping","inventory"],
 application:["web-app","dashboard","saas-mvp","custom-platform"],
 brand:["brand-identity","logo-identity","brand-identity-system","brand-guidelines"],
 growth:["seo-audit","technical-seo-audit","on-page-seo","analytics-setup","conversion-audit"],
 technical:["simple-api","advanced-api","deployment","cloudflare","custom-automation"]
};
export function recommendServices(r:ProjectRequirement):Recommendation[]{
 const scores=new Map<string,{weight:number;reasons:string[]}>();
 const add=(id:string,weight:number,reason:string)=>{const x=scores.get(id)||{weight:0,reasons:[]};x.weight+=weight;x.reasons.push(reason);scores.set(id,x);};
 (map[r.goal]||[]).forEach((id,i)=>add(id,10-i,"matches your "+r.goal+" outcome"));
 if(r.designLevel!=="focused")add(r.goal==="brand"?"brand-identity":"website-ui",5,"your selected design depth");
 if(r.contentRequirement!=="provided")add("website-copy",4,"content support is part of the route");
 if(r.infrastructureRequirement)add("complete-launch",4,"launch infrastructure is included");
 if(r.seoRequirement!=="none")add(r.seoRequirement==="growth"?"seo-strategy":"seo-audit",4,"SEO is part of the requirement");
 if(r.automationRequirement!=="none")add(r.automationRequirement==="advanced"?"custom-automation":"forms-automation",6,"automation is part of the requirement");
 r.integrations.forEach(id=>add(id,5,"selected integration: "+id));
 return [...scores.entries()].map(([serviceId,v])=>({serviceId,weight:v.weight,reason:v.reasons.join("; ")})).sort((a,b)=>b.weight-a.weight).slice(0,8);
}
