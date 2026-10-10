# Design Taste working agreement

Read the brief and existing project decisions first. Load only relevant atlas records and workflows.
Distinguish sourced history, contemporary design proposals, personal preferences and live production evidence.
Read relevant BRAND.md, DESIGN.md, MOTION.md, EXPORTS.md and PROCESS.md files when present.
Keep user/client data, private memory, personal absolute paths, tokens, fonts and images with unclear licenses out of the repository.
knowledge/records.json is the search index; update it alongside atlas Markdown records.
Verify production access from a live session. A skill or file is not evidence of an application connection.
Do not claim complete art coverage; maintain atlas/coverage.json and the research queue.
For new records and search changes, run `python scripts/check.py`.
Keep repository prose, instructions, examples, metadata and CLI output in English. Preserve original proper names and source URLs.

## Project standard 1.0.0

This repository applies the user-approved project standard; docs/project-standard.json records its source.
Identity/scope: docs/project.md. Directory responsibilities: docs/architecture.md. Publication/rollback: docs/operations.md.
Python 3.10+; no additional dependencies. Search: `python search/query.py 'photomontage' --type technique`.
Verification: `python scripts/check.py`. Packaging: `python scripts/install.py --dest '<new-package-directory>'`.
Keep temporary files in .work/ or outside the repository; keep personal memory outside it. .env.example is a safe example.
GitHub Issues is the single task source; do not duplicate TODO/ROADMAP lists.
Preserve domain directories; run search and package relocation tests when refactoring paths.
Respect existing user authorization and tool boundaries for third-party applications, publication and user data.
Completion reports must describe actual changes, checks performed and remaining limitations.
