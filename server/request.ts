import {createBlueprint} from '../src/engine/blueprint.js';
import {services} from '../src/data/packages.js';
import {defaultRequirement,featureOptions,integrationOptions,preferenceOptions,type ProjectRequirement} from '../src/engine/requirements.js';
export type RequestSnapshot={title:string;items:{label:string;amount:string}[];estimate:string;specifications:string[];contact:{name:string;email:string;phone:string;notes:string};kind:'package'|'custom';timeline:string;agreementVersion:string};
const money=(n:number)=>`₹${n.toLocaleString('en-IN')}`;
const enums:Record<string,readonly unknown[]>={goal:['presence','commerce','application','brand','growth','technical'],audience:['personal','business','customers','internal','mixed'],scale:['lean','standard','advanced'],designLevel:['focused','custom','signature'],contentRequirement:['provided','assisted','full'],seoRequirement:['none','foundation','growth'],automationRequirement:['none','light','advanced'],deliverySpeed:['standard','priority','rush'],budgetRange:['under-10k','10-25k','25-50k','50-100k','100k-plus']};
export function parseRequest(body:any):RequestSnapshot{
 const c=body?.contact;
 if(!c||typeof c.name!=='string'||!c.name.trim()||c.name.length>120||/[\x00-\x1f\x7f]/.test(c.name)||typeof c.email!=='string'||c.email.length>200||!/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(c.email)||/[\x00-\x1f\x7f]/.test(c.email)||typeof c.phone!=='string'||c.phone.length>30||!/^\+?[\d ()-]{7,30}$/.test(c.phone)||c.phone.replace(/\D/g,'').length<7||c.phone.replace(/\D/g,'').length>15||typeof c.notes!=='string'||c.notes.length>2000||body.agreementAccepted!==true||body.website)throw Error('Please check contact details and accept the terms.');
 const base={contact:{name:c.name.trim(),email:c.email.trim().toLowerCase(),phone:c.phone.trim(),notes:c.notes.trim()},agreementVersion:'studio-email-request-2026-11-14'};
 if(body.kind==='package'){
  const s=services.find(s=>s.number===body.selection?.serviceId),t=s?.tiers.find(t=>t.name===body.selection?.tier);
  if(!s||!t)throw Error('Choose a valid service and tier.');
  const price=t.price;
  return {...base,kind:'package',title:`${s.name} / ${t.name}`,estimate:price,timeline:'To be agreed after review',items:[{label:`${s.name} - ${t.name}`,amount:price},...t.features.map(label=>({label,amount:'Included in package'}))],specifications:[t.summary,...s.deliverables,'Starting price; scope, timeline, taxes and external costs subject to review.']};
 }
 if(body.kind!=='custom'||!body.requirement)throw Error('Choose a project route.');
 const allowedKeys=Object.keys(defaultRequirement);
 if(typeof body.requirement!=='object'||Array.isArray(body.requirement)||Object.keys(body.requirement).some(k=>!allowedKeys.includes(k)))throw Error('Invalid project requirement.');
 const r={...defaultRequirement,...body.requirement} as ProjectRequirement;
 for(const [k,values] of Object.entries(enums))if(!values.includes((r as any)[k]))throw Error('Invalid project requirement.');
 for(const k of ['features','integrations','preferences'] as const)if(!Array.isArray(r[k])||r[k].length>10||r[k].some(x=>typeof x!=='string'||x.length>120)||new Set(r[k]).size!==r[k].length)throw Error('Invalid project options.');
 const options={features:featureOptions as readonly string[],integrations:integrationOptions.map(x=>x[0]) as readonly string[],preferences:preferenceOptions};
 for(const k of ['features','integrations','preferences'] as const)if(r[k].some(x=>!options[k].includes(x)))throw Error('Unsupported project option.');
 if(typeof r.infrastructureRequirement!=='boolean')throw Error('Invalid infrastructure choice.');
 const b=createBlueprint(r);
 return {...base,kind:'custom',title:b.title,estimate:`${money(b.estimate.low)} - ${money(b.estimate.high)}`,timeline:`${b.timeline.reduce((n,p)=>n+p.duration,0)} days (indicative)`,items:b.estimate.breakdown.map(s=>({label:s.label,amount:`${money(s.low)} to ${money(s.high)}`})),specifications:Object.entries(r).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', ')||'None':v}`).concat(b.estimate.notes,`Indicative timeline: ${b.timeline.reduce((n,p)=>n+p.duration,0)} days. Line items are indicative components of the overall estimate, not approved quotations.`)};
}
