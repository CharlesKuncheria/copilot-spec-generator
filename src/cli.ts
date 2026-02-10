#!/usr/bin/env node

import { Command } from 'commander';
import { generateSpec } from './agent.js';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

const program = new Command();

program
  .name('spec-gen')
  .description('Generate product specs from PDF/DOCX using GitHub Copilot')
  .version(packageJson.version)
  .argument('<input>', 'Input PDF or DOCX file path')
  .argument('<output>', 'Output markdown file path')
  .option('-m, --model <model>', 'AI model to use', 'gpt-5')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (input: string, output: string, options: { model: string; verbose: boolean }) => {
    try {
      const inputPath = resolve(input);
      const outputPath = resolve(output);

      console.log('🚀 Copilot Spec Generator\n');
      console.log(`📄 Input: ${inputPath}`);
      console.log(`📝 Output: ${outputPath}`);
      console.log(`🤖 Model: ${options.model}\n`);

      await generateSpec(inputPath, outputPath, {
        model: options.model,
        verbose: options.verbose,
      });

      console.log('\n✅ Spec generated successfully!');
    } catch (error: any) {
      console.error('\n❌ Error:', error.message);

      if (error.message.includes('not authenticated') || error.message.includes('authentication')) {
        console.error('\n💡 Please authenticate with GitHub:');
        console.error('   gh auth login');
        process.exit(1);
      }

      if (error.message.includes('Copilot subscription') || error.message.includes('subscription')) {
        console.error('\n💡 GitHub Copilot subscription required');
        console.error('   Visit: https://github.com/features/copilot');
        process.exit(1);
      }

      if (error.message.includes('ENOENT') || error.message.includes('not found')) {
        console.error('\n💡 File not found. Please check the input path.');
        process.exit(1);
      }

      if (options.verbose) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }

      process.exit(1);
    }
  });

program.parse();
