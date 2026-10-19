# Private project-record contract

Store each job under `DESIGN_TASTE_PRIVATE_ROOT/<project>/`, outside this repository. Confirm the private root before writing job data; do not invent a personal path. No client data belongs in this skill package.

| File / section | Contents | Writer |
| --- | --- | --- |
| BRIEF.md | Audience, goal, deliverables, constraints, approver, definition of done | Design Taste |
| DESIGN.md | Concept, keywords, do/don't, selected family, color/type/grid/spacing tokens | Design Taste only |
| MOTION.md / Direction tokens | Duration, easing, rhythm, holds, sound derived from direction | Design Taste only |
| MOTION.md / Storyboard and specifications | Medium-specific scenes and execution specs using the direction tokens | Motion Design |
| BRAND.md | Verbal identity, where relevant | Design Taste |
| PROCESS.md | Decisions, revisions, approvals and proposed changes | All may append; only Design Taste resolves proposals |
| EXPORTS.md | Deliverables, formats, selected routes and verification | Producing discipline |

Disciplines translate direction; they do not choose or silently override color, type, tone, rhythm or message. They never edit DESIGN.md or MOTION.md direction-token sections. A needed change goes into PROCESS.md:

```text
## Proposed change: <unique ID> - <date>
Author discipline: <name>
Current direction/version: <reference>
Affected token or direction: <exact section>
Proposed change: <before and after>
Reason and evidence: <observed issue and inspected artifact>
Cross-discipline impact: <affected deliverables>
Status: pending
Brain resolution: <accepted/rejected, date, reason; brain writes this>
Updated direction/version: <brain fills on acceptance>
```

Until the brain resolves the proposal, keep the approved direction. If it blocks production, preserve the partial work and report the dependency. On acceptance, Design Taste updates DESIGN.md / MOTION.md and dispatches the change to affected disciplines. Explicit user approvals remain distinct from the brain's coordination decisions.
