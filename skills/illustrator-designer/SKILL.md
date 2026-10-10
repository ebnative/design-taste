---
name: illustrator-designer
description: Create and refine editable designs inside Adobe Illustrator from a brief or visual reference. Use for vector illustration, logos, posters, typography and artwork variants in Illustrator, and learn the user's style from explicit feedback and approved work.
---

# Illustrator Designer

Turn the user's command into actual editable Illustrator artwork, inspect the result visually, and refine it. Deliver the native AI file and requested exports. Communicate in the user's preferred language. Do not substitute a raster mockup for a requested vector design.

## Start with context

Read [../../workflows/private-memory.md](../../workflows/private-memory.md) and [references/style-learning.md](references/style-learning.md). The profile starts without inferred aesthetic preferences. Current instructions override project preferences, which override the general profile.

Inspect the relevant reference artwork and active document before editing. Translate the brief into concrete choices for layout, type, palette, shapes and output requirements. Infer routine details and state material assumptions briefly; ask only when missing information changes the intended result. For a new design, create a new document. For existing work, target the identified document and preserve an original copy before extensive changes.

## Connect and inspect

Prefer an available Illustrator MCP connection when it exposes document inspection, script execution and preview/export. Discover actual tools rather than assuming tool names or a connected session. Otherwise, on Windows use the bundled COM runner; read [references/illustrator-execution.md](references/illustrator-execution.md).

Run `scripts/inspect-document.jsx` through `scripts/run-illustrator.ps1` to read the app version and a bounded document summary. Do not launch Illustrator for a read-only inventory; `-Launch` is appropriate for an authorized design task if the app is closed. Connection errors must remain explicit. Never claim a saved script executed when no Illustrator result was received.

## Build the design

For new visual directions or palette/type/style choices, read [references/pro-max-design.md](references/pro-max-design.md). Retrieve relevant Design Taste atlas records and translate their observed principles into a contemporary graphic-design specification before drawing. The user's brief and evidenced preferences outrank catalog recommendations. Use UI UX Pro Max only when the brief actually concerns UI/web or the user requests it.

Use native paths, Bezier handles, compound paths, groups, clipping masks, gradients, editable text, layers and artboards where their APIs support the requested outcome. A small set of MCP convenience tools is not the capability limit: generate task-specific ExtendScript through the connection for supported operations beyond those tools.

Consult Adobe's product-specific scripting reference for unfamiliar APIs and installed-version compatibility. Toolbar gestures and document APIs are different interfaces: construct the requested result through the document model when possible. Do not promise every UI tool or plugin is scriptable. For an unsupported operation, assess available Actions or menu commands carefully, or an explicitly available desktop-control tool. Verify that the fallback exists before depending on it; report a specific missing capability if it blocks completion.

Keep artwork meaningfully editable: separate major elements, name layers/groups by role, preserve live text and effects where possible, and avoid flattening. If outlining/expanding is necessary for delivery, retain an editable master. Check installed fonts before choosing exact fonts; do not silently replace a font required by the brief.

Use the brief and references to make visual decisions, not just to assemble primitives. Build coherent hierarchy, intentional spacing, consistent stroke weights and curves, and enough visual detail to match the requested design. Use only relevant assets, and resolve linked files for a portable delivery.

## Verify by seeing and reading

After a coherent design pass, export the target artboard(s) to PNG in the task output folder and inspect the actual images with an image-viewing tool. Also read relevant object counts, bounds, text/font data and export status. API success alone does not prove visual quality.

Check composition, typography, contrast, curve quality, alignment, clipping and off-artboard elements against the brief. Fix observed problems and inspect the revised output. Inspect every distinct artboard before delivering a multi-artboard design. If image inspection is unavailable, report that visual verification is incomplete.

Save the AI master and requested exports at explicit absolute paths. Re-read the resulting file paths and document status. State what was produced, what was verified and any concrete limitation; link the deliverables and show an appropriate preview.

## Learn from use

After explicit feedback or approval, update the style files following [references/style-learning.md](references/style-learning.md). The user has authorized these narrow learning updates; do not ask again for each preference record. Do not infer approval from silence or a successful export.

Learn at two levels: maintain aesthetic preferences in `../../workflows/private-memory.md`; maintain reproducible Illustrator execution lessons in `references/verified-recipes.md`. Edit this entrypoint only for a demonstrated workflow improvement, keeping its purpose and permissions intact. Persist changes in the installed skill when writable; if persistence is blocked, preserve the proposed update in the workspace and report the limitation. Never claim autonomous background learning: updates happen during work where this skill is loaded.

## Shared paths in the package
The repository uses ../../workflows and ../../curriculum. Installed packages use bundle/workflows and bundle/curriculum; resolve them through the [shared guide](references/shared-design.md).
