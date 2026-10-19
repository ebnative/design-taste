# 0002: Position Design Taste as a digital design studio

Date: 2026-10-19  
Status: user-directed studio concept; proposed implementation architecture recorded for review  
Scope: architecture and integration guidance; no skills installed or application connections established by this document  
Refined by: [0003](0003-studio-sync-archives-adobe-route.md), which governs synchronization, archives, sequencing and the Adobe route where the two differ

## Context and intent

Design Taste should be the digital brain, design process management system and production hands of a graphic design studio. It should understand a brief, develop a design direction, coordinate the relevant disciplines, use available tools to produce the design, inspect the result and manage revisions and delivery.

The user established that web UI and motion graphics are design disciplines alongside graphic design. They are not merely collections of links or software utilities. The user also proposed a dedicated graphic-design skill, with Design Taste positioned above the disciplines. This document records the resulting proposed structure, not an already completed migration.

## Studio architecture

| Layer | Skill or resource | Responsibility |
| --- | --- | --- |
| Studio direction and process | `design-taste` | Understand the brief; define objectives and deliverables; coordinate disciplines; preserve shared creative direction, decisions, revisions and delivery evidence. |
| Design discipline | `graphic-design` (new) | Visual identity, covers, posters, editorial design, typography, composition and visual systems. |
| Design discipline | `web-ui-design` (new) | Websites and interfaces, information hierarchy, page composition, components, responsive behavior and interaction states. |
| Design discipline | `motion-design` (new) | Motion language, storyboards, choreography, timing, transitions and the relationship between picture and sound. |
| Shared knowledge | `art-design-atlas` and domain archives | Sourced principles, history, contemporary references, tool records and verified production recipes. |
| Shared critique | `design-critic` | Evaluate visible work against the brief and explicit criteria; identify revisions and report evidence limits. |
| Production | Existing Adobe Designer skills and selected code-based tools | Produce editable native documents, working interfaces, interactive figures and rendered media through verified access. |

The proposed set contains eleven skills: the existing eight plus the three discipline skills. Tool integrations do not each require a new skill. Domain-specific references can be loaded only when needed.

`design-taste` remains the studio entry point. Move its detailed graphic art-direction guidance into `graphic-design` while preserving useful existing workflows and links. Keep shared direction and coordination in `design-taste`. A simple task may go directly to the appropriate discipline and production method; invoking every layer is unnecessary.

## Shared operating model

Brief → relevant knowledge and references → design direction → discipline-specific specification → production → visible inspection and critique → revision → editable master and requested exports.

For a product launch, Design Taste establishes the message and common direction; Graphic Design develops the visual language; Web UI Design applies it to the landing page; Motion Design develops the film and animated elements. Production skills execute the relevant parts.

Process management means maintaining the brief, chosen direction, decisions, source provenance, revisions, deliverables and verification state. GitHub Issues remains the single task source. Do not create a second backlog or roadmap in the archive.

Use the existing workflow documents and relevant `BRAND.md`, `DESIGN.md`, `MOTION.md`, `EXPORTS.md` and `PROCESS.md` conventions where appropriate. These are design evidence, not a requirement to generate every document for every job. Private preferences, client data and production source files remain outside the public repository.

## Web UI archive

The proposed skill name is `web-ui-design`; the archive is one of its resources. Its purpose is to retrieve useful references, explain why they fit a brief, turn observations into design decisions and support implementation.

Maintain three distinct record categories:

1. Page and interaction references: specific pages, sections, flows and behaviors, with an explanation of the observed design principle and appropriate context.
2. Component and tool sources: libraries, templates, utilities and assets, with technology requirements, source links and applicable usage terms.
3. Verified recipes: examples actually executed and inspected, with versions, reproduction instructions, outputs and limitations.

Suggested metadata: stable ID, title, canonical URL, category, tags, intended context, observed principle, implementation stack, license or terms URL, access requirements, last checked date and evidence status. Keep observation, recommendation and personal preference separate.

Evidence statuses should distinguish a saved candidate, source inspection, visual inspection and executed verification. A library's accessibility or performance claim is not our independent validation.

Start with searchable source records and commentary. Add licensed code examples only where useful. A browsable local gallery is an optional later interface over the same records, not a prerequisite or a separately approved implementation.

### Initial source candidates

