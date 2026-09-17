# AI Project Workflow

## Context and token efficiency

- Treat this repository and maintained project documentation as the durable source of truth, not long chat history.
- Read only the files required for the current task. Do not scan or summarize the entire repository unless the task requires it.
- Reuse existing documentation and decisions instead of repeating project history.
- Keep handoffs compact: objective, changed files, durable decisions, unresolved issues, tests, and next action.
- When a conversation becomes context-heavy, prefer a fresh task/chat that reads repository source-of-truth files instead of carrying unnecessary history forward.
- Prefer targeted edits, existing scripts, tests, CI, and deterministic automation for repetitive work.
- Reserve deeper reasoning for architecture, difficult debugging, creative decisions, and meaningful tradeoffs.
- Preserve working behavior unless the requested change requires altering it.
- Before substantial work, choose the least context-intensive reliable approach that can complete the task correctly.
- Update durable project documentation when a decision or state change will matter to future work. Do not store terminal dumps, temporary debugging chatter, or redundant summaries as project memory.
- If `CURRENT-STATE.md`, `DECISIONS.md`, `NEXT-STEPS.md`, architecture docs, or equivalent files exist, use and maintain them as concise sources of truth.

## Change discipline

- Inspect the affected area before editing.
- Make the smallest safe change that satisfies the request.
- Do not rebuild or redesign unrelated parts of the project.
- Run relevant available tests, lint, or build checks after behavior-changing edits.
- Summarize only durable changes and remaining actions.
