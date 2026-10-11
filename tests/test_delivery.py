"""Behavioral contracts for the bounded local delivery, not design mastery."""
import copy
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

from test_retrieval import ROOT, SCRATCH, query, installer, validator


class DeliveryTests(unittest.TestCase):
    def cli(self, phrase, *flags, script=None, cwd=ROOT):
        return subprocess.run([sys.executable, str(script or ROOT / 'search/query.py'),
                               phrase, *flags, '--json'], cwd=cwd, capture_output=True,
                              text=True, encoding='utf-8')

    def test_practical_task_retrieval(self):
        for phrase, expected in [('readable cover title', 'typography-hierarchy'),
                                 ('editorial cover brief', 'editorial-cover'),
                                 ('small size logo', 'identity-use-conditions')]:
            with self.subTest(phrase=phrase):
                result = query.search(phrase, 'foundation')
                self.assertIn(expected, [r['id'] for r in result['results'][:3]])
                row = next(r for r in result['results'] if r['id'] == expected)
                self.assertTrue(row['task_terms'])
                self.assertTrue(row['claim_review_ids'])
                self.assertEqual(row['production_test_status'], 'not_run')
                self.assertEqual(row['review_status'], 'source-reviewed')

    def test_mixed_constraints_are_not_solved(self):
        result = query.search('Bauhaus underwater zxqv987655')
        self.assertTrue(result['results'])
        self.assertEqual(result['constraint_evaluation'], 'not_performed')
        self.assertIn('zxqv987655', result['unmatched_terms'])
        for row in result['results']:
            self.assertEqual(set(row['unmatched_terms']),
                             set(query.tokens(result['query'])) - set(row['matched_terms']))
        for phrase in ('zxqv987655', '   '):
            result = query.search(phrase)
            self.assertEqual((result['status'], result['count'], result['results']), ('no_match', 0, []))
        failure = subprocess.run([sys.executable, str(ROOT / 'search/query.py'),
                                  'cover', '--constraint', 'waterproof'], capture_output=True)
        self.assertNotEqual(failure.returncode, 0)
        self.assertNotIn(b'Traceback', failure.stderr)
        text = subprocess.run([sys.executable, str(ROOT / 'search/query.py'),
                               'Bauhaus zxqv987655'], capture_output=True, text=True)
        self.assertIn('not evaluated', text.stdout)
        self.assertIn('zxqv987655', text.stdout)

    def test_cli_all_filters_and_counts(self):
        for kind in query.TYPES:
            result = json.loads(self.cli('cover typography', '--type', kind, '-n', '2').stdout)
            self.assertEqual(result['count'], len(result['results']))
            self.assertTrue(all(r['record_type'] == kind for r in result['results']))
        records = {r['id']: r for r in json.loads((ROOT / 'knowledge/records.json').read_text())}
        aliases = json.loads((ROOT / 'knowledge/aliases.json').read_text())['asset_aliases']
        for asset, names in aliases.items():
            for name in [asset] + names:
                for medium in ('static', 'temporal', 'study'):
                    result = json.loads(self.cli('cover logo typography', '--asset', name,
                                                 '--medium', medium, '-n', '3').stdout)
                    self.assertEqual(result['count'], len(result['results']))
                    self.assertTrue(all(asset in records[r['id']]['assets'] and
                                        medium in records[r['id']]['medium'] for r in result['results']))
        result = json.loads(self.cli('readable cover title', '--type', 'foundation',
                                     '--asset', 'cover', '--medium', 'static').stdout)
        self.assertEqual(result['results'][0]['id'], 'typography-hierarchy')
        for flags in [('--asset', 'invalid-asset'), ('--medium', 'bad'), ('--type', 'bad'), ('-n', '0')]:
            process = self.cli('cover', *flags)
            self.assertNotEqual(process.returncode, 0)
            self.assertNotIn('Traceback', process.stderr)

    def test_source_and_import_status_preserved(self):
        baseline = json.loads((ROOT / 'tests/fixtures/import-status.json').read_text())
        records = {r['id']: r for r in json.loads((ROOT / 'knowledge/records.json').read_text())}
        sources = {s['id']: s for s in json.loads((ROOT / 'knowledge/sources.json').read_text())}
        for ident, status in baseline['records'].items():
            self.assertEqual({k: records[ident][k] for k in status}, status)
        for ident, status in baseline['sources'].items():
            self.assertEqual({k: sources[ident][k] for k in status}, status)
        reviews = {r['id']: r for s in sources.values() for r in s.get('claim_reviews', [])}
        self.assertEqual(len(reviews), 7)
        for review in reviews.values():
            for key in ('page_url', 'claim', 'locator', 'reviewed_on', 'limits', 'support_excerpt', 'reviewer_role'):
                self.assertTrue(review[key])
            self.assertEqual(review['rights']['images'], 'not-determined')
        for record in records.values():
            for ident in record.get('claim_review_ids', []):
                self.assertIn(ident, reviews)
                self.assertIn(reviews[ident]['source_id'], record['source_ids'])
                self.assertIn(ident, (ROOT / record['path']).read_text())

    def test_relocated_actual_cli_and_example_links(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temporary:
            temporary = Path(temporary)
            dest = temporary / 'skills'
            installer.install(dest, ['design-taste', 'design-critic'])
            for name in ('design-taste', 'design-critic'):
                moved = temporary / ('moved-' + name)
                shutil.copytree(dest / name, moved)
                for phrase in ('readable cover title', 'small size logo', 'Bauhaus zxqv987655', 'zxqv987655'):
                    actual = self.cli(phrase, script=moved / 'bundle/search/query.py', cwd=temporary)
                    self.assertEqual(actual.returncode, 0, actual.stderr)
                    self.assertEqual(json.loads(actual.stdout), query.search(phrase))
                self.assertTrue((moved / 'bundle/examples/learning-guide-cover/selected.svg').is_file())
                for path in moved.rglob('*.md'):
                    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', path.read_text()):
                        if not target.startswith(('http:', 'https:', '#')):
                            self.assertTrue((path.parent / target.split('#')[0]).exists(), (path, target))

    def test_malformed_task_metadata_and_claim_reviews(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temporary:
            root = Path(temporary)
            shutil.copytree(ROOT / 'knowledge', root / 'knowledge')
            shutil.copytree(ROOT / 'atlas', root / 'atlas')
            original = json.loads((root / 'knowledge/records.json').read_text())
            for value in (None, True, 7, 'logo', {}, [None], [['logo']]):
                with self.subTest(value=value):
                    records = copy.deepcopy(original)
                    records[-1]['task_terms'] = value
                    (root / 'knowledge/records.json').write_text(json.dumps(records))
                    with self.assertRaises(ValueError):
                        query.search('logo', root=root)
                    self.assertTrue(any('task_terms' in e for e in validator.validate(root)))
            (root / 'knowledge/records.json').write_text(json.dumps(original))
            sources = json.loads((root / 'knowledge/sources.json').read_text())
            for value in (None, True, 7, 'claim', {}, [None], [{'id': []}]):
                modified = copy.deepcopy(sources)
                modified[0]['claim_reviews'] = value
                (root / 'knowledge/sources.json').write_text(json.dumps(modified))
                self.assertTrue(any('claim' in e.lower() for e in validator.validate(root)))

    def test_public_text_privacy_guard(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temporary:
            root = Path(temporary)
            shutil.copytree(ROOT / 'knowledge', root / 'knowledge')
            shutil.copytree(ROOT / 'atlas', root / 'atlas')
            for private in ('/Us' + 'ers/person/brief', 'C:' + '\\Users\\person\\brief'):
                (root / 'private.md').write_text(private)
                self.assertTrue(any('Personal path' in e for e in validator.validate(root)))

    def test_original_artifacts_and_curriculum_contracts(self):
        import struct
        import xml.etree.ElementTree as ET
        example = ROOT / 'examples/learning-guide-cover'
        manifest = json.loads((example / 'manifest.json').read_text())
        self.assertEqual(manifest['native_operation'], 'blocked-by-user-decision')
        self.assertEqual(manifest['human_acceptance'], 'pending')
        self.assertEqual(len(manifest['concepts']), 3)
        for name in manifest['concepts'] + [manifest['comparison'], 'selected.svg']:
            svg = ET.parse(example / name).getroot()
            self.assertEqual((svg.get('width'), svg.get('height')), ('1200', '1600'))
            self.assertFalse(any('href' in k for element in svg.iter() for k in element.attrib))
            self.assertFalse(any(element.tag.endswith(('script', 'image', 'foreignObject')) for element in svg.iter()))
        for name, dimensions in manifest['previews'].items():
            data = (example / name).read_bytes()
            self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
            self.assertEqual(list(struct.unpack('>II', data[16:24])), dimensions)
        for number in range(1, 13):
            content = (ROOT / 'curriculum/exercises' / f'{number:02}.md').read_text()
            for heading in ('Prerequisites', 'Objective', 'Deliverable', 'Observable criteria',
                            'Critique and revision', 'Retained evidence'):
                self.assertIn(heading, content)


if __name__ == '__main__':
    unittest.main()
