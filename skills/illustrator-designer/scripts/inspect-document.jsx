(function () {
    var lines = ["Illustrator version: " + app.version, "Open documents: " + app.documents.length];
    var limit = Math.min(app.documents.length, 10);
    for (var i = 0; i < limit; i++) {
        var doc = app.documents[i];
        lines.push("Document " + i + ": " + doc.name + "; saved=" + doc.saved + "; layers=" + doc.layers.length + "; items=" + doc.pageItems.length + "; artboards=" + doc.artboards.length);
    }
    if (app.documents.length > limit) lines.push("Additional documents omitted: " + (app.documents.length - limit));
    if (app.documents.length) {
        var active = app.activeDocument;
        var boardIndex = active.artboards.getActiveArtboardIndex();
        lines.push("Active: " + active.name + "; artboard=" + boardIndex + "; rect=" + active.artboards[boardIndex].artboardRect.join(",") + "; textFrames=" + active.textFrames.length);
        var layerLimit = Math.min(active.layers.length, 20);
        for (var j = 0; j < layerLimit; j++) {
            var layer = active.layers[j];
            lines.push("Layer: " + layer.name + "; locked=" + layer.locked + "; visible=" + layer.visible + "; items=" + layer.pageItems.length);
        }
        if (active.layers.length > layerLimit) lines.push("Additional layers omitted: " + (active.layers.length - layerLimit));
    }
    return lines.join("\n");
})();
