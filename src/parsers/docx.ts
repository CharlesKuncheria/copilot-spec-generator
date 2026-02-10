import mammoth from 'mammoth';

export async function extractDocxText(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`DOCX file not found: ${filePath}`);
    }
    throw new Error(`Failed to parse DOCX: ${error.message}`);
  }
}
