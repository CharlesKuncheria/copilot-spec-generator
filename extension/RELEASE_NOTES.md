# Copilot Spec Generator - VS Code Extension v0.1.0

Convert documents to product feature specifications directly in GitHub Copilot Chat!

## Features
- 💬 Interactive chat interface with `@spec-generator`
- 📄 Supports PDF, DOCX, TXT, and MD files
- 🤖 Powered by GitHub Copilot
- 📝 Generates PM-focused specs with 11 structured sections
- ⚡ Drag & drop files or paste requirements

## Installation

Download the `.vsix` file from this release and install in VS Code:

### Option 1: Via VS Code UI
1. Download `copilot-spec-generator-chat-0.1.0.vsix`
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
4. Click `...` menu → "Install from VSIX..."
5. Select the downloaded file

### Option 2: Via Command Line
```bash
code --install-extension copilot-spec-generator-chat-0.1.0.vsix
```

## Usage

1. Open GitHub Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
2. Type `@spec-generator` and describe your feature
3. Attach documents or paste requirements
4. Iterate with follow-up questions

**Example:**
```
@spec-generator Create a spec for user authentication with email and social login
```

## Prerequisites
- VS Code 1.100.0 or higher
- GitHub Copilot subscription
- GitHub Copilot Chat extension installed

## What's Included

This extension generates product specifications with:
1. Executive Summary
2. Problem Statement
3. User Stories
4. Functional Requirements (prioritized)
5. Design Reference (Figma links)
6. User Experience Flow
7. Acceptance Criteria (Playwright-testable)
8. Success Metrics
9. Scope (in/out)
10. Dependencies & Constraints
11. Open Questions

See [Full Documentation](https://github.com/CharlesKuncheria/copilot-spec-generator/blob/main/extension/README.md) for more details.
