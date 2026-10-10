# Önceki uygulama testleri

Önceki sohbette raporlanan testlerdir; bu importta tekrar çalıştırılmadı.
# Verified Illustrator recipes

Record only methods executed and checked in Illustrator. No design/style preferences belong here.

## Native vector creation and delivery — 2026-10-10

- Host tested: Illustrator 2026, `app.version` 30.8.1, Windows.
- Connection: bundled PowerShell 5.1 COM runner, `DoJavaScript`, UTF-8 JSX read inside Illustrator; sandbox escalation was needed for COM activation.
- Verified operations: new 960 x 640 RGB document; three named layers; locked background; rectangle, ellipse, a three-anchor curve with Bezier handles and a smooth middle point; five live text frames using installed ArialMT; Turkish characters.
- Delivery: IllustratorSaveOptions with PDF compatibility; PNG24 with artboard clipping, antialiasing and 100% scale; actual PNG visually inspected.
- Persistence: saved and reopened `<previous-test-artifact>`; re-read three layers, three paths, five live text frames and exact Turkish text; `saved=true` after reopen. Export had marked the open document dirty, so save again after export when a clean final document status is required.
- Helper validation: PowerShell syntax checked; nonexistent JSX rejected before connection; a deliberate ExtendScript error returned process exit code 1.
- Scope: verifies the connection and these operations, not all Illustrator tools, effects, font choices or export formats. The test's palette and composition are not user style preferences.

