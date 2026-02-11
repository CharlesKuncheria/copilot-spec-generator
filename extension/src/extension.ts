import * as vscode from 'vscode';
import { SPEC_GENERATION_PROMPT } from './specPrompt';
import { parseDocument } from './parser';
import * as fs from 'fs';

const SPEC_GEN_PARTICIPANT_ID = 'copilot-spec-generator.spec-gen';

interface ISpecGenChatResult extends vscode.ChatResult {
  metadata: {
    command: string;
  };
}

export function activate(context: vscode.ExtensionContext) {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ): Promise<ISpecGenChatResult> => {
    
    stream.progress('Analyzing your document...');

    try {
      let documentContent = '';

      // If invoked with a command that should pick a file, open a local file picker.
      if (request.command === 'file') {
        const picked = await vscode.window.showOpenDialog({
          canSelectMany: false,
          openLabel: vscode.l10n.t('Convert to spec'),
          filters: {
            'Documents': ['pdf', 'docx', 'txt', 'md']
          }
        });

        if (!picked || picked.length === 0) {
          stream.markdown('❌ No file selected.');
          return { metadata: { command: request.command || '' } };
        }

        const fileUri = picked[0];
        stream.progress(`Reading ${fileUri.fsPath}...`);
        documentContent = await parseDocument(fileUri.fsPath);
      }

      // Check if there are file references in the request
      if (!documentContent && request.references && request.references.length > 0) {
        for (const ref of request.references) {
          if (ref.value instanceof vscode.Uri) {
            stream.progress(`Reading ${ref.value.fsPath}...`);
            documentContent += await parseDocument(ref.value.fsPath);
          }
        }
      }

      // If no files, check whether the prompt is a local path or file URI.
      if (!documentContent) {
        const candidate = (request.prompt || '').trim();
        const localUri = tryParseLocalFileUri(candidate);
        const localPath = localUri?.fsPath ?? (isExistingFile(candidate) ? candidate : undefined);

        if (localPath) {
          stream.progress(`Reading ${localPath}...`);
          documentContent = await parseDocument(localPath);
        } else {
          // Otherwise, use the prompt text directly
          documentContent = request.prompt;
        }
      }

      if (!documentContent || documentContent.trim().length === 0) {
        stream.markdown('❌ Please provide a document (PDF/DOCX/TXT/MD) via attachment, use the `/file` command to pick a local file, paste a local file path, or paste your requirements text.');
        return { metadata: { command: request.command || '' } };
      }

      stream.progress('Generating product specification...');

      // Construct the messages for the language model
      const messages = [
        vscode.LanguageModelChatMessage.User(SPEC_GENERATION_PROMPT),
        vscode.LanguageModelChatMessage.User(`Here is the document content to convert into a product specification:\n\n${documentContent}`)
      ];

      // Request chat access and stream the response
      const chatResponse = await request.model.sendRequest(messages, {}, token);
      
      stream.markdown('## Generated Product Specification\n\n');

      for await (const fragment of chatResponse.text) {
        stream.markdown(fragment);
      }

      stream.markdown('\n\n---\n\n✅ Spec generation complete!');

      return { metadata: { command: request.command || '' } };

    } catch (err) {
      handleError(err, stream);
      return { metadata: { command: request.command || '' } };
    }
  };

  // Create the chat participant
  const specGenerator = vscode.chat.createChatParticipant(SPEC_GEN_PARTICIPANT_ID, handler);
  specGenerator.iconPath = new vscode.ThemeIcon('file-text');

  // Add follow-up provider
  specGenerator.followupProvider = {
    provideFollowups(_result: ISpecGenChatResult, _context: vscode.ChatContext, _token: vscode.CancellationToken) {
      return [
        {
          prompt: 'Can you add more user stories?',
          label: vscode.l10n.t('Add more user stories')
        },
        {
          prompt: 'Can you refine the acceptance criteria?',
          label: vscode.l10n.t('Refine acceptance criteria')
        }
      ];
    }
  };

  context.subscriptions.push(specGenerator);
}

export function deactivate() {}

function handleError(err: any, stream: vscode.ChatResponseStream): void {
  if (err instanceof vscode.LanguageModelError) {
    console.error('Language Model Error:', err.message, err.code);
    stream.markdown(`❌ **Error**: ${err.message}`);
  } else if (err instanceof Error) {
    console.error('Error:', err.message);
    stream.markdown(`❌ **Error**: ${err.message}`);
  } else {
    console.error('Unknown error:', err);
    stream.markdown('❌ **Error**: An unexpected error occurred while generating the spec.');
  }
}

function tryParseLocalFileUri(text: string): vscode.Uri | undefined {
  if (!text || !text.startsWith('file:')) {
    return undefined;
  }
  try {
    const uri = vscode.Uri.parse(text, true);
    return uri.scheme === 'file' ? uri : undefined;
  } catch {
    return undefined;
  }
}

function isExistingFile(filePath: string): boolean {
  if (!filePath) {
    return false;
  }
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
