"""Build an offline, private source-reference catalog; never fetch or execute upstream code."""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


def target(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or path.is_relative_to(ROOT.resolve()):
        raise ValueError('Catalog output must remain in the private root, outside the repository')
    return path


def http_url(value):
    try:
        return value if isinstance(value, str) and urlparse(value).scheme in ('http', 'https') and urlparse(value).netloc else '#'
    except ValueError:
        return '#'


def build(private_root, batch, captures=None, root=ROOT):
    root = Path(root)
    private_root = Path(private_root).expanduser().resolve()
    if private_root.is_relative_to(ROOT.resolve()) or ROOT.resolve().is_relative_to(private_root):
        raise ValueError('Choose a dedicated private folder outside the repository and its ancestors')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', batch):
        raise ValueError('Batch must be a date in YYYY-MM-DD form')
    destination = target(private_root, 'inspiration/' + batch)
    outputs = {name: target(private_root, 'inspiration/' + batch + '/' + name)
               for name in ('index.html', 'catalog.json', 'capture-receipts.json')}
    if any(path.exists() and not path.is_file() for path in outputs.values()):
        raise ValueError('Catalog outputs must be files')
    cards = json.loads((root / 'archive/cards.json').read_text(encoding='utf-8'))
    previous_captures = outputs['capture-receipts.json']
    if not captures and previous_captures.is_file() and json.loads(previous_captures.read_text(encoding='utf-8')):
        raise ValueError('Existing captured batches require --captures to rebuild; previews will not be erased')
    capture_rows = []
    copies = []
    if captures:
        captures = Path(captures).resolve()
        capture_rows = json.loads((captures / 'captures.json').read_text(encoding='utf-8'))
        for row in capture_rows:
            filename = row.get('file', '')
            if not re.fullmatch(r'(GD|WEB|MOT)-\d{3}(-[a-z0-9-]+)?\.(png|jpg|jpeg)', filename):
                raise ValueError('Invalid capture filename')
            source = (captures / filename).resolve()
            if not source.is_relative_to(captures) or not source.is_file():
                raise ValueError('Missing or escaped capture')
            data = source.read_bytes()
            header = data[:8]
            if not (header == b'\x89PNG\r\n\x1a\n' or header[:3] == b'\xff\xd8\xff'):
                raise ValueError('Capture is not a PNG or JPEG')
            out = target(private_root, 'inspiration/' + batch + '/screenshots/' + filename)
            if out.exists() and not out.is_file():
                raise ValueError('Capture outputs must be files')
            copies.append((out, data))
            row['sha256'] = hashlib.sha256(data).hexdigest()
    receipts_path = target(private_root, 'inspiration/' + batch + '/source-receipts.json')
    receipts = json.loads(receipts_path.read_text(encoding='utf-8')) if receipts_path.is_file() else []
    by_repo = {r['repo']: r for r in receipts if r.get('state') == 'downloaded-not-executed'}
    panels = []
    manifest = []
    for card in cards:
        ident = card['id']
        source = http_url(card['source']['url'])
        acquisition = card.get('acquisition', {})
        # Inspiration captures never become client-facing showroom cards.
        preview_id = 'WEB-015' if ident == 'MOT-007' else ident
        shots = [r for r in capture_rows if r.get('id') == preview_id or r.get('id', '').startswith(preview_id + '-')]
        unique = {r['file']: r for r in shots}
        media = ''.join('<a href="screenshots/' + html.escape(name, quote=True) + '"><img loading="lazy" src="screenshots/' + html.escape(name, quote=True) + '" alt="' + html.escape(card['title'] + ' viewport reference', quote=True) + '"></a>' for name in unique)
        if not media:
            media = '<div class="placeholder">Documentation / code reference<br>No visual preview captured</div>'
        code_url = acquisition.get('code_url') or ''
        repo = urlparse(code_url).path.strip('/') if http_url(code_url) != '#' else ''
        receipt = by_repo.get(repo)
        code = '<p class="muted">No licensed code copy recorded.</p>'
        if receipt:
            relative = receipt.get('relative_dir', '')
            if not relative or not target(private_root, 'inspiration/' + batch + '/' + relative).is_dir():
                raise ValueError('Missing private source directory')
            source_receipt = target(private_root, 'inspiration/' + batch + '/' + relative + '/SOURCE-RECEIPT.json')
            if not source_receipt.is_file():
                raise ValueError('Missing private source receipt')
            href = html.escape(relative + '/SOURCE-RECEIPT.json', quote=True)
            code = '<p><a href="' + href + '">Local source receipt</a> · ' + str(len(receipt.get('files', []))) + ' inert source files<br><small>Revision ' + html.escape(receipt['sha'][:12]) + ' · downloaded, not executed</small></p>'
        review = card.get('review', {})
        observed = review.get('observed', card['intended_use'])
        limits = review.get('limits', card['notes'])
        search = ' '.join([ident, card['title'], card['discipline'], acquisition.get('kind', ''), observed])
        panels.append('<article data-discipline="' + html.escape(card['discipline'], quote=True) + '" data-search="' + html.escape(search.casefold(), quote=True) + '"><div class="media">' + media + '</div><div class="body"><div class="eyebrow">' + html.escape(ident + ' / ' + card['discipline'] + ' / ' + card['evidence_status']) + '</div><h2>' + html.escape(card['title']) + '</h2><p>' + html.escape(observed) + '</p><p class="limit">' + html.escape(limits) + '</p><a href="' + html.escape(source, quote=True) + '" target="_blank" rel="noreferrer">Original source ↗</a>' + code + '</div></article>')
        manifest.append({'id': ident, 'source_url': source, 'screenshots': list(unique), 'source_state': receipt['state'] if receipt else 'no-code-copy', 'evidence_status': card['evidence_status']})
    page = '''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>Design Taste | Private references</title><style>
    *{box-sizing:border-box}body{margin:0;background:#f3f0e9;color:#20241f;font:16px/1.5 system-ui,sans-serif}header{padding:48px 5vw 28px;border-bottom:1px solid #ccc8bd;background:#fffdf7}h1{font-size:clamp(32px,5vw,64px);line-height:1.05;max-width:900px;letter-spacing:-.04em;margin:12px 0 20px}.intro{max-width:900px;color:#54584e}.tag,.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em}.tag{color:#526b38}nav{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px}input,select{padding:13px 16px;border:1px solid #b7bcae;border-radius:8px;background:white;font:inherit}input{min-width:min(460px,100%)}main{padding:28px 5vw;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(355px,100%),1fr));gap:24px}article{background:#fffdf8;border:1px solid #d5d6cb;border-radius:12px;overflow:hidden}.media{display:grid;background:#e1e4d9}.media img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-bottom:1px solid #ddd}.media a:not(:first-child) img{max-height:180px;object-fit:cover}.body{padding:22px}h2{margin:8px 0;font-size:24px;letter-spacing:-.02em}.limit{font-size:13px;color:#636457;border-left:3px solid #acb99b;padding-left:12px}a{color:#315530;text-underline-offset:3px}.placeholder{padding:70px 24px;color:#606650;text-align:center}.muted,small{color:#6b6f63;font-size:12px}[hidden]{display:none!important}footer{padding:30px 5vw;color:#616958;font-size:13px}input:focus-visible,select:focus-visible,a:focus-visible{outline:3px solid #627a49;outline-offset:3px}
    </style></head><body><header><div class="tag">Design Taste / private research archive</div><h1>References to learn from.<br>Source to build with.</h1><p class="intro">Internal inspiration, not a client showroom. Captures show bounded public viewports, not complete sites or animation playback. Code copies are pinned, license-scoped and inert. Paid templates, prompt libraries and unknown-rights assets are linked, not copied.</p><nav><input id="search" type="search" aria-label="Search sources" placeholder="Search source, component or design task"><select id="discipline" aria-label="Discipline"><option value="">All disciplines</option><option value="web">Web UI</option><option value="motion">Motion</option><option value="graphic">Graphic</option></select><span id="count" aria-live="polite"></span></nav></header><main>''' + ''.join(panels) + '''</main><footer>Original input coverage also records Adobe as deferred and the X article text as unverified. No claim of complete source-catalog coverage, production verification or redistribution rights.</footer><script>const items=[...document.querySelectorAll('article')];function filter(){const q=document.getElementById('search').value.toLowerCase().trim(),d=document.getElementById('discipline').value;let n=0;for(const item of items){item.hidden=!!((d&&item.dataset.discipline!==d)||(q&&!item.dataset.search.includes(q)));if(!item.hidden)n++;}document.getElementById('count').textContent=n+' cards';}document.getElementById('search').addEventListener('input',filter);document.getElementById('discipline').addEventListener('change',filter);filter();</script></body></html>'''
    # Preflight every capture and source receipt before replacing existing output.
    destination.mkdir(parents=True, exist_ok=True)
    for out, data in copies:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(data)
    outputs['index.html'].write_text(page, encoding='utf-8')
    outputs['catalog.json'].write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    outputs['capture-receipts.json'].write_text(json.dumps(capture_rows, indent=2) + '\n', encoding='utf-8')
    return {'cards': len(cards), 'capture_files': len({r['file'] for r in capture_rows}), 'source_repositories': len(by_repo), 'output': str(destination / 'index.html')}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-root', required=True)
    parser.add_argument('--batch', required=True)
    parser.add_argument('--captures', help='Directory containing captures.json and task-owned screenshot files')
    args = parser.parse_args()
    try:
        print(json.dumps(build(args.private_root, args.batch, args.captures), indent=2))
    except (ValueError, OSError) as error:
        parser.error(str(error))
