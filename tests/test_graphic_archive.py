"""Private graphic outputs, source linkage and safe media handling."""
import copy
import json
from pathlib import Path
import tempfile
import subprocess
import sys
import unittest

from scripts.build_graphic_archive import ROOT, build, safe_file, validate
from search.query import search


class GraphicArchiveTests(unittest.TestCase):
    def setUp(self):
        self.studies = json.loads((ROOT / 'archive/graphic-studies.json').read_text())['studies']
        self.cards = json.loads((ROOT / 'archive/cards.json').read_text())

    def test_source_linkage_and_execution_boundary(self):
        validate(self.studies, self.cards)
        changed = copy.deepcopy(self.studies)
        changed[0]['source_url'] = 'https://x.com/unrelated/status/1'
        with self.assertRaises(ValueError):
            validate(changed, self.cards)
        changed = copy.deepcopy(self.studies)
        changed[0]['recipe']['status'] = 'executed-verified'
        with self.assertRaises(ValueError):
            validate(changed, self.cards)
        for phrase, expected in [('GD-012', 'GD-012'), ('Physalia', 'GD-004'), ('torn crease paper', 'GD-006')]:
            self.assertIn(expected, [r['id'] for r in search(phrase, archive=True, limit=10)['results']])

    def test_private_media_escape_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / 'valid.jpg').write_bytes(b'\xff\xd8\xfftest')
            self.assertEqual(safe_file(root, 'valid.jpg'), (root / 'valid.jpg').resolve())
            for value in ('../escape.jpg', '/escape.jpg', 'a\\b.jpg'):
                with self.assertRaises(ValueError):
                    safe_file(root, value)
            (root / 'escape').symlink_to(ROOT / 'README.md')
            with self.assertRaises(ValueError):
                safe_file(root, 'escape')

    def test_builder_requires_actual_media_and_preserves_trials(self):
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            captures, output = base / 'captures', base / 'output'
            captures.mkdir()
            rows = []
            for study in self.studies:
                name = study['id'] + '.jpg'
                (captures / name).write_bytes(b'\xff\xd8\xfffixture')
                rows.append(dict(id=study['id'], file=name, kind='browser-capture'))
            manifest = base / 'media.json'
            manifest.write_text(json.dumps(rows))
            result = build(output, captures, manifest)
            self.assertEqual(result['studies'], len(self.studies))
            sentinel = output / 'retained-trial.svg'
            sentinel.write_text('retained')
            build(output, captures, manifest)
            self.assertEqual(sentinel.read_text(), 'retained')
            self.assertTrue((output / 'studies/GD-012/RECIPE.md').is_file())
            manifest.write_text(json.dumps(rows[:-1]))
            with self.assertRaises(ValueError):
                build(output, captures, manifest)
            self.assertEqual(sentinel.read_text(), 'retained')
            with self.assertRaises(ValueError):
                build(ROOT / '.work/unsafe-graphic', captures, manifest)

    def test_generated_notes_escape_untrusted_text(self):
        from scripts.build_graphic_archive import e, selection_prompt
        self.assertEqual(e('<script>"'), '&lt;script&gt;&quot;')
        prompt = selection_prompt(self.studies[-1])
        self.assertIn('GD-012', prompt)
        self.assertIn('Human acceptance remains pending', prompt)

    def test_relocated_skill_can_build_private_library(self):
        from scripts.install import install
        with tempfile.TemporaryDirectory() as temporary:
            base = Path(temporary)
            install(base / 'packages', ['graphic-design'])
            relocated = base / 'relocated'
            (base / 'packages/graphic-design').rename(relocated)
            captures = base / 'captures'
            captures.mkdir()
            rows = []
            for study in self.studies:
                name = study['id'] + '.jpg'
                (captures / name).write_bytes(b'\xff\xd8\xfffixture')
                rows.append(dict(id=study['id'], file=name, kind='browser-capture'))
            manifest = base / 'media.json'
            manifest.write_text(json.dumps(rows))
            result = subprocess.run([sys.executable, str(relocated / 'bundle/tools/build_graphic_archive.py'),
                                     '--dest', str(base / 'output'), '--captures', str(captures),
                                     '--media-manifest', str(manifest)], cwd=base, capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(json.loads(result.stdout)['studies'], len(self.studies))
            self.assertTrue((base / 'output/library.css').is_file())
