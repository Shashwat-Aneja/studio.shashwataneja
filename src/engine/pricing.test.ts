import {describe,expect,it} from "vitest";
import {assessBudgetFit,calculateEstimate} from "./pricing.js";
import {defaultRequirement} from "./requirements.js";

describe("indicative pricing",()=>{
  it("returns an ordered estimate with a credited 2 percent booking amount",()=>{
    const estimate=calculateEstimate(defaultRequirement);
    expect(estimate.low).toBeGreaterThanOrEqual(4999);
    expect(estimate.high).toBeGreaterThanOrEqual(estimate.low);
    expect(estimate.booking).toBe(Math.round(estimate.low*.02));
  });
  it("prices selected features as scoped add-ons instead of generic page fees",()=>{
    const baseline=calculateEstimate(defaultRequirement);
    const withPayments=calculateEstimate({...defaultRequirement,features:["Payments"]});
    expect(withPayments.low).toBeGreaterThan(baseline.low);
    expect(withPayments.high).toBeGreaterThan(baseline.high);
    const withIntegration=calculateEstimate({...defaultRequirement,integrations:["payments"]});
    expect(withIntegration.low).toBeGreaterThan(baseline.low);
  });
  it("reflects design depth, content, SEO and infrastructure choices",()=>{
    const lean={...defaultRequirement,designLevel:"focused" as const,contentRequirement:"provided" as const,infrastructureRequirement:false,seoRequirement:"none" as const};
    const standard=calculateEstimate(defaultRequirement);
    const reduced=calculateEstimate(lean);
    expect(standard.low).toBeGreaterThan(reduced.low);
    expect(standard.high).toBeGreaterThan(reduced.high);
  });
  it("assesses whether an estimate overlaps the selected budget band",()=>{
    expect(assessBudgetFit({low:12000,high:22000,booking:4999,discount:0,services:[],breakdown:[],notes:[],confidence:"indicative"},"10-25k")).toBe("within");
    expect(assessBudgetFit({low:30000,high:40000,booking:4999,discount:0,services:[],breakdown:[],notes:[],confidence:"indicative"},"10-25k")).toBe("over");
    expect(assessBudgetFit({low:3000,high:8000,booking:4999,discount:0,services:[],breakdown:[],notes:[],confidence:"indicative"},"25-50k")).toBe("below");
  });
});

// Every provisional line item must reconcile with the displayed overall range.
it("reconciles itemized scope and delivery adjustments",()=>{for(const deliverySpeed of ["standard","priority","rush"] as const){const e=calculateEstimate({...defaultRequirement,features:["CMS","Analytics"],integrations:["CRM"],deliverySpeed},["business-website","ecommerce"]);expect(e.breakdown.reduce((n,x)=>n+x.low,0)).toBe(e.low);expect(e.breakdown.reduce((n,x)=>n+x.high,0)).toBe(e.high);}});

it("prices faster rush delivery above priority and standard, with shorter timelines",async()=>{const {timelineDays}=await import("./timeline.js");const r=defaultRequirement;expect(calculateEstimate({...r,deliverySpeed:"rush"}).low).toBeGreaterThan(calculateEstimate({...r,deliverySpeed:"priority"}).low);expect(calculateEstimate({...r,deliverySpeed:"priority"}).low).toBeGreaterThan(calculateEstimate(r).low);expect(timelineDays({...r,deliverySpeed:"rush"})).toBeLessThan(timelineDays({...r,deliverySpeed:"priority"}));expect(timelineDays({...r,deliverySpeed:"priority"})).toBeLessThanOrEqual(timelineDays(r));});
