# Accessing shared knowledge

In the repository, use ../../../knowledge/records.json, ../../../search/query.py and ../../../workflows/ relative to this file.
In an installed package, the skill root's bundle/ directory contains the same shared data; check that it exists first.
With Python 3: <repo-or-bundle>/search/query.py "surrealism" --type movement --asset cover --json
Use a focused English query. Filters describe suggested contemporary uses, not historical scope.
Each result's path identifies the atlas record. Resolve source IDs in knowledge/sources.json.
Read the brief and any BRAND.md/DESIGN.md first, then only relevant records, workflows and application recipes.
Search scores measure textual relevance, not quality or user preference.
If nothing matches, narrow or change the term once; if still unmatched, state that the knowledge base has no match.
Do not invent missing dates, rights or application support. Keep private memory outside the repository.
