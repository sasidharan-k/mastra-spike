import { Step } from '@mastra/core';
import { inspectionSchema,InspectionType } from '../schema/inspectionSchema';
import { LookupType } from '../schema/lookupSchema';
import { loadReferenceData } from '../helpers/excel';
import path from 'path';
import { accessSync } from 'fs';

const lookupBusinessNameFromExcel = new Step({
    id: 'lookupBusinessNameFromExcel',
    description: 'Looks up the business name from an Excel file',
    inputSchema: inspectionSchema,
    execute: async ({ context }: {context: any}) => {
        const inspectionResults = context.steps.extractSchemaWithLlm.output;
        
        
        const businessNumber = inspectionResults?.jurisdictionNumber; 

        // Replace "AR0" with ""
        const jurisdictionNumber = businessNumber.replace("AR0", "");

        // Try multiple potential locations where the Excel file might be
        const possiblePaths = [
            path.resolve(process.cwd(), 'src/mastra/workflows/pdfExtractor/data/qryActiveVessels.xlsx'),
            path.resolve(process.cwd(), '.mastra/data/qryActiveVessels.xlsx'),
            path.resolve(process.cwd(), '.mastra/output/.mastra/data/qryActiveVessels.xlsx')
        ];
        
        // Find the first path that exists
        let excelPath;
        let foundPath = false;
        
        for (const p of possiblePaths) {
            try {
                accessSync(p);
                excelPath = p;
                console.log("Found Excel at:", p);
                foundPath = true;
                break;
            } catch (err) {
                console.log("Excel not found at:", p);
            }
        }
        
        // If no path found, default to the production path
        if (!foundPath) {
            excelPath = path.resolve(process.cwd(), '.mastra/output/.mastra/data/qryActiveVessels.xlsx');
            console.log("No Excel found, defaulting to:", excelPath);
        }

        console.log("Loading Excel from:", excelPath);
        const referenceData = loadReferenceData(excelPath || '');
        const record = referenceData.find(rec => rec.omObjNum === jurisdictionNumber);
        const businessName = record?.loName ?? 'Business name not found';
        const address = record?.loMailAddr ?? 'Address not found';
        const state = record?.loState ?? 'State not found';
        const zip = record?.loZip ?? 'Zip not found';
        const response = {
            businessName: businessName, 
            address: address,
            state: state, 
            zip: zip
        }
    
        return response;
    },
})



export { lookupBusinessNameFromExcel}