These are intake classifications, not an endorsement of every component or its reuse rights.

| Category | Sources | Intended use |
| --- | --- | --- |
| Website and interaction references | [Landdding](https://landdding.com/), [60fps](https://60fps.design/), [Aperios](https://aperios-design.co.uk/) | Page composition, interaction examples and a real studio website case study. |
| Component libraries | [Tailgrids](https://tailgrids.com/), [HeroUI](https://heroui.com/), [Arc UI](https://uiarc.dev/), [Bencho](https://bencho.dev/), [OpenSource UI](https://opensourceui.in/), [BoardUI](https://boardui.com/), [Reverse UI](https://reverseui.com/) | Evaluate relevant components against the target stack and brief. |
| Sections, transitions and templates | [Motion](https://www.motionin.design/), [Transitions](https://transitions.dev/), [Modulify](https://modulify.ai/templates) | Reusable page patterns and motion references; inspect each item's conditions. |
| Visual and prompt resources | [Backgrounds Supply](https://www.backgrounds.supply/), [OnePromptDesign](https://onepromptdesign.com/) | Backgrounds and visual direction references. |
| Specialized tools | [Pele](https://pele.run/), [Theatre.js](https://www.theatrejs.com/), [Reelfolio](https://reelfolio.io/) | Diagram rendering, browser animation and portfolio showreel workflows respectively. |

Keep the following in intake pending adequate inspection: [Feral UI](https://feralui.dev/gradients), [Inspora](https://www.inspora.design/), [Recent](https://recent.design/), [Squints](https://squints.app/), [Squig](https://squig.sh/), [Iconography Encyclopedia](https://encyclopedia.iconography.co/), [AudioCN](https://audiocn.dev/), [MDXCN](https://mdxcn.dev/) and [Gauge UI](https://gauge-ui.dev/). Initial text retrieval failed or was insufficient for these sources; this does not establish that the sites are unavailable.

## Motion and video archive

`motion-design` owns the design discipline. It selects production methods appropriate to the desired output rather than treating every request as a request for generated video.

| Production mode | Candidates | Purpose and evidence boundary |
| --- | --- | --- |
| Code-based video | [Remotion](https://github.com/remotion-dev/remotion) and [official skills](https://github.com/remotion-dev/skills) | Product explainers, data animation and social video. The official skill README names Codex support; render and playback still require verification. |
| Motion principles | [LottieFiles motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | Timing, easing, intent and choreography across engines. Review relevant instructions before adapting them. |
| Web animation | [Motion AI Kit](https://github.com/motiondivision/ai-kit), [GSAP](https://github.com/greensock/GSAP), [Theatre.js](https://www.theatrejs.com/) | Motion implementation and timelines. AI Kit is presented as a Cursor plugin; assess Codex portability separately. |
| Explanatory figures and reveals | [Hairline](https://hairline.lucasmarkes.com/skills), [Anatomy Reveal](https://github.com/annnguyentt/anatomy-reveal-skill) | Interactive explanation and product dissection/reveal. Hairline currently documents `hairline-create` and `hairline-adopt`; do not assume the social-post command names are current. |
| 3D and physics | Blender integration candidates, [React Three Rapier](https://github.com/pmndrs/react-three-rapier), [React Postprocessing](https://github.com/pmndrs/react-postprocessing) | Scene production, physics and image effects. Libraries are not automatically agent skills. |
| Audio discovery | [Openverse API](https://api.openverse.org/v1/) | Find sound assets and retain item-level source, creator, license and attribution data. |
| Generative video | Providers to be evaluated for an actual brief | Text/image-to-video generation needs its own model access, shot planning, continuity and output review. No provider integration is selected by this decision. |

Keep After Effects and Premiere Pro as production routes alongside code-based rendering. Native AEP/PRPROJ projects, code projects, interactive HTML and flat MP4 exports are different deliverables and must be described accurately.

The supplied [X article](https://x.com/0xwhrrari/article/2105643919119696297) was not retrieved successfully. Exact upstream identities for the listed `/anatomy`, `/blender-agents` and `/openverse-api` skills remain unresolved. Do not substitute an unrelated repository or treat social-post descriptions, model recommendations or asset counts as verified instructions. [Scenario's Blender plugin](https://github.com/scenario-labs/blender-plugin) is a related candidate, not confirmed as the exact linked skill.

## Adobe Skills integration instructions

### What the upstream repository provides

Use [adobe/skills](https://github.com/adobe/skills) as an upstream source of selected workflows. Its current README includes business and web-development skills as well as creative workflows; installing the entire collection would introduce substantial unrelated scope.

The Creativity & Design section documents an Adobe for Creativity connector for Claude Desktop, with workflows for batch photo edits, portrait retouching, social variations, resizing, InDesign data merge, Express templates and Quick Cut. The `run-workflow` integration separately requires enterprise Firefly Creative Production entitlement. These statements describe upstream documentation inspected during this research, not verified account availability.

### Candidate mapping

| Upstream guidance | Local destination | Intended benefit |
| --- | --- | --- |
| Batch photo edits and portrait retouching | `photoshop-designer` references | Consistent adjustments and repeatable photo workflows, where supported by the actual available tools. |
| InDesign data merge | `indesign-designer` references | Structured data and template-driven document production. |
| Social variations and resizing | Shared export workflows plus relevant production skills | Platform-specific framing, dimensions and delivery checks. |
| Express template design | Optional reference or adapter if Express access is verified | Template-based visual production; do not imply an existing Express connection. |
| Quick Cut | Motion/video workflow references if access is verified | Short-form editing through that specific service; it is not proof of Premiere Pro control. |
| Stardust extraction, direction and prototyping | `web-ui-design` references | Evaluate its design-system analysis and website prototyping methods. Its AEM deployment steps are not automatically part of our workflow. |
| Firefly `run-workflow` | Optional future production adapter | Evaluate only when an actual task and account entitlement justify it. |

### Integration procedure for a later implementation

1. Select the actual task and relevant upstream skill. Inspect its `SKILL.md`, referenced scripts, connector calls, dependencies, host assumptions and license before installation or reuse. Record the upstream URL and pinned revision for adapted material.
2. Distinguish portable design/workflow knowledge from host-specific execution instructions. Adapt useful guidance into existing local skills or focused references; do not copy Claude tool names or plugin configuration into Codex and assume they work.
3. Preserve the existing production methods and user restrictions. This decision does not lift the current Photoshop live-control block or authorize a terminal, AppleScript or ExtendScript workaround. Do not overwrite installed Adobe skills or replace their adapters as part of documentation work.
4. Before promising execution, inspect a live tool/session inventory for the intended environment. Confirm the actual application or service, supported operations, account access, installed version and intended document. A skill file, installed application or marketplace listing is not connection proof.
5. If the necessary connector is unavailable, retain useful planning guidance and report the precise execution limit. Do not invent access or silently route private files through another service.
6. When a production test is authorized, use a task-owned working document and unique output paths. Preserve existing documents and unsaved work. Keep credentials, client assets and private outputs outside the repository.
7. Verify an actual representative operation, saved output and visible result. Check native editability where required, and playback for video. Record host, versions, operation, output and limits. Do not mark an adapter verified from documentation alone.
8. Separate local skill preparation from connector installation, authentication, paid services, private-data transfer and publication. Obtain only the additional authority actually required by the selected operation, honoring existing scope-specific authorization.

Do not run a blanket `npx skills add adobe/skills --all` as the default integration strategy. No installation command in upstream documentation is authorized merely by its inclusion in this decision.

## Repository implementation and verification boundaries

Preserve the current purpose-specific directories and dependency-free Python knowledge/search tools. Production projects can have their own engine dependencies; adding a source record must not make the atlas require Node, Blender or Adobe software.

When implementation is requested, inspect the installer and validation assumptions before adding the three skills. Update canonical skill sources, descriptions, shared references, documentation and package selection behavior together. Preserve installed private memory and existing application adapters. Update `knowledge/records.json` alongside relevant atlas records, maintain `atlas/coverage.json` and use the research queue for incomplete coverage.

Run `python scripts/check.py` for new records or search changes and the appropriate relocation/package checks for packaging changes. Verify representative retrieval and actual portable package behavior. Software checks do not establish visual acceptance, native application access or publication.

This document is an architecture record, not a parallel implementation backlog. Follow-up execution tasks belong in GitHub Issues. No skill migration, source import, application test, installation, deployment or publication has occurred as a result of writing this decision.
