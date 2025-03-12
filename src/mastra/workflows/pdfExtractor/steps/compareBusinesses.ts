import { Step } from '@mastra/core';
import { LookupType, lookupSchema } from '../schema/lookupSchema';
import { AnswerType, answerSchema } from '../schema/answer';
import { generateStructuredOutput } from '../helpers/bedrock';

const compareBusiness = new Step({
    id: 'compareBusiness',
    description: 'Looks at the name and address from the inspection and compares it to the name and address from the lookup table',
    inputSchema: lookupSchema,
    execute: async ({ context }: {context: any}) => {

        // Get the results from the PDF
        const inspectionResults = context.steps.extractSchemaWithLlm.output;
        const name = inspectionResults?.ownerName;
        const address = inspectionResults?.ownerStreetAddress ?? "No address found";
        const state = inspectionResults?.ownerState ?? "No state found"; 
        
        // Get the output from the previous step 
        const vesselResults = context.steps.lookupBusinessNameFromExcel.output;
        
        const lookupName = vesselResults?.businessName;
        const lookupAddress = vesselResults?.address;
        const lookupState = vesselResults?.state; //await llm.lookupBusinessName(jurisdictionNumber);

        // Let's ask the LLM if they have changed the owner
        const prompt = createPrompt(name, address, state, lookupName, lookupAddress, lookupState);

        const response = await generateStructuredOutput<AnswerType>(prompt, answerSchema);
        return response;
    },
})

// Create a function that takes the names, address and states and returns a prmopt that an LLM will use to determine if the business owner has changed
function createPrompt(name: string, address: string, state: string, lookupName: string, lookupAddress: string, lookupState: string) {
    const prompt = `You are an expert data analyst. Your task is to help us clean up data so that it can be easily compared. 
        
    The input is coming from two different, hand entered sources. Different people entered the data, so there may be places where they're using slightly different language to mean the same thing. For example UPS and United Parcel Service are the same company. 
    
    Use the information below and determine whether or not the owner of the business has changed. If the business name, address, or state has materially changed, indicate "Yes". If the business name, address, or state has not changed, indicate "No". If the business name, address, or state is not found in the lookup table, indicate "ERROR".
    
    <inspection>
    <name>${name}</name>
    <address>${address}</address>
    <state>${state}</state>
    </inspection>

    <lookup>
    <name>${lookupName}</name>
    <address>${lookupAddress}</address>
    <state>${lookupState}</state>
    </lookup>
    Has the owner changed?`;
    
    return prompt;
}


export { compareBusiness }