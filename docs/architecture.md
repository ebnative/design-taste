# Architecture

- `atlas/`: readable topic records and research queue.
- `knowledge/`: source entries, aliases, relationships and search index.
- `curriculum/`: learning path, exercises and critique criteria.
- `skills/`: studio brain, atlas, critic and five production skills; three v0 discipline skeletons.
- `archive/`: inspiration and original showroom card metadata, plus direction families; private media stays outside the repository.
- `adapters/`: application access evidence and method limitations; planned `routes.json` maps operations to candidate routes.
- `search/query.py`: standard-library lexical/BM25 search.
- `scripts/`: validation and portable skill installation/packaging.
- `tests/`: retrieval and installation behavior.
- `workflows/`: production guidance by output type.
- `examples/`: original editable SVG concepts, flat PNG previews, artifact manifests and criterion-separated critique; no Adobe-native proof.
- `.github/workflows/ci.yml`: Python checks on Linux and Windows.

Brief → brain-owned direction → discipline translation → operation → verified and live-available route → output → critique.

The private project record follows decision 0003 D2: the brain owns BRIEF.md, DESIGN.md and relevant BRAND.md, and sets MOTION.md tokens. Motion Design adds storyboard/specs. All disciplines may append proposals to PROCESS.md; only the brain resolves them. Producers maintain EXPORTS.md. Disciplines never edit direction sections directly.
Search retrieves relevant information; it does not control applications.
Practical `task_terms` extend lexical retrieval. Result and response unmatched terms expose incomplete matches; `constraint_evaluation=not_performed` prevents treating retrieval as brief solving.
Claim review IDs resolve to exact source passages and corresponding atlas ledgers. Imported provenance, claim support and reuse rights remain distinct.
The repository is the source of truth. Each installation derives shared files into a skill's `bundle/` directory,
so a standalone package retains knowledge, workflows, curriculum and examples after relocation. Tests execute the relocated CLI, rather than merely inspecting bundle paths.
Personal preferences, client data and source Adobe files remain outside the repository.

This project is neither a distributable Python library nor a web application. Moving its scripts into `src/`
would break execution and installation paths, so purpose-specific directories are retained.
This follows the common standard's technology-appropriate layout principle.

[Decision 0003](decisions/0003-studio-sync-archives-adobe-route.md) governs the synchronization contract, two-layer archives and route selection. Production sites and render projects belong in separate repositories.
