
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { bingAgent } from './agents';
import { pdfExtractionWorkflow } from './workflows/pdfExtractor';

export const mastra = new Mastra({
  agents: { bingAgent },
  workflows: { pdfExtractionWorkflow },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
