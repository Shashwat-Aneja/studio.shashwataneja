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
 if(draft.blueprint.estimate.booking<4999) errors.push("Booking amount is below the configured minimum.");
 return errors;
}

export function createBookingSummary(draft:BookingDraft):BookingSummary{
 return {status:"payment",bookingAmount:draft.blueprint.estimate.booking,message:"Your booking details are ready. Secure checkout is available only when Studio has enabled payments; project confirmation requires a verified provider webhook."};
}
