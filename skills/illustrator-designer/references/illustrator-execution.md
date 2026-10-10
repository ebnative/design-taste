# Illustrator execution on Windows

## Local connection

This skill bundles a direct Windows COM runner, so Node, an MCP server and a downloaded repository are not required for initial use. COM uses Illustrator's ExtendScript engine; it does not reproduce all UI tools. Do not use the Adobe Express connector as if it controlled desktop Illustrator.

Use Windows PowerShell 5.1 (powershell.exe), resolve the installed skill's absolute path, and execute:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<skill>/scripts/run-illustrator.ps1" -JsxPath "<skill>/scripts/inspect-document.jsx"
```

The execution policy flag applies only to this process; do not change the user's persistent policy. For an authorized design task, append `-Launch` if Illustrator is not running. Place generated task JSX in the permitted workspace, not in the installed skill folder. Run each write sequentially. The helper refuses unavailable files and reports script errors as failures. It does not retry, save or close user documents automatically.

In this Codex Windows environment, a sandboxed COM activation returned E_ACCESSDENIED; the same operation succeeded through the normal sandbox escalation mechanism. When that exact boundary applies, request execution outside the sandbox through the provided tool approval mechanism; do not change Illustrator or OS security settings. Installed skill/profile files can also require the normal filesystem escalation to persist updates.

Write JSX as UTF-8. Use ExtendScript-compatible ES3: `var`, classic functions and loops; no arrow functions, promises, template literals or browser APIs. Do not assume JSON exists: return a string or supply a compatible serializer. Distinguish a COM execution error from a successful script with an empty result.

Query app/document state before writes. Explicitly select the intended document; do not rely on an active document that may change between calls. Scripts should return what was actually created and the absolute output paths. A timeout may leave a script running: inspect before retrying a mutation, and never restart Illustrator to clear uncertainty without protecting the user's work.

## Geometry and output

Illustrator uses points (72 per inch); convert mm explicitly. For pixel briefs, declare the pixel-to-point/export-scale convention. Record color space from the brief: RGB for screen; use the requested print specification for CMYK.

Read each artboard's `artboardRect` and explicitly use the intended coordinate system. A typical rectangle is [left, top, right, bottom]; convert top-left-local (x,y) to document coordinates as (left+x, top-y), then verify actual bounds. Do not assume the origin is zero.

Prefer named layers and grouped objects. Bezier paths use anchor, leftDirection, rightDirection and pointType. For unfamiliar gradients, compound paths, text wrapping, effects, clipping or save options, check the official scripting reference and query the live result rather than guessing API names.

For previews, PNG24 with artboard clipping and deliberate export scale is suitable. Set the intended active artboard before export and restore prior selection/artboard when editing existing work. Use IllustratorSaveOptions for the AI master, and format-specific options for other exports. Native AI and a successful actual preview are the initial acceptance criteria.

## Sources

- Official Illustrator developer entrypoint and downloadable scripting/SDK resources: https://developer.adobe.com/illustrator/
- Official script installation/execution guidance: https://helpx.adobe.com/be_en/illustrator/desktop/automate-visualize-data/automate-actions/install-and-run-scripts.html
- Reference connection project (not a dependency, not Adobe-maintained): https://github.com/Christancho-co/illustrator-mcp

Consult `verified-recipes.md` when a relevant operation has already been tested. Cite live official sources for changing compatibility claims. Do not assume Photoshop UXP APIs work in Illustrator.
