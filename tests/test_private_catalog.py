"""Private catalog output stays contained and preserves source boundaries."""
import json
from pathlib import Path
import tempfile
import unittest

from scripts.build_private_catalog import build, http_url, target


class PrivateCatalogTests(unittest.TestCase):
    def fixture(self, root):
        (root / 'archive').mkdir()
        card = {
            'id': 'WEB-001', 'title': '<script>unsafe</script>',
            'discipline': 'web', 'evidence_status': 'source-inspected',
            'source': {'url': 'javascript:alert(1)'},
            'intended_use': 'A reference', 'notes': 'Not verified',
        }
        (root / 'archive/cards.json').write_text(json.dumps([card]), encoding='utf-8')

    def test_offline_catalog_escapes_text_and_rejects_active_urls(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            result = build(base / 'private', '2026-10-20', root=repo)
            page = Path(result['output']).read_text(encoding='utf-8')
            self.assertIn('&lt;script&gt;unsafe&lt;/script&gt;', page)
            self.assertNotIn('javascript:alert', page)
            self.assertIn('default-src \'none\'', page)
            self.assertIn('No licensed code copy recorded.', page)
            self.assertEqual(http_url('https://example.org/'), 'https://example.org/')

    def test_capture_receipt_and_traversal_rejection(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            captures = base / 'captures'; captures.mkdir()
            # Signature-only fixture tests bounded copying, not image decoding.
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xfffixture')
            manifest = captures / 'captures.json'
            manifest.write_text(json.dumps([{'id': 'WEB-001', 'file': 'WEB-001.jpg'}]))
            result = build(base / 'private', '2026-10-20', captures, root=repo)
            destination = Path(result['output']).parent
            receipt = json.loads((destination / 'capture-receipts.json').read_text())
            self.assertEqual(len(receipt[0]['sha256']), 64)
            self.assertEqual((destination / 'screenshots/WEB-001.jpg').read_bytes(), b'\xff\xd8\xfffixture')
            original_page = Path(result['output']).read_bytes()
            original_receipts = (destination / 'capture-receipts.json').read_bytes()
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xffreplacement')
            manifest.write_text(json.dumps([
                {'id': 'WEB-001', 'file': 'WEB-001.jpg'},
                {'id': 'WEB-002', 'file': 'WEB-002.jpg'},
            ]))
            with self.assertRaises(ValueError):
                build(base / 'private', '2026-10-20', captures, root=repo)
            self.assertEqual((destination / 'screenshots/WEB-001.jpg').read_bytes(), b'\xff\xd8\xfffixture')
            self.assertEqual(Path(result['output']).read_bytes(), original_page)
            self.assertEqual((destination / 'capture-receipts.json').read_bytes(), original_receipts)
            manifest.write_text(json.dumps([{'id': 'WEB-001', 'file': '../outside.jpg'}]))
            with self.assertRaises(ValueError):
                build(base / 'private', '2026-10-20', captures, root=repo)
            with self.assertRaises(ValueError):
                target(base / 'private', '../outside')

    def test_private_destination_cannot_be_repository_or_ancestor(self):
        from scripts.build_private_catalog import ROOT
        for destination in (ROOT, ROOT / '.work/private', ROOT.parent):
            with self.assertRaises(ValueError):
                build(destination, '2026-10-20')

    def test_escaped_output_preserves_existing_capture(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            captures = base / 'captures'; captures.mkdir()
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xfforiginal')
            (captures / 'captures.json').write_text(json.dumps([{'id': 'WEB-001', 'file': 'WEB-001.jpg'}]))
            result = build(base / 'private', '2026-10-20', captures, root=repo)
            destination = Path(result['output']).parent
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xffreplacement')
            outside = base / 'outside.json'; outside.write_text('outside')
            (destination / 'catalog.json').unlink()
            (destination / 'catalog.json').symlink_to(outside)
            with self.assertRaises(ValueError):
                build(base / 'private', '2026-10-20', captures, root=repo)
            self.assertEqual((destination / 'screenshots/WEB-001.jpg').read_bytes(), b'\xff\xd8\xfforiginal')
            self.assertEqual(outside.read_text(), 'outside')

    def test_missing_local_source_receipt_is_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            cards_path = repo / 'archive/cards.json'
            cards = json.loads(cards_path.read_text())
            cards[0]['acquisition'] = {'code_url': 'https://github.com/example/source'}
            cards_path.write_text(json.dumps(cards))
            destination = base / 'private/inspiration/2026-10-20'
            (destination / 'licensed-source/example').mkdir(parents=True)
            (destination / 'source-receipts.json').write_text(json.dumps([{
                'repo': 'example/source', 'state': 'downloaded-not-executed',
                'relative_dir': 'licensed-source/example', 'sha': 'a' * 40, 'files': [],
            }]))
            with self.assertRaisesRegex(ValueError, 'Missing private source receipt'):
                build(base / 'private', '2026-10-20', root=repo)
            self.assertFalse((destination / 'index.html').exists())

    def test_existing_captures_cannot_be_silently_erased(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            captures = base / 'captures'; captures.mkdir()
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xfforiginal')
            (captures / 'captures.json').write_text(json.dumps([{'id': 'WEB-001', 'file': 'WEB-001.jpg'}]))
            result = build(base / 'private', '2026-10-20', captures, root=repo)
            destination = Path(result['output']).parent
            before = {name: (destination / name).read_bytes() for name in ('index.html', 'capture-receipts.json')}
            with self.assertRaisesRegex(ValueError, 'require --captures'):
                build(base / 'private', '2026-10-20', root=repo)
            for name, data in before.items():
                self.assertEqual((destination / name).read_bytes(), data)

    def test_capture_directory_target_preserves_previous_batch(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            captures = base / 'captures'; captures.mkdir()
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xfforiginal')
            manifest = captures / 'captures.json'
            manifest.write_text(json.dumps([{'id': 'WEB-001', 'file': 'WEB-001.jpg'}]))
            result = build(base / 'private', '2026-10-20', captures, root=repo)
            destination = Path(result['output']).parent
            before = (destination / 'capture-receipts.json').read_bytes()
            (destination / 'screenshots/WEB-002.jpg').mkdir()
            (captures / 'WEB-001.jpg').write_bytes(b'\xff\xd8\xffreplacement')
            (captures / 'WEB-002.jpg').write_bytes(b'\xff\xd8\xffsecond')
            manifest.write_text(json.dumps([
                {'id': 'WEB-001', 'file': 'WEB-001.jpg'},
                {'id': 'WEB-002', 'file': 'WEB-002.jpg'},
            ]))
            with self.assertRaisesRegex(ValueError, 'Capture outputs must be files'):
                build(base / 'private', '2026-10-20', captures, root=repo)
            self.assertEqual((destination / 'screenshots/WEB-001.jpg').read_bytes(), b'\xff\xd8\xfforiginal')
            self.assertEqual((destination / 'capture-receipts.json').read_bytes(), before)

    def test_private_playground_links_and_invalid_configuration(self):
        with tempfile.TemporaryDirectory() as temp:
            base = Path(temp)
            repo = base / 'repo'; repo.mkdir(); self.fixture(repo)
            destination = base / 'private/inspiration/2026-10-20'
            destination.mkdir(parents=True)
            config = destination / 'playground.json'
            valid = {'base_url': 'http://127.0.0.1:4317', 'samples': {'WEB-001': 'example'}}
            config.write_text(json.dumps(valid))
            result = build(base / 'private', '2026-10-20', root=repo)
            page = Path(result['output']).read_text()
            self.assertIn('http://127.0.0.1:4317/#/example/preview', page)
            self.assertIn('View / copy code', page)
            manifest = json.loads((destination / 'catalog.json').read_text())
            self.assertEqual(manifest[0]['playground']['files'], 'http://127.0.0.1:4317/#/example/files')
            for invalid in [None, {'base_url': 'https://example.org', 'samples': {}},
                            {'base_url': 'http://localhost:4317/path', 'samples': {}},
                            {'base_url': 'http://localhost:4317', 'samples': {'WEB-001': '../escape'}},
                            {'base_url': 'http://localhost:4317', 'samples': {'WEB-999': 'example'}}]:
                config.write_text(json.dumps(invalid))
                with self.assertRaises(ValueError):
                    build(base / 'private', '2026-10-20', root=repo)
                self.assertEqual(Path(result['output']).read_text(), page)
