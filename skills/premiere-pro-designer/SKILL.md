---
name: premiere-pro-designer
description: "Plan and produce editable Premiere Pro work from a brief through an available verified application connection; preserve native projects and inspect real exports."
---

# Premiere Pro Designer
Translate the brief and approved design direction into editable Premiere Pro production.
Read [shared design guidance](references/shared-design.md) and the corresponding workflow.
Discover actual connected tools or an explicitly available desktop-control method before promising execution.
This package does not install Premiere Pro, a bridge, an MCP server or a plugin.
Read app/build, project, selected target and unsaved changes before writes. Do not close/overwrite user work.
Use only APIs documented for the installed version. Check current official sources for unfamiliar APIs.
Editable structure: sequences, video/audio tracks, clips, markers, captions. Preserve required assets/fonts and a native PRPROJ master.
Verification: Read sequence resolution, frame rate and actual clips. Check media links, cut boundaries, black gaps, sound levels/sync and caption timing by playback. Watch the final exported video.
If connection is unavailable, deliver a concrete production plan and state that native production is blocked.
Do not label scripts, manifests or previews as a saved native project. Mark recipes verified only after execution and inspection.
Keep private preference learning in the [private memory workflow](../../workflows/private-memory.md).
Official entrypoint: https://developer.adobe.com/premiere-pro/uxp/introduction/

## Shared paths in the package
The repository uses ../../workflows and ../../curriculum. Installed packages use bundle/workflows and bundle/curriculum; resolve them through the [shared guide](references/shared-design.md).

## Production operation routing
Request `video.highlight-reel`, `image.social-variations` as relevant through the [route registry](../../adapters/routes.json). The brain selects a route only when its operation-specific evidence is verified and the route is present in the live inventory. Preserved methods and existing access blocks still govern; cloud operations do not prove native editability. Do not mark an imported adapter or installed application as verified.
