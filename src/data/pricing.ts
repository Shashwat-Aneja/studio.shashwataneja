export {pricingRules,calculateEstimate} from "../engine/pricing";
export type {Estimate} from "../engine/pricing";
export function formatINR(value:number){
 return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
}
