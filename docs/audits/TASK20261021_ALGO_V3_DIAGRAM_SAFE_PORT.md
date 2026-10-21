# Algoritmlash V3 diagram display — safe subset of PR #146

This PR extracts **only static source-backed SVG diagram display** from outdated PR #146 and adapts it to the current book reader. It does **not** transplant #146's conflicting 2026-10-18 migration chain, approve questions or enable unpublished lessons.

## Root cause fixed
The original PR added Markdown image recognition to `markdownToTheoryBlocks`, but the current `BookBlock` renderer resolves diagram identifiers solely through `BOOK_DIAGRAMS`. Consequently, an unregistered SVG path could degrade to a paragraph caption without its image. This patch covers **both the parser and the BookBlock renderer**.

## Safety
- The Markdown parser only allows a strict list of 11 existing V2 and two added V3 `/algoritmlash-v*/...` static SVG files.
- BookBlock checks the same allowlist before ever creating an `<img>`. Unknown URLs fall back to text, never to remote image loading.
- No `dangerouslySetInnerHTML` added, no untrusted HTML, no production databases touched.
- Two original SVG assets are brought unchanged from the old PR, reviewed for scripts/event handlers/remote asset references.
- New Vitest tests cover allowed V2/V3 paths, rendered image markup, unknown local/remote/scripting URLs and existing `NETFIG` network diagrams.
- This change affects existing *approved* lessons only if their published Markdown contains one of the pre-shipped allowlisted image references. It does **not** make draft/review lessons visible.

## Local verification
After merging, run `npm ci`, `npm run typecheck`, `npx vitest run src/features/content/localAlgorithmDiagram.test.tsx`, and `npm run dev`. To visually inspect a diagram, use a *local* published source-backed lesson containing `![...]( /algoritmlash-v3/... )` without spaces inside the URL, or test BookBlock in the local UI harness.

All unrelated SQL migrations/content from #146 remain outside this PR; do not replay them just to exercise the SVG renderer.

**MERGE AFTER CI ONLY; PRODUCTION DEPLOY: NO.**
