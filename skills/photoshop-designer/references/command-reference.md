# Photoshop command reference: Windows

Research date: October 10, 2026. This selection covers commands often needed in portfolio and graphic-design work;
it is not an Adobe-published frequency ranking. Menu names assume an English interface. Links are in the [Adobe source record](adobe-sources.md).

## Shortcuts

Selected from Adobe's [shortcut PDF](https://helpx.adobe.com/content/dam/help/en/photoshop/using/default-keyboard-shortcuts/photoshop-keyboard-shortcuts.pdf).
Canvas focus and active tool matter; do not send letter shortcuts while typing. Shift+letter cycling depends on preferences.
Inspect Edit > Keyboard Shortcuts without changing user assignments on your own.

| Action | Windows default |
|---|---|
| Move | V |
| Rectangle/ellipse selection | M |
| Lasso | L |
| Object/quick selection group | W |
| Crop | C |
| Frame | K |
| Eyedropper | I |
| Retouching group | J |
| Brush | B |
| Clone Stamp | S |
| Gradient/fill | G |
| Pen | P |
| Type | T |
| Path Selection | A |
| Shape group | U |
| Hand | H |
| Zoom | Z |
| Transform | Ctrl+T |
| New layer | Ctrl+Shift+N |
| Layer via copy | Ctrl+J |
| Group | Ctrl+G |
| Ungroup | Ctrl+Shift+G |
| Clipping mask | Ctrl+Alt+G |
| Default colors | D |
| Swap colors | X |
| Decrease/increase brush size | [ / ] |
| Fit on screen | Ctrl+0 |
| 100% view | Ctrl+1 |
| Panel visibility | Tab |
| Cancel dialog | Escape |

Ctrl+J may copy only selected pixels when a selection is active. W and J represent groups; verify the actual tool label.
If brackets do not work in the keyboard layout, change brush size in the options bar.
For automation, Ctrl+T may be represented as `Control_L+t` for `sky.press_key`; the current Computer Use API is authoritative.

## Files and working copies

