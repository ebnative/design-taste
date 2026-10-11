"""Projection, provenance and deterministic Lab regression tests."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]

class WebTests(unittest.TestCase):
    def builder(self):
        spec = importlib.util.spec_from_file_location('build_web', ROOT / 'scripts/build_web.py')
        assert spec is not None and spec.loader is not None
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module

    def test_projection_preserves_canonical_content(self):
        data = self.builder().project(ROOT)
        for key in ('records', 'sources'):
            self.assertEqual(data[key], json.loads((ROOT / 'knowledge' / (key + '.json')).read_text()))
        exercises = sorted((ROOT / 'curriculum/exercises').glob('*.md'))
        self.assertEqual(len(data['lessons']), len(exercises))
        self.assertEqual({x['level'] for x in data['lessons']}, {'Foundations', 'Applied Practice', 'Synthesis'})
        for lesson, source in zip(data['lessons'], exercises):
            self.assertEqual(lesson['markdown'], source.read_text())
            self.assertTrue(lesson['source_ids'])
            for section in ['Prerequisites', 'Objective', 'Deliverable', 'Observable criteria', 'Critique and revision', 'Retained evidence']:
                self.assertIn(section, lesson['markdown'])

    def test_projection_freshness(self):
        result = subprocess.run([sys.executable, 'scripts/build_web.py', '--check'], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_markdown_is_safe_and_links_are_local(self):
        render = self.builder().markdown
        html = render('<script>alert(1)</script> [bad](javascript:alert) [type](../../atlas/foundations/typography-hierarchy.md)')
        self.assertNotIn('<script>', html)
        self.assertNotIn('href="javascript:', html)
        self.assertIn('atlas.html#typography-hierarchy', html)

    def test_generated_routes_and_local_links(self):
        from html.parser import HTMLParser
        from urllib.parse import urlsplit, unquote
        class Links(HTMLParser):
            def __init__(self):
                super().__init__()
                self.urls = []
                self.ids = set()
            def handle_starttag(self, tag, attrs):
                attrs = dict(attrs)
                if 'id' in attrs:
                    self.assert_unique(attrs['id'])
                    self.ids.add(attrs['id'])
                for key in ('href', 'src'):
                    if key in attrs:
                        self.urls.append(attrs[key])
            def assert_unique(self, identifier):
                if identifier in self.ids:
                    raise AssertionError('Duplicate HTML id: ' + identifier)
        generated = self.builder().outputs(ROOT)
        pages = {}
        for name, text in generated.items():
            if name.endswith('.html'):
                parser = Links()
                parser.feed(text)
                pages[name] = parser
                self.assertIn('main', parser.ids)
                self.assertIn('Skip to content', text)
                self.assertIn('aria-current="page"', text)
        self.assertEqual(set(pages), {'index.html','academy.html','atlas.html','lab.html'})
        for name, parsed in pages.items():
            for url in parsed.urls:
                target = urlsplit(url)
                if target.scheme:
                    self.assertIn(target.scheme, ('https','http'))
                    continue
                path = unquote(target.path) or name
                self.assertTrue((ROOT / 'web' / path).exists(), (name,url))
                if target.fragment and path in pages:
                    self.assertIn(unquote(target.fragment), pages[path].ids, (name,url))
        self.assertEqual(generated, self.builder().outputs(ROOT), 'repeated builds must be byte deterministic')

    def test_lab_logic(self):
        result = subprocess.run(['node', 'web/logic.test.mjs'], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_original_studio_projection_and_visual_order(self):
        builder = self.builder()
        data = builder.project(ROOT)
        self.assertEqual([e['lesson'] for e in data['studio']['exercises']], ['01','02','04'])
        pages = builder.outputs(ROOT)
        self.assertIn('data-exercise="composition"', pages['academy.html'])
        self.assertIn('data-exercise="color"', pages['academy.html'])
        section = pages['atlas.html'].split('id="de-stijl"',1)[1].split('</details>',1)[0]
        self.assertLess(section.index('studio-host'), section.index('Claim status:'))
        self.assertIn('data-lab="true"', pages['lab.html'])
        for mutate in [lambda s: s.update(asset='https://unsafe'), lambda s: s['objects'][0].update(x=float('inf')), lambda s: s['objects'][1].update(id='vessel'), lambda s: s['regions'][0].update(rect=[.9,.9,.5,.5])]:
            import copy
            bad = copy.deepcopy(data['studio'])
            mutate(bad)
            with self.assertRaises(ValueError):
                builder.validate_studio(bad, data['records'], data['sources'], data['lessons'])

    def test_contrast(self):
        def luminance(h):
            values = [int(h[i:i+2], 16)/255 for i in (0,2,4)]
            values = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in values]
            return sum(v*w for v,w in zip(values, (.2126,.7152,.0722)))
        for fg in ['20251f','565c52','234d86','a34120']:
            for bg in ['f5f1e8','fffdf7']:
                ratio = (luminance(bg)+.05)/(luminance(fg)+.05)
                self.assertGreaterEqual(ratio, 4.5, (fg,bg,ratio))

if __name__ == '__main__':
    unittest.main()
