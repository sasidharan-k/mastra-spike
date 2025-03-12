// src/schemas/inspectionSchema.ts
import { z } from "zod";

export type LookupType = z.infer<typeof lookupSchema>;


export const lookupSchema = z.object({  
  name: z.string().describe("The extracted name from the Excel sheet"),
  address: z.string().describe("The extracted address from the Excel sheet"),
  state: z.string().describe("The extracted state from the Excel sheet"),
  zip: z.string().describe("The extracted zip from the Excel sheet"),
});
