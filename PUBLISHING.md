# Publishing Checklist

## Before Publishing

- [ ] Update `package.json` with your actual organization/username
- [ ] Test on clean machine or Docker
- [ ] Add examples to README
- [ ] Create GitHub repository
- [ ] Add CI/CD for automated testing (optional)

## Publish to NPM

```bash
# 1. Create npm account (if needed)
npm adduser

# 2. Update package name in package.json
# Change: "@yourorg/copilot-spec-generator"
# To: "@your-actual-npm-username/copilot-spec-generator"
# Or use unscoped: "copilot-spec-generator" (must be unique)

# 3. Build
npm run build

# 4. Test locally
npm link
spec-gen test-input.md output.md
npm unlink

# 5. Publish
npm publish --access public

# 6. Verify
npm info @your-username/copilot-spec-generator
```

## Publish to GitHub

```bash
# 1. Create repository on GitHub
gh repo create copilot-spec-generator --public --source=. --description="Generate product specs from PDF/DOCX using GitHub Copilot SDK"

# 2. Push code
git add -A
git commit -m "Ready for distribution"
git push -u origin main

# 3. Create release
git tag v0.1.0
git push --tags
gh release create v0.1.0 --title "v0.1.0 - Initial Release" --notes "First stable release"

# 4. Users can install from GitHub
npm install -g git+https://github.com/yourorg/copilot-spec-generator.git
```

## Test Installation (Clean Environment)

```bash
# Option 1: Docker
docker run -it --rm node:18 bash
npm install -g @yourorg/copilot-spec-generator
spec-gen --help

# Option 2: npx (no install)
npx @yourorg/copilot-spec-generator input.docx output.md
```

## After Publishing

- [ ] Update README with actual install command
- [ ] Share with team/community
- [ ] Monitor GitHub issues
- [ ] Collect feedback
- [ ] Plan next version
