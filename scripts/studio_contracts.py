"""Dependency-free validation of studio schemas and evidence/privacy invariants."""
from datetime import date
import json
from pathlib import Path, PurePosixPath
import re
from urllib.parse import urlparse


def schema_errors(value, schema, at='value'):
    """Evaluate the JSON Schema keywords used by the checked-in studio schemas."""
    errors = []
    types = schema.get('type', [])
    if isinstance(types, str):
        types = [types]
    checks = {'object': lambda v: isinstance(v, dict), 'array': lambda v: isinstance(v, list),
              'string': lambda v: isinstance(v, str), 'boolean': lambda v: type(v) is bool,
              'null': lambda v: v is None}
    if types and not any(checks[t](value) for t in types):
        return [at + ': wrong type']
    if 'enum' in schema and not any(type(value) is type(v) and value == v for v in schema['enum']):
        errors.append(at + ': invalid enum value')
    if isinstance(value, str):
        if len(value) < schema.get('minLength', 0):
            errors.append(at + ': empty string')
        if 'pattern' in schema and not re.search(schema['pattern'], value):
            errors.append(at + ': invalid pattern')
    if isinstance(value, list):
        for index, item in enumerate(value):
            errors += schema_errors(item, schema.get('items', {}), f'{at}[{index}]')
    if isinstance(value, dict):
        props = schema.get('properties', {})
        for key in schema.get('required', []):
            if key not in value:
                errors.append(at + ': missing ' + key)
        if schema.get('additionalProperties') is False:
            for key in value.keys() - props.keys():
                errors.append(at + ': unknown field ' + key)
        for key in value.keys() & props.keys():
            errors += schema_errors(value[key], props[key], at + '.' + key)
    return errors


def relative_path(value):
    return (isinstance(value, str) and bool(value) and '\\' not in value and ':' not in value
            and '?' not in value and '#' not in value and not value.startswith(('/', '~'))
            and all(p not in ('', '.', '..') for p in value.split('/')))


def private_preview(value, root):
    if not relative_path(value):
        return False
    # Private references cannot resolve to an existing repository file/directory.
    return not (root / value).exists() and PurePosixPath(value).parts[0] not in {
        'archive', 'examples', 'skills', 'knowledge', 'atlas', 'schemas', 'adapters',
        'docs', 'tests', 'scripts', 'search', 'curriculum', 'workflows', '.git', '.work'}


def repo_record(value, root):
    if not relative_path(value):
        return False
    path = root / value
    return path.is_file() and path.resolve().is_relative_to(root.resolve())


def approval_valid(value, root):
    if not isinstance(value, dict) or value.get('by') != 'Ebru':
        return False
    try:
        date.fromisoformat(value.get('on', ''))
    except (TypeError, ValueError):
        return False
    ref = value.get('reference', '')
    return (isinstance(ref, str) and ref.startswith('https://github.com/ebnative/design-taste/')
            and ('/issues/' in ref or '/pull/' in ref)) or repo_record(ref, root)


def execution_valid(value, root):
    return (isinstance(value, dict) and bool(value.get('operation'))
            and value.get('inspected') is True and repo_record(value.get('record'), root)
            and relative_path(value.get('output_ref')))


def translation_ids(root):
    path = root / 'skills/design-taste/references/translation-table.md'
    if not path.is_file():
        path = root / 'studio/translation-table.md'
    return set(re.findall(r'\bTR-[0-9]{3}\b', path.read_text(encoding='utf-8'))) if path.exists() else set()


def validate_archive(root):
    root = Path(root)
    if not (root / 'archive').exists():
        return []  # Legacy atlas-only validation fixtures have no studio surface.
    errors = []
    try:
        cards = json.loads((root / 'archive/cards.json').read_text(encoding='utf-8'))
        families = json.loads((root / 'archive/families.json').read_text(encoding='utf-8'))
        card_schema = json.loads((root / 'schemas/archive-card.schema.json').read_text(encoding='utf-8'))
        family_schema = json.loads((root / 'schemas/archive-family.schema.json').read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        return ['Archive files: ' + str(error)]
    if not isinstance(cards, list) or not isinstance(families, list):
        return ['Archive catalogs must be arrays']
    for kind, records, schema in [('card', cards, card_schema), ('family', families, family_schema)]:
        for i, row in enumerate(records):
            errors += schema_errors(row, schema, f'{kind}[{i}]')
    if errors:
        return errors
    by_id = {c['id']: c for c in cards}
    family_ids = {f['id'] for f in families}
    if len(by_id) != len(cards) or len(family_ids) != len(families):
        errors.append('Duplicate archive card/family IDs')
    rows = translation_ids(root)
    for card in cards:
        ident = card['id']
        def fail(message):
            errors.append(ident + ': ' + message)
        if not ident.startswith({'graphic': 'GD-', 'web': 'WEB-', 'motion': 'MOT-'}[card['discipline']]):
            fail('ID prefix does not match discipline')
        if set(card['families']) - family_ids:
            fail('unresolved families')
        if set(card['agent_face']['translation_rows']) - rows:
            fail('unresolved translation rows')
        if card['last_checked'] is not None:
            try:
                date.fromisoformat(card['last_checked'])
            except ValueError:
                fail('invalid date')
        preview = card['client_face']['preview_ref']
        if card['layer'] == 'inspiration':
            if card['source']['url'] is None or urlparse(card['source']['url']).scheme not in ('http', 'https'):
                fail('inspiration needs source URL')
            if preview is not None or card.get('media_public') or 'presentable' in card:
                fail('inspiration cannot carry media or presentable status')
        else:
            if card.get('authorship') not in ('studio', 'ebru') or card['source']['url'] is not None or card['source']['terms_url'] is not None or card['source']['creator'] not in ('studio', 'Ebru'):
                fail('showroom requires original authorship and no third-party source')
            if 'presentable' not in card:
                fail('showroom requires explicit presentable state')
            if card.get('media_public') and preview is None:
                fail('public media requires a preview reference')
            if preview is not None:
                if card.get('media_public'):
                    if not repo_record(preview, root) or not approval_valid(card.get('media_public_approval'), root):
                        fail('public media needs existing original file and per-card Ebru approval')
                elif not private_preview(preview, root):
                    fail('preview must be private-root-relative, outside repository')
            if card.get('presentable') and (card['evidence_status'] != 'executed-verified' or preview is None or not approval_valid(card.get('presentable_approval'), root)):
                fail('presentable needs executed evidence, preview and Ebru approval')
        if card['evidence_status'] == 'executed-verified' and not execution_valid(card.get('execution_evidence'), root):
            fail('executed-verified needs executed operation record and inspected output')
    for family in families:
        for discipline, ident in family['cards'].items():
            if ident is None:
                continue
            card = by_id.get(ident)
            if card is None or card['discipline'] != discipline or card['layer'] != 'showroom' or family['id'] not in card['families']:
                errors.append(family['id'] + ': unresolved or inconsistent showroom card ' + str(ident))
        if set(family['translation_rows']) - rows:
            errors.append(family['id'] + ': unresolved translation rows')
    for card in cards:
        for ident in card['families']:
            family = next((f for f in families if f['id'] == ident), None)
            if family and family['cards'].get(card['discipline']) != card['id']:
                errors.append(card['id'] + ': family does not link back')
    return errors
