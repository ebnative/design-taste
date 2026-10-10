# Running, publishing and rollback

## Local use

Python 3.10+ and Git. No third-party Python dependencies or pip installation required.
`python search/query.py 'photomontage' --type technique` runs a search.
`python scripts/check.py` runs syntax, record/link and behavior checks.

## Configuration

`DESIGN_TASTE_PRIVATE_ROOT`: optional private location outside the repository for user preferences.
`.env.example` is an example and is not automatically loaded. Local search requires no key or token.
GitHub credentials belong in Git Credential Manager, never in repository files or commits.

## Packaging

`python scripts/install.py --dest '<new-package-directory>'` produces eight portable packages.
Use `--update` with the intended destination/skill to update an existing installation;
the installer creates a hash-verified backup and preserves style/memory.
Packaging tests verify file and retrieval behavior, not live Adobe production.

## GitHub

The repository is public. `main` is the default branch. CI runs on pushes and pull requests.
Normal changes: check → commit → push. Do not commit sensitive or private content.
Publication does not establish a native Adobe connection.

## Rollback

Undo faulty code with a new `git revert <commit>`; do not erase shared history with force push.
Restore a skill package after checking backup file hashes.
Preserve user preferences and existing application files.
