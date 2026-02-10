# Quick Setup Guide for End Users

## Prerequisites (One-Time Setup)

### 1. Install Node.js
- **Download**: https://nodejs.org/ (choose LTS version)
- **Verify**: Open terminal and run `node --version` (should show v18 or higher)

### 2. Install GitHub CLI
- **Mac**: `brew install gh`
- **Windows**: Download from https://cli.github.com/
- **Linux**: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

### 3. Get GitHub Copilot Subscription
- **Individual**: https://github.com/features/copilot ($10/month)
- **Enterprise**: Contact your IT department

### 4. Authenticate
```bash
gh auth login
```
Follow the prompts to log in with your GitHub account.

## Installation

### Option A: From npm (when published)
```bash
npm install -g @yourorg/copilot-spec-generator
```

### Option B: From Source
```bash
git clone https://github.com/yourorg/copilot-spec-generator.git
cd copilot-spec-generator
npm install
npm run build
npm link
```

## Usage

```bash
# Generate spec from PDF
spec-gen requirements.pdf product-spec.md

# Generate spec from DOCX
spec-gen design-doc.docx feature-spec.md

# Use different model
spec-gen input.pdf output.md --model gpt-4.1

# Verbose output
spec-gen input.pdf output.md --verbose
```

## Verify Everything Works

```bash
# Check Node.js
node --version
# Should show: v18.x.x or higher

# Check GitHub authentication
gh auth status
# Should show: Logged in to github.com

# Check agent installation
spec-gen --version
# Should show: 0.1.0

# Check Copilot access
gh copilot
# Should show Copilot commands (not "command not found")
```

## Troubleshooting

**Problem**: "command not found: spec-gen"
```bash
# Solution: Reinstall
npm install -g @yourorg/copilot-spec-generator
```

**Problem**: "GitHub authentication required"
```bash
# Solution: Login
gh auth login
```

**Problem**: "Copilot subscription required"
- Subscribe at https://github.com/features/copilot

## Getting Help

- GitHub Issues: https://github.com/yourorg/copilot-spec-generator/issues
- Documentation: https://github.com/yourorg/copilot-spec-generator#readme
