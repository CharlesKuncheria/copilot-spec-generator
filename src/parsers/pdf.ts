import { readFile } from 'fs/promises';
import pdf from 'pdf-parse';

export async function extractPdfText(filePath: string): Promise<string> {
  try {
    const dataBuffer = await readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`PDF file not found: ${filePath}`);
    }
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}
