"""Build a private offline graphic study library from canonical notes and existing media."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]


def safe_file(root, relative):
    if not isinstance(relative, str) or not relative or '\\' in relative:
        raise ValueError('Expected a relative media path')
    p = Path(relative)
    resolved = (root / p).resolve()
    if p.is_absolute() or '..' in p.parts or not resolved.is_relative_to(root.resolve()):
        raise ValueError('Media path escapes its private directory')
    if resolved.is_relative_to(ROOT.resolve()):
        raise ValueError('Private media cannot resolve into the repository')
    if not resolved.is_file():
        raise ValueError('Missing private media: ' + relative)
    return resolved


def validate(studies, cards):
    ids = set()
    card_map = {c['id']: c for c in cards}
    for study in studies:
        ident = study['id']
        if not re.fullmatch(r'GD-\d{3}', ident) or ident in ids:
            raise ValueError('Invalid or duplicate graphic study ID')
        ids.add(ident)
        if ident not in card_map or card_map[ident]['source']['url'] != study['source_url']:
            raise ValueError('Study must resolve to its canonical source card')
        if not study['source_url'].startswith('https://x.com/'):
            raise ValueError('Expected a supplied X source')
        if set(study['analysis']) != {'concept', 'composition', 'hierarchy', 'typography', 'color', 'material', 'motion', 'system'}:
            raise ValueError('Incomplete visual analysis')
        recipe = study['recipe']
        if len(recipe['steps']) < 3 or len(recipe['comparison_checks']) < 3:
            raise ValueError('Recipe needs production and comparison detail')
        if recipe['status'] != 'authored-unexecuted':
            raise ValueError('Source recipes cannot infer job execution')
        if any(t['provenance'] != 'authored starting point; not measured source values' for t in recipe['starting_tokens']):
            raise ValueError('Starting values need honest provenance')
    if any(set(s['related_ids']) - ids for s in studies):
        raise ValueError('Unknown related study')


def e(value):
    return html.escape(str(value), quote=True)


def listing(values, ordered=False):
    tag = 'ol' if ordered else 'ul'
    return '<' + tag + '>' + ''.join('<li>' + e(v) + '</li>' for v in values) + '</' + tag + '>'


def markdown(study):
    analysis = '# ' + study['title'] + '\n\n' + study['source_url'] + '\n\n'
    analysis += '\n\n'.join('## ' + k.title() + '\n\n' + v for k, v in study['analysis'].items())
    analysis += '\n\n## Evidence limits\n\n' + study['evidence']['limits'] + '\n'
    r = study['recipe']
    recipe = '# Production recipe - ' + study['id'] + '\n\nAuthored hypothesis; not an executed source recipe.\n\n'
    for key in ('inputs', 'steps', 'deliverables', 'comparison_checks'):
        recipe += '## ' + key.replace('_', ' ').title() + '\n\n' + '\n'.join(str(n) + '. ' + v for n, v in enumerate(r[key], 1)) + '\n\n'
    recipe += '## Application proposals\n\n' + '\n'.join('- ' + k + ': ' + v for k, v in r['adaptations'].items()) + '\n'
    return analysis, recipe


def selection_prompt(study):
    return ('Use Design Taste reference ' + study['id'] + ' (' + study['title'] + '). '
            'Read its private media, ANALYSIS.md and RECIPE.md. Apply its selected visual grammar to my stated brief. '
            'If no target is specified, create a provisional studio study. Keep the content and artwork original. '
            'Produce an editable trial, full and reduced exports; compare actual reference/trial pixels, '
            'revise the highest-impact gap and retain revisions. Continue toward criterion-level comparability; '
            'document a demonstrated plateau or missing route honestly. Human acceptance remains pending.')


def build(destination, captures, media_manifest, root=ROOT):
    destination, captures, root = (Path(x).resolve() for x in (destination, captures, root))
    if destination.is_relative_to(ROOT) or ROOT.is_relative_to(destination):
        raise ValueError('Graphic archive must be outside the repository and its ancestors')
    if destination == captures or destination.is_relative_to(captures) or captures.is_relative_to(destination):
        raise ValueError('Capture input and archive output must be disjoint')
    studies = json.loads((root / 'archive/graphic-studies.json').read_text())['studies']
    validate(studies, json.loads((root / 'archive/cards.json').read_text()))
    media = json.loads(Path(media_manifest).read_text())
    known = {s['id'] for s in studies}
    copies = []
    receipts = []
    for row in media:
        if row['id'] not in known or row['kind'] not in ('source-image', 'video-poster-not-playback', 'browser-capture', 'sampled-video-frame', 'source-video'):
            raise ValueError('Invalid media record')
        source = safe_file(captures, row['file'])
        data = source.read_bytes()
        suffix = source.suffix.lower()
        if not ((suffix in ('.jpg', '.jpeg') and data[:3] == b'\xff\xd8\xff') or
                (suffix == '.png' and data[:8] == b'\x89PNG\r\n\x1a\n') or
                (suffix == '.mp4' and data[4:8] == b'ftyp')):
            raise ValueError('Media extension does not match content')
        if not re.fullmatch(r'GD-\d{3}[a-z0-9-]*\.(jpg|jpeg|png|mp4)', row['file']):
            raise ValueError('Invalid media filename')
        target = destination / 'captures' / row['file']
        if not target.resolve().is_relative_to(destination) or target.is_symlink():
            raise ValueError('Output escapes the private archive')
        copies.append((source, target))
        receipts.append({**row, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})
    if any(not any(m['id'] == ident for m in receipts) for ident in known):
        raise ValueError('Every study requires actual private media')
    if len({r['file'] for r in receipts}) != len(receipts):
        raise ValueError('Duplicate media filename')
    previous = destination / 'capture-receipts.json'
    if previous.is_file():
        old = json.loads(previous.read_text())
        if {r['file'] for r in old} - {r['file'] for r in receipts}:
            raise ValueError('Rebuild must retain all previously recorded source media')
    # Validate outputs before mutation; never remove existing trials or source media.
    output_names = ['index.html', 'catalog.json', 'capture-receipts.json', 'library.css', 'library.js', 'WORKFLOW.md', 'comparisons/index.html']
    for s in studies:
        output_names += ['studies/' + s['id'] + '/' + n for n in ('index.html', 'ANALYSIS.md', 'RECIPE.md', 'tokens.json', 'selection-prompt.txt')]
    for name in output_names:
        p = destination / name
        if not p.resolve().is_relative_to(destination) or (p.exists() and not p.is_file()):
            raise ValueError('Unsafe archive output')
    destination.mkdir(parents=True, exist_ok=True)
    for source, target in copies:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
    panels = []
    for s in studies:
        media_rows = [r for r in receipts if r['id'] == s['id']]
        preferred = next((r for r in media_rows if r['kind'] in ('source-image', 'video-poster-not-playback', 'sampled-video-frame')), media_rows[0])
        preview = 'captures/' + preferred['file']
        directory = destination / 'studies' / s['id']
        directory.mkdir(parents=True, exist_ok=True)
        a, r = markdown(s)
        (directory / 'ANALYSIS.md').write_text(a)
        (directory / 'RECIPE.md').write_text(r)
        (directory / 'tokens.json').write_text(json.dumps(s['recipe']['starting_tokens'], indent=2) + '\n')
        prompt = selection_prompt(s)
        (directory / 'selection-prompt.txt').write_text(prompt + '\n')
        analysis_html = ''.join('<h3>' + e(k.title()) + '</h3><p>' + e(v) + '</p>' for k, v in s['analysis'].items())
        media_html = ''.join(('<video controls muted preload="metadata" src="../../captures/' + e(m['file']) + '"></video>' if m['kind'] == 'source-video' else '<a href="../../captures/' + e(m['file']) + '"><img loading="lazy" src="../../captures/' + e(m['file']) + '" alt="' + e(s['title'] + ' / ' + m['kind']) + '"></a>') + '<p class="muted">' + e(m['kind']) + ' · ' + e(m['file']) + '</p>' for m in media_rows)
        recipe_html = ''.join('<h3>' + e(k.replace('_', ' ').title()) + '</h3>' + listing(s['recipe'][k], k == 'steps') for k in ('inputs', 'steps', 'deliverables', 'comparison_checks'))
        recipe_html += '<h3>Application proposals</h3>' + listing(k + ': ' + v for k, v in s['recipe']['adaptations'].items())
        recipe_html += '<h3>Authored starting tokens</h3>' + listing(t['name'] + ': ' + t['value'] + ' - ' + t['provenance'] for t in s['recipe']['starting_tokens'])
        related = ' · '.join('<a href="../' + e(i) + '/index.html">' + e(i) + '</a>' for i in s['related_ids'])
        body = '<a href="../../index.html">← Graphic library</a><p class="kicker">' + e(s['id'] + ' / ' + s['creator']) + '</p><h1>' + e(s['title']) + '</h1><p><a href="' + e(s['source_url']) + '" rel="noreferrer">Original post ↗</a> ' + related + '</p><p class="notice">' + e(s['evidence']['limits']) + '</p><nav><a href="#analysis">Analysis</a><a href="#recipe">Recipe</a><a href="#media">Source media</a><a href="#use">Use this style</a><a href="../../comparisons/index.html">Trials & comparisons</a></nav><div class="detail-grid"><section id="analysis"><h2>Visual analysis</h2>' + analysis_html + '</section><section id="media"><h2>Private source evidence</h2>' + media_html + '</section></div><section id="recipe"><h2>Production recipe</h2><p class="notice">Authored hypothesis. Execution and acceptance are recorded separately per trial.</p>' + recipe_html + '</section><section id="use"><h2>Use this style</h2><p>This prepares an agent handoff; it does not start an AI job.</p><textarea id="prompt" readonly aria-label="Style selection prompt">' + e(prompt) + '</textarea><button id="copy">Copy prompt</button><span id="copy-status" role="status"></span><p><a download href="ANALYSIS.md">Analysis Markdown</a> · <a download href="RECIPE.md">Recipe Markdown</a> · <a download href="tokens.json">Starting tokens</a> · <a download href="selection-prompt.txt">Prompt</a></p></section>'
        (directory / 'index.html').write_text(page(s['title'], body, '../../'))
        search = ' '.join([s['id'], s['title'], s['creator'], *s['tags'], *s['analysis'].values()]).casefold()
        panels.append('<article data-search="' + e(search) + '" data-tags="' + e(' '.join(s['tags'])) + '" data-id="' + s['id'] + '"><a class="preview" href="studies/' + s['id'] + '/index.html"><img loading="lazy" src="' + e(preview) + '" alt="' + e(s['title']) + '"></a><div class="card-body"><p class="kicker">' + s['id'] + ' / ' + e(s['creator']) + '</p><h2><a href="studies/' + s['id'] + '/index.html">' + e(s['title']) + '</a></h2><p>' + e(s['analysis']['concept']) + '</p><div class="tags">' + ''.join('<span>' + e(t) + '</span>' for t in s['tags']) + '</div><button class="save" aria-pressed="false">Save locally</button></div></article>')
    tag_options = ''.join('<option>' + e(t) + '</option>' for t in sorted({t for s in studies for t in s['tags']}))
    body = '<a class="skip" href="#library">Skip to library</a><aside><a class="brand" href="index.html">Design Taste<span>PRIVATE GRAPHIC LIBRARY</span></a><nav><a href="#library">All references</a><a href="comparisons/index.html">Trials & comparisons</a><a href="WORKFLOW.md">Production workflow</a><a href="../inspiration/2026-10-20/index.html">Web reference archive ↗</a></nav><p class="muted">10 posts · 9 project groups<br>Reference study, not a client showroom.</p></aside><main><header><p class="kicker">Graphic design / source → principles → production</p><h1>A reference you can<br>actually work from.</h1><p>Inspect the artwork, understand its construction, select a direction and compare original trials. All third-party media stays private.</p><nav><a href="comparisons/index.html">Open production studies ↗</a></nav></header><div class="filters"><input id="search" type="search" aria-label="Search graphic references" placeholder="Search style, material, author or task"><select id="style" aria-label="Style or material"><option value="">All styles & materials</option>' + tag_options + '</select><select id="use" aria-label="Output use"><option value="">All uses</option><option value="poster">Poster</option><option value="identity">Identity</option><option value="campaign">Campaign</option><option value="motion">Motion</option><option value="editorial">Editorial</option></select><label><input id="saved" type="checkbox">Saved on this device</label><button id="reset">Reset</button><span id="count" role="status"></span></div><section id="library" class="grid">' + ''.join(panels) + '</section><p id="empty" hidden>No matching references. Clear a filter or reset the search.</p><footer>Estimated values are labeled; authored recipes are hypotheses. Source media, actual trials, model critique and human approval are separate evidence.</footer></main>'
    (destination / 'index.html').write_text(page('Design Taste / Graphic library', body))
    assets = Path(__file__).resolve().parent / 'graphic_library'
    for name in ('library.css', 'library.js'):
        shutil.copy2(assets / name, destination / name)
    (destination / 'catalog.json').write_text(json.dumps({'studies': studies}, ensure_ascii=False, indent=2) + '\n')
    (destination / 'capture-receipts.json').write_text(json.dumps(receipts, indent=2) + '\n')
    shutil.copy2(root / 'workflows/graphic-reference-production.md', destination / 'WORKFLOW.md')
    comparison = destination / 'comparisons/index.html'
    if not comparison.exists():
        comparison.parent.mkdir(parents=True, exist_ok=True)
        comparison.write_text(page('Graphic comparisons', '<a href="../index.html">Back to graphic library</a><h1>No executed trials yet.</h1><p>Source analysis and authored recipes do not establish production. A private job adds actual reference/trial comparisons here.</p>', '../'))
    return {'studies': len(studies), 'project_groups': len({s['project_key'] for s in studies}), 'media_files': len(receipts), 'output': str(destination / 'index.html')}


def page(title, body, prefix=''):
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src \'self\' file:; media-src \'self\' file:; style-src \'self\' file:; script-src \'self\' file:; base-uri \'none\'; form-action \'none\'"><title>' + e(title) + '</title><link rel="stylesheet" href="' + prefix + 'library.css"><script defer src="' + prefix + 'library.js"></script></head><body class="' + ('detail' if prefix else 'library') + '">' + body + '</body></html>'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest', required=True)
    parser.add_argument('--captures', required=True)
    parser.add_argument('--media-manifest', required=True)
    args = parser.parse_args()
    try:
        print(json.dumps(build(args.dest, args.captures, args.media_manifest), indent=2))
    except (ValueError, OSError, KeyError) as error:
        parser.error(str(error))
