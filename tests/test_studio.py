"""Observable studio archive, evidence and portable retrieval contracts."""
import copy
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

from test_retrieval import ROOT, SCRATCH, installer, query
from scripts.studio_contracts import validate_archive, validate_routes


class StudioTests(unittest.TestCase):
    def fixture(self, root):
        for name in ('archive', 'schemas'):
            shutil.copytree(ROOT / name, root / name)
        return json.loads((root / 'archive/cards.json').read_text(encoding='utf-8'))

    def write_cards(self, root, cards):
        (root / 'archive/cards.json').write_text(json.dumps(cards), encoding='utf-8')

    def test_archive_candidates_and_disclosures(self):
        result = query.search('landing page zxqv987655', archive=True)
        self.assertTrue(result['results'])
        self.assertIn('zxqv987655', result['unmatched_terms'])
        self.assertEqual(result['constraint_evaluation'], 'not_performed')
        for row in result['results']:
            self.assertEqual(row['evidence_status'], 'candidate')
            self.assertEqual(row['layer'], 'inspiration')
            self.assertFalse(row['presentable'])
            self.assertIn('zxqv987655', row['unmatched_terms'])
        self.assertEqual(query.search('zxqv987655', archive=True)['status'], 'no_match')
        for flags in [('--type', 'movement'), ('--asset', 'cover'), ('--medium', 'static')]:
            process = subprocess.run([sys.executable, str(ROOT / 'search/query.py'), 'landing', '--archive', *flags], capture_output=True, text=True)
            self.assertNotEqual(process.returncode, 0)
            self.assertNotIn('Traceback', process.stderr)

    def test_archive_indexes_content_not_empty_schema_keys(self):
        self.assertEqual(query.search('tokens', archive=True)['status'], 'no_match')
        motion_ids = {r['id'] for r in query.search('motion', archive=True, limit=30)['results']}
        self.assertNotIn('WEB-017', motion_ids)
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            root = Path(temp)
            cards = self.fixture(root)
            shutil.copytree(ROOT / 'knowledge', root / 'knowledge')
            cards[0]['agent_face']['tokens'] = {'surface_style': 'warm amber'}
            self.write_cards(root, cards)
            result = query.search('amber', root=root, archive=True)
            self.assertEqual(result['results'][0]['id'], cards[0]['id'])
            self.assertEqual(query.search('surface_style', root=root, archive=True)['status'], 'no_match')

    def test_bad_showroom_fixture_and_malformed_schema(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            root = Path(temp)
            cards = self.fixture(root)
            bad = json.loads((ROOT / 'tests/fixtures/archive-third-party-showroom.json').read_text(encoding='utf-8'))
            self.write_cards(root, [bad])
            self.assertTrue(any('third-party source' in e for e in validate_archive(root)))
            for field, value in [('discipline', 'unknown'), ('client_face', None), ('agent_face', []), ('last_checked', '2026-99-99'), ('evidence_status', 'verified')]:
                malformed = copy.deepcopy(cards[0]); malformed[field] = value
                self.write_cards(root, [malformed])
                self.assertTrue(validate_archive(root), (field, value))

    def test_showroom_media_and_approval_gates(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            root = Path(temp)
            cards = self.fixture(root)
            card = copy.deepcopy(cards[0])
            card.update(layer='showroom', authorship='studio', presentable=False)
            card['source'] = dict(url=None, creator='studio', terms_url=None, license='original-rights-unconfirmed')
            self.write_cards(root, [card])
            self.assertEqual(validate_archive(root), [])
            for preview in ['../outside.png', '/absolute.png', 'https://example.org/image.png', 'C:\\image.png', 'examples/cover.png', '.work/image.png']:
                card['client_face']['preview_ref'] = preview
                self.write_cards(root, [card])
                self.assertTrue(validate_archive(root), preview)
            card['client_face']['preview_ref'] = 'portfolio/showroom/demo.png'
            self.write_cards(root, [card])
            self.assertEqual(validate_archive(root), [])
            card['media_public'] = True
            self.write_cards(root, [card])
            self.assertTrue(validate_archive(root))
            card.pop('media_public')
            card['presentable'] = True
            self.write_cards(root, [card])
            self.assertTrue(validate_archive(root))
            card['presentable'] = False
            card['evidence_status'] = 'executed-verified'
            self.write_cards(root, [card])
            self.assertTrue(validate_archive(root))

    def test_route_registry_requires_operation_evidence(self):
        self.assertEqual(validate_routes(ROOT), [])
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            root = Path(temp)
            for directory in ('adapters', 'schemas'):
                shutil.copytree(ROOT / directory, root / directory)
            original = json.loads((root / 'adapters/routes.json').read_text(encoding='utf-8'))
            def check(data):
                (root / 'adapters/routes.json').write_text(json.dumps(data), encoding='utf-8')
                return validate_routes(root)
            modified = copy.deepcopy(original)
            route = modified['operations'][0]['routes'][0]
            route['status'] = 'verified'
            self.assertTrue(any('inspected output' in e for e in check(modified)))
            route['evidence'] = 'adapters/photoshop/capability.json'
            route['last_checked'] = '2026-10-20'
            route['execution_evidence'] = dict(operation='vector.logo', record=route['evidence'], output_ref='job/output.png', inspected=True)
            self.assertTrue(any('matching executed operation' in e for e in check(modified)))
            modified = copy.deepcopy(original)
            photoshop = next(r for op in modified['operations'] for r in op['routes'] if r['id'] == 'desktop-control@photoshop')
            self.assertEqual(photoshop['status'], 'blocked')
            photoshop['status'] = 'unverified'
            self.assertTrue(any('explicit decision' in e for e in check(modified)))
            modified = copy.deepcopy(original)
            modified['operations'].pop()
            self.assertTrue(any('missing required operations' in e for e in check(modified)))

    def test_archive_cli_relocates_with_candidate_status(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            root = Path(temp)
            installer.install(root / 'install', ['web-ui-design'])
            moved = root / 'relocated'
            shutil.move(str(root / 'install/web-ui-design'), moved)
            shutil.rmtree(root / 'install')
            process = subprocess.run([sys.executable, str(moved / 'bundle/search/query.py'), 'landing page', '--archive', '--json'], cwd=root, capture_output=True, text=True, check=True)
            self.assertEqual(json.loads(process.stdout), query.search('landing page', archive=True))
            self.assertTrue((moved / 'bundle/schemas/archive-card.schema.json').is_file())


if __name__ == '__main__':
    unittest.main()