[Save help](https://helpx.adobe.com/photoshop/desktop/save-and-export/save-files/save-your-work.html).

| Command | Use/check |
|---|---|
| File > Open | Open the target and verify its document tab. |
| File > New | Choose purpose-appropriate dimensions, color mode and profile. |
| File > Save | Save only the working copy at its current location. |
| File > Save As | New name/location and layered PSD working version. |
| File > Save a Copy | Separate delivery copy preserving the master. |
| Image > Duplicate | In-memory alternative; save it separately to disk. |
| Window > History | Inspect edit history. |
| History > Snapshot | Temporary comparison point, not a persistent backup. |

New-document settings are design decisions: pixels for web; physical dimensions and required resolution for print.
Check whether saving is local or cloud-based on screen.

## Layers and tone

[Layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/create-layer-compositions/create-layers-and-layer-groups.html),
[adjustment layers](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/work-with-adjustment-and-fill-layers.html).

| Command/panel | Decision |
|---|---|
| Window > Layers | Inspect active layer, order, lock, visibility and mask. |
| Layer > New > Layer | Keep retouching or new graphics separate. |
| Layer > New > Group | Name parts managed together. |
| Layers: Opacity / blend mode | Adjust transparency/surface integration by inspecting results. |
| Create/Release Clipping Mask | Restrict upper content to the lower shape's opaque area. |
| Create new fill or adjustment layer | Edit tone/color without changing source pixels. |
| Levels / Curves | Tonal range and contrast. |
| Hue/Saturation / Color Balance | Color relationships in the selected region. |
| Brightness/Contrast / Exposure | Lighting adjustments. |
| Solid Color / Gradient / Pattern | Editable background or fill. |
| Black & White / Gradient Map | Tone mapping for the intended visual direction. |

Restrict an adjustment with a mask or clipping mask. Check effects of global tone corrections on brand colors.
Do not Flatten or Rasterize merely to simplify the next step.

## Selections and masks

[Add masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/add-layer-masks.html),
[edit masks](https://helpx.adobe.com/photoshop/desktop/create-masks/layer-masks/edit-and-refine-layer-masks.html),
[refine edges](https://helpx.adobe.com/photoshop/desktop/make-selections/refine-modify-selections/refine-your-selection-and-mask.html).

| Command/tool | Use |
|---|---|
| Marquee / Lasso / Object Selection | Geometric, freehand or object-based starting selection. |
| Select > Subject | Automatic starting point, not a final mask. |
| Select > Select and Mask | Inspect edges and view mode. |
| Layer > Layer Mask > Reveal Selection | Keep selected area visible. |
| Layer > Layer Mask > Hide Selection | Hide selected area. |
| Add Layer Mask | Reveal-all mask when there is no selection. |
| Alt+Add Layer Mask | Hiding mask according to selection state. |
| Mask thumbnail + Brush | Black hides, white reveals, gray partially reveals. |
| Properties: Density / Feather | Mask strength and edge softness. |
| Alt+mask thumbnail | Inspect the mask alone. |
| Shift+mask thumbnail | Temporarily disable the mask for comparison. |

Verify that the mask thumbnail, not the image, is active. Check hair/fur on light and dark backgrounds;
excessive feathering blurs contours. Clipping masks and layer masks serve different purposes.

## Text

[Type layers](https://helpx.adobe.com/photoshop/desktop/text-typography/type-layers-creation/type-layers-in-photoshop.html).

| Tool/panel | Use |
|---|---|
| Horizontal Type | Click for point type in short headings. |
| Draw a box with Type | Paragraph type for long text. |
| Window > Character | Font, weight, size, leading, tracking and kerning. |
| Window > Paragraph | Alignment and paragraph layout. |
| Type on a path | Editable text on a curve/path when needed. |
| Type layer / Layer Styles | Effects without rasterizing text. |

Preserve the T icon on type layers. Check actual headings and required language glyphs; do not hide overflowing text.
Resolve missing fonts against brand requirements and licensing.

## Placement, size and smart objects

[Place files](https://helpx.adobe.com/photoshop/desktop/create-open-import-images/import-files/place-a-file-in-photoshop.html),
[transform](https://helpx.adobe.com/photoshop/desktop/crop-resize-transform/resize-adjust-resolution/transform-images-shapes-and-paths.html),
[replace contents](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/smart-objects/replace-the-contents-of-a-smart-object.html).

| Command | Use |
|---|---|
| File > Place Embedded | Content inside PSD for portable delivery. |
| File > Place Linked | Externally linked content; use a source working copy. |
| Layer > Smart Objects > Convert to Smart Object | Editable transforms and filters. |
| Edit > Free Transform | Scale, position and rotation; numeric fields for precision. |
| Transform: Distort / Perspective / Warp | Mockup geometry matching the real surface. |
| Layer > Smart Objects > Edit Contents | Edit and save source contents to update the master. |
| Smart Object: Replace Contents | Place a new design into existing transforms. |
| Embed Linked / Embed All Linked | Remove delivery dependence on external files. |
| Image > Image Size | Pixel dimensions/resolution; check resampling decisions. |
| Image > Canvas Size | Expand/shrink composition area without scaling the image. |
| Crop Tool | Framing; check Delete Cropped Pixels to preserve source pixels. |

Free Transform proportion lock may follow the last setting; do not assume Shift behavior.
Smart objects preserve source data during repeated transforms but cannot create detail from insufficient resolution.
Edit Contents may open Illustrator for AI/PDF content: verify application and source path again.
After Replace Contents, inspect proportions, crop and all linked instances.

## Retouching and delivery

[Remove tool](https://helpx.adobe.com/ca/photoshop/using/tool-techniques/remove-tool.html),
[multi-layer sampling](https://helpx.adobe.com/photoshop/desktop/create-manage-layers/get-started-layers/sample-from-all-visible-layers.html),
[Export As](https://helpx.adobe.com/photoshop/desktop/save-and-export/export-files-to-different-formats/fine-tune-your-export-settings-using-the-export-as-option.html).

| Command/tool | Use/check |
|---|---|
| Spot Healing / Healing Brush | Small defects; separate retouching layer and appropriate sampling. |
| Clone Stamp | Controlled texture copying; inspect repetition and source point. |
| Remove Tool | Unwanted regions; observe AI on/off/auto mode. |
| Sample All Layers | Sample visible layers and apply to the active retouching layer. |
| File > Export > Export As | Dimensions, format, quality, transparency and visible color options. |
| File > Export > Quick Export as… | Preset format; verify current settings. |

Consider PNG for transparent graphics and JPEG for photo-heavy presentations.
Do not assume WebP/AVIF/SVG appear in Photoshop's format list; hand off separate format preparation to web-assets when necessary.
Deliver PSD and publishable images separately; reopen outputs to check dimensions, appearance and text.
