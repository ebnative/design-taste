# Source-informed motion direction and production selection

Read MOTION.md and the [source review ledger](../../../archive/source-review.md). Exact colors, type, durations, easing and tone belong to the brain. Sources inform translation; they are not defaults or executed recipes.

| Output / need | Relevant cards | Handoff and limitation |
| --- | --- | --- |
| Video embedded in a page or standalone film | MOT-002 Remotion, MOT-003 official guidance | video.code-render in a separate production repository; a rendered file and its React source are different deliverables. Read the custom Remotion license for the actual entity/use case. |
| Interface state transitions | WEB-007 Bencho, WEB-012 Transitions, MOT-005 Motion AI Kit, MOT-006 GSAP | web.interaction-animation; specify event, state, interruption and teardown, with keyboard/touch and reduced-motion alternatives. |
| Editable scene timelines | MOT-007 / WEB-015 Theatre.js | A sequence/graph editor controls properties; it is not by itself proof of a saved MP4 or native Adobe timeline. |
| Explanatory figures | MOT-008 Hairline, MOT-014 Anatomy | Choose a recognizable object metaphor whose behavior explains the concept; an HTML figure and a film require different verification. |
| Product dissection and reveal | MOT-009 Anatomy Reveal | Parts, feature motion and shot order precede film production. Do not turn an uncertain product model into claimed mechanical accuracy. |
| Physical behavior or render effects | MOT-010 React Three Rapier, MOT-011 React Postprocessing | Physics, scene geometry and post-effects are distinct tools; use only what supports the story and inspect simulation/render behavior. |
| Cloud showreel service | MOT-001 Reelfolio | Account/upload route requires its own authority and verification; a template render is not an editable AEP master. |
| Blender generation/integration | MOT-013 Scenario plugin | Integration and paid generation require real installed/connected capability and account access; no Blender route was tested by this research. |
| Sound discovery | MOT-012 Openverse | Select the actual sound, check its original source/license and record creator/attribution. UI component audio is not a cleared sound library. |

## Motion specification

For each beat/state, record: intended communication, trigger or timestamp, initial/final state, animated properties, duration/hold, easing token, focal element, supporting motion, interruption/reversal behavior, sound/caption cue and reduced-motion alternative. Use frames and fps for video timing; document any seconds-to-frame rounding. Preview in context with real copy, not a loading spinner alone.

MOT-004 LottieFiles emphasizes intent and choreography before engine choice. Use it as a question framework, not an instruction to pick an unrelated personality or override MOTION.md. Acknowledge that a web transition and a film shot have different reading-time and interaction constraints.

For interactive motion, inspect the trigger, final state and a repeated/interrupted action. For film, inspect meaningful boundary frames AND the actual exported playback, duration, captions and sound sync. Check that the editable master can reproduce the output. No screenshot alone verifies timing, smoothness, audio or simulation.

## Upstream guidance and scope

The inspected Motion AI Kit README now documents Codex support in addition to Cursor. Its installers change skill/MCP configuration and paid Motion+ functions have separate access; do not execute those installers merely to read guidance. The official Remotion skill set has focused creation, markup, preview and render routes; read only the relevant section in the production task.

Upstream LottieFiles also uses the name motion-design. Preserve this studio skill's identity/brain contract rather than installing a same-named skill over it. Keep references or an explicitly namespaced integration when a later task needs one. Source inspection does not establish a verified recipe.

Follow the [acquisition workflow](../../../workflows/reference-acquisition.md). Preserve the distinction between freely accessible examples, permissively licensed code, custom-license engines and paid prompt/spec collections.
