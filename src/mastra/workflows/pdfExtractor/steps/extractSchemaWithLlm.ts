import { Step } from '@mastra/core';
import { z } from 'zod';
import { inspectionSchema, InspectionType } from '../schema/inspectionSchema';
import { generateStructuredOutput } from '../helpers/bedrock';
import { readPdfBuffer } from '../helpers/pdfReader';
import * as path from 'path';
import { accessSync } from 'fs';

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

            // Try to use the pdfUrl first, or hardcoded paths as fallbacks
            let pdfPath;
            // Try multiple potential locations where the PDF might be
            const possiblePaths = [
                path.resolve(process.cwd(), 'src/mastra/workflows/pdfExtractor/data/1.pdf'),
                path.resolve(process.cwd(), '.mastra/data/1.pdf'),
                path.resolve(process.cwd(), '.mastra/output/.mastra/data/1.pdf')
            ];
            
            // Find the first path that exists
            let foundPath = false;
            for (const p of possiblePaths) {
                try {
                    accessSync(p);
                    pdfPath = p;
                    console.log("Found PDF at:", p);
                    foundPath = true;
                    break;
                } catch (err) {
                    console.log("PDF not found at:", p);
                }
            }
            
            // If no path found, default to the one we know works in build
            if (!foundPath) {
                pdfPath = path.resolve(process.cwd(), '.mastra/output/.mastra/data/1.pdf');
                console.log("No PDF found, defaulting to:", pdfPath);
            }
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