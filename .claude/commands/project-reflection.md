# Aventis Project Reflection

You are an expert in Playwright E2E test automation for the Aventis Sozialhilfe framework. Your task is to analyze the current session and improve the project's Claude instructions and memory files.

## Phase 1: Analyze Recent Changes

1. Run `git diff` and `git log --oneline -10` to see what changed this session
2. Read `memory/MEMORY.md` for current memory state
3. Read `memory/domain-knowledge.md`, `memory/patterns.md`, `memory/debugging.md`
4. Identify:
   - New domain constraints discovered
   - New failure patterns encountered and solved
   - New coding patterns that worked well
   - User preferences expressed during the session

## Phase 2: Update Memory Files

For each discovery, update the appropriate file:
- New domain constraint (keyword behavior, system calculations, prerequisites) -> `memory/domain-knowledge.md`
- New error->solution mapping, CI vs local issue, timing fix -> `memory/debugging.md`
- New locator strategy, API workflow gotcha, coding pattern -> `memory/patterns.md`
- User workflow preference, tool preference, communication style -> `memory/MEMORY.md` (User Preferences section)

**Rules:**
- Do NOT duplicate information already in the memory files
- Update existing entries if they need correction
- Remove entries contradicted by current evidence
- Keep MEMORY.md under 200 lines (it's auto-loaded into context)

## Phase 3: Check for Staleness

1. Read `docs/claude/architecture.md` -- still accurate vs actual code structure?
2. Read `docs/claude/test-patterns.md` -- any new patterns or deprecated ones?
3. Read `docs/claude/coding-conventions.md` -- any new constants, aliases, or helpers?
4. Read agent files in `.claude/agents/` -- do they reference outdated patterns?
5. Check memory files -- any entries contradicted by code changes this session?

## Phase 4: Check CLAUDE.md

1. Read `CLAUDE.md` -- are the core rules still accurate?
2. Are the agent routing entries correct?
3. Are the reference doc paths still valid?
4. Are the AI behavior rules still needed or should they be adjusted?

## Phase 5: Present Findings

Present a summary to the user:

```
## Session Reflection Summary

### Memory Updates Proposed
- [file]: [what to add/update/remove]

### Documentation Staleness
- [file]: [what needs updating]

### Instruction Improvements
- [suggestion with rationale]
```

**Only update files after user confirmation.**

## Important Notes

- Memory files persist across conversations -- be careful about what you write
- Prefer updating existing entries over creating new ones
- Verify against actual code before writing -- `grep` in `libs/` is truth
- Keep entries concise and actionable
- Tag entries with dates when relevant (e.g., "Fixed Feb 2026")
