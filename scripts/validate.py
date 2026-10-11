"""Check references, provenance, record contracts, and shareable text privacy."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def string_list(value):
    return isinstance(value, list) and all(isinstance(v, str) and v.strip() for v in value)

def claim_reviews(sources, errors):
    reviews = {}
    for source in sources:
        entries = source.get('claim_reviews', [])
        if not isinstance(entries, list):
            errors.append('Invalid claim_reviews: ' + source['id'])
            continue
        for entry in entries:
            fields = ('id', 'source_id', 'page_url', 'claim', 'support_excerpt', 'locator',
                      'reviewed_on', 'reviewer_role', 'limits', 'outcome')
            if not isinstance(entry, dict) or any(not isinstance(entry.get(k), str) or
                                                  not entry[k].strip() for k in fields):
                errors.append('Invalid claim review: ' + source['id'])
                continue
            rights = entry.get('rights')
            if not isinstance(rights, dict) or any(not isinstance(rights.get(k), str) or
                                                  not rights[k].strip() for k in
                                                  ('text', 'images', 'fonts', 'data', 'commercial_use')):
                errors.append('Invalid claim rights: ' + entry['id'])
            if entry['source_id'] != source['id'] or entry['page_url'] != source['url']:
                errors.append('Claim source mismatch: ' + entry['id'])
            if not re.fullmatch(r'S[0-9]+-C[0-9]+', entry['id']) or entry['id'] in reviews:
                errors.append('Invalid/duplicate claim ID: ' + entry['id'])
            if not re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', entry['reviewed_on']):
                errors.append('Invalid claim date: ' + entry['id'])
            reviews[entry['id']] = entry
    return reviews

def validate(root=ROOT):
    root = Path(root)
    errors = []
    records = json.loads((root / 'knowledge/records.json').read_text(encoding='utf-8'))
    sources = json.loads((root / 'knowledge/sources.json').read_text(encoding='utf-8'))
    source_ids = {s['id'] for s in sources}
    reviews = claim_reviews(sources, errors)
    ids = [r['id'] for r in records]
    if len(ids) != len(set(ids)):
        errors.append('Duplicate record IDs')
    required = ('id', 'title_en', 'record_type', 'aliases', 'historical_context',
                'visual_principles', 'contemporary_application', 'exercise', 'limits', 'source_ids',
                'rights', 'review_status', 'production_test_status', 'path')
    for record in records:
        if not string_list(record.get('task_terms', [])):
            errors.append('Invalid task_terms: ' + record['id'])
        references = record.get('claim_review_ids', [])
        if not string_list(references):
            errors.append('Invalid claim_review_ids: ' + record['id'])
        else:
            for ident in references:
                if ident not in reviews or reviews[ident]['source_id'] not in record['source_ids']:
                    errors.append('Unresolved claim review: ' + record['id'])
                elif (root / record['path']).is_file() and ident not in (root / record['path']).read_text(encoding='utf-8'):
                    errors.append('Claim review missing from atlas: ' + record['id'])
        if any(key not in record or not record[key] for key in required):
            errors.append('Incomplete record: ' + record['id'])
        if not set(record['source_ids']).issubset(source_ids):
            errors.append('Unresolved sources: ' + record['id'])
        if not (root / record['path']).is_file():
            errors.append('Missing record document: ' + record['id'])
    for path in root.rglob('*'):
        if not path.is_file() or any(part in ('.git', '.work', '__pycache__') for part in path.relative_to(root).parts) or path.suffix not in ('.md', '.json', '.yaml', '.ps1', '.jsx', '.py', '.svg'):
            continue
        content = path.read_text(encoding='utf-8-sig')
        if re.search(r'[A-Za-z]:[/\\]Users[/\\]|E:[/\\]portfol|/Us' + r'ers/|/ho' + r'me/[^/\s]+/', content):
            errors.append('Personal path in ' + path.relative_to(root).as_posix())
        if '\u2014' in content:
            errors.append('Em dash in ' + path.relative_to(root).as_posix())
        if path.suffix == '.md':
            for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', content):
                if target.startswith(('http:', 'https:', '#', 'app:')):
                    continue
                if not (path.parent / target.split('#')[0]).exists():
                    errors.append('Broken link in ' + path.relative_to(root).as_posix() + ': ' + target)
    return errors

if __name__ == '__main__':
    errors = validate()
    print(json.dumps({'status': 'fail' if errors else 'pass', 'errors': errors}, indent=2))
    raise SystemExit(bool(errors))
