// src/mastra/utils/pdfUtils.ts
import { readFileSync } from "fs";

/**
 * Reads a PDF file from the given path and returns its Buffer.
 * This function is used to pass the PDF directly to the LLM.
 */
export function readPdfBuffer(pdfPath: string) {
  return readFileSync(pdfPath);
}