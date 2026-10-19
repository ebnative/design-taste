# Private reference and licensed-source acquisition

Purpose: turn supplied sources into a usable private visual/code archive while keeping the public repository free of third-party media, client content and copied manuals. Existing user authorization for this research and its selected private root persists; do not repeatedly ask for the same scope.

## Source-aware collection

| Source type | Collect | Do not infer |
| --- | --- | --- |
| Inspiration gallery or studio site | Original page/item URL, author attribution, bounded viewport/section references and observed principle | Full source code, ownership, client-showroom approval or permission to mirror the complete gallery |
| Public component repository/registry | Exact item/source URL, pinned revision, license/NOTICE, dependency and state contract, permitted source copy in private storage | Rights to unrelated demo images, logos, recordings or Pro code |
| Commercial template/service | Public preview and licensed acquisition/export route | That an account clone exports editable source, or that a paid template can become a shared library |
| Prompt/spec collection | Link and high-level capability; use an authorized manual provider workflow if needed | Permission to scrape/share spec files; Motionin.design expressly prohibits those uses |
| Motion example | Source/trigger, state sequence, meaningful stills and actual playback evidence when collected | Measured timing or smoothness from a single screenshot |
| Generator or inspection tool | Original input/export settings and actual operation evidence when a job uses it | A successful export or measurement from a marketing page |

## Private layout and receipts

Under the confirmed DESIGN_TASTE_PRIVATE_ROOT, use `inspiration/<batch>/index.html`, `catalog.json`, `screenshots/`, `licensed-source/` and per-source receipts. The public card may hold a private-root-relative media reference in acquisition metadata. Its client_face.preview_ref stays empty for inspiration; it never becomes a showroom card by being downloaded.

Keep sources inert: no npm installation, upstream script execution, automatic skill replacement, account creation or paid download is needed to archive a public code copy. Preserve exact copyright/license/NOTICE text, source URL, commit, file hashes, exclusions and download status. Custom or unclear licenses stay link-only until the intended use is understood. Do not copy a paid/free website collection wholesale under a license that applies only to its public repository.

Use only actual observed item links, official registries/APIs, allowed site exports or provider-supported tools. Stop at account/paywall/terms limits. Enumerating links visible on the supplied page is not an exhaustive site crawl. Record the page depth, item count, failed requests and omitted media/code. Future batches should target an explicit task/category and bounded collection size rather than promise every design on every site.

## Offline catalog generation

From the canonical repository, run:

```sh
python scripts/build_private_catalog.py --private-root '<confirmed-private-root>' --batch YYYY-MM-DD --captures '<task-capture-directory>'
```

The capture directory contains `captures.json` and actual PNG/JPEG files named by card ID, optionally with a detail suffix. The generator validates paths, copies those existing captures, reads existing private source receipts and writes a searchable offline HTML catalog. It does not browse, download, execute code, change route status or prove a screenshot was visually inspected. Missing captures/code remain explicit. Rebuilding an existing captured batch requires --captures again; omitting it is rejected to preserve previous previews and receipts. Use the browser tool actually available in the host for capture and inspect its real outputs.

A private archive can contain internal third-party references, but it is not a client showroom or a public component redistribution service. For a client direction, produce original work and obtain Ebru's separate presentable approval.
