# Copilot Spec Generator - VS Code Extension

Convert documents into structured product feature specifications directly in GitHub Copilot Chat!

## Features

- 📝 **Chat-Based Interface** - Use `@spec-generator` in Copilot Chat
- 📄 **Multiple Formats** - Supports PDF, DOCX, TXT, and MD files
- 🤖 **AI-Powered** - Leverages GitHub Copilot's language model
- 🎯 **PM-Focused** - Generates specs with user stories, acceptance criteria, and success metrics
- ⚡ **Interactive** - Refine specs through conversation

## Prerequisites

- VS Code 1.100.0 or higher
- GitHub Copilot subscription
- GitHub Copilot Chat extension installed

## Installation

### From .vsix File (Local Install)

1. Download the `.vsix` file
2. In VS Code, go to Extensions view
3. Click the `...` menu → "Install from VSIX..."
4. Select the downloaded file

### From Source

```bash
cd extension
npm install
npm run compile
```

Press F5 to run in development mode.

## Usage

### Convert a Document

1. Open GitHub Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
2. Type `@spec-generator` to invoke the participant
3. Attach a file or paste your content
4. Press Enter

**Example:**
```
@spec-generator convert this requirements document
[Attach requirements.pdf]
```

### With Text/Pasted Content

```
@spec-generator Here are the requirements for our new login feature:
- Users should be able to sign in with email
- Support social login (Google, GitHub)
- Remember me functionality
```

### Using Slash Commands

```
@spec-generator /convert [attach file]
```

## Generated Spec Includes

- ✅ Executive Summary
- ✅ Problem Statement
- ✅ User Stories
- ✅ Functional Requirements (prioritized)
- ✅ Design Reference section (for Figma links)
- ✅ User Experience Flow
- ✅ Acceptance Criteria (Playwright-testable format)
- ✅ Success Metrics
- ✅ Scope (what's in/out)
- ✅ Dependencies & Constraints
- ✅ Open Questions

## Tips

- **For best results**: Provide detailed requirements, user personas, and business context
- **Figma links**: Include design links in your document for complete specs
- **Iterate**: Use follow-up prompts to refine sections
- **Save output**: Copy the generated spec to a `.md` file in your project

## Supported File Types

- `.pdf` - PDF documents
- `.docx` - Microsoft Word documents
- `.txt` - Plain text files
- `.md` - Markdown files
- Direct text input in chat

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Package for distribution
npm run package
```

## License

MIT
