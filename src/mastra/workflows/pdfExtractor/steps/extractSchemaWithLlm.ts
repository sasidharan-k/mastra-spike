import { Step } from '@mastra/core';
import { z } from 'zod';
import { inspectionSchema, InspectionType } from '../schema/inspectionSchema';
import { generateStructuredOutput } from '../helpers/bedrock';
import { readPdfBuffer } from '../helpers/pdfReader';
import * as path from 'path';

// Define input schema using Zod
const extractSchemaInputSchema = z.object({
    pdfUrl: z.string().describe('The URL of the PDF to extract the schema from'),
});

// Define input type using z.infer
type ExtractSchemaInput = z.infer<typeof extractSchemaInputSchema>;

const extractSchemaWithLlm = new Step({
    id: 'extractSchemaWithLlm',
    description: 'Extracts schema from a PDF using LLM',
    inputSchema: z.object({
        pdfUrl: z.string().describe('The URL of the PDF to extract the schema from'),
    }),
    outputSchema: inspectionSchema,
    execute: async ({ context, runId }: { context: any, runId: string }) => {
        try {
            // Print working directory
            console.log(`Run ID: ${runId}`);
            console.log(`Working directory: ${process.cwd()}`);

            // Access pdfUrl from the context if available, otherwise use default
            const pdfUrl = context.pdfUrl;
            console.log("pdfUrl ------", pdfUrl)

            // let pdfPath = pdfUrl;
            let pdfPath = path.resolve(process.cwd(), '../../src/mastra/workflows/pdfExtractor/data/1.pdf');
            console.log("pdfPath ------", pdfPath)

            const pdfBuffer = readPdfBuffer(pdfPath || '')
            console.log("pdfBuffer ------", pdfBuffer)

            const output = await generateStructuredOutput(
                'Extract schema from PDF',
                inspectionSchema,
                pdfBuffer,
                "application/pdf"
            );
            console.log("output ------", output)
            return output;
        }
        catch (error) {
            console.log("error ------", error)
        }
    },
})

export { extractSchemaWithLlm };