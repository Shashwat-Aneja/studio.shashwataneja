import type {ProjectBlueprint} from "./blueprint.js";

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
 if(!draft.agreementAccepted) errors.push("Agreement acceptance is required before submission.");

 return errors;
}

export function createBookingSummary(_draft:BookingDraft):BookingSummary{
 return {status:"review",bookingAmount:0,message:"Provisional request pending Studio review. No payment is collected."};
}
