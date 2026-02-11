"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const specPrompt_1 = require("./specPrompt");
const parser_1 = require("./parser");
const fs = __importStar(require("fs"));
const SPEC_GEN_PARTICIPANT_ID = 'copilot-spec-generator.spec-gen';
function activate(context) {
    const handler = async (request, chatContext, stream, token) => {
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
                documentContent = await (0, parser_1.parseDocument)(fileUri.fsPath);
            }
            // Check if there are file references in the request
            if (!documentContent && request.references && request.references.length > 0) {
                for (const ref of request.references) {
                    if (ref.value instanceof vscode.Uri) {
                        stream.progress(`Reading ${ref.value.fsPath}...`);
                        documentContent += await (0, parser_1.parseDocument)(ref.value.fsPath);
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
                    documentContent = await (0, parser_1.parseDocument)(localPath);
                }
                else {
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
                vscode.LanguageModelChatMessage.User(specPrompt_1.SPEC_GENERATION_PROMPT),
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
        }
        catch (err) {
            handleError(err, stream);
            return { metadata: { command: request.command || '' } };
        }
    };
    // Create the chat participant
    const specGenerator = vscode.chat.createChatParticipant(SPEC_GEN_PARTICIPANT_ID, handler);
    specGenerator.iconPath = new vscode.ThemeIcon('file-text');
    // Add follow-up provider
    specGenerator.followupProvider = {
        provideFollowups(_result, _context, _token) {
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
function deactivate() { }
function handleError(err, stream) {
    if (err instanceof vscode.LanguageModelError) {
        console.error('Language Model Error:', err.message, err.code);
        stream.markdown(`❌ **Error**: ${err.message}`);
    }
    else if (err instanceof Error) {
        console.error('Error:', err.message);
        stream.markdown(`❌ **Error**: ${err.message}`);
    }
    else {
        console.error('Unknown error:', err);
        stream.markdown('❌ **Error**: An unexpected error occurred while generating the spec.');
    }
}
function tryParseLocalFileUri(text) {
    if (!text || !text.startsWith('file:')) {
        return undefined;
    }
    try {
        const uri = vscode.Uri.parse(text, true);
        return uri.scheme === 'file' ? uri : undefined;
    }
    catch {
        return undefined;
    }
}
function isExistingFile(filePath) {
    if (!filePath) {
        return false;
    }
    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=extension.js.map