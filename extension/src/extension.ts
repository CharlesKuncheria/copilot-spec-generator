import * as vscode from 'vscode';
import { SPEC_GENERATION_PROMPT } from './specPrompt';
import { parseDocument } from './parser';

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

      // Check if there are file references in the request
      if (request.references && request.references.length > 0) {
        for (const ref of request.references) {
          if (ref.value instanceof vscode.Uri) {
            stream.progress(`Reading ${ref.value.fsPath}...`);
            documentContent += await parseDocument(ref.value.fsPath);
          }
        }
      }

      // If no files, use the prompt text directly
      if (!documentContent) {
        documentContent = request.prompt;
      }

      if (!documentContent || documentContent.trim().length === 0) {
        stream.markdown('❌ Please provide a document (PDF/DOCX) or paste your requirements text.');
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
