export {pricingRules,calculateEstimate} from "../engine/pricing.js";
export type {Estimate} from "../engine/pricing.js";
export function formatINR(value:number){
 return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
}
