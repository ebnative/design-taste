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

def normalize(text):
    text = text.casefold().replace('ı', 'i')
    return ''.join(c for c in unicodedata.normalize('NFKD', text) if not unicodedata.combining(c))

def tokens(text):
    return re.findall(r'[a-z0-9]+', normalize(text))

def search(query, record_type=None, asset=None, medium=None, limit=5, root=ROOT):
    if not 1 <= limit <= 30:
        raise ValueError('limit must be 1..30')
    root = Path(root)
    records = json.loads((root / 'knowledge/records.json').read_text(encoding='utf-8'))
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
        prominent = ' '.join([rec['id'], rec['title_en']] + rec['aliases'])
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
                            score=round(score, 5), matched_terms=matched, path=rec['path'],
                            source_ids=rec['source_ids'], review_status=rec['review_status'],
                            production_test_status=rec['production_test_status'],
                            application=rec['contemporary_application'], limits=rec['limits']))
    results.sort(key=lambda item: (-item['score'], item['id']))
    return {'query': query, 'filters': {'record_type': record_type, 'asset': requested_asset, 'medium': medium},
            'status': 'matched' if results else 'no_match', 'count': min(limit, len(results)),
            'note': 'Text relevance only. Applications are contemporary proposals; source re-review pending.',
            'results': results[:limit]}

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
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    try:
        result = search(args.query, args.record_type, args.asset, args.medium, args.n)
    except ValueError as error:
        parser.error(str(error))
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    elif not result['results']:
        print('No match in the knowledge base; no result or default style was generated.')
    else:
        print(result['note'])
        for row in result['results']:
            print('\n' + row['title'] + ' [' + row['record_type'] + ']\n' + row['path'])
            print('Proposal: ' + row['application'])
            print('Limit: ' + row['limits'])

if __name__ == '__main__':
    main()
