import {describe,expect,it} from "vitest";
import {assessBudgetFit,calculateEstimate} from "./pricing";
import {defaultRequirement} from "./requirements";

describe("indicative pricing",()=>{
  it("returns an ordered estimate with the configured booking floor",()=>{
    const estimate=calculateEstimate(defaultRequirement);
    expect(estimate.low).toBeGreaterThanOrEqual(4999);
    expect(estimate.high).toBeGreaterThanOrEqual(estimate.low);
    expect(estimate.booking).toBeGreaterThanOrEqual(4999);
  });
  it("prices selected features as scoped add-ons instead of generic page fees",()=>{
    const baseline=calculateEstimate(defaultRequirement);
    const withPayments=calculateEstimate({...defaultRequirement,features:["Payments"]});
    expect(withPayments.low).toBeGreaterThan(baseline.low);
    expect(withPayments.high).toBeGreaterThan(baseline.high);
  });
  it("assesses whether an estimate overlaps the selected budget band",()=>{
    expect(assessBudgetFit({low:12000,high:22000,booking:4999,discount:0,services:[],notes:[],confidence:"indicative"},"10-25k")).toBe("within");
    expect(assessBudgetFit({low:30000,high:40000,booking:4999,discount:0,services:[],notes:[],confidence:"indicative"},"10-25k")).toBe("over");
    expect(assessBudgetFit({low:3000,high:8000,booking:4999,discount:0,services:[],notes:[],confidence:"indicative"},"25-50k")).toBe("below");
  });
});
