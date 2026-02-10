# Copilot Spec Generator

Generate product specifications from PDF and DOCX documents using the GitHub Copilot SDK.

## Features

- 📄 **PDF & DOCX Support** - Extract text from PDF and Word documents
- 🤖 **GitHub Copilot Powered** - Uses GitHub Copilot SDK for intelligent spec generation
- 📝 **Structured Output** - Generates well-formatted markdown product specs
- 🔒 **Secure** - No API keys needed, uses your GitHub Copilot subscription
- ⚡ **Streaming** - Real-time progress as the spec is generated

## Prerequisites

- Node.js 18+
- GitHub Copilot subscription
- GitHub CLI authenticated (`gh auth login`)

## Installation

### Global Installation

```bash
npm install -g @yourorg/copilot-spec-generator
```

### From Source

```bash
git clone https://github.com/yourorg/copilot-spec-generator.git
cd copilot-spec-generator
npm install
npm run build
npm link
```

## Usage

### Basic Usage

```bash
spec-gen input.pdf output.md
```

### Examples

```bash
# Generate spec from PDF
spec-gen requirements.pdf product-spec.md

# Generate spec from DOCX
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
