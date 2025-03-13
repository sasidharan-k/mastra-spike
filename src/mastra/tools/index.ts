import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const BING_SEARCH_URL = 'https://api.bing.microsoft.com/v7.0/search';
const BING_SEARCH_API_KEY = process.env.BING_API_KEY || '';

export const bindSearchTool = createTool({
  id: 'bing-search',
  description: 'The search term to be used to search engine on www.in.gov website.',
  inputSchema: z.object({
    searchTerm: z.string().describe('The search term to be used to search engine on www.in.gov website.'),
  }),
  outputSchema: z.object({
    result: z.string()
  }),
  execute: async ({ context }) => {
    return await search(context.searchTerm, BING_SEARCH_API_KEY);
  },
});

export const search = async (
  searchTerm: string,
  apiKey: string = process.env.BING_API_KEY || ''
) => {
  let searchText = searchTerm;
  const params = new URLSearchParams({
    q: searchText,
    count: '5',
    offset: '0',
    mkt: 'en-us',
  });
  const searchUrl = BING_SEARCH_URL + '?' + params.toString();
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new BingError(errorMessage.error);
    }
    // const fullpageContent  = await getBingResults(response.json());
    const fullpageContent = await response.json();
    console.log('======================BingSearchResponse========================', fullpageContent, '======================BingSearchResponse========================');
    return fullpageContent;
  } catch (error) {
    throw new BingError('Failed to fetch Bing search results');
  }
};
export class BingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BingError';
  }
}