# 0003: Studio synchronization, design archives and the Adobe route for Codex

Date: 2026-10-19  
Status: accepted in the planning session of 2026-10-19; items marked **[Ebru]** need the maintainer's explicit confirmation before execution  
Builds on: [0002](0002-digital-design-studio.md). Where the two differ, this record governs sequencing, synchronization, archives and the Adobe route.  
Scope: architecture and sequencing. Execution tasks live in GitHub Issues. Nothing was installed, connected, migrated or published by writing this record.

## Context

0002 described Design Taste as a digital design studio with three discipline skills. A planning session on 2026-10-19 resolved how those parts stay coherent, what the first real work is, how reference archives serve both clients and agents, and how Adobe cloud operations reach Codex, the maintainer's working host.

First real work, in order:

1. Ebru's own portfolio (pilot for the brain, `graphic-design` and `web-ui-design`).
2. A client web design that includes motion and video (pilot for `motion-design` and a reuse test for `web-ui-design`).
3. The client work returns to the portfolio as a case study with motion (portfolio v2).

## Decisions

### D1. Brain and disciplines are separate skills from the start

`design-taste` is the studio brain: it holds the brief, the creative direction, the cross-discipline translation and the decision log. `graphic-design`, `web-ui-design` and `motion-design` are reasoning systems that run inside that direction. They translate it into their medium. They do not set it.

Rule: **disciplines do not choose color; they translate color into their medium.** The same applies to typography, tone, rhythm and message.

### D2. One shared project record is the synchronization contract

Each job keeps one project record in the private root (`DESIGN_TASTE_PRIVATE_ROOT/<project>/`), never in this repository. The record uses existing conventions, with no new file types:

