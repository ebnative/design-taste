# Architecture

- `atlas/`: readable topic records and research queue.
- `knowledge/`: source entries, aliases, relationships and search index.
- `curriculum/`: learning path, exercises and critique criteria.
- `skills/`: three knowledge skills and five application production skills.
- `adapters/`: application access evidence and method limitations.
- `search/query.py`: standard-library lexical/BM25 search.
- `scripts/`: validation and portable skill installation/packaging.
- `tests/`: retrieval and installation behavior.
- `workflows/`: production guidance by output type.
- `.github/workflows/ci.yml`: Python checks on Linux and Windows.

Brief → relevant record → contemporary design decision → production skill → native output → actual preview.
Search retrieves relevant information; it does not control applications.
The repository is the source of truth. Each installation derives shared files into a skill's `bundle/` directory,
so a standalone package retains access to the same knowledge after relocation.
Personal preferences, client data and source Adobe files remain outside the repository.

This project is neither a distributable Python library nor a web application. Moving its scripts into `src/`
would break execution and installation paths, so purpose-specific directories are retained.
This follows the common standard's technology-appropriate layout principle.
