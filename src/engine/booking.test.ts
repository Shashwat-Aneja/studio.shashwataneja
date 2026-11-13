import {describe,expect,it} from "vitest";
import {createBlueprint} from "./blueprint.js";
import {validateBooking,type BookingDraft} from "./booking.js";
import {defaultRequirement} from "./requirements.js";

const blueprint=createBlueprint(defaultRequirement);
const validDraft:BookingDraft={blueprint,name:"Aarav",email:"hello@example.com",phone:"9876543210",notes:"",agreementAccepted:true};

describe("booking validation",()=>{
  it("accepts a complete valid draft",()=>expect(validateBooking(validDraft)).toEqual([]));
  it("rejects malformed email and phone values",()=>{
    const errors=validateBooking({...validDraft,email:"not-an-email",phone:"123"});
    expect(errors).toContain("A valid email is required.");
    expect(errors).toContain("Enter a valid phone number.");
  });
  it("requires agreement acceptance and caps notes",()=>{
    const errors=validateBooking({...validDraft,agreementAccepted:false,notes:"x".repeat(2001)});
    expect(errors).toContain("Agreement acceptance is required before submission.");
    expect(errors).toContain("Notes must be 2,000 characters or fewer.");
  });
});
