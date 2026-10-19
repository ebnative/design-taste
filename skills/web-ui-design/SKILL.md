---
name: web-ui-design
description: "Translate studio direction into web pages, interface components, responsive layouts and interaction states, using sourced references and production handoffs."
---

# Web UI Design
v0 skeleton. Portfolio work will supply actual recipes; no working page is delivered by this skill file.

## Reads
Read the private BRIEF.md, DESIGN.md, relevant BRAND.md, MOTION.md direction tokens and PROCESS.md. Follow the [project-record contract](../design-taste/references/project-record.md) and [translation table](../design-taste/references/translation-table.md). Only the brain edits direction. Append a Proposed change in PROCESS.md when translation requires a direction change; wait for its resolution. Retrieve only relevant atlas records through the [shared guide](references/shared-design.md).

## Translation rules
Translate message and hierarchy into page order and component emphasis. Keep brain-owned color, type, grid and spacing consistent across responsive layouts and default, hover, focus, loading, empty, error and success states. TR-001 suggests sharp edges/no shadow; TR-002 suggests generous whitespace/rounded corners only when selected by the brain. Choose medium-specific values within the direction, and propose direction changes rather than rewriting tokens. Generic frontend helpers implement the design; they do not choose its direction and are interchangeable when available.

## Outputs
Build the working page in its own production repository. Deliver actual screenshots at 390 px and 1280 px viewport widths, an accessibility pass with inspected scope and limits, editable source and EXPORTS.md evidence. Add a deployment link only after authorized publication. Screenshots are not evidence of functional states that were never exercised.

## Discipline critique checklist
Check information hierarchy, token consistency, navigation, responsive overflow, text legibility and component states. Inspect keyboard navigation, visible focus and contrast; report untested accessibility properties. Compare with graphic/motion deliverables in a separate coherence check.

## Production handoff
Request web.page-build, web.screenshot and image.resize through adapters/routes.json. The brain requires route verification plus live availability; no implementation helper or installed browser proves execution. Production dependencies stay in the separate site repository.

## Archive use
Search relevant inspiration cards for internal reasoning and cite card IDs and sources. Third-party references are not client proposals. Show clients only original showroom cards with evidence_status=executed-verified and explicit Ebru presentable approval. Use selected FAM-### cards as the starting direction only after the brain records the choice. Propose additions with honest evidence status and rights; keep media in the private root. No verified recipes are claimed by this v0 skeleton.
