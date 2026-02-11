#!/bin/bash
# Script to reinstall the extension

echo "📦 Reinstalling Copilot Spec Generator Extension"
echo ""

# Uninstall if exists (ignore errors)
echo "1. Uninstalling old version (if exists)..."
code --uninstall-extension charleskuncheria.copilot-spec-generator-chat 2>/dev/null || true

# Install new version
echo ""
echo "2. Installing new version..."
code --install-extension "$(dirname "$0")/copilot-spec-generator-chat-0.1.0.vsix"

echo ""
echo "3. Please restart VS Code completely (close all windows)"
echo ""
echo "4. After restart, open Copilot Chat and type @spec-generator"
echo ""
echo "✅ Done!"
