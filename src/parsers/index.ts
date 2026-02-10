import { extname } from 'path';
import { extractPdfText } from './pdf.js';
import { extractDocxText } from './docx.js';

export async function extractText(filePath: string): Promise<string> {
  const extension = extname(filePath).toLowerCase();

  switch (extension) {
    case '.pdf':
      return extractPdfText(filePath);
    case '.docx':
      return extractDocxText(filePath);
    default:
      throw new Error(
        `Unsupported file format: ${extension}. Supported formats: .pdf, .docx`
      );
  }
}
