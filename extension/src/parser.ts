import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocument(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    return await parsePdf(filePath);
  } else if (ext === '.docx') {
    return await parseDocx(filePath);
  } else if (ext === '.txt' || ext === '.md') {
    return await parseText(filePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}. Please use PDF, DOCX, TXT, or MD files.`);
  }
}

async function parsePdf(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function parseDocx(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function parseText(filePath: string): Promise<string> {
  return fs.readFileSync(filePath, 'utf-8');
}
