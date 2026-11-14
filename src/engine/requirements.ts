export type ProjectGoal="presence"|"commerce"|"application"|"brand"|"growth"|"technical";
export type ProjectScale="lean"|"standard"|"advanced";
export type DeliverySpeed="standard"|"priority"|"rush";
export type ProjectRequirement={
 goal:ProjectGoal; audience:"personal"|"business"|"customers"|"internal"|"mixed"; scale:ProjectScale;
 features:string[]; integrations:string[]; designLevel:"focused"|"custom"|"signature";
 contentRequirement:"provided"|"assisted"|"full"; infrastructureRequirement:boolean;
 seoRequirement:"none"|"foundation"|"growth"; automationRequirement:"none"|"light"|"advanced";
 deliverySpeed:DeliverySpeed; budgetRange:"under-10k"|"10-25k"|"25-50k"|"50-100k"|"100k-plus"; preferences:string[];
};
export const defaultRequirement:ProjectRequirement={
 goal:"presence",audience:"business",scale:"standard",features:[],integrations:[],
 designLevel:"custom",contentRequirement:"assisted",infrastructureRequirement:true,
 seoRequirement:"foundation",automationRequirement:"none",deliverySpeed:"standard",budgetRange:"25-50k",preferences:[]
};
export function requirementSummary(r:ProjectRequirement){return[
 r.goal==="presence"?"digital presence":r.goal,r.scale+" scope",r.designLevel+" design",
 r.contentRequirement+" content",r.seoRequirement==="none"?null:r.seoRequirement+" SEO",
 r.automationRequirement==="none"?null:r.automationRequirement+" automation",
 r.infrastructureRequirement?"launch infrastructure":null,r.integrations.length?r.integrations.length+" integration(s)":null
].filter(Boolean) as string[];}

export const featureOptions=["CMS","Blog","Booking","Payments","Analytics","SEO","Automation","Dashboard","Authentication","API"] as const;
export const integrationOptions=[
 ["payments","Payment provider","Checkout and transactions."],
 ["whatsapp","WhatsApp","Customer communication."],
 ["crm","CRM","Lead and customer records."],
 ["google-sheets","Google Sheets","Lightweight data synchronisation."],
 ["webhooks","Webhooks / API","Connect an external service."]
] as const;
// No preference identifiers are currently offered by the workshop.
export const preferenceOptions:readonly string[]=[];
