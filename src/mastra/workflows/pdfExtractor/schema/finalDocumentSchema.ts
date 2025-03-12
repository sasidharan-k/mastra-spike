// src/schemas/inspectionSchema.ts
import { z } from "zod";

export type FinalDocumentType = z.infer<typeof finalDocumentSchema>;


export const finalDocumentSchema = z.object({
  dateInspected: z.union([
    z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/),
    z.literal("ERROR")
  ]).describe("Extract value from PDF. If date is blank or unclear, put ERROR and add to errors"),
  
  certificateExpirationDate: z.union([
    z.string().regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/),
    z.literal("ERROR")
  ]).describe("Extract value from PDF. If date is blank or unclear, put ERROR and add to errors"),
  
  certificatePosted: z.union([
    z.literal("Yes"),
    z.literal("No"),
    z.literal("ERROR")
  ]).describe("Examine checkboxes for 'Yes' or 'No'. If none are checked, or both are checked, 'ERROR' and flag for error, otherwise put Yes or No"),
  
  jurisdictionNumber: z.union([
    z.string(),
    z.literal("ERROR")
  ]).describe("Extract value from PDF. If blank or unclear, put ERROR and add to error string"),
  
  natlBdNo: z.union([
    z.string(),
    z.literal("ERROR")
  ]).describe("Extract value from PDF. If date is blank or unclear, put ERROR and add to errors"),
  
  ownerName: z.string().describe("The extracted owner name from the PDF document"),
  ownerStreetAddress: z.string().describe("The street address of the owner extracted from the PDF document"),
  ownerState: z.string().describe("The state extracted from the PDF document. Typically a two-letter abbreviation"),
  ownerZip: z.string().describe("The zip code extracted from the PDF document"),
  
  ownerChange: z.union([
    z.literal("Yes"),
    z.literal("No"),
    z.literal("ERROR")
  ]).describe("Extract the 'Owner' field and look up the 'Owner' from the qryActiveVessels.xlsx table. If they are different, set to Yes, otherwise No. If owner not found in lookup, set ERROR"),
  
  kindOfInspection: z.union([
    z.literal("INTERNAL"),
    z.literal("EXTERNAL"),
    z.literal("ERROR")
  ]).describe("Examine checkboxes for 'Int' or 'Ext'. If none are checked, or both are checked, 'ERROR' and flag for error, otherwise put INTERNAL or EXTERNAL"),
  
  pressureAllowed: z.union([
    z.coerce.number().int().positive(),
    z.literal("ERROR")
  ]).describe("Extract value from PDF. If blank or unclear, put ERROR and add to error string"),
  
  requirements: z.union([
    z.literal("None"),
    z.literal("Violations Noted")
  ]).describe("If anything appears in this field, set the value to 'Violations Noted' and set the status to 'Violations'. Many inspections say 'See Supplemental Report' which should be treated as having violations"),
  
  inspectorIdentNo: z.union([
    z.coerce.number().int().positive(),
    z.literal("ERROR")
  ]).describe("Extract first value (starts with 'AR-'), remove prefix and enter only the number. If blank or unclear, put ERROR and add to error string"),
  
  fee: z.union([
    z.literal("N/A"),
    z.literal("$15.00"),
    z.literal("$30.00")
  ]).describe("Calculate the fee based on the number of years between Date Inspected and Certification Expiration date. If 1 year, $15.00, if 2 years, $30.00, otherwise N/A and flag an error"),
    
  message: z.string().describe("Leave blank if no validation errors or violations noted. Otherwise, a series of comma-separated plain text messages to explain errors in the file")
});
