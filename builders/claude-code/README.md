# Claude Code

**Role in EMOVEL-OS:** Development assistant for targeted code changes, debugging, and file editing.

Claude Code operates at the file level — it reads, edits, and creates files with precision. It is the right tool when you know what needs to change, not when you need an entire codebase generated.

---

## Local Path

```
C:\Users\flavi\Downloads\claude-code-main
```

---

## When to Use Claude Code

- Debugging a specific error in an existing codebase
- Adding a feature to a GPT-Pilot scaffold
- Refactoring a module
- Reading and explaining unfamiliar code
- Wiring up an API integration
- Writing tests

---

## Claude Code CLI

Install globally:
```
npm install -g @anthropic-ai/claude-code
```

Run in a project directory:
```
claude
```

---

## Tips

- Always give Claude Code context: which file, what the current behavior is, what you want instead
- For large changes, break them into steps and verify each one
- Use `/code-review` before committing significant changes
