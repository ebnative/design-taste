import assert from 'node:assert/strict';
import {transform, study, effects, studies, validateFile, fitSize} from './transforms.mjs';
const w=12,h=10,input=new Uint8ClampedArray(w*h*4);
for(let i=0;i<input.length;i+=4){input[i]=(i*7)%256;input[i+1]=(i*3+60)%256;input[i+2]=(i*11+100)%256;input[i+3]=255;}
const saved=new Uint8ClampedArray(input);
for(const effect of effects){const out=transform(input,w,h,effect,50); assert.equal(out.length,input.length); assert.notDeepEqual(out,input,effect); assert.deepEqual(out,transform(input,w,h,effect,50)); for(let i=3;i<out.length;i+=4)assert.equal(out[i],255);}
assert.deepEqual(input,saved,'input must remain unchanged');
assert.deepEqual([...transform(new Uint8ClampedArray([255,0,0,255]),1,1,'grayscale',50)],[54,54,54,255]);
assert.deepEqual([...transform(new Uint8ClampedArray([100,100,100,255]),1,1,'threshold',50)],[0,0,0,255]);
for(const id of studies){const out=study(input,w,h,id);assert.notDeepEqual(out,input,id);assert.deepEqual(out,study(input,w,h,id));}
assert.throws(()=>transform(input,w,h,'surrealism',50));assert.throws(()=>study(input,w,h,'dada'));
assert.throws(()=>transform(input,0,h,'grayscale',50));assert.throws(()=>transform(input,w,h,'posterization',NaN));
assert.equal(validateFile({type:'image/png',size:100}),null);
assert.match(validateFile({type:'image/svg+xml',size:100}),/PNG/);
assert.match(validateFile({type:'image/png',size:21*1024*1024}),/20 MB/);
assert.deepEqual(fitSize(2400,1200),[960,480]);assert.deepEqual(fitSize(400,300),[400,300]);assert.throws(()=>fitSize(20000,20000));
await import('./repair.test.mjs');
const studio = await import('./studio.mjs');
const fs = await import('node:fs');
const spec = JSON.parse(fs.readFileSync(new URL('../curriculum/studio.json', import.meta.url),'utf8'));
const initial = studio.createState(spec,'composition');
assert.equal(initial.width,600); assert.equal(initial.height,600);
assert.equal(initial.objects.length,4);
const moved = studio.editObject(initial,'vessel',{x:0.25,scale:0.8});
assert.equal(initial.objects[0].x,0.15); assert.equal(moved.objects[0].x,0.25);
const svg = studio.sceneSVG(moved);
assert.match(svg,/width="600" height="600"/); assert.match(svg,/translate\(150 312\) scale\(0.8\)/);
assert.match(svg,/<rect/); assert.doesNotMatch(svg,/http[^:]*:\/\/(?!www.w3.org)|script|foreignObject|image href/);
const timeline = studio.history(initial); timeline.commit(moved); assert.deepEqual(timeline.undo(),initial); assert.deepEqual(timeline.redo(),moved);
timeline.undo(); timeline.commit(studio.editObject(initial,'sphere',{visible:false})); assert.equal(timeline.canRedo,false);
for(let i=0;i<40;i++)timeline.commit(studio.editObject(initial,'vessel',{x:i/100})); assert.ok(timeline.length<=30);
const evidence = studio.createState(spec,'color');
for(let i=0;i<6;i++){evidence.variants[i]=studio.colorVariant(evidence,i); assert.equal(evidence.variants[i].inner,'#808080');}
const changed = studio.reviseBackground(evidence,2,'#a34120');
assert.deepEqual(changed.variants.slice(0,2),evidence.variants.slice(0,2)); assert.deepEqual(changed.variants.slice(3),evidence.variants.slice(3)); assert.equal(changed.variants[2].inner,'#808080');
assert.match(studio.patchSVG(changed.variants[2]),/x="200" y="200" width="200" height="200" fill="#808080"/);
assert.deepEqual(studio.importState(studio.serialize(moved),spec),moved);
for(const mutate of [s=>s.version=2,s=>s.objects[0].x=Infinity,s=>s.objects[0].id='evil',s=>s.objects[0].fill='url(https://evil)',s=>s.objects.push(s.objects[0]),s=>s.reference='https://evil',s=>s.width=999999,s=>s.notes=[{region:'missing',kind:'observation',text:'x'}]]){const bad=structuredClone(initial);mutate(bad);assert.throws(()=>studio.validateState(bad,spec));}
for(const raw of ['null','[]','{}','{', ' '.repeat(200001)])assert.throws(()=>studio.importState(raw,spec));
assert.equal(studio.evidenceReady(initial),false);
const full=structuredClone(moved);full.layouts=[{objects:initial.objects,background:initial.background},{objects:moved.objects,background:moved.background},{objects:studio.editObject(moved,'sphere',{x:.5}).objects,background:moved.background}];full.notes=spec.regions.map(r=>({region:r.id,kind:'observation',text:'Visible gap differs.'}));full.revision='Changed vessel spacing';full.recheck='Compared same dimensions';full.inspected150=true;assert.equal(studio.evidenceReady(full),true);assert.deepEqual(studio.importState(studio.serialize(full),spec),full);
const colors=structuredClone(changed);colors.variantBefore=structuredClone(evidence.variants);colors.prediction='The dark surround may look lighter';colors.observation='no difference';colors.revision='Changed third surround';colors.recheck='No difference at equal dimensions';assert.equal(studio.evidenceReady(colors),true);colors.variants=structuredClone(colors.variantBefore);assert.equal(studio.evidenceReady(colors),false);
assert.equal(studio.sceneSVG(initial,150).includes('width="150" height="150"'),true);
console.log('PASS: studio independent coordinate/patch SVG oracles, immutable edits, bounded exact history, invariant RGB, atomic import rejection');
console.log(`PASS: ${effects.length} pixel operations, ${studies.length} studies, exact pixel oracles, immutability, deterministic repeat, malformed inputs, file admission and resolution bounds`);
