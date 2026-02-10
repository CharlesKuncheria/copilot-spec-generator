# Distribution Guide

## Distribution Options

### Option 1: NPM Package (Recommended)

**Advantages:**
- Easy installation: `npm install -g @yourorg/copilot-spec-generator`
- Automatic dependency management
- Version control and updates
- Works across platforms (Windows, Mac, Linux)

**Steps:**
1. Update `package.json` with your organization name
2. Create npm account if needed: `npm adduser`
3. Publish: `npm publish --access public`
4. Users install globally: `npm install -g @yourorg/copilot-spec-generator`

### Option 2: GitHub Releases

**Advantages:**
- No npm account needed
- Users can install from source
- Good for internal/private distribution

**Steps:**
1. Push to GitHub
2. Create release with tag (e.g., v0.1.0)
3. Users install from GitHub:
   ```bash
   npm install -g git+https://github.com/yourorg/copilot-spec-generator.git
   ```

### Option 3: Docker Container

**Advantages:**
- No Node.js installation needed
- Consistent environment
- Easy for CI/CD pipelines

**Steps:**
1. Create Dockerfile
2. Build and push to Docker Hub
3. Users run: `docker run -v $(pwd):/work yourorg/spec-gen input.docx output.md`

## User Prerequisites

### Required
1. **Node.js 18+** - JavaScript runtime
   - Install: https://nodejs.org/
   - Check: `node --version`

2. **GitHub Copilot Subscription** - AI service ($10-19/month or Enterprise)
   - Individual: https://github.com/features/copilot
   - Enterprise: Included with GitHub Enterprise Cloud
   - Check: Visit https://github.com/settings/copilot

3. **GitHub CLI** - For authentication
   - Install: https://cli.github.com/
   - Authenticate: `gh auth login`
   - Check: `gh auth status`

### Optional
- **npm** - Usually comes with Node.js
- **Git** - For installing from source

## Installation Instructions for End Users

### Quick Start (NPM)

```bash
# 1. Install Node.js 18+ (if not already installed)
# Visit: https://nodejs.org/

# 2. Authenticate with GitHub
gh auth login

# 3. Install the agent globally
npm install -g @yourorg/copilot-spec-generator

# 4. Verify installation
spec-gen --version

# 5. Use it!
spec-gen my-document.docx product-spec.md
```

### From Source (GitHub)

```bash
# 1. Clone repository
git clone https://github.com/yourorg/copilot-spec-generator.git
cd copilot-spec-generator

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Link globally (optional)
npm link

# 5. Use it
spec-gen my-document.docx product-spec.md
```

## What Gets Installed on User's Machine

### File Structure After Installation
```
User's Machine:
├── /usr/local/lib/node_modules/@yourorg/copilot-spec-generator/
│   ├── dist/                    # Compiled JavaScript
│   ├── node_modules/            # Dependencies
│   │   ├── @github/copilot-sdk  # Copilot SDK (~10MB)
│   │   ├── pdf-parse            # PDF parser (~2MB)
│   │   ├── mammoth              # DOCX parser (~1MB)
│   │   ├── commander            # CLI framework (~100KB)
│   │   └── ... (other deps)
│   └── package.json
└── /usr/local/bin/
    └── spec-gen -> link to CLI executable
```

### Total Size: ~15-20MB

### No User Configuration Required
- Agent uses existing GitHub CLI credentials
- No API keys to manage
- No config files to edit

## Authentication Flow

```
User runs: spec-gen input.docx output.md
    ↓
Agent checks: GitHub CLI authenticated?
    ↓
    ├─ YES → Use stored credentials → Connect to Copilot
    └─ NO → Show error: "Run: gh auth login"
    ↓
Verify: User has Copilot subscription?
    ↓
    ├─ YES → Generate spec
    └─ NO → Show error: "Copilot subscription required"
```

## Cost Implications

### For You (Package Maintainer)
- **Free**: Hosting on npm, GitHub
- **Optional**: CI/CD for automated testing/publishing

### For End Users
- **Node.js**: Free
- **GitHub CLI**: Free
- **Your Agent**: Free (if you make it free)
- **GitHub Copilot Subscription**: $10-19/month or Enterprise
  - Individual: $10/month or $100/year
  - Business: $19/user/month
  - Enterprise: Included with GitHub Enterprise Cloud

## Platform Compatibility

### Supported Platforms
- ✅ macOS (Intel & Apple Silicon)
- ✅ Windows 10/11
- ✅ Linux (Ubuntu, Debian, RHEL, etc.)

### Supported File Formats
- ✅ PDF files (.pdf)
- ✅ Word documents (.docx)
- ⚠️ Plain text files (.txt, .md) - could be added easily
- ❌ Older Word formats (.doc) - not currently supported

## Updating the Agent

### For You (Maintainer)
```bash
# 1. Make changes
# 2. Update version in package.json
npm version patch  # or minor, major

# 3. Build
npm run build

# 4. Publish
npm publish
```

### For Users
```bash
# Check for updates
npm outdated -g

# Update to latest version
npm update -g @yourorg/copilot-spec-generator

# Or reinstall
npm install -g @yourorg/copilot-spec-generator@latest
```

## Troubleshooting Common Issues

### Issue: "GitHub authentication required"
**Solution:**
```bash
gh auth login
# Follow prompts to authenticate
```

### Issue: "Copilot subscription required"
**Solution:** 
- Subscribe at https://github.com/features/copilot
- Or contact IT for Enterprise license

### Issue: "Command not found: spec-gen"
**Solution:**
```bash
# Verify installation
npm list -g @yourorg/copilot-spec-generator

# Reinstall if needed
npm install -g @yourorg/copilot-spec-generator
```

### Issue: "Failed to parse PDF/DOCX"
**Solution:**
- Check file isn't corrupted
- Verify file format (not .doc, .pages, etc.)
- Try re-saving file in native format

## Security Considerations

### What Data Leaves User's Machine?
1. **Document text** → Sent to GitHub Copilot API
2. **Usage telemetry** → Sent to GitHub (standard Copilot usage)

### What Data Stays Local?
1. **Original document files**
2. **Generated spec files**
3. **GitHub credentials** (stored by GitHub CLI)

### Privacy & Compliance
- Agent uses GitHub Copilot's existing privacy policy
- Enterprise customers: Data stays within Microsoft/GitHub infrastructure
- No data stored by your agent
- No third-party analytics

## Next Steps

1. **Choose distribution method** (NPM recommended)
2. **Update package.json** with correct name/org
3. **Create README** with user instructions
4. **Test on clean machine** (or Docker container)
5. **Publish** to npm or GitHub
6. **Share** with users
