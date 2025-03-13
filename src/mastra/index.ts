
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

// Define API handler for Vercel
export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    // Handle CORS preflight requests
    return new Response(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  return new Response('Mastra is running on Edge!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',  // Change this to your frontend domain in production
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}