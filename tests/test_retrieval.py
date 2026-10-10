import importlib.util
import json
from pathlib import Path
import shutil
import os
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRATCH = ROOT / '.work' / 'test-install'
SCRATCH.mkdir(parents=True, exist_ok=True)
def load(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

query = load('atlas_query', 'search/query.py')
installer = load('atlas_installer', 'scripts/install.py')
validator = load('atlas_validator', 'scripts/validate.py')

class RetrievalTests(unittest.TestCase):
    def test_turkish_and_english_identity(self):
        for phrase in ('İsviçre stili', 'Swiss Style', 'International Typographic Style'):
            self.assertEqual(query.search(phrase)['results'][0]['id'], 'swiss-style')

    def test_cli_turkish_output_on_windows_legacy_encoding(self):
        environment = dict(os.environ, PYTHONIOENCODING='cp1252')
        result = subprocess.run([sys.executable, str(ROOT / 'search/query.py'), 'sürrealizm',
                                 '--type', 'movement', '--asset', 'cover', '-n', '1', '--json'],
                                capture_output=True, env=environment, check=True)
        self.assertEqual(json.loads(result.stdout.decode('utf-8'))['results'][0]['id'], 'surrealism')

    def test_school_technique_collective_are_distinct(self):
        for phrase, kind, expected in [('Bauhaus', 'school', 'bauhaus'), ('fotomontaj', 'technique', 'photomontage'), ('Memphis', 'collective', 'memphis')]:
            self.assertEqual(query.search(phrase, kind)['results'][0]['id'], expected)
        self.assertEqual(query.search('Bauhaus', 'technique')['count'], 0)

    def test_unknown_query_and_filter(self):
        self.assertEqual(query.search('zxqv987655')['status'], 'no_match')
        with self.assertRaises(ValueError):
            query.search('kapak', asset='invalid-asset')

    def test_cover_filter_and_source_status(self):
        result = query.search('sürrealizm', 'movement', 'cover')
        self.assertEqual(result['results'][0]['id'], 'surrealism')
        self.assertEqual(result['results'][0]['production_test_status'], 'not_run')

    def test_regional_pattern_does_not_conflate_calligraphy(self):
        result = query.search('İslami desen', 'art_tradition')
        self.assertEqual(result['results'][0]['id'], 'islamic-geometric-pattern')
        self.assertNotEqual(result['results'][0]['id'], 'calligraphy-in-islamic-art')

    def test_import_contract_and_links(self):
        self.assertEqual(validator.validate(), [])

    def test_standalone_install_survives_relocation(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            dest = Path(temp) / 'skills'
            installer.install(dest, ['design-taste'])
            relocated = Path(temp) / 'elsewhere'
            shutil.copytree(dest / 'design-taste', relocated)
            isolated = load('isolated_query', relocated / 'bundle/search/query.py')
            self.assertEqual(isolated.search('fotomontaj')['results'][0]['id'], 'photomontage')
            for path in relocated.rglob('*.md'):
                import re
                for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', path.read_text(encoding='utf-8')):
                    if not target.startswith(('http:', 'https:', '#')):
                        self.assertTrue((path.parent / target).exists(), (path, target))

    def test_existing_install_refused_then_backup_and_memory_preserved(self):
        with tempfile.TemporaryDirectory(dir=SCRATCH) as temp:
            dest = Path(temp) / 'skills'
            installer.install(dest, ['design-taste'])
            memory = dest / 'design-taste/memory/evidence.json'
            memory.parent.mkdir()
            memory.write_text('{"preference":"explicit"}', encoding='utf-8')
            with self.assertRaises(RuntimeError):
                installer.install(dest, ['design-taste'])
            result = installer.install(dest, ['design-taste'], update=True)
            self.assertEqual(memory.read_text(encoding='utf-8'), '{"preference":"explicit"}')
            self.assertEqual((Path(result['backup']) / 'design-taste/memory/evidence.json').read_text(), memory.read_text())

if __name__ == '__main__':
    unittest.main()
