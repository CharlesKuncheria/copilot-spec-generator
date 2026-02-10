import { CopilotClient } from '@github/copilot-sdk';
import { extractText } from './parsers/index.js';
import { writeFile } from 'fs/promises';
import { SPEC_GENERATION_PROMPT } from './templates/spec-prompt.js';

export interface GenerateSpecOptions {
  model?: string;
  verbose?: boolean;
}

export async function generateSpec(
  inputFile: string,
  outputFile: string,
  options: GenerateSpecOptions = {}
): Promise<void> {
  const { model = 'gpt-5', verbose = false } = options;

  if (verbose) console.log('📖 Extracting text from document...');
  const documentText = await extractText(inputFile);

  if (verbose) {
    console.log(`   Extracted ${documentText.length} characters`);
  }

  if (verbose) console.log('🔐 Authenticating with GitHub Copilot...');
  const client = new CopilotClient();

  try {
    await client.start();
  } catch (error: any) {
    if (error.message.includes('not authenticated')) {
      throw new Error('GitHub authentication required. Run: gh auth login');
    }
    if (error.message.includes('subscription')) {
      throw new Error('GitHub Copilot subscription required. Visit: https://github.com/features/copilot');
    }
    throw error;
  }

  if (verbose) console.log(`🤖 Creating session with model: ${model}`);
  const session = await client.createSession({
    model,
    streaming: true,
    systemPrompt: SPEC_GENERATION_PROMPT,
  });

  console.log('✨ Generating product spec...\n');
  console.log('─'.repeat(60));

  let spec = '';
  let lastUpdate = Date.now();

  await session.send({
    prompt: `Convert the following document into a structured product specification:\n\n${documentText}`,
    onChunk: (chunk: string) => {
      process.stdout.write(chunk);
      spec += chunk;

      const now = Date.now();
      if (verbose && now - lastUpdate > 1000) {
        process.stderr.write('.');
        lastUpdate = now;
      }
    },
  });

  console.log('\n' + '─'.repeat(60));

  if (verbose) console.log('\n💾 Saving spec to file...');
  await writeFile(outputFile, spec, 'utf-8');

  await client.stop();
}
