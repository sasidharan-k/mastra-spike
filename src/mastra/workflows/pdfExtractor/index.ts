import { Workflow } from '@mastra/core';
import { z } from 'zod';

import { extractSchemaWithLlm } from './steps/extractSchemaWithLlm';
import { lookupBusinessNameFromExcel } from './steps/lookupBusinessNameFromExcel';
import { compareBusiness } from './steps/compareBusinesses';

const pdfExtractionWorkflow = new Workflow({
  name: 'pdf-extraction-workflow',
  triggerSchema: z.object({
    pdfUrl: z.string().describe('The PDF URL to extract data from')
  })
})

pdfExtractionWorkflow
  .step(extractSchemaWithLlm)
  .then(lookupBusinessNameFromExcel)
  .then(compareBusiness);

  pdfExtractionWorkflow.commit();

export { pdfExtractionWorkflow };
