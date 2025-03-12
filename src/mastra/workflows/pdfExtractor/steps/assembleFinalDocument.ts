import { Step } from '@mastra/core';
import { AnswerType, answerSchema } from '../schema/answer';
import { finalDocumentSchema, FinalDocumentType } from '../schema/finalDocumentSchema';
const assembleFinalDocument = new Step({
    id: 'assembleFinalDocument',
    description: 'Combines the results from the PDF extraction and lookup into a final JSON document',
    inputSchema: answerSchema,
    execute: async ({ context }: { context: any }) => {

        // Get the results from the PDF
        const lookupResults = context.steps.compareBusinesses.output;

        const inspectionResults = context.steps.extractSchemaWithLlm.output;
        
        return;
    },
})



export { assembleFinalDocument }