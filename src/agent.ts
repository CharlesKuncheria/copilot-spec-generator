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
  });

  console.log('✨ Generating product spec...\n');
  console.log('─'.repeat(60));

  let spec = '';

  // Set up streaming event listeners
  session.on('assistant.message_delta', (event: any) => {
    const chunk = event.data.deltaContent;
    process.stdout.write(chunk);
    spec += chunk;
  });

  // Wait for completion
  const completed = new Promise<void>((resolve) => {
    session.on('session.idle', () => {
      resolve();
    });
  });

  // Send message with system prompt
  const fullPrompt = `${SPEC_GENERATION_PROMPT}\n\n---\n\nConvert the following document into a structured product specification:\n\n${documentText}`;
  await session.send({ prompt: fullPrompt });

  // Wait for streaming to complete
  await completed;

  console.log('\n' + '─'.repeat(60));

  if (verbose) console.log('\n💾 Saving spec to file...');
  await writeFile(outputFile, spec, 'utf-8');

  // Cleanup
  await session.destroy();
  await client.stop();
}
