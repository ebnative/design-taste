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


## Executable private specimens

When separately authorized, run selected components in a separate private production project. Keep this repository dependency-free. An optional private `inspiration/<batch>/playground.json` contains `base_url` (an explicit loopback HTTP origin, for example `http://127.0.0.1:4317`) and `samples` (archive card ID to simple sample slug). Rebuilding the gallery adds preview, view/copy-code and project-file links for those cards. The service must be running; links do not start a server or establish verified behavior. Preserve the original source receipts as downloaded-not-executed; record executed specimen evidence in the production project's EXPORTS.md instead.

The workbench should expose the actual wrapper, upstream implementation, dependencies and notices, plus a complete project download excluding node_modules, Git and private configuration. Keep license scopes explicit, including any official package whose version/license differs from a repository snapshot. Capture bounded interaction evidence for each specimen rather than claiming that an entire library/site has been verified.

## Categorized resource-site delivery

When the brief requests a reusable design library, use separate catalog records for runnable components, full templates and private visual references. Store component tags and site-category tags independently; search and filters must combine by intersection. A discovery platform such as 21st.dev or Refero can guide navigation and source discovery, but does not grant redistribution rights to its collection, screenshots or linked sites.

For each permitted source pack retain a pinned source revision, exact license/NOTICE files, editable implementation, DESIGN.md, tokens.json with per-token provenance, generated tokens.css and a README with build commands. Distinguish exact source values from studio-host choices and screenshot estimates. Replace uncleared photography, logos, fonts and media before preparing a redistributable pack. Label adapted previews and demo-only controls honestly; a template is not a working backend.

For a code-inaccessible reference, retain an actual private capture, source URL, capture date/viewport, observed layout, explicit unknowns and a React reconstruction brief. An estimated color or a proposed responsive breakpoint must not become a claim about source CSS. A later reconstruction is a new implementation and needs its own executed evidence and rights review.

Keep the private workspace export distinct from a shareable source-library export and a static-site export. The public build must filter records before bundling, reject paths outside each record's own package, retain required notices and exclude private references from metadata, compiled assets, images, source-file snapshots and ZIP entries. Test negative cases as well as current records. Preview approved template code in a sandbox without same-origin, network or form privileges. Record build results, browser interactions and remaining limits in the production project's EXPORTS.md. Preparing these exports does not authorize publication or client-showroom approval.

## Resource-site discovery interface

For a catalog brief, adapt the selected reference's navigation hierarchy and preview density to the actual collection. A compact persistent sidebar, global search, preview-led cards and a small featured shelf can replace a large editorial landing section when discovery is the primary task. Use actual collection counts; do not invent trending ranks, community saves, authors or account features. A studio-selected featured order must not be described as measured popularity.

Keep component type, website category and collection kind as independent combined filters, with a reset and an actionable empty state. Saved designs may persist locally without a backend; label that scope. Separate preview, code/design assets and source/license information in accessible detail tabs. Keep imported specimen tokens separate from the catalog shell's visual theme.

For keyboard use, support search focus without intercepting ordinary text entry, visible focus, tab-arrow navigation and a skip link that does not collide with hash routing. A mobile drawer must leave closed navigation out of the focus order, contain focus while open, and move focus after removing an inert background. Verify the actual viewport and scroll width; if a browser override fails, a local development iframe provides an honest bounded viewport fixture. Preserve production framing/security headers rather than weakening them for a screenshot. Record iframe checks as iframe checks, not native-device acceptance.

## Measured interface reconstruction

When the user selects a platform's own interface for an authorized local reconstruction, inspect the actual desktop and mobile page before implementation. Record source URLs, viewport dimensions, computed typography/colors, bounding rectangles, observed interaction states and bounded screenshots. Distinguish measured CSS values from authored responsive adaptations; reconstructed DESIGN.md and token files are not upstream source or an exhaustive original design system.

Compare source and implementation screenshots together at matching viewport/state. Fix typography, composer geometry, title wrapping, drawer focus and navigation before calling the bounded reconstruction checked. Record intentional identity/content substitutions, omitted animation/backend states, actual browser interactions and remaining accessibility/device limits in a private design-qa.md. Search over a local catalog must not be described as the source platform's AI service.

Keep unclear-rights source fonts, screenshots, measurements and study archives private. A hidden route is insufficient to prevent bundling: select the public home module before the build graph imports private CSS/fonts, then inspect generated CSS/JavaScript, font hashes, source snapshots and every ZIP. A runnable private backup and a permitted public source library remain separate deliverables. Publication and redistribution authority are evaluated separately from the user's local recreation instruction.
