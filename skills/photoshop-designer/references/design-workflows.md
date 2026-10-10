# Combining Photoshop and design skills

This is a portfolio-production guide. Use `photoshop-designer` with `computer-use:computer-use` for Photoshop operations.
Design skills establish the goal; Computer Use controls native layers. Load only required SKILL.md files.
The optional `ebru-portfolio-*` skill identifiers below refer to local companion skills, not packages bundled in this repository.

## Task routing

| Task | Companion skill | Photoshop implementation | Output check |
|---|---|---|---|
| Layered poster/cover/composition | ebru-portfolio-art-direction | Grid, named groups, smart object images, adjustment layers | Hierarchy, spacing, brand colors |
| Headline and body text | ebru-portfolio-typography | Type, Character, Paragraph | Actual text, glyphs, overflow, font |
| Background removal/masking | ebru-portfolio-web-assets | Object Selection, Select and Mask, layer mask | Light/dark grounds, hair/fur, transparency |
| Image placement/collage | ebru-portfolio-art-direction + web-assets | Place Embedded, Free Transform, clipping mask | Proportions, crop, resolution |
| PSD mockup | ebru-portfolio-art-direction + web-assets | Edit/Replace Contents, surface transformation, lighting layers | Logo/text accuracy, perspective |
| Project presentation | ebru-portfolio-storytelling | Verified text in editable layers | No invented brief, role or results |
| Portfolio page sketch | ebru-portfolio-wireframes + art-direction | Section composition following the flow | A PSD sketch is not a responsive website |
| Web gallery behavior | ebru-portfolio-interactions | Photoshop only for a needed static draft | Implement interactions in site code |
| Animation/video presentation | ebru-portfolio-motion | Required poster/single-frame assets | A static PSD is not working animation |

## 1. Layered composition

Use requested dimensions, audience, text and actual source artworks. Continue an approved direction; otherwise infer a reasonable one and state material assumptions.
Example groups: `Background`, `Images`, `Text`, `Effects`; this count is not mandatory. Keep images as smart objects, text as Type and tones as adjustment layers.
Inspect the overall composition and details at 100%. Evaluate priorities among headline, focal image and secondary information.

## 2. Text and typography

Use authorized text sources. Choose fonts/weights, hierarchy and line length through typography guidance; apply them in Character and Paragraph.
Use point type for short headings and paragraph type for long descriptions. Check document color and the active type layer first; finish typing and change focus before tool shortcuts.
Test required language-specific glyphs in a working copy only when necessary. Fix the text box/grid instead of hiding overflow or shrinking excessively.
Read `adobe-fonts` when font research is needed and verify its connection; do not assume fonts were downloaded or activated.

## 3. Masks and cutouts

Establish use, dimensions and transparency needs. Start with Object Selection; inspect edges in an appropriate Select and Mask view.
Output an editable layer mask. Check hair/fur, translucent areas and interior product gaps on different backgrounds.
Refine locally with a low-opacity brush when needed. If paint accidentally reaches the image layer, undo and reselect the mask.
For precise logo contours, consider source vectors or accurate selections instead of AI edge refinement.

## 4. Image placement

Match inventory entries with source files. Prefer Place Embedded for portable output; use Place Linked with a project working copy when multi-document updates are necessary.
Resize with proportion lock, enter numerical coordinates/dimensions when possible and confirm with Enter. Use clipping masks or frames for cropping.
Do not stretch logos or people to fill an area. Check clarity at intended size; prepare web formats through the web-assets workflow afterward.

## 5. Mockups

Inspect the PSD template's license and placeholder layer first. Work on a copy. Open the placeholder smart object with Edit Contents,
place the actual logo/design and save the contents document. For external linked assets, create a standalone working copy or embed them.
Replacing contents may preserve transforms while changing proportions/cropping; inspect the main PSD. Use Distort/Perspective/Warp for surface geometry
and preserve template shadows, lighting, texture and masks. Check whether other instances of the same smart object also change.

Without a template, place the actual design as a separate smart object on a licensed surface photograph.
Inspect whether simple perspective suffices for cylinders/fabric; refine warping and masks as needed. Do not redraw logos or readable text with generative AI.
Deliver a layered PSD and presentation PNG/JPEG, identified as a mockup.

`adobe-create-mockups` is a separate Firefly cloud workflow. Load and verify it when the user requests that route or an AI scene;
do not silently convert a desktop request into cloud generation. Its Firefly Board steps do not apply to local Photoshop work.
Use Figma/Canva/Express skills only for requested output in those applications or a concrete dependency.

## 6. Export and verification

Apply the requested changes, inspect after major edits and save the local working PSD. Produce publishable derivatives separately.
Check active document, output name, dimensions, color profile, transparency and legibility. Report only performed operations and actual paths.
Reopening the file and inspecting layers/text provides stronger evidence than file existence alone.

## Planned behavior trials

During future actual tasks or on request, use an original test document in `work/` to try:
a text/shape layered poster, masking on light/dark backgrounds, two-image smart object placement, one mockup and reopening PSD/PNG outputs.
Record each as passed, partial or blocked from observations. This guide does not claim those trials have been run.
