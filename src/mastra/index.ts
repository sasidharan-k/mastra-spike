
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { VercelDeployer } from '@mastra/deployer-vercel';

import { bingAgent } from './agents';

export const mastra = new Mastra({
  agents: { bingAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  deployer: new VercelDeployer({
    teamId: 'team_pKXbTt4t3X5FBYNDydAegZze',
    projectName: 'mastra-spike',
    token: '4TlNDj1Nj6W7F0OB5q8cD7KT',
  }),
});
