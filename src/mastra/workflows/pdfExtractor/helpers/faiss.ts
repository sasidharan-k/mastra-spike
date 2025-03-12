// src/mastra/utils/faissUtils.ts
import { loadReferenceData, ReferenceRecord } from "./excel";
import { embed, embedMany } from "ai";
//import { azureOpenai } from "@ai-sdk/openai";

import { createAzure } from '@ai-sdk/azure';

const azure = createAzure({
  resourceName: 'franklin-open-ai-test', // Azure resource name
  apiKey: 'd2c4f58c99b24590af432e547d5dfd6f',
});

// Note: Replace the above with your actual embedding client (e.g. from @ai-sdk/openai)

/**
 * Type representing an in‑memory FAISS‑like index.
 */
export interface FaissIndex {
  referenceRecords: ReferenceRecord[];
  referenceVectors: number[][];
}

/**
 * Initializes the FAISS index by loading reference data from an XLSX file
 * and computing embeddings for each record's name and address.
 */
export async function initializeFaissIndex(xlsxPath: string): Promise<FaissIndex> {
  const records = loadReferenceData(xlsxPath);
  const texts = records.map(rec => `${rec.name} ${rec.address}`);
  
  // Compute embeddings for all records using a batch embedding call.
  const embeddingsResponse = await embedMany({
    model: azure.textEmbeddingModel("text-embedding-3-small"), // Use OpenAI embeddings provider
    values: texts
  });
  
  const referenceVectors = embeddingsResponse.embeddings;
  return { referenceRecords: records, referenceVectors };
}

/**
 * Queries the FAISS index with a query string.
 * Computes the embedding for the query and returns the best-matching record.
 */
export async function queryFaissIndex(query: string, index: FaissIndex): Promise<{ bestRecord: ReferenceRecord | null, similarityScore: number }> {
  // Compute query embedding.
  const { embedding: queryVector } = await embed({
    model: azure.textEmbeddingModel("text-embedding-3-small"),
    value: query
  });
  
  let bestScore = -Infinity;
  let bestIndex = -1;
  const queryNorm = Math.hypot(...queryVector);
  
  for (let i = 0; i < index.referenceVectors.length; i++) {
    const refVec = index.referenceVectors[i];
    const dot = queryVector.reduce((sum, val, j) => sum + val * refVec[j], 0);
    const refNorm = Math.hypot(...refVec);
    const cosineSim = dot / (queryNorm * refNorm);
    if (cosineSim > bestScore) {
      bestScore = cosineSim;
      bestIndex = i;
    }
  }
  
  const bestRecord = bestIndex >= 0 ? index.referenceRecords[bestIndex] : null;
  return { bestRecord, similarityScore: bestScore };
}
