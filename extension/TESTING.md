# Testing the Extension

## Run in Development Mode

1. Open the `extension` folder in VS Code
2. Press **F5** to launch Extension Development Host
3. In the new VS Code window, open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
4. Type `@spec-generator` and you should see it autocomplete
5. Try one of these examples:

### Example 1: With Pasted Text
```
@spec-generator Create a spec for a user login feature with email and social auth
```

### Example 2: With File Attachment
1. Type `@spec-generator convert this document`
2. Use the attach file button in chat to attach a PDF or DOCX
3. Press Enter

### Example 3: Using /convert command
```
@spec-generator /convert
[attach requirements.pdf]
```

## Debugging

- View output in the Debug Console in the main VS Code window
- Check for errors in Developer Tools (Help → Toggle Developer Tools)
- Look for console.error messages in the terminal

## Expected Behavior

1. Progress indicators should show while processing
2. Generated spec should appear as markdown in the chat
3. Follow-up suggestions should appear after generation
4. You should be able to iterate with follow-up questions

## Package for Distribution

Once tested successfully:

```bash
npm run package
```

This creates a `.vsix` file you can share or install locally.
