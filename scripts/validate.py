"""Check references, provenance, record contracts, and shareable text privacy."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def validate(root=ROOT):
    root = Path(root)
    errors = []
    records = json.loads((root / 'knowledge/records.json').read_text(encoding='utf-8'))
    sources = json.loads((root / 'knowledge/sources.json').read_text(encoding='utf-8'))
    source_ids = {s['id'] for s in sources}
    ids = [r['id'] for r in records]
    if len(ids) != len(set(ids)):
        errors.append('Duplicate record IDs')
    required = ('id', 'title_en', 'record_type', 'aliases', 'historical_context',
                'visual_principles', 'contemporary_application', 'exercise', 'limits', 'source_ids',
                'rights', 'review_status', 'production_test_status', 'path')
    for record in records:
        if any(key not in record or not record[key] for key in required):
            errors.append('Incomplete record: ' + record['id'])
        if not set(record['source_ids']).issubset(source_ids):
            errors.append('Unresolved sources: ' + record['id'])
        if not (root / record['path']).is_file():
            errors.append('Missing record document: ' + record['id'])
    for path in root.rglob('*'):
        if not path.is_file() or '.git' in path.parts or path.suffix not in ('.md', '.json', '.yaml', '.ps1', '.jsx', '.py'):
            continue
        content = path.read_text(encoding='utf-8-sig')
        if re.search(r'[A-Za-z]:[/\\]Users[/\\]|E:[/\\]portfol', content):
            errors.append('Personal path in ' + path.relative_to(root).as_posix())
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
