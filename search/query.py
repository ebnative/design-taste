"""Local English lexical retrieval; relevance scores are not aesthetic ratings."""
import argparse
from collections import Counter
import json
import math
from pathlib import Path
import re
import sys
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
TYPES = ('foundation', 'movement', 'school', 'collective', 'design_tradition', 'art_tradition', 'technique', 'case_study')

def task_terms(record):
    values = record.get('task_terms', [])
    if not isinstance(values, list) or any(not isinstance(v, str) or not v.strip() for v in values):
        raise ValueError('task_terms must be a list of nonempty strings')
    return values

def normalize(text):
    text = text.casefold().replace('ı', 'i')
    return ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c))

def tokens(text):
    return re.findall(r'[a-z0-9]+', normalize(text))

def archive_values(value):
    """Index authored content without making empty schema keys searchable."""
    if isinstance(value, dict):
        return [text for child in value.values() for text in archive_values(child)]
    if isinstance(value, list):
        return [text for child in value for text in archive_values(child)]
    return [str(value)] if isinstance(value, (str, int, float)) and not isinstance(value, bool) else []


def archive_records(root):
    cards = json.loads((root / 'archive/cards.json').read_text(encoding='utf-8'))
    records = []
    for card in cards:
        records.append(dict(id=card['id'], title_en=card['title'], aliases=[],
                            task_terms=[card['category'], card['intended_use']],
                            historical_context='', visual_principles='',
                            contemporary_application=card['intended_use'],
                            exercise=' '.join(archive_values(card['agent_face'])),
                            record_type='archive', path='archive/cards.json',
                            source_ids=[], review_status=card['evidence_status'],
                            production_test_status='not_run' if card['evidence_status'] != 'executed-verified' else 'recorded-execution',
                            limits='Inspiration is internal; status does not establish reuse rights or client approval.',
                            card=card))
    return records

def search(query, record_type=None, asset=None, medium=None, limit=5, root=ROOT, archive=False):
    if not 1 <= limit <= 30:
        raise ValueError('limit must be 1..30')
    root = Path(root)
    if archive and (record_type or asset or medium):
        raise ValueError('Atlas filters cannot be combined with --archive')
    records = archive_records(root) if archive else json.loads((root / 'knowledge/records.json').read_text(encoding='utf-8'))
    catalog = json.loads((root / 'knowledge/aliases.json').read_text(encoding='utf-8'))
    requested_asset = None
    if asset:
        for key, aliases in catalog['asset_aliases'].items():
            if normalize(asset) in [normalize(a) for a in [key] + aliases]:
                requested_asset = key
                break
        if requested_asset is None:
            raise ValueError('Unknown asset filter: ' + asset)
    if record_type and record_type not in TYPES:
        raise ValueError('Unknown record type: ' + record_type)
    if medium and medium not in ('static', 'temporal', 'study'):
        raise ValueError('Unknown medium: ' + medium)
    documents = []
    for rec in records:
        prominent = ' '.join([rec['id'], rec['title_en']] + rec['aliases'] + task_terms(rec))
        content = ' '.join(rec.get(key, '') for key in ('historical_context', 'visual_principles', 'contemporary_application', 'exercise'))
        documents.append(tokens((prominent + ' ') * 3 + content))
    terms = set(tokens(query))
    df = Counter(t for doc in documents for t in set(doc))
    average = sum(map(len, documents)) / max(1, len(documents))
    results = []
    for rec, doc in zip(records, documents):
        if record_type and rec['record_type'] != record_type:
            continue
        if requested_asset and requested_asset not in rec['assets']:
            continue
        if medium and medium not in rec['medium']:
            continue
        tf = Counter(doc)
        matched = sorted(terms.intersection(tf))
        score = 0.0
        for term in matched:
            idf = math.log(1 + (len(records) - df[term] + .5) / (df[term] + .5))
            score += idf * tf[term] * 2.2 / (tf[term] + 1.2 * (.25 + .75 * len(doc) / max(average, 1)))
        if not score:
            continue
        if normalize(query.strip()) in [normalize(a) for a in rec['aliases'] + [rec['id']]]:
            score += 10
        results.append(dict(id=rec['id'], title=rec['title_en'], record_type=rec['record_type'],
                            score=round(score, 5), matched_terms=matched,
                            unmatched_terms=sorted(terms.difference(tf)), path=rec['path'],
                            task_terms=task_terms(rec), claim_review_ids=rec.get('claim_review_ids', []),
                            source_ids=rec['source_ids'], review_status=rec['review_status'],
                            production_test_status=rec['production_test_status'],
                            application=rec['contemporary_application'], limits=rec['limits']))
    if archive:
        for row in results:
            card = next(rec['card'] for rec in records if rec['id'] == row['id'])
            row.update(discipline=card['discipline'], layer=card['layer'],
                       evidence_status=card['evidence_status'], source_url=card['source']['url'],
                       presentable=card.get('presentable', False))
    results.sort(key=lambda item: (-item['score'], item['id']))
    selected = results[:limit]
    matched_terms = {term for row in selected for term in row['matched_terms']}
    return {'query': query, 'filters': {'record_type': record_type, 'asset': requested_asset, 'medium': medium},
            'status': 'matched' if selected else 'no_match', 'count': len(selected),
            'unmatched_terms': sorted(terms.difference(matched_terms)),
            'constraint_evaluation': 'not_performed',
            'note': 'Lexical relevance only, not a solved brief. Constraints are not evaluated. '
                    'Applications and task labels are contemporary proposals; review status is per record.',
            'results': selected}

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('query')
    parser.add_argument('--type', dest='record_type', choices=TYPES)
    parser.add_argument('--asset')
    parser.add_argument('--medium', choices=('static', 'temporal', 'study'))
    parser.add_argument('-n', type=int, choices=range(1, 31), default=5)
    parser.add_argument('--archive', action='store_true', help='Search discipline archive cards instead of historical atlas records')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    try:
        result = search(args.query, args.record_type, args.asset, args.medium, args.n, archive=args.archive)
    except ValueError as error:
        parser.error(str(error))
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif not result['results']:
        print('No match in the knowledge base; no result or default style was generated.')
    else:
        print(result['note'])
        print('Unmatched query terms: ' + (', '.join(result['unmatched_terms']) or 'none'))
        for row in result['results']:
            print('\n' + row['title'] + ' [' + row['record_type'] + ']\n' + row['path'])
            print('Unmatched for this record: ' + (', '.join(row['unmatched_terms']) or 'none'))
            if args.archive:
                print('Evidence: ' + row['evidence_status'] + '; layer: ' + row['layer'])
            print('Proposal: ' + row['application'])
            print('Limit: ' + row['limits'])

if __name__ == '__main__':
    main()