| File | Holds | Who writes |
| --- | --- | --- |
| `BRIEF.md` | Client, audience, goal, deliverables, constraints, approver, definition of done | `design-taste` |
| `DESIGN.md` | Direction (concept, keywords, do/don't), selected direction family, visual tokens (color, type, grid, spacing) | `design-taste` only |
| `MOTION.md` | Motion tokens (durations, easing, rhythm, holds, sound) derived from the direction | `design-taste` sets tokens; `motion-design` adds storyboard and specs |
| `BRAND.md` | Verbal identity where relevant | `design-taste` |
| `PROCESS.md` | Decision log, proposed changes from disciplines, revisions, approvals | all; only `design-taste` resolves proposals |
| `EXPORTS.md` | Deliverables, formats, routes used, verification state | the producing discipline |

A discipline that needs a direction change writes a `Proposed change` entry in `PROCESS.md`. The brain accepts or rejects it and updates `DESIGN.md`/`MOTION.md`. A discipline never edits direction sections directly.

### D3. All three disciplines share one skill anatomy

Every discipline `SKILL.md` has the same sections, in this order:

1. **Reads**: which project-record sections and archive cards it consumes.
2. **Translation rules**: how direction and tokens become decisions in this medium.
3. **Outputs**: deliverable types, editable masters, exports.
4. **Discipline critique checklist**: what `design-critic` checks for this medium.
5. **Production handoff**: the operations it requests, resolved through the route registry (D7).
6. **Archive use**: how it searches, cites and adds cards (D5).

### D4. A cross-discipline translation table lives in the brain

`skills/design-taste/references/translation-table.md` maps direction qualities to graphic, web UI and motion decisions. Example:

| Direction quality | Graphic | Web UI | Motion |
| --- | --- | --- | --- |
| Precise / hard | Tight grotesk, high contrast | Sharp edges, no shadow | Short durations, no overshoot |
| Fluid / warm | Organic forms, soft palette | Generous whitespace, rounded corners | Long ease-out, overlapping actions |

The installer bundles it into every discipline package. Rows grow from real jobs, each row citing the job or atlas record that justified it.

### D5. Two-layer archives: inspiration and showroom

Every discipline has an archive with two layers:

- **Inspiration layer** (internal): third-party sites, components, libraries, motion references. A record holds a link, observed principle, context and terms. **No third-party media is stored in the repository.** The agent learns from it. It is never shown to a client as "your site will look like this".
- **Showroom layer** (client-facing): original work made by Ebru or the studio, such as demo themes, posters and motion samples. The client chooses from here.

One card, two views:

- **Client face:** title, preview media reference, mood words, two-sentence description.
- **Agent face:** tokens, layout patterns, motion parameters, do/don't, translation-table row.
- **Evidence:** source/rights, evidence status (`candidate` → `source-inspected` → `visually-inspected` → `executed-verified`), and for showroom cards, `presentable` approval by Ebru.

**Direction families** link one graphic card, one web theme and one motion style into a coherent package (`FAM-###`). A client selects a family; its cards become the brain's starting direction in `DESIGN.md`. This is the selection-time synchronization point.

Storage: card metadata and the agent face live in the repository (`archive/`). Showroom media lives in the private root by default. Moving a card's media into the public repository requires Ebru's explicit per-card approval **[Ebru]**. Client material never enters the archive without the client's permission.

Growth rule: the showroom fills from real work, including unselected direction explorations. Start target: 3–5 original showroom cards per discipline, not a large link collection. 0002's source lists enter only as inspiration `candidate` records.

### D6. Coherence is a critique criterion

`design-critic` gains a cross-discipline coherence check: do the poster, the page and the film express the same direction? This check is separate from per-discipline checks and is never averaged into them.

### D7. A route registry separates "what" from "how"

`adapters/routes.json` lists production operations (for example `image.resize`, `image.batch-adjust`, `photo.retouch-portrait`, `layout.layered-psd`, `vector.logo`, `video.highlight-reel`, `video.code-render`, `web.page-build`). Each operation lists candidate routes (Adobe MCP, local desktop control, code), the host, the verification status and the evidence link. A discipline requests an operation; the brain picks a route that is verified **and** present in the live tool inventory. An unverified route can be planned but must not be promised.

### D8. Adobe for Creativity reaches Codex through its remote MCP server

At inspection (2026-10-19), `adobe/skills` → `plugins/creative-cloud/adobe-for-creativity` (plugin version 3.2.0, Apache-2.0) declares a remote HTTP MCP server at `https://adobe-creativity.adobe.io/mcp`. It is not tied to Claude. Plan:

1. Primary: register that MCP server in Ebru's Codex configuration. Adapt the needed upstream `SKILL.md` guidance into Codex-ready references with the upstream URL and pinned commit.
2. **Riskiest assumption:** Adobe's OAuth admits Codex as a client. Test with one smoke operation before any further work.
3. Fallback: Claude Desktop with the same connector acts as an "Adobe cloud station" over a shared project folder, used only for cloud operations.
4. Cloud operations complement the local desktop-control routes. They do not replace them. Layered, natively editable work stays with the desktop Designer skills.

Do not run `npx skills add adobe/skills --all`.

### D9. Photoshop live-control status must be reconciled **[Ebru]**

The repository records that live Photoshop control is blocked by user decision. The planning session reported that Ebru runs `photoshop-designer` in Codex through desktop computer control. Until Ebru explicitly records a decision lifting or narrowing the block, the block stands and no agent lifts it on its own.

### D10. Production code lives outside the atlas

The portfolio site and client projects are separate repositories with their own dependencies (Node, Remotion and so on). This repository stays dependency-free Python. Only skills, archive cards, route evidence and verified recipes return here.

## Sequencing

| Phase | Goal | Skills piloted | Exit criterion |
| --- | --- | --- | --- |
| 0 Foundations | Skeletons, contract, archive schema, route registry, Adobe smoke test | all, as v0 | `python scripts/check.py` passes; the 11 skills install and relocate; the Adobe route is recorded as verified or failed |
| 1 Portfolio v1 | Ebru's portfolio live | brain, graphic, web UI, critic | Ebru approves v1; ≥3 showroom cards per graphic and web; web-ui verified recipes extracted |
| 2 Client project | Client site with motion | web UI (reuse), motion | Client approval; motion deliverables verified by playback; motion-design v1 extracted |
| 3 Portfolio v2 | Case study with motion reel | all | Case study published with the client's permission |

## Success and stop criteria

- **Success:** the second project reuses `web-ui-design` with visibly less effort than the first (fewer direction resets, fewer undocumented decisions). Every showroom card was executed and approved. The client chose from a family, and its tokens reached production unchanged except through logged `PROCESS.md` proposals.
- **Reconsider the split:** if in phases 1–2 the disciplines repeatedly need direction edits the brain could not anticipate, or if keeping 11 skills in sync costs more than it saves, then merge back or slim down. Record that as a new decision.
- **Stop an archive layer:** if inspiration records are not cited by any job within two projects, freeze intake.

## Evidence boundaries

Statements about `adobe/skills` describe the upstream repository on the inspection date, not account access. No Codex MCP connection, OAuth flow, Adobe operation, Photoshop session or deployment has been verified by this record.
