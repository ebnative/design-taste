# Design archives

For the graphic reference collection, read graphic-studies.json and the [reference production workflow](../workflows/graphic-reference-production.md). Ten source-post studies link to GD-003 through GD-012; GD-004/GD-010 are the same project. Recipes are authored hypotheses with explicit material requirements and paired comparison criteria. Existing reference statuses and historical atlas coverage are not promoted by these additions. Private galleries, media, editable trials and comparisons stay outside this repository.

cards.json is the canonical discipline-card catalog; families.json links coherent graphic/web/motion cards. These records are separate from historical atlas/knowledge records. No third-party media is bundled. The original candidates from decision 0002 now have a bounded source/viewport review, documented in source-review.md. One resolved original Anatomy source was added. None is an executed production recipe or approved client direction.

Inspiration is internal reference material. Its client_face is metadata for future presentation tooling, not permission to show third-party examples as a client proposal. Clients see only original showroom work with executed-verified evidence and explicit presentable approval by Ebru. Families may omit a motion card until one exists; they must never invent one.

Showroom source.url and source.terms_url must be null; authorship must be studio or ebru. No client data enters this catalog. Store previews relative to DESIGN_TASTE_PRIVATE_ROOT, outside this repository. Reject absolute paths, URIs, traversal, repository paths and symlinks resolving into repository media. Public original media requires media_public=true plus a per-card Ebru approval reference; presentable=true requires a separate approval reference. Approval metadata records actual decisions, never inferred consent.

execution_evidence records an executed operation, a shareable repository evidence record, an output reference and inspected=true. Merely pointing to a file does not prove execution; review its contents before promoting a status. Evidence records must contain no private paths or media. Rights remain item-specific; unknown is not cleared.

Search: `python search/query.py 'landing page' --archive --json`. It reports lexical matches, evidence status and unmatched terms; it does not select a family, solve constraints or prove quality. Domain filters for historical atlas records cannot be combined with --archive.

The JSON schemas define structural contracts. Dependency-free Python validation checks the subset of JSON Schema keywords used here, then enforces provenance, evidence, private-media and cross-reference rules. Template skeletons and planning translation rows are not job verification.

Review metadata separates observed capability, proposed application, method, source URLs and limits. Acquisition metadata distinguishes source type, license-scoped code route and private viewport references. Input-coverage.json reconciles all initial sources, including deferred Adobe and unverified X article content. Source-inspected and visually-inspected do not imply rights clearance or executed production.
