// src/schemas/inspectionSchema.ts
import { z } from "zod";

export type AnswerType = z.infer<typeof answerSchema>;


export const answerSchema = z.object({  
  reasoning: z.string().describe("Your reasoning for why you believe the owner has changed"),
  ownerChanged: z.union([
    z.literal("Yes"),
    z.literal("No"),
    z.literal("ERROR")
  ]).describe("Yes if the owner name has changed, No if it has not, ERROR if the owner name is not found in the lookup table"),
  status: z.union([
    z.literal("Error"),
    z.literal("Violations noted"),
    z.literal("Owner Change"),
    z.literal("Success")
  ]).describe("If any validation errors, 'Error'. If any content in Requirements, 'Violations noted'. If Owner Change is 'Yes', 'Owner Change'. Otherwise, 'Success'. Note: Violations takes precedence over Owner Change"),
  
});
