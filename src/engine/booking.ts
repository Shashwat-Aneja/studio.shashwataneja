import type {ProjectBlueprint} from "./blueprint";

export type BookingDraft={
  blueprint:ProjectBlueprint;
  name:string;
  email:string;
  phone:string;
  notes:string;
  agreementAccepted:boolean;
};

export type BookingStatus="draft"|"review"|"agreement"|"payment"|"pending-verification"|"confirmed";

export type BookingSummary={
  status:BookingStatus;
  bookingAmount:number;
  message:string;
};

export function validateBooking(draft:BookingDraft):string[]{
 const errors:string[]=[];
 if(!draft.name.trim()) errors.push("Name is required.");
 if(!/^\S+@\S+\.\S+$/.test(draft.email.trim())) errors.push("A valid email is required.");
 if(!draft.phone.trim()) errors.push("Phone number is required.");
 else if(draft.phone.replace(/\D/g,"").length<7||draft.phone.replace(/\D/g,"").length>15) errors.push("Enter a valid phone number.");
 if(draft.notes.length>2000) errors.push("Notes must be 2,000 characters or fewer.");
 if(!draft.agreementAccepted) errors.push("Agreement acceptance is required before payment.");

 return errors;
}

export function createBookingSummary(draft:BookingDraft):BookingSummary{
 return {status:"payment",bookingAmount:draft.blueprint.estimate.booking,message:"The displayed 2% is an illustrative booking estimate based on the current scope range. The actual booking amount is calculated as 2% of the final written quotation and credited towards the project total. Secure checkout remains unavailable until Studio enables payments."};
}
