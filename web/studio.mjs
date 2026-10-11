// Original-only portable scene state. Uploaded images never enter this module.
const clone = value => structuredClone(value);
const hex = value => typeof value === 'string' && /^#[0-9a-f]{6}$/.test(value);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const number = (value,min,max) => typeof value==='number' && Number.isFinite(value) && value>=min && value<=max;
const text = value => typeof value==='string' && value.length<=2000;
const fail = () => { throw Error('Invalid studio evidence. Use version 1 original-only JSON, bounded properties and known IDs. Previous work is unchanged.'); };
function keys(value,expected){if(!object(value)||Object.keys(value).sort().join()!==expected.split(' ').sort().join())fail();}
function scene(s,spec){
 keys(s,'objects background');if(!hex(s.background)||!Array.isArray(s.objects)||s.objects.length!==4)fail();
 const ids=new Set();for(const o of s.objects){keys(o,'id shape x y scale fill visible');const original=spec.objects.find(p=>p.id===o.id);if(!original||ids.has(o.id)||o.shape!==original.shape||!number(o.x,0,1)||!number(o.y,0,1)||!number(o.scale,.25,1.5)||!hex(o.fill)||typeof o.visible!=='boolean')fail();ids.add(o.id);}
}
export function createState(spec,exercise='composition'){
 if(!spec.exercises.some(e=>e.id===exercise))fail();
 return {schema:'design-taste-studio/1',version:1,exercise,lesson:spec.exercises.find(e=>e.id===exercise).lesson,movement:exercise==='planes'?'de-stijl':null,reference:spec.reference,width:600,height:600,objects:clone(spec.objects),background:'#fffdf7',before:{objects:clone(spec.objects),background:'#fffdf7'},layouts:[],variants:[],variantBefore:[],notes:[],prediction:'',observation:'',revision:'',recheck:'',profile:'Uncalibrated browser RGB; ambient light and display affect appearance.',inspected150:false,status:'not-started'};
}
export function validateState(s,spec){
 keys(s,'schema version exercise lesson movement reference width height objects background before layouts variants variantBefore notes prediction observation revision recheck profile inspected150 status');
 const e=spec.exercises.find(e=>e.id===s.exercise);
 if(s.schema!=='design-taste-studio/1'||s.version!==1||!e||s.lesson!==e.lesson||s.movement!==(s.exercise==='planes'?'de-stijl':null)||s.reference!==spec.reference||s.width!==600||s.height!==600||!['not-started','working','evidence-retained','needs-review'].includes(s.status)||typeof s.inspected150!=='boolean')fail();
 scene({objects:s.objects,background:s.background},spec);scene(s.before,spec);
 if(!Array.isArray(s.layouts)||s.layouts.length>3||!Array.isArray(s.variants)||s.variants.length>6||!Array.isArray(s.notes)||s.notes.length>20)fail();
 for(const item of s.layouts)scene(item,spec);
 if(!Array.isArray(s.variantBefore)||s.variantBefore.length>6)fail();
 for(const v of [...s.variants,...s.variantBefore]){keys(v,'background inner width height');if(!hex(v.background)||v.inner!=='#808080'||v.width!==600||v.height!==600)fail();}
 for(const n of s.notes){keys(n,'region kind text');if(!spec.regions.some(r=>r.id===n.region)||!['observation','interpretation'].includes(n.kind)||!text(n.text))fail();}
 for(const k of ['prediction','observation','revision','recheck','profile'])if(!text(s[k]))fail();
 if(s.status==='evidence-retained'&&!evidenceReady(s))fail();
 return clone(s);
}
export function serialize(s){const raw=JSON.stringify(s,null,2);if(raw.length>200000)fail();return raw;}
export function importState(raw,spec){if(typeof raw!=='string'||raw.length>200000)fail();return validateState(JSON.parse(raw),spec);}
export function editObject(s,id,patch){const next=clone(s),o=next.objects.find(o=>o.id===id);if(!o||!object(patch)||Object.keys(patch).some(k=>!['x','y','scale','fill','visible'].includes(k)))fail();Object.assign(o,patch);if(!number(o.x,0,1)||!number(o.y,0,1)||!number(o.scale,.25,1.5)||!hex(o.fill)||typeof o.visible!=='boolean')fail();next.status='working';return next;}
export function history(initial){let states=[clone(initial)],index=0;return {commit(s){if(JSON.stringify(states[index])===JSON.stringify(s))return clone(s);states=states.slice(0,index+1);states.push(clone(s));if(states.length>30)states.shift();index=states.length-1;return clone(s);},undo(){index=Math.max(0,index-1);return clone(states[index]);},redo(){index=Math.min(states.length-1,index+1);return clone(states[index]);},get canUndo(){return index>0;},get canRedo(){return index<states.length-1;},get length(){return states.length;}};}
export function colorVariant(s,index){if(!Number.isInteger(index)||index<0||index>5)fail();return {background:['#fffdf7','#20251f','#234d86','#a34120','#e5be42','#b5b9ac'][index],inner:'#808080',width:600,height:600};}
export function reviseBackground(s,index,color){const next=clone(s);if(!hex(color)||!Number.isInteger(index)||!next.variants[index])fail();next.variants[index].background=color;next.status='working';return next;}
const header=size=>`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 600 600" role="img" aria-label="Project-authored simplified still life">`;
const shapes={vessel:'<path d="M0 0 H105 L90 155 Q52 175 15 155 Z"/><rect x="-4" y="-10" width="113" height="18"/>',arch:'<path fill-rule="evenodd" d="M0 210 V65 A65 65 0 0 1 130 65 V210 H90 V65 A25 25 0 0 0 40 65 V210 Z"/>',sphere:'<circle cx="0" cy="0" r="55"/>',fold:'<path d="M-15 75 L30 -30 L120 70 Z"/><path d="M30 -30 L55 65 L120 70" fill="none" stroke="#fffdf7" stroke-width="3"/>'};
const planes={vessel:[105,150],arch:[130,210],sphere:[70,80],fold:[120,60]};
function regionRect(s,r,spec){
 const p=s.objects.find(o=>o.id===r.id),base=spec.objects.find(o=>o.id===r.id);
 if(!p)return r.rect.map(v=>v*600);
 if(s.exercise==='planes'){const [w,h]=planes[p.id];return [p.x*600-4*p.scale,p.y*600-4*p.scale,(w+8)*p.scale,(h+8)*p.scale];}
 return [(p.x+(r.rect[0]-base.x)*p.scale)*600,(p.y+(r.rect[1]-base.y)*p.scale)*600,r.rect[2]*p.scale*600,r.rect[3]*p.scale*600];
}
const coord=v=>Math.round(v*1000000)/1000000;
export function sceneSVG(s,size=600,region=null,spec=null){
 if(![150,600].includes(size)||!hex(s.background))fail();
 let out=header(size)+`<rect width="600" height="600" fill="${s.background}"/><rect y="480" width="600" height="120" fill="#e5be42"/>`;
 for(const o of s.objects){if(!['vessel','arch','sphere','fold'].includes(o.id)||!Object.hasOwn(shapes,o.shape)||!hex(o.fill)||!number(o.x,0,1)||!number(o.y,0,1)||!number(o.scale,.25,1.5))fail();if(!o.visible)continue;
 const [w,h]=planes[o.id];
 const plane=o.id==='arch'?'<path d="M0 0 H130 V210 H90 V65 H40 V210 H0 Z" stroke-width="8"/>':`<rect width="${w}" height="${h}" stroke-width="8"/>`;
 const shape=s.exercise==='planes'?plane:shapes[o.shape];
 out+=`<g data-object="${o.id}" transform="translate(${o.x*600} ${o.y*600}) scale(${o.scale})" fill="${o.fill}" stroke="#20251f" stroke-width="2">${shape}</g>`;}
 const r=spec?.regions.find(r=>r.id===region);if(r){const rect=regionRect(s,r,spec).map(coord);out+=`<rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" fill="none" stroke="#a34120" stroke-width="6" stroke-dasharray="10 6"/>`;}
 return out+'</svg>';
}
export function patchSVG(v,size=600){if(!hex(v.background)||v.inner!=='#808080'||v.width!==600||v.height!==600||![150,600].includes(size))fail();return header(size)+`<rect width="600" height="600" fill="${v.background}"/><rect x="200" y="200" width="200" height="200" fill="#808080"/></svg>`;}
export function evidenceReady(s){if(s.exercise==='color')return s.variants.length===6&&s.variantBefore.length===6&&s.variants.some((v,i)=>v.background!==s.variantBefore[i].background)&&!!s.prediction.trim()&&!!s.observation.trim()&&!!s.revision.trim()&&!!s.recheck.trim()&&!!s.profile.trim();return s.objects.some(o=>{const b=s.before.objects.find(b=>b.id===o.id);return o.x!==b.x||o.y!==b.y||o.scale!==b.scale;})&&s.layouts.length===3&&new Set(s.layouts.map(x=>JSON.stringify(x))).size===3&&new Set(s.notes.filter(n=>n.kind==='observation'&&n.text.trim()).map(n=>n.region)).size===5&&!!s.revision.trim()&&!!s.recheck.trim()&&s.inspected150;}
// The reference is embedded unchanged; overlay geometry belongs to the card, not the source.
export function referenceAnalysisSVG(s,spec,reference){
 if(typeof reference!=='string'||reference.length>10000||!reference.startsWith('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"')||/<(?:script|foreignObject|image)\b|\bon\w+=|href=/i.test(reference))fail();
 const esc=t=>t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const bounds={vessel:[188,292,151,199],arch:[410,102,300,333],sphere:[397,356,176,176],fold:[686,253,190,235],space:[339,491,347,44]};
 const rows=s.notes.flatMap(n=>{const words=(n.region+' / '+n.kind+' / '+n.text).split(/\s+/),lines=[''];for(const w of words){if((lines.at(-1)+' '+w).length>85)lines.push('');lines[lines.length-1]+=(lines.at(-1)?' ':'')+w;}return [...lines,''];});
 const height=Math.max(1100,760+rows.length*28);
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}"><title>Unchanged original reference / spatial analysis card</title><rect width="1200" height="${height}" fill="#fffdf7"/>`+reference.replace('<svg ','<svg x="20" y="20" ');
 for(const [i,r] of spec.regions.entries()){const [x,y,w,h]=bounds[r.id];out+=`<rect x="${x+20}" y="${y+20}" width="${w}" height="${h}" fill="none" stroke="#a34120" stroke-width="3"/><text x="${x+20}" y="${y+16}" font-size="22" fill="#20251f">${i+1}</text>`;}
 out+='<text x="20" y="700" font-size="24" fill="#20251f">Unchanged original reference / observations and interpretations</text>';
 rows.forEach((line,i)=>{out+=`<text x="20" y="${750+i*28}" font-size="20" fill="#20251f">${esc(line)}</text>`;});return out+'</svg>';
}
export function analysisSVG(s,spec){
 const esc=t=>t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 const rows=s.notes.flatMap(n=>{const words=(n.region+' / '+n.kind+' / '+n.text).split(/\s+/);const lines=[''];for(const w of words){if((lines.at(-1)+' '+w).length>90)lines.push('');lines[lines.length-1]+=(lines.at(-1)?' ':'')+w;}return [...lines,''];});
 const height=Math.max(1000,720+rows.length*28);
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}"><rect width="1200" height="${height}" fill="#fffdf7"/>`+sceneSVG(s,600,null,spec).replace('<svg ','<svg x="30" y="30" ');
 out+='<text x="650" y="60" font-size="24" fill="#20251f">Revised reconstruction / annotated analysis</text>';
 for(const [i,r] of spec.regions.entries()){const [x,y,w,h]=regionRect(s,r,spec);out+=`<rect x="${coord(30+x)}" y="${coord(30+y)}" width="${coord(w)}" height="${coord(h)}" fill="none" stroke="#a34120" stroke-width="3"/><text x="${coord(30+x)}" y="${coord(50+y)}" font-size="20" fill="#20251f">${i+1}</text>`;}
 rows.forEach((line,i)=>{out+=`<text x="30" y="${680+i*28}" font-size="20" fill="#20251f">${esc(line)}</text>`;});return out+'</svg>';
}
