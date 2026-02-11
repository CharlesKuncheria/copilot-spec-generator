# Copilot Spec Generator

Generate product specifications from PDF and DOCX documents using GitHub Copilot.

**Two ways to use:**
- 🖥️ **[CLI Tool](#cli-tool)** - Command-line automation for batch processing
- 💬 **[VS Code Extension](#vs-code-extension)** - Interactive chat interface (recommended for PMs)

## Features

- 📄 **PDF & DOCX Support** - Extract text from PDF and Word documents
- 🤖 **GitHub Copilot Powered** - Uses GitHub Copilot SDK for intelligent spec generation
- 📝 **Structured Output** - Generates well-formatted markdown product specs
- 🔒 **Secure** - No API keys needed, uses your GitHub Copilot subscription
- ⚡ **Interactive or Automated** - Choose chat interface or CLI based on your workflow

## VS Code Extension

**Best for:** Product Managers who want an interactive, no-code experience

### Installation

1. Download the extension from the [releases page](https://github.com/CharlesKuncheria/copilot-spec-generator/releases)
2. In VS Code: Extensions → `...` menu → "Install from VSIX..."
3. Or build from source: See [extension/README.md](extension/README.md)

### Usage

1. Open GitHub Copilot Chat in VS Code (Ctrl+Shift+I / Cmd+Shift+I)
2. Type `@spec-generator` and describe your feature or attach a document
3. Iterate with follow-up questions to refine the spec

**Example:**
```
@spec-generator Create a spec for a user authentication feature with email and social login
```

Or attach a PDF/DOCX:
```
@spec-generator convert this requirements document
[attach requirements.pdf]
```

Or pick a local file using the slash command:
```
@spec-generator /file
```

See [extension/README.md](extension/README.md) for full documentation.

---

## CLI Tool

**Best for:** Developers who want automation, CI/CD integration, or batch processing

## Prerequisites

- Node.js 18+
- GitHub Copilot subscription
- GitHub CLI authenticated (`gh auth login`)

## Installation

### Option 1: Using npx (Recommended - No Install Required)

```bash
npx @charleskuncheria/copilot-spec-generator input.pdf output.md
```

### Option 2: Global Install

```bash
npm install -g @charleskuncheria/copilot-spec-generator
```

### Option 3: From Source

```bash
git clone https://github.com/CharlesKuncheria/copilot-spec-generator.git
cd copilot-spec-generator
npm install
npm run build
npm link
```

## Usage

### Using npx (No Installation Required)

```bash
npx @charleskuncheria/copilot-spec-generator input.pdf output.md
```

### Using Installed Command

```bash
spec-gen input.pdf output.md
```

### Examples

```bash
# Generate spec from PDF using npx
npx @charleskuncheria/copilot-spec-generator requirements.pdf product-spec.md

# Generate spec from DOCX using npx
npx @charleskuncheria/copilot-spec-generator design-document.docx feature-spec.md

# If globally installed
spec-gen requirements.pdf product-spec.md
spec-gen design-document.docx feature-spec.md
```

## Authentication

The agent uses your GitHub Copilot subscription. First-time users need to authenticate:

```bash
gh auth login
```

## Generated Spec Structure

The agent generates structured product specs with:

- **Problem Statement** - What problem are we solving?
- **User Stories** - Who are the users and what do they need?
- **Acceptance Criteria** - How do we know it's done?
- **Technical Requirements** - What needs to be built?
- **Dependencies** - What does this depend on?
- **Success Metrics** - How do we measure success?

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Test locally
node dist/cli.js sample.pdf output.md
```

## How It Works

1. **Document Parsing** - Extracts text from PDF/DOCX files
2. **AI Processing** - Sends content to GitHub Copilot SDK
3. **Spec Generation** - Copilot structures the content into a product spec
4. **Output** - Saves formatted markdown file

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.
