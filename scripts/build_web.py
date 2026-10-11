"""Deterministic static projection; canonical knowledge/curriculum remain authoritative."""
import argparse
import hashlib
import html
import json
import math
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

def project(root):
    records = json.loads((root / 'knowledge/records.json').read_text(encoding='utf-8'))
    sources = json.loads((root / 'knowledge/sources.json').read_text(encoding='utf-8'))
    lessons = []
    for path in sorted((root / 'curriculum/exercises').glob('*.md')):
        text = path.read_text(encoding='utf-8')
        n = int(path.stem)
        lessons.append({'id': path.stem, 'title': text.splitlines()[0].removeprefix('## '), 'level': ['Foundations','Applied Practice','Synthesis'][(n-1)//4], 'markdown': text, 'source_ids': sorted(set(re.findall(r'\[(S\d+):', text)))})
    studio = json.loads((root / 'curriculum/studio.json').read_text(encoding='utf-8'))
    validate_studio(studio, records, sources, lessons)
    practice = json.loads((root / 'curriculum/practice.json').read_text(encoding='utf-8'))
    validate_practice(practice, records, sources, lessons)
    canonical = [*sorted((root / 'knowledge').glob('*.json')), *sorted((root / 'curriculum').rglob('*.md')), root / 'curriculum/studio.json', root / 'curriculum/practice.json']
    digest = hashlib.sha256()
    for path in canonical:
        digest.update(path.relative_to(root).as_posix().encode())
        digest.update(path.read_bytes())
    return {'studio': studio, 'practice': practice, 'records': records, 'sources': sources, 'lessons': lessons, 'assessment': (root/'curriculum/assessment/critique.md').read_text(encoding='utf-8'), 'learning_path': (root/'curriculum/learning-paths/foundations-to-portfolio.md').read_text(encoding='utf-8'), 'canonical_sha256': digest.hexdigest()}

def validate_studio(s, records, sources, lessons):
    def require(condition):
        if not condition: raise ValueError('Invalid original studio specification')
    require(isinstance(s,dict) and set(s) == {'version','reference','asset','ownership','limits','sources','movement','exercises','palette','backgrounds','objects','regions'})
    for k in ['ownership','limits']: require(isinstance(s[k],str) and 0 < len(s[k]) <= 2000)
    for k in ['sources','exercises','palette','backgrounds','objects','regions']: require(isinstance(s[k],list) and 0 < len(s[k]) <= 20)
    require(all(isinstance(x,str) for x in s['sources']) and len(set(s['sources'])) == len(s['sources']))
    for key, fields in [('exercises',{'id','lesson','teaching'}),('objects',{'id','shape','x','y','scale','fill','visible'}),('regions',{'id','label','rect','explanation'})]:
        require(all(isinstance(x,dict) and set(x) == fields for x in s[key]))
    require(s['version'] == 1 and type(s['version']) is int and s['reference'] == 'original-still-life' and s['asset'] == 'reference.svg')
    require(s['ownership'] and s['limits'] and s['movement'] in {r['id'] for r in records})
    require(set(s['sources']) <= {x['id'] for x in sources})
    require([e['id'] for e in s['exercises']] == ['composition', 'color', 'planes'])
    for e in s['exercises']: require(e['lesson'] in {x['id'] for x in lessons} and isinstance(e['teaching'], str) and 0 < len(e['teaching']) <= 2000)
    for c in s['palette'] + s['backgrounds']: require(isinstance(c,str) and re.fullmatch(r'#[0-9a-f]{6}',c))
    require([o['id'] for o in s['objects']] == ['vessel','arch','sphere','fold'])
    for o in s['objects']:
        require(o['shape'] == o['id'] and o['fill'] in s['palette'] and type(o['visible']) is bool)
        for k,lo,hi in [('x',0,1),('y',0,1),('scale',.25,1.5)]: require(type(o[k]) in (int,float) and lo <= o[k] <= hi)
    require([r['id'] for r in s['regions']] == ['vessel','arch','sphere','fold','space'])
    for r in s['regions']:
        require(all(isinstance(r[k],str) and 0 < len(r[k]) <= 2000 for k in ['label','explanation']) and isinstance(r['rect'],list) and len(r['rect']) == 4)
        require(all(type(v) in (int,float) and 0 <= v <= 1 for v in r['rect']))
        require(r['rect'][0]+r['rect'][2] <= 1 and r['rect'][1]+r['rect'][3] <= 1)

def validate_practice(p, records, sources, lessons):
    def require(condition):
        if not condition:
            raise ValueError('Invalid full original practice specification')
    def text(value, maximum=4000):
        return isinstance(value, str) and 0 < len(value) <= maximum
    def shape(value, fields):
        require(isinstance(value, dict) and set(value) == set(fields.split()))
    shape(p, 'version ownership reference lessons movements')
    require(type(p['version']) is int and p['version'] == 2 and p['reference'] == 'original-still-life' and text(p['ownership']))
    require(isinstance(p['lessons'], list) and len(p['lessons']) == 12 and isinstance(p['movements'], list) and len(p['movements']) == 13)
    for lesson in p['lessons']:
        shape(lesson, 'id engine title concept task formats limitations')
        require(all(text(value) for value in lesson.values()))
    require([e['id'] for e in p['lessons']] == [e['id'] for e in lessons])
    movement_ids = {r['id'] for r in records if r['record_type'] == 'movement'}
    for movement in p['movements']:
        shape(movement, 'id engine title teaching limits controls regions contextEvidence')
        require(all(text(movement[k]) for k in ['id', 'engine', 'title', 'teaching', 'limits']))
        require(movement['id'] in movement_ids)
        require(isinstance(movement['controls'], list) and 2 <= len(movement['controls']) <= 5)
        control_keys = []
        for control in movement['controls']:
            require(isinstance(control, dict) and isinstance(control.get('type'), str))
            if control['type'] == 'number':
                shape(control, 'key label type min max step value')
                require(all(type(control[k]) in (int, float) and math.isfinite(control[k]) for k in ['min', 'max', 'step', 'value']))
                require(control['min'] <= control['value'] <= control['max'] and 0 < control['step'] <= 100)
            elif control['type'] in ('text', 'boolean'):
                shape(control, 'key label type value')
                require(text(control['value'], 160) if control['type'] == 'text' else type(control['value']) is bool)
            else:
                require(False)
            require(text(control['key'], 50) and text(control['label']) and re.fullmatch(r'[a-z][A-Za-z]*', control['key']))
            control_keys.append(control['key'])
        require(len(set(control_keys)) == len(control_keys))
        require(isinstance(movement['regions'], list) and len(movement['regions']) == 3)
        for region in movement['regions']:
            shape(region, 'id label explanation')
            require(all(text(value) for value in region.values()))
        require([r['id'] for r in movement['regions']] == ['structure', 'message', 'relationship'])
        evidence = movement['contextEvidence']
        if evidence is not None:
            shape(evidence, 'source page maker medium locator accessed status limits')
            require(all(text(value) for value in evidence.values()))
            source = next((s for s in sources if s['id'] == evidence['source']), None)
            require(source is not None and evidence['page'] == source['url'])
            require(evidence['status'] == 'writer-inspected-named-passage-not-canonical-review')
    require({m['id'] for m in p['movements']} == movement_ids and len({m['engine'] for m in p['movements']}) == 13)
    require(next(m for m in p['movements'] if m['id'] == 'harlem-renaissance')['contextEvidence'] is not None)

def practice_host(p, kind, identifier, readonly=False):
    entry = next(e for e in p['lessons' if kind == 'lesson' else 'movements'] if e['id'] == identifier)
    description = entry['task' if kind == 'lesson' else 'teaching']
    original = '<figure><img src="reference.svg" width="960" height="640" alt="Unchanged original project-owned still life"><figcaption>Unchanged original / not historical artwork</figcaption></figure>'
    study = f'<figure><img src="art/studies/{identifier}.svg" width="600" height="600" alt="Original contemporary {html.escape(entry["title"], quote=True)} interpretation"><figcaption>Distinct original reinterpretation / not a named historical replica</figcaption></figure>' if kind == 'movement' else ''
    annotations = '<ol>' + ''.join(f'<li>{html.escape(r["label"])}: {html.escape(r["explanation"])}</li>' for r in entry.get('regions', [])) + '</ol>'
    return f'<div class="practice-host" data-kind="{kind}" data-id="{identifier}" data-readonly="{str(readonly).lower()}"><h3>{html.escape(entry["title"])}</h3><div class="static-reference-pair">{original}{study}</div><p>{html.escape(description)}</p>{annotations}<p>{html.escape(entry.get("limitations", entry.get("limits", "")))}</p><a class="button" href="lab.html?{("movement" if kind == "movement" else "lesson")}={identifier}#full-practice">Open the matching editable Lab practice →</a><p>JavaScript enables original practice controls. References, source links and canonical contracts remain readable without it. No mastery or production completion is implied.</p></div>'

def studio_host(s, exercise, readonly=False):
    e=next(e for e in s['exercises'] if e['id']==exercise)
    return f'<div class="studio-host" data-exercise="{exercise}" data-readonly="{str(readonly).lower()}"><h3>Original practice / {exercise}</h3><p>{html.escape(e["teaching"])}</p><figure><img src="reference.svg" width="960" height="640" alt="Project-authored original still life, unchanged reference"><figcaption>{html.escape(s["ownership"])}</figcaption></figure><p>{html.escape(s["limits"])}</p><p class="studio-loading">Interactive controls require JavaScript. Read the original reference and lesson contract without it.</p></div>'

def link(url):
    if url.startswith(('https://','http://')):
        return url
    if 'atlas/' in url:
        return 'atlas.html#'+Path(url).stem
    if re.fullmatch(r'\d{2}\.md',url):
        return 'academy.html#lesson-'+Path(url).stem
    if 'assessment/' in url:
        return 'academy.html#assessment'
    if 'examples/' in url:
        return 'index.html#original-cover'
    if 'workflows/' in url:
        return '../workflows/'+Path(url).name
    return None

def inline(text):
    text = html.escape(text)
    def replace(m):
        target = link(html.unescape(m[2]))
        return '<a href="'+html.escape(target,quote=True)+'">'+m[1]+'</a>' if target else m[1]
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',replace,text)
    text = re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',text)
    return text

def markdown(text):
    out=[]
    for line in text.splitlines():
        if not line.strip(): continue
        m=re.match(r'^(#{1,6}) (.*)',line)
        if m:
            level=max(2,min(4,len(m[1])))
            out.append(f'<h{level}>{inline(m[2])}</h{level}>')
        else: out.append('<p>'+inline(line)+'</p>')
    return '\n'.join(out)

def shell(title,body,page):
    if page != 'index.html':
        body = body.replace('<section class="page-intro">', '<section class="page-intro"><figure class="intro-print"><img src="art/registration-strip.svg" width="1200" height="260" alt="Original Design Taste registration study: sighting, overlapping ink plates and sequential fields."><figcaption>Original studio graphics / not historical artwork</figcaption></figure>', 1)
    nav=''.join(f'<a href="{p}"'+(' aria-current="page"' if p==page else '')+f'>{name}</a>' for p,name in [('index.html','Home'),('academy.html','Academy'),('atlas.html','Atlas'),('lab.html','Lab')])
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="A source-grounded studio for learning visual communication through observation, experiments and revision."><title>{title} · Design Taste</title><link rel="stylesheet" href="style.css"></head><body class="page-{page.removesuffix('.html')}"><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="index.html"><span class="mark" aria-hidden="true"></span>Design Taste<span class="brand-note">A learning studio</span></a><nav aria-label="Main">{nav}</nav></header><main id="main"><aside class="note" aria-label="Preview status"><strong>Public preview</strong><p>Lessons are in development. Audio pause and export-evidence limitations remain. <a href="RELEASE-NOTES.md">Read known limitations before using audio or relying on exports.</a></p></aside>{body}</main><footer><strong>Observe. Make. Revise.</strong><p>Original educational work. Source review, rights, software checks and human acceptance are separate. No degree, affiliation or mastery claim.</p><nav aria-label="Further reading"><a href="academy.html#assessment">How to critique</a><a href="atlas.html#sources">Source ledger</a><a href="lab.html#privacy">Local image privacy</a></nav></footer><script type="module" src="app.mjs"></script></body></html>'''

def source_html(s):
    reviews=''.join('<div class="review"><strong>'+html.escape(r['id'])+' · '+html.escape(r['outcome'])+'</strong><p>'+html.escape(r['claim'])+'</p><p>Locator: '+html.escape(r['locator'])+'</p><p>'+html.escape(r['limits'])+'</p></div>' for r in s.get('claim_reviews',[]))
    return f'<details id="{s["id"]}" class="source"><summary>{s["id"]} · {html.escape(s["title"])}</summary><a href="{html.escape(s["url"],quote=True)}">Open actual source ↗</a><p>Verification: {html.escape(s["verification"])}</p><p>{html.escape(s.get("import_note","Independent claim-level research; scope below."))}</p><p>Text rights: {html.escape(s["text_rights"])} · Image rights: {html.escape(s["image_rights"])}</p>{reviews}</details>'

def outputs(root):
    data=project(root); R=data['records']; S=data['sources']; L=data['lessons']
    count=f'{len(R)} records · {len(S)} source entries · {len(L)} study modules'
    home=f'''<section class="hero"><div><p class="eyebrow">An independent visual education</p><h1>Taste is a practice.<br><em>Not a preset.</em></h1><p class="lead">Learn to notice how images work. Make a deliberate change. Keep the evidence. Develop your own reasons.</p><a class="button primary" href="academy.html#lesson-01">Begin with observation ↗</a><p class="small">{count}. No account. No universal style ranking.</p></div><figure class="hero-art"><img src="reference.svg" width="960" height="640" alt="Original geometric still life: orange vessel, blue arch, cream sphere, dark angular shape and a striped tabletop."><figcaption>01 / The same scene. Many ways to see.</figcaption></figure></section><section><div class="section-head"><p class="eyebrow">The studio loop</p><h2>Read a little. Look closely. Try something.</h2></div><div class="cards"><a class="card" href="academy.html"><span class="index">01 / Academy</span><h3>Build your eye</h3><p>Twelve complete exercise contracts, from perception and typography to editorial systems and critique.</p><span>Explore the learning path →</span></a><a class="card" href="atlas.html"><span class="index">02 / Atlas</span><h3>Know the context</h3><p>Movements, schools, techniques and traditions stay distinct. Find the source and the limits of each claim.</p><span>Browse the source-grounded atlas →</span></a><a class="card" href="lab.html"><span class="index">03 / Lab</span><h3>Make a comparison</h3><p>Original-only teaching and editable practice across twelve lesson scopes and thirteen distinct movement constructions. Six pixel operations and five legacy raster studies remain separate; production and human gates are not implied.</p><span>Open the working studio →</span></a></div></section><section id="original-cover" class="cover-section"><figure><img loading="lazy" src="cover.png" width="300" height="400" alt="Original Design Taste learning guide cover: large black typography above an open geometric revision field."></figure><div><p class="eyebrow">Original project evidence / not a quality guarantee</p><h2>A cover with its decisions left visible.</h2><p>The Revision Field direction uses repeated geometry and a corrected boundary as a metaphor for observation and revision. This is an authored interpretation, not a tested reader response.</p><a href="../examples/learning-guide-cover/README.md">Read the original process and limits ↗</a><p>Editable SVG and flat previews exist. Native Adobe proof and human acceptance remain unverified.</p></div></section>'''
    academy='<section class="page-intro"><p class="eyebrow">Academy / read → make → recheck</p><h1>Learn by keeping<br><em>the before and after.</em></h1><p class="lead">A self-directed curriculum, not a degree. Prerequisites refer to retained evidence, not time served. Reading a lesson does not complete its production exercise.</p></section><nav class="subnav" aria-label="Learning levels"><a href="#foundations">Foundations / 01–04</a><a href="#applied-practice">Applied Practice / 05–08</a><a href="#synthesis">Synthesis / 09–12</a></nav>'
    advice={ 'Foundations':'Start with visible relationships, then compare color and reading order. A numerical color value is not perceived appearance. Typography requires exact copy and actual glyph checks. Historical context is not a visual preset.', 'Applied Practice':'Connect a visible decision to a communication goal. Original SVG layers, identity specimens, format series and publication pages are independently editable. Keep source ownership, downloaded-artifact checks, print/native and human gates separate.', 'Synthesis':'Treat sequence, rhythm and captions as narrative decisions. Original browser timelines play, pause and scrub; static alternatives and actual frame/timing sources are available. Encoded video, recorded speech alignment, native operation and human acceptance remain distinct gates, never inferred from source artifacts.' }
    for level in advice:
        academy+=f'<section class="level-section" id="{level.lower().replace(" ","-")}"><div class="section-head"><div class="level-print" aria-hidden="true"></div><p class="eyebrow">{level}</p><h2>{level}</h2><p>{advice[level]}</p></div><div class="lesson-list">'
        for lesson in L:
            if lesson['level']!=level: continue
            exercise_html = studio_host(data['studio'], 'composition' if lesson['id']=='01' else 'color') if lesson['id'] in ('01','02') else practice_host(data['practice'], 'lesson', lesson['id'])
            academy+=f'<details class="lesson" id="lesson-{lesson["id"]}"><summary><span class="index">{lesson["id"]}</span><span>{html.escape(lesson["title"].split(". ",1)[1])}</span><span class="open-label">Read lesson +</span></summary><article class="prose">{exercise_html}{markdown(lesson["markdown"])}<div class="note"><h3>Transfer your evidence, not just a link</h3><p>Download/import the matching original project to carry edits between Academy and Lab. Required-size artifacts, source/rights, native and human gates remain separate.</p><a class="button" href="lab.html?lesson={lesson["id"]}#full-practice">Take this practice into Lab →</a><a href="academy.html#lesson-{lesson["id"]}">Link to this lesson</a></div></article></details>'
        academy+='</div></section>'
    academy+='<section id="assessment" class="prose">'+markdown(data['assessment'])+'</section>'
    kinds=sorted({r['record_type'] for r in R}); assets=sorted({a for r in R for a in r['assets']})
    atlas=f'<section class="page-intro"><p class="eyebrow">Atlas / context before adaptation</p><h1>References, with<br><em>their limits intact.</em></h1><p class="lead">{count}. This is a bounded collection, not all art history. Imported seeds retain needs-source-review. Named passage reviews do not verify an entire source or grant reuse rights.</p></section><form class="filters" role="search"><label>Search records<input id="search" type="search" placeholder="Try color, hierarchy, or a name"></label><label>Record kind<select id="kind"><option value="">All kinds</option>'+''.join(f'<option value="{k}">{k.replace("_"," ")}</option>' for k in kinds)+'</select></label><label>Suggested asset<select id="asset"><option value="">All assets</option>'+''.join(f'<option>{a}</option>' for a in assets)+'</select></label><button type="reset">Clear filters</button></form><p id="results-count" aria-live="polite"></p><p class="small">Asset labels describe contemporary suggested applications, not historical definitions.</p><div id="records" class="record-list">'
    for r in R:
        search=html.escape(json.dumps(r,ensure_ascii=False).lower(),quote=True)
        study_html = practice_host(data['practice'], 'movement', r['id'], True) if r['record_type'] == 'movement' else ''
        study_html += studio_host(data['studio'], 'planes', True) if r['id'] == 'de-stijl' else ''
        atlas+=f'<details class="record" id="{r["id"]}" data-kind="{r["record_type"]}" data-assets="{html.escape(" ".join(r["assets"]),quote=True)}" data-search="{search}"><summary><span class="index">{r["record_type"].replace("_"," ")}</span><span>{html.escape(r["title_en"])}</span><span class="open-label">Explore +</span></summary><article class="prose">{study_html}<p class="status">Claim status: {html.escape(r["review_status"])} · Production: {html.escape(r["production_test_status"])}</p>'
        for field,title in [('historical_context','Historical context'),('visual_principles','Observable principles'),('contemporary_application','Contemporary proposal'),('exercise','Exercise'),('limits','Limits')]:
            atlas+=f'<h3>{title}</h3><p>{html.escape(r[field])}</p>'
        atlas+='<p>Chronology: '+html.escape(json.dumps(r['chronology']))+'</p><p>Rights: '+html.escape(json.dumps(r['rights']))+'</p><h3>Actual source entries</h3>'+''.join(f'<a class="source-link" href="#{sid}">{sid} · {html.escape(next(s["title"] for s in S if s["id"]==sid))}</a>' for sid in r['source_ids'])+f'<p>{html.escape(r["filter_note"])}</p>'
        atlas+=(f'<a href="lab.html?study={r["id"]}#movement-studies">Compare or read this movement study in Lab →</a>' if r['record_type']=='movement' else '<a href="lab.html">Try a technical comparison in Lab →</a>')+'</article></details>'
    atlas+='</div><p id="empty" hidden>No matching records. Clear filters or try a broader term.</p><section id="sources"><div class="section-head"><h2>Source ledger</h2><p>All canonical source entries, including curriculum and method references. Links open external sites only when you choose them; availability and rights remain source-specific.</p></div>'+''.join(source_html(s) for s in S)+'</section>'
    lab=(root/'web/lab-body.html').read_text(encoding='utf-8')
    home = home.replace('<figure class="hero-art">', '<figure class="hero-art"><img class="press-sheet" src="art/press-sheet.svg" width="800" height="920" alt="Original print-workshop collage of cut-paper fields, displaced blue and rust impressions, and registration crosses."><figcaption class="print-credit">Original studio composition / not historical artwork</figcaption><div class="reference-inset">', 1).replace('<figcaption>01 / The same scene. Many ways to see.</figcaption></figure>', '<figcaption>The Lab reference / the same scene, many ways to see.</figcaption></div></figure>', 1)
    return {'data.json':json.dumps(data,ensure_ascii=False,sort_keys=True,indent=2)+'\n','index.html':shell('Home',home,'index.html'),'academy.html':shell('Academy',academy,'academy.html'),'atlas.html':shell('Atlas',atlas,'atlas.html'),'lab.html':shell('Lab',lab,'lab.html'),'cover.png':(root/'examples/learning-guide-cover/concept-a-revision-field-300.png').read_bytes()}

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--check',action='store_true'); args=parser.parse_args()
    result=outputs(ROOT); stale=[]
    for name,content in result.items():
        target=ROOT/'web'/name; content=content if isinstance(content,bytes) else content.encode()
        if args.check:
            if not target.exists() or target.read_bytes()!=content: stale.append(name)
        else: target.parent.mkdir(parents=True,exist_ok=True); target.write_bytes(content)
    if stale: raise SystemExit('Stale web projection: '+', '.join(stale)+'; run python3 scripts/build_web.py')
    data=project(ROOT)
    print(('Fresh' if args.check else 'Built')+f' deterministic web projection: {len(data["records"])} records / {len(data["sources"])} sources / {len(data["lessons"])} lessons; '+data['canonical_sha256'])

if __name__=='__main__': main()
