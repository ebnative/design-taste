"""Full Academy/Atlas contracts, metadata preflight and shared-engine behavioral tests."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]

class FullStudioTests(unittest.TestCase):
    def builder(self):
        spec = importlib.util.spec_from_file_location('full_build_web', ROOT / 'scripts/build_web.py')
        assert spec is not None and spec.loader is not None
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_all_canonical_surfaces_and_visuals(self):
        builder = self.builder()
        data = builder.project(ROOT)
        self.assertEqual([e['id'] for e in data['practice']['lessons']], [f'{i:02}' for i in range(1, 13)])
        expected = {r['id'] for r in data['records'] if r['record_type'] == 'movement'}
        self.assertEqual({e['id'] for e in data['practice']['movements']}, expected)
        self.assertEqual(len(expected), 13)
        pages = builder.outputs(ROOT)
        for i in range(3, 13):
            self.assertIn(f'data-id="{i:02}"', pages['academy.html'])
        for identifier in expected:
            section = pages['atlas.html'].split(f'id="{identifier}"', 1)[1].split('</details>', 1)[0]
            self.assertLess(section.index('practice-host'), section.index('Claim status:'))
            self.assertIn(f'art/studies/{identifier}.svg', section)
            self.assertIn('reference.svg', section)
            self.assertIn(f'movement={identifier}', section)
        self.assertIn('id="full-practice"', pages['lab.html'])
        self.assertEqual(data['records'], json.loads((ROOT / 'knowledge/records.json').read_text()))
        self.assertEqual(data['sources'], json.loads((ROOT / 'knowledge/sources.json').read_text()))

    def test_practice_metadata_preflight(self):
        builder = self.builder()
        data = builder.project(ROOT)
        for path in [('version',), ('lessons',), ('movements',), ('movements', 0, 'id'), ('movements', 0, 'controls'), ('movements', 0, 'controls', 0, 'min'), ('movements', 0, 'regions'), ('movements', 0, 'regions', 0, 'explanation')]:
            for value in [None, True, {}, [], ['bad']]:
                bad = copy.deepcopy(data['practice'])
                parent = bad
                for key in path[:-1]:
                    parent = parent[key]
                parent[path[-1]] = value
                with self.assertRaises(ValueError, msg=f'{path}: {value}'):
                    builder.validate_practice(bad, data['records'], data['sources'], data['lessons'])
        for field in ['max', 'value']:
            bad = copy.deepcopy(data['practice'])
            bad['movements'][0]['controls'][0][field] = float('inf')
            if field == 'value':
                bad['movements'][0]['controls'][0]['max'] = float('inf')
            with self.assertRaises(ValueError, msg='Non-finite metadata ' + field):
                builder.validate_practice(bad, data['records'], data['sources'], data['lessons'])
        bad = copy.deepcopy(data['practice'])
        bad['movements'][0]['id'] = bad['movements'][1]['id']
        with self.assertRaises(ValueError):
            builder.validate_practice(bad, data['records'], data['sources'], data['lessons'])

    def test_full_behavioral_output_oracles(self):
        result = subprocess.run(['node', 'web/practice.test.mjs'], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_static_originals_are_fresh(self):
        result = subprocess.run(['node', 'web/build-studies.mjs', '--check'], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

if __name__ == '__main__':
    unittest.main()
