import { Step } from '@mastra/core';
import { inspectionSchema, InspectionType } from '../schema/inspectionSchema';
import { LookupType } from '../schema/lookupSchema';
import { loadReferenceData } from '../helpers/excel';
import path from 'path';

const lookupBusinessNameFromExcel = new Step({
    id: 'lookupBusinessNameFromExcel',
    description: 'Looks up the business name from an Excel file',
    inputSchema: inspectionSchema,
    execute: async ({ context }: {context: any}) => {
        const inspectionResults = context.steps.extractSchemaWithLlm.output;
        
        
        const businessNumber = inspectionResults?.jurisdictionNumber; 

        // Replace "AR0" with ""
        const jurisdictionNumber = businessNumber.replace("AR0", "");

        let excelPath = path.resolve(process.cwd(), '../../src/mastra/workflows/pdfExtractor/data/qryActiveVessels.xlsx');

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