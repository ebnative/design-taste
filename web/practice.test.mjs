import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as P from './practice.mjs';
import * as Pilot from './studio.mjs';
const meta=JSON.parse(fs.readFileSync(new URL('../curriculum/practice.json',import.meta.url)));
const data={records:JSON.parse(fs.readFileSync(new URL('../knowledge/records.json',import.meta.url))),sources:JSON.parse(fs.readFileSync(new URL('../knowledge/sources.json',import.meta.url)))};
const spec=JSON.parse(fs.readFileSync(new URL('../curriculum/studio.json',import.meta.url)));
const original=fs.readFileSync(new URL('./reference.svg',import.meta.url),'utf8');
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
test('unchanged original analysis is embedded, separately annotated and safely escaped',()=>{
 const s=Pilot.createState(spec);s.notes=[{region:'vessel',kind:'observation',text:'<script>not executable & exact</script>'}];
 const svg=Pilot.referenceAnalysisSVG(s,spec,original);
 assert.ok(svg.includes(original.replace('<svg ','<svg x="20" y="20" ')));
 assert.match(svg,/x="208" y="312" width="151" height="199"/);
 assert.match(svg,/Unchanged original reference/);assert.match(svg,/&lt;script&gt;/);assert.equal((svg.match(/<script/g)||[]).length,0);
 const moved=Pilot.editObject(s,'vessel',{x:.8,scale:.5});assert.equal(Pilot.referenceAnalysisSVG(moved,spec,original),svg,'original annotation cannot move with reconstruction');
});
test('all twelve canonical lessons and thirteen canonical movements have explicit metadata',()=>{
 assert.deepEqual(meta.lessons.map(e=>e.id),['01','02','03','04','05','06','07','08','09','10','11','12']);
 assert.deepEqual([...meta.movements.map(e=>e.id)].sort(),data.records.filter(e=>e.record_type==='movement').map(e=>e.id).sort());
 assert.equal(new Set(meta.movements.map(e=>e.engine)).size,13);
});
test('three actual typography posters, exact Unicode and independent spacing oracle',()=>{
 const s=P.createPractice(meta,'lesson','03',data);assert.equal(s.documents.length,3);
 for(const d of s.documents)assert.deepEqual([d.width,d.height],[1200,1600]);
 const edited=P.editLayer(s,0,'title',{text:'İğ Şç — Café < & >',tracking:7,leading:112});
 const out=P.documentSVG(edited,0);assert.match(out,/İğ Şç — Café &lt; &amp; &gt;/);assert.match(out,/letter-spacing="7"/);assert.match(out,/width="1200" height="1600"/);
 assert.match(P.documentSVG(edited,0,300),/width="300" height="400"/);assert.deepEqual(s.documents[0],s.before[0]);
});
test('research cards reject forged review status and wrong source URL',()=>{
 const s=P.createPractice(meta,'lesson','04',data);assert.equal(s.cards.length,2);
 for(const patch of [{status:'source-reviewed'},{page:'javascript:alert(1)'},{source:[]}]){const bad=structuredClone(s);Object.assign(bad.cards[0],patch);assert.throws(()=>P.validatePractice(bad,meta,data));}
 assert.match(P.researchMarkdown(s),/learner-unreviewed/);
});
test('layered cover has actual mask, edge and isolated scale edits',()=>{
 const s=P.createPractice(meta,'lesson','05',data);assert.deepEqual([s.documents[0].width,s.documents[0].height],[1200,1600]);
 const n=P.editLayer(s,0,'vessel',{mask:30,w:260});assert.match(P.documentSVG(n,0),/<clipPath/);assert.match(P.documentSVG(n,0),/M0 0 H260 L221 360/);assert.match(P.documentSVG(n,0),/x="78" y="0" width="182" height="400"/);
 assert.deepEqual(n.documents[0].layers.filter(l=>l.id!=='vessel'),s.documents[0].layers.filter(l=>l.id!=='vessel'));
});
test('three identity constructions and real 32 256 one-color reverse specimens',()=>{
 const s=P.createPractice(meta,'lesson','06',data);assert.equal(s.documents.length,3);
 assert.equal(new Set(s.documents.map((d,i)=>P.documentSVG(s,i))).size,3);
 assert.match(P.identitySVG(s,32,'one-color'),/width="32" height="32"/);assert.match(P.identitySVG(s,256,'reverse'),/width="256" height="256"/);
 assert.match(P.brandMarkdown(s),/Constants/);assert.match(P.brandMarkdown(s),/pending/);
});
test('series contains exact poster flyer four social dimensions and editable event fields',()=>{
 const s=P.createPractice(meta,'lesson','07',data);
 assert.deepEqual(s.documents.map(d=>[d.width,d.height]),[[1200,1600],[600,800],...[0,1,2,3].map(()=>[1080,1080])]);
 const n=P.setCopy(s,'event','Özgün Night — 7');for(let i=0;i<6;i++)assert.match(P.documentSVG(n,i),/Özgün Night — 7/);
 assert.equal(s.controls.event,'Open Studio');assert.ok(P.seriesStress(s,'long').documents.every(d=>d.layers.some(l=>l.id==='title'&&l.text.includes('neighborhood'))));
});
test('eight pages, three cover directions, editable reading sequence and full reduced export',()=>{
 const s=P.createPractice(meta,'lesson','08',data);assert.equal(s.documents.length,8);assert.equal(s.alternatives.length,3);
 assert.equal(new Set(s.alternatives.map(d=>d.layers.map(l=>l.type+':'+l.x+':'+l.y).join('|'))).size,3);
 assert.match(P.documentSVG(s,7,300),/width="300" height="400"/);assert.match(P.publicationHTML(s),/Page 8/);
});
test('real frame clocks never precede a nonnegative playback origin',()=>{
 assert.equal(P.playbackTime(0,99,100,10,24),0);
 assert.equal(P.playbackTime(2,99,100,10,24),2);
 assert.equal(P.playbackTime(0,1360,100,10,24),1.25);
 assert.equal(P.playbackTime(0,11000,100,10,24),10);
});
test('timeline duration, exact frame boundaries, interpolated motion and frame timing oracles',()=>{
 const a=P.createPractice(meta,'lesson','09',data),b=P.createPractice(meta,'lesson','10',data),c=P.createPractice(meta,'lesson','11',data);
 assert.equal(a.documents.length,6);assert.equal(P.duration(a),8);assert.equal(P.duration(b),10);assert.equal(P.duration(c),30);
 assert.ok(b.documents.every(d=>d.layers.find(l=>l.id==='mark').type==='arch'),'identity construction is constant across shots');
 for(const s of [a,b,c])for(const d of s.documents)assert.deepEqual([d.width,d.height],[1920,1080]);
 assert.equal(P.frameAt(a,0).index,0);assert.equal(P.frameAt(a,8).index,5);assert.equal(P.frameAt(c,5).index,1);
 const motion=P.frameAt(b,5);assert.ok(motion.progress>=0&&motion.progress<=1);
 const n=P.editLayer(b,0,'mark',{x:100,endX:500});assert.match(P.documentSVG(n,0,1920,2.5),/translate\(300 /);
 const timing=P.timingManifest(c);assert.equal(timing.frames,720);assert.equal(timing.duration,30);assert.equal(timing.fps,24);
 assert.equal(timing.videoExport,'capability-available-receipt-required');assert.equal(timing.speechAlignment,'blocked-no-recorded-speech');
});
test('UTF8 SRT, real PCM original audio bounded peaks and independent sample oracle',()=>{
 const s=P.createPractice(meta,'lesson','11',data);s.documents[0].caption='İğne — original caption';
 assert.match(P.srt(s),/00:00:00,000 --> 00:00:05,000\nİğne/);
 const pcm=P.audioSamples(s,8000);assert.equal(pcm.length,240000);assert.equal(pcm[0],0);assert.ok(Math.max(...pcm.subarray(0,8000))<=.18000001,'Float32 peak within one rounding unit');assert.ok(Math.abs(pcm[200]-.18*.5*Math.sin(2*Math.PI*220*200/8000))<1e-7,'independently specified fade and sine sample');assert.ok(pcm.some(v=>v!==0));
 const wav=P.wavBytes(s,8000);assert.equal(String.fromCharCode(...wav.slice(0,4)),'RIFF');assert.equal(new DataView(wav.buffer).getUint32(24,true),8000);
});
test('case study preserves selected production state, alternatives and actual revision support',()=>{
 const source=P.createPractice(meta,'lesson','05',data),n=P.editLayer(source,0,'vessel',{x:340});n.journal.revision='Moved vessel';n.journal.recheck='Full and 300 review remains human pending';
 const caseStudy=P.adoptCaseSource(P.createPractice(meta,'lesson','12',data),n,meta,data);
 assert.deepEqual(caseStudy.documents,n.documents);assert.deepEqual(caseStudy.before,n.before);assert.match(P.caseMarkdown(caseStudy),/05/);assert.match(P.caseMarkdown(caseStudy),/source/);
});
test('distinct movement geometry annotations controls and deterministic seed',()=>{
 const svgs=[];
 for(const e of meta.movements){let s=P.createPractice(meta,'movement',e.id,data);const svg=P.movementSVG(s,meta);svgs.push(svg);assert.match(svg,/data-region="/);assert.ok(e.regions.length>=3);assert.ok(e.controls.length>=2);
  const control=e.controls.find(c=>c.type==='number');assert.ok(control);const value=control.value===control.max?control.min:control.max;const n=P.setControl(s,control.key,value,meta);assert.notEqual(P.movementSVG(n,meta),svg,e.id);assert.deepEqual(s,P.importPractice(P.serializePractice(s),meta,data));
 }
 assert.equal(new Set(svgs).size,13);
 const d=P.createPractice(meta,'movement','dada',data);assert.equal(P.movementSVG(d,meta),P.movementSVG(d,meta));assert.notEqual(P.movementSVG(P.setControl(d,'seed',73,meta),meta),P.movementSVG(d,meta));
 const type=P.createPractice(meta,'movement','new-typography',data);assert.match(P.movementSVG(P.setControl(type,'headline','İğ — exact',meta),meta),/İğ — exact/);
 const hr=meta.movements.find(e=>e.id==='harlem-renaissance');assert.ok(hr.contextEvidence.maker);assert.ok(hr.contextEvidence.medium);assert.ok(hr.contextEvidence.locator);assert.ok(hr.limits.includes('not'));
});
test('all nested JSON scalar and collection classes rejected before adoption; valid work unchanged',()=>{
 const s=P.createPractice(meta,'lesson','11',data),saved=P.serializePractice(s);
 for(const raw of ['null','[]','{}','{',' '.repeat(400001)])assert.throws(()=>P.importPractice(raw,meta,data));
 const paths=[['id'],['documents'],['documents',0,'width'],['documents',0,'duration'],['documents',0,'layers'],['documents',0,'layers',0,'type'],['documents',0,'layers',0,'x'],['documents',0,'layers',0,'visible'],['controls','fps'],['journal','revision'],['before'],['cards'],['ledger']];
 for(const path of paths)for(const value of [null,true,{},[],['bad'],'<script>']){const bad=structuredClone(s);let parent=bad;for(const k of path.slice(0,-1))parent=parent[k];parent[path.at(-1)]=value;const allowed=(path.join('.')==='documents.0.layers.0.visible'&&value===true)||(path.join('.')==='journal.revision'&&typeof value==='string')||(['cards','ledger'].includes(path.join('.'))&&Array.isArray(value)&&value.length===0);if(allowed)assert.doesNotThrow(()=>P.validatePractice(bad,meta,data));else assert.throws(()=>P.validatePractice(bad,meta,data),JSON.stringify(path)+':'+JSON.stringify(value));}
 assert.equal(P.serializePractice(s),saved);
});
test('CSV purpose cannot execute formulas; video capability is not a produced receipt',()=>{
 const s=P.createPractice(meta,'lesson','11',data);s.documents[0].purpose=' \t=HYPERLINK("evil")';
 assert.ok(P.timingCSV(s).includes('"\' \t=HYPERLINK(""evil"")"'));
 assert.equal(P.timingManifest(s).videoExport,'capability-available-receipt-required');
 assert.match(P.gates(s).video,/receipt-required/);
 const ui=fs.readFileSync(new URL('./practice-ui.mjs',import.meta.url),'utf8');
 assert.match(ui,/sourceInput.onchange=async\(\)=>\{const token=\+\+importGeneration/);
 assert.match(ui,/decodeWav/);assert.match(ui,/speechOffset/);
});
const A=await import('./speech-audio.mjs');
test('local PCM admission is bounded, attested and atomic; mono stereo and timeline offsets',()=>{
 const s=P.createPractice(meta,'lesson','11',data),wav=P.wavBytes(s,8000);
 assert.throws(()=>A.decodeWav(wav,false));
 const a=A.decodeWav(wav,true);assert.equal(a.channels.length,1);assert.equal(a.sampleRate,8000);
 assert.deepEqual(A.timelineAudio(a,30,0).channels[0],a.channels[0]);
 assert.equal(A.timelineAudio(a,30,1).channels[0][8000+200],a.channels[0][200]);
 for(const offset of [NaN,Infinity,-1,37])assert.throws(()=>A.timelineAudio(a,30,offset));
 for(const end of [0,12,43,wav.length-1])assert.throws(()=>A.decodeWav(wav.slice(0,end),true));
 for(const [offset,value,size] of [[22,3,2],[24,0,4],[24,192000,4],[32,4,2],[40,0xffffffff,4],[20,3,2]]){const bad=wav.slice(),v=new DataView(bad.buffer);size===2?v.setUint16(offset,value,true):v.setUint32(offset,value,true);assert.throws(()=>A.decodeWav(bad,true));}
 assert.deepEqual(A.timelineAudio(a,30,0).channels[0],a.channels[0],'failed admissions cannot mutate last valid PCM');
 const stereo=wav.slice(0,52),v=new DataView(stereo.buffer);v.setUint32(4,44,true);v.setUint16(22,2,true);v.setUint32(28,32000,true);v.setUint16(32,4,true);v.setUint32(40,8,true);v.setInt16(44,16384,true);v.setInt16(46,-16384,true);v.setInt16(48,8192,true);v.setInt16(50,-8192,true);
 const b=A.decodeWav(stereo,true);assert.deepEqual([...b.channels[0]],[.5,.25]);assert.deepEqual([...b.channels[1]],[-.5,-.25]);
 assert.throws(()=>A.decodeWav('file:///secret.wav',true));assert.throws(()=>A.decodeWav(new Uint8Array(8000001),true));
 assert.equal(A.audioReceipt(a,30,0).speechAlignment,'unknown-until-manual-listening');
 assert.equal(P.timingManifest(s).shots[1].start,5);assert.match(P.srt(s),/00:00:05,000 --> 00:00:10,000/);
});
console.log(`PASS ${count} full-scope behavioral groups; independent output oracles, not browser/human acceptance`);
