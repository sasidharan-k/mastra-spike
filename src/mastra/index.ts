
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { bingAgent } from './agents';

export const mastra = new Mastra({
  agents: { bingAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
