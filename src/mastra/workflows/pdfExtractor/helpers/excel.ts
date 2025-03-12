// src/mastra/utils/excelUtils.ts
import xlsx from "xlsx";

export interface ReferenceRecord {
  omObjNum: string;
  loName: string;
  loMailAddr: string; 
  loState: string;
  loZip: string;
  orName: string;
  orMailAddr: string;
  orState: string;
  orZip: string;

  [key: string]: any;
}

/**
 * Loads reference data from an XLSX file.
 * Assumes the first sheet contains columns named "name" and "address".
 */
export function loadReferenceData(filePath: string): ReferenceRecord[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data: ReferenceRecord[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return data;
}
