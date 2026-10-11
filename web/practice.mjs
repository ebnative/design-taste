// Small original-only document/timeline engines. No DOM, remote assets or learner storage.
const copy=v=>structuredClone(v);
const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const num=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
const str=(v,n=2000)=>typeof v==='string'&&v.length<=n;
const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/.test(v);
const slug=v=>typeof v==='string'&&/^[a-z][a-z0-9-]{0,40}$/.test(v);
const fail=()=>{throw Error('Invalid original practice project. Typed bounded version 2 JSON required; previous work is retained.');};
function require(ok){if(!ok)fail();}
function keys(v,list){require(obj(v)&&Object.keys(v).sort().join('|')===list.split(' ').sort().join('|'));}
export const escapeText=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const fonts=['system-ui','Georgia','monospace'];
const layerTypes=['rect','circle','triangle','vessel','arch','fold','line','text'];
const journalKeys=['concept','prediction','observation','explanation','revision','recheck','limitations','font'];
const lessonControls={fps:24,gain:.18,frequency:220,event:'Open Studio',date:'12 OCT / 18:00 — fictional',place:'Workshop / Room 2 — fictional'};
function layer(id,type,x,y,w,h,fill='#234d86',extra={}){
 return {id,type,x,y,w,h,rotation:0,fill,text:'',font:'system-ui',size:64,tracking:0,leading:80,visible:true,mask:0,opacity:1,endX:x,endY:y,endScale:1,...extra};
}
function text(id,content,x,y,size=64,extra={}){return layer(id,'text',x,y,1000,300,'#20251f',{text:content,size,leading:size*1.25,...extra});}
function page(id,width,height,layers,title=id,duration=0,caption='',purpose='Describe the intended communication purpose'){
 return {id,title,width,height,layers,duration,caption,purpose};
}
function cover(id,direction=0){
 const words=text('title','FIELD NOTES\nON MAKING',96,160,86,{leading:106});
 const support=text('support','An original workshop publication\nObserve. Make. Revise.',96,1350,32,{leading:46});
 const variants=[
  [layer('arch','arch',300,500,400,550),layer('vessel','vessel',130,840,230,400,'#a34120'),layer('circle','circle',790,930,210,210,'#e5be42')],
  [layer('block','rect',80,470,1020,190,'#234d86'),layer('fold','fold',430,730,500,420,'#a34120')],
  [layer('line','line',930,120,8,1350,'#a34120'),layer('circle','circle',140,600,620,620,'#234d86')]
 ];
 if(direction===1){words.y=180;words.size=74;words.x=130;words.endX=words.x;words.endY=words.y;}
 if(direction===2){words.x=140;words.y=230;words.font='Georgia';words.endX=words.x;words.endY=words.y;}
 return page(id,1200,1600,[...variants[direction],words,support],['Open arch / making as invitation','Workbench / making as process','Margin notes / making as reflection'][direction]);
}
function documentsFor(id){
 switch(id){
 case '03':return [0,1,2].map(i=>page('poster-'+(i+1),1200,1600,[text('title','NOTICE\nMAKE\nREVISE',100+i*90,180+i*110,96-i*12,{font:fonts[i],tracking:i*2,leading:150-i*12}),text('support','İ ı Ğ ğ Ş ş Ç ç Ö ö Ü ü — Café\nExact glyphs / original type specimen',100,1250,34,{leading:60,font:fonts[i]})],'Type direction '+(i+1)));
 case '04':return [0,1].map(i=>page('card-'+(i+1),1200,1600,[text('title','RESEARCH CARD '+(i+1),100,180,72),text('support','Source / passage / limits\nOriginal proposal, not historical replica',100,400,36)],'Research card '+(i+1)));
 case '05':return [cover('cover')];
 case '06':return [
  page('open-arch',512,512,[layer('mark','arch',130,70,250,290),text('wordmark','FIELD',62,425,60,{w:390,h:80,tracking:2})],'Open arch / invitation'),
  page('folded-sheet',512,512,[layer('mark','fold',110,85,290,270,'#a34120'),text('wordmark','FIELD',62,425,60,{w:390,h:80,tracking:2})],'Folded sheet / work in progress'),
  page('paired-counters',512,512,[layer('mark','rect',100,95,110,270),layer('counter','circle',250,95,150,150,'#a34120'),text('wordmark','FIELD',62,425,60,{w:390,h:80,tracking:2})],'Paired counters / dialogue')
 ];
 case '07':return [[1200,1600],[600,800],...[0,1,2,3].map(()=>[1080,1080])].map(([w,h],i)=>page('format-'+(i+1),w,h,[layer('field','rect',w*.1,h*.44,w*.8,h*.23,i%2?'#a34120':'#234d86'),text('event','Open Studio',w*.08,h*.11,w*.04,{w:w*.84,h:h*.12}),text('title',['MAKE','LOOK','KEEP','CHANGE','RECHECK','SHARE'][i],w*.08,h*.27,w*.09,{w:w*.84,h:h*.2}),text('date',lessonControls.date,w*.08,h*.77,w*.03,{w:w*.84,h:h*.08}),text('place',lessonControls.place,w*.08,h*.86,w*.03,{w:w*.84,h:h*.08})],i===0?'Poster':i===1?'Flyer':'Social card '+(i-1)));
 case '08':return [cover('page-1'),...[1,2,3,4,5,6,7].map(i=>page('page-'+(i+1),1200,1600,[text('title',['','Observe a relationship','Predict a change','Make one intervention','Compare equal views','Name the uncertainty','Revise a decision','Retain the evidence'][i],96,140,58,{w:1008,h:180}),text('body',['','A gap is a visible relationship.\nDescribe its boundary before meaning.','State what you expect before\nmanipulating the composition.','Change one spatial variable.\nKeep the original source unchanged.','Use the same dimensions.\nA mockup is not a flat inspection.','Distinguish a visible failure\nfrom a preference or interpretation.','Retain the actual before and after.\nA proposal alone is not revision.','Link a claim to source and artifact.\nKeep human acceptance pending.'][i],96,540,44,{leading:72,w:1008,h:520}),layer('illustration',i%2?'arch':'circle',180,900,360,360,i%2?'#234d86':'#a34120'),text('folio',String(i+1).padStart(2,'0'),1000,1490,30,{w:100,h:50})],'Page '+(i+1)))];
 case '09':return [1,1,1.5,1.5,1.5,1.5].map((hold,i)=>page('shot-'+(i+1),1920,1080,[layer('shape',i%2?'arch':'circle',160+i*120,260,380,420,i%2?'#234d86':'#a34120'),text('title',['OBSERVE','PREDICT','MAKE','COMPARE','REVISE','KEEP EVIDENCE'][i],760,420,76,{w:1040,h:300,leading:100})],'Storyboard '+(i+1),hold,'','Show '+['the reference','a prediction','a controlled intervention','the comparison','the revision','retained evidence'][i]));
 case '10':return [0,1].map(i=>page('identity-shot-'+(i+1),1920,1080,[layer('mark','arch',i?200:100,200,360,440,'#234d86',{endX:i?500:700,endY:200,endScale:i?1:.8}),text('wordmark','FIELD / ORIGINAL STUDIO',780,520,58,{w:1030,h:200,tracking:3,endX:720,endY:520,endScale:1})],'Identity '+(i+1),5,'','Identify the constant mark and exact wordmark; easing is linear'));
 case '11':return [0,1,2,3,4,5].map(i=>page('narrative-shot-'+(i+1),1920,1080,[layer('door','arch',160+i*35,130,420,660,'#234d86'),layer('object',['vessel','circle','fold'][i%3],800,260,340,380,'#a34120',{endX:920,endY:260,endScale:1}),text('title',['A maker opens a room','A tool is placed on the table','Two shapes are compared','A gap becomes a question','One detail is revised','The work is kept for review'][i],670,180,48,{w:1120,h:200,leading:74})],'Original narrative '+(i+1),5,['A maker opens a room.','A tool is placed on the table.','Two shapes are compared.','A gap becomes a question.','One detail is revised.','The work is kept for review.'][i],'Original silent geometric narrative; tones are non-speech'));
 case '12':return [0,1,2].map(i=>cover('route-'+(i+1),i));
 default:fail();
 }
}
function initialCards(data){
 return [['bauhaus','S27'],['new-typography','S33']].map(([record,source])=>{const r=data.records.find(r=>r.id===record),s=data.sources.find(s=>s.id===source),review=s.claim_reviews?.[0];return {record,source,page:s.url,locator:review?.locator||'',accessed:review?.reviewed_on||'',passage:review?.support_excerpt||'',claim:review?.claim||r.historical_context,category:r.record_type,context:'Compare a school with a movement; imported context is not independent passage verification.',proposal:'Create an original visible comparison, not a historical replica.',limits:review?.limits||'Actual source inspection, passage locator and access date required; imported status stays unreviewed.',status:'learner-unreviewed'};});
}
export function createPractice(meta,kind,id,data){
 require(['lesson','movement'].includes(kind));const entry=(kind==='lesson'?meta.lessons:meta.movements).find(e=>e.id===id);require(!!entry);
 if(kind==='lesson')require(!['01','02'].includes(id));
 const documents=kind==='lesson'?documentsFor(id):[];
 return {schema:'design-taste-practice/2',version:2,kind,id,origin:null,selected:0,documents,before:copy(documents),alternatives:kind==='lesson'&&['08','12'].includes(id)?[0,1,2].map(i=>cover('cover-direction-'+(i+1),i)):[],controls:kind==='lesson'?copy(lessonControls):Object.fromEntries(entry.controls.map(c=>[c.key,c.value])),controlBefore:kind==='lesson'?copy(lessonControls):Object.fromEntries(entry.controls.map(c=>[c.key,c.value])),journal:Object.fromEntries(journalKeys.map(k=>[k,k==='limitations'?entry.limitations||entry.limits:k==='font'?'Requested system-ui / Georgia / monospace; actual fallback and glyph observations not reviewed.':''])),cards:kind==='lesson'&&id==='04'?initialCards(data):[],cardBefore:kind==='lesson'&&id==='04'?initialCards(data):[],ledger:[],snapshots:[],playback:[]};
}
function validateLayer(l,w,h){
 keys(l,'id type x y w h rotation fill text font size tracking leading visible mask opacity endX endY endScale');
 require(slug(l.id)&&layerTypes.includes(l.type)&&hex(l.fill)&&str(l.text,800)&&fonts.includes(l.font)&&typeof l.visible==='boolean');
 for(const key of ['x','endX'])require(num(l[key],-w,w*1.5));for(const key of ['y','endY'])require(num(l[key],-h,h*1.5));
 require(num(l.w,1,w*2)&&num(l.h,1,h*2)&&num(l.rotation,-180,180)&&num(l.size,8,200)&&num(l.tracking,-8,20)&&num(l.leading,8,260)&&num(l.mask,0,70)&&num(l.opacity,.1,1)&&num(l.endScale,.25,2));
}
function validateDocument(d){
 keys(d,'id title width height layers duration caption purpose');
 require(slug(d.id)&&str(d.title,120)&&[[1200,1600],[600,800],[1080,1080],[1920,1080],[512,512]].some(([w,h])=>d.width===w&&d.height===h)&&num(d.duration,0,10)&&str(d.caption,800)&&str(d.purpose,800)&&Array.isArray(d.layers)&&d.layers.length>=1&&d.layers.length<=16);
 const seen=new Set();for(const l of d.layers){validateLayer(l,d.width,d.height);require(!seen.has(l.id));seen.add(l.id);}
}
function validateDocuments(list,max=8){require(Array.isArray(list)&&list.length<=max);const seen=new Set();for(const d of list){validateDocument(d);require(!seen.has(d.id));seen.add(d.id);}}
function validateControls(c,kind,id,meta){
 if(kind==='lesson'){keys(c,'fps gain frequency event date place');require([24,30].includes(c.fps)&&num(c.gain,0,.3)&&num(c.frequency,80,600)&&str(c.event,80)&&str(c.date,120)&&str(c.place,120));}
 else {const def=meta.movements.find(e=>e.id===id).controls;keys(c,def.map(c=>c.key).join(' '));for(const d of def){const v=c[d.key];if(d.type==='number')require(num(v,d.min,d.max)&&(d.step!==1||Number.isInteger(v)));else if(d.type==='boolean')require(typeof v==='boolean');else require(str(v,160));}}
}
function validateCard(c,data){
 keys(c,'record source page locator accessed passage claim category context proposal limits status');
 for(const k of Object.keys(c))require(str(c[k],2000));
 const r=data.records.find(r=>r.id===c.record),s=data.sources.find(s=>s.id===c.source);
 require(!!r&&!!s&&r.source_ids.includes(c.source)&&c.page===s.url&&c.category===r.record_type&&c.status==='learner-unreviewed'&&(/^\d{4}-\d{2}-\d{2}$/.test(c.accessed)||c.accessed===''));
}
export function validatePractice(s,meta,data){
 // Structural preflight precedes every nested operation, hashing or source lookup.
 keys(s,'schema version kind id origin selected documents before alternatives controls controlBefore journal cards cardBefore ledger snapshots playback');
 require(s.schema==='design-taste-practice/2'&&s.version===2&&['lesson','movement'].includes(s.kind)&&str(s.id,50));
 const entry=(s.kind==='lesson'?meta.lessons:meta.movements).find(e=>e.id===s.id);require(!!entry&&!(s.kind==='lesson'&&['01','02'].includes(s.id)));
 require(s.origin===null||(s.kind==='lesson'&&s.id==='12'&&['05','06','08','10','11'].includes(s.origin)));
 validateDocuments(s.documents);validateDocuments(s.before);validateDocuments(s.alternatives,3);
 if(s.kind==='lesson'){
  const reference=documentsFor(s.origin||s.id);require(s.documents.length===reference.length&&s.before.length===reference.length);
  require(s.alternatives.length===(['08','12'].includes(s.origin||s.id)?3:0));
  for(const [i,d] of s.documents.entries())require(d.width===reference[i].width&&d.height===reference[i].height&&d.id===reference[i].id&&s.before[i].id===d.id&&s.before[i].width===d.width&&s.before[i].height===d.height);
  require(Number.isInteger(s.selected)&&s.selected>=0&&s.selected<s.documents.length);
  if(['09','10','11'].includes(s.origin||s.id)){require(s.documents.every(d=>d.duration>=.25));const t=duration(s),b=duration({...s,documents:s.before});const range=s.id==='09'?[6,10]:(s.origin||s.id)==='10'?[8,12]:[24,36];require(num(t,...range)&&num(b,...range));}
  else require(s.documents.every(d=>d.duration===0));
 }else require(s.documents.length===0&&s.before.length===0&&s.alternatives.length===0&&s.selected===0&&s.origin===null);
 validateControls(s.controls,s.kind,s.id,meta);validateControls(s.controlBefore,s.kind,s.id,meta);
 keys(s.journal,journalKeys.join(' '));for(const k of journalKeys)require(str(s.journal[k]));
 require(Array.isArray(s.cards)&&Array.isArray(s.cardBefore)&&s.cards.length===(s.id==='04'?2:0)&&s.cardBefore.length===s.cards.length);for(const c of [...s.cards,...s.cardBefore])validateCard(c,data);
 require(Array.isArray(s.ledger)&&s.ledger.length<=20);for(const row of s.ledger){keys(row,'artifact criterion source locator rights limits');for(const v of Object.values(row))require(str(v,2000));require(row.source===''||data.sources.some(src=>src.id===row.source));}
 require(Array.isArray(s.snapshots)&&s.snapshots.length<=6);for(const shot of s.snapshots){keys(shot,'label documents controls cards');require(str(shot.label,120));validateDocuments(shot.documents);validateControls(shot.controls,s.kind,s.id,meta);require(Array.isArray(shot.cards)&&shot.cards.length<=2);for(const c of shot.cards)validateCard(c,data);}
 require(Array.isArray(s.playback)&&s.playback.length<=20);for(const p of s.playback){keys(p,'view from to seconds frames mode');require(['before','after'].includes(p.view)&&num(p.from,0,36)&&num(p.to,p.from,36)&&num(p.seconds,0,7200)&&Number.isInteger(p.frames)&&p.frames>=0&&p.frames<100000&&['browser-raf','browser-static-scrub'].includes(p.mode));}
 require(JSON.stringify(s).length<=400000);return copy(s);
}
export function serializePractice(s){const raw=JSON.stringify(s,null,2);require(raw.length<=400000);return raw;}
export function importPractice(raw,meta,data){require(typeof raw==='string'&&raw.length<=400000);return validatePractice(JSON.parse(raw),meta,data);}
export function editLayer(s,index,id,patch){
 require(Number.isInteger(index)&&obj(patch)&&Object.keys(patch).every(k=>!['id','type'].includes(k)&&Object.keys(layer('a','rect',0,0,1,1)).includes(k)));
 const n=copy(s),d=n.documents[index];require(!!d);const l=d.layers.find(l=>l.id===id);require(!!l);Object.assign(l,patch);validateLayer(l,d.width,d.height);return n;
}
export function setControl(s,key,value,meta){const n=copy(s);require(Object.hasOwn(n.controls,key));n.controls[key]=value;validateControls(n.controls,n.kind,n.id,meta);return n;}
export function setCopy(s,key,value){require(['event','date','place'].includes(key)&&str(value,key==='event'?80:120));const n=copy(s);n.controls[key]=value;for(const d of n.documents){const l=d.layers.find(l=>l.id===key);if(l)l.text=value;}return n;}
export function seriesStress(s,which){require(s.id==='07'&&['short','long'].includes(which));const n=copy(s);for(const d of n.documents){const l=d.layers.find(l=>l.id==='title');l.text=which==='short'?'MAKE':'A neighborhood\nworkshop for\nshared ideas';}return n;}
export function duration(s){return s.documents.reduce((t,d)=>t+d.duration,0);}
export function playbackTime(from,stamp,started,total,fps){
 require(num(from,0,total)&&num(total,0,36)&&num(stamp,0,Number.MAX_SAFE_INTEGER)&&num(started,0,Number.MAX_SAFE_INTEGER)&&[24,30].includes(fps));
 const elapsed=Math.max(0,(stamp-started)/1000),time=Math.min(total,from+elapsed);
 return Math.min(total,Math.max(from,Math.floor(time*fps)/fps));
}
export function frameAt(s,time){require(num(time,0,36)&&s.documents.length>0);const total=duration(s);let start=0,index=0;for(let i=0;i<s.documents.length;i++){index=i;const end=start+s.documents[i].duration;if(time<end||i===s.documents.length-1)break;start=end;}const d=s.documents[index];return {index,start,progress:d.duration?Math.max(0,Math.min(1,(Math.min(time,total)-start)/d.duration)):0};}
const svgHeader=(width,height,viewW=width,viewH=height,label='Original editable practice')=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewW} ${viewH}" role="img" aria-label="${escapeText(label)}"><rect width="${viewW}" height="${viewH}" fill="#fffdf7"/>`;
function layerMarkup(l,progress=0,mono=null,instance='p'){
 if(!l.visible)return '';
 const x=l.x+(l.endX-l.x)*progress,y=l.y+(l.endY-l.y)*progress,scale=1+(l.endScale-1)*progress,fill=mono||l.fill;
 let shape='';
 if(l.type==='text'){shape=`<text fill="${fill}" font-family="${l.font}" font-size="${l.size}" letter-spacing="${l.tracking}">`+l.text.split('\n').map((line,i)=>`<tspan x="0" y="${i*l.leading}">${escapeText(line)}</tspan>`).join('')+'</text>';}
 if(['rect','line'].includes(l.type))shape=`<rect width="${l.w}" height="${l.h}" fill="${fill}"/>`;
 if(l.type==='circle')shape=`<ellipse cx="${l.w/2}" cy="${l.h/2}" rx="${l.w/2}" ry="${l.h/2}" fill="${fill}"/>`;
 if(l.type==='triangle')shape=`<path d="M0 ${l.h} L${l.w/2} 0 L${l.w} ${l.h} Z" fill="${fill}"/>`;
 if(l.type==='vessel')shape=`<path d="M0 0 H${l.w} L${l.w*.85} ${l.h*.9} Q${l.w*.5} ${l.h*1.1} ${l.w*.15} ${l.h*.9} Z" fill="${fill}"/><ellipse cx="${l.w/2}" cy="0" rx="${l.w/2}" ry="${l.h*.06}" fill="${fill}" stroke="#fffdf7" stroke-width="3"/>`;
 if(l.type==='arch')shape=`<path d="M0 ${l.h} V${l.w/2} A${l.w/2} ${l.w/2} 0 0 1 ${l.w} ${l.w/2} V${l.h} H${l.w*.7} V${l.w/2} A${l.w*.2} ${l.w*.2} 0 0 0 ${l.w*.3} ${l.w/2} V${l.h} Z" fill="${fill}"/>`;
 if(l.type==='fold')shape=`<path d="M0 ${l.h} L${l.w*.45} 0 L${l.w} ${l.h} Z" fill="${fill}"/><path d="M${l.w*.45} 0 L${l.w*.6} ${l.h}" stroke="#fffdf7" stroke-width="${Math.max(2,l.w*.012)}"/>`;
 const clipId=instance+'-'+l.id;
 const clip=l.mask?`<defs><clipPath id="${clipId}"><rect x="${l.w*l.mask/100}" y="0" width="${l.w*(1-l.mask/100)}" height="${l.h}"/></clipPath></defs>`:'';
 return `<g data-layer="${l.id}" transform="translate(${x} ${y}) rotate(${l.rotation}) scale(${scale})" opacity="${l.opacity}">${clip}<g${l.mask?` clip-path="url(#${clipId})"`:''}>${shape}</g></g>`;
}
export function documentSVG(s,index=s.selected,width=null,localTime=0){
 require(Number.isInteger(index)&&s.documents[index]);const d=s.documents[index];validateDocument(d);const w=width===null?d.width:width;require(num(w,32,1920));const h=w*d.height/d.width,p=d.duration?Math.max(0,Math.min(1,localTime/d.duration)):0;
 let out=svgHeader(w,h,d.width,d.height,d.title)+d.layers.map(l=>layerMarkup(l,p,null,d.id)).join('');
 if(d.caption)out+=`<rect x="180" y="880" width="1560" height="160" fill="#fffdf7"/><text x="220" y="970" font-family="system-ui" font-size="40" fill="#20251f">${escapeText(d.caption)}</text>`;
 return out+'</svg>';
}
export function identitySVG(s,size=256,mode='color'){
 require((s.id==='06'||s.origin==='06')&&[32,256].includes(size)&&['color','one-color','reverse'].includes(mode));
 const d=s.documents[s.selected],reverse=mode==='reverse';let out=svgHeader(size,size,512,512,'Original selected identity mark / '+mode);
 if(reverse)out+='<rect width="512" height="512" fill="#20251f"/>';
 out+=d.layers.filter(l=>l.type!=='text').map(l=>layerMarkup(l,0,mode==='color'?null:reverse?'#fffdf7':'#20251f',d.id)).join('');return out+'</svg>';
}
export function timingManifest(s){
 let start=0;return {schema:'design-taste-timing/1',width:1920,height:1080,fps:s.controls.fps,duration:duration(s),frames:Math.round(duration(s)*s.controls.fps),shots:s.documents.map(d=>{const p={id:d.id,start,end:start+d.duration,frames:Math.round(d.duration*s.controls.fps),purpose:d.purpose,caption:d.caption};start=p.end;return p;}),interpolation:'linear position/scale, static type glyphs',playbackReceipts:copy(s.playback),videoExport:'capability-available-receipt-required',speechAlignment:(s.origin||s.id)==='11'?'blocked-no-recorded-speech':'not-applicable',audio:(s.origin||s.id)==='11'?'original PCM sine tones, no speech':'none'};
}
export function timingCSV(s){return 'shot,start,end,frames,purpose\n'+timingManifest(s).shots.map(d=>[d.id,d.start,d.end,d.frames,'"'+(/^[\s]*[=+@-]/.test(d.purpose)?"'"+d.purpose:d.purpose).replace(/"/g,'""')+'"'].join(',')).join('\n')+'\n';}
const stamp=time=>{const ms=Math.round(time*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0');};
export function srt(s){let t=0;return s.documents.map((d,i)=>{const out=`${i+1}\n${stamp(t)} --> ${stamp(t+d.duration)}\n${d.caption}\n`;t+=d.duration;return out;}).join('\n');}
export function audioSamples(s,rate=24000){
 require((s.origin||s.id)==='11'&&[8000,24000,48000].includes(rate));const length=Math.round(duration(s)*rate),samples=new Float32Array(length);let offset=0;
 for(const [i,d] of s.documents.entries()){const count=Math.round(d.duration*rate),freq=s.controls.frequency*(1+i*.08);for(let j=0;j<count&&offset+j<length;j++){const fade=Math.min(1,j/(rate*.05),(count-j-1)/(rate*.05));samples[offset+j]=s.controls.gain*Math.max(0,fade)*Math.sin(2*Math.PI*freq*j/rate);}offset+=count;}
 return samples;
}
export function audioPeaks(s,rate=24000){const samples=audioSamples(s,rate);let peak=0,power=0;for(const v of samples){peak=Math.max(peak,Math.abs(v));power+=v*v;}return {sampleRate:rate,samples:samples.length,duration:samples.length/rate,peak,rms:Math.sqrt(power/samples.length),maximumPermittedGain:.3,clippedSamples:0,medium:'original synthesized non-speech PCM',speechAlignment:'blocked-no-recorded-speech'};}
export function wavBytes(s,rate=24000){const pcm=audioSamples(s,rate),bytes=new Uint8Array(44+pcm.length*2),view=new DataView(bytes.buffer);function word(offset,txt){for(let i=0;i<txt.length;i++)bytes[offset+i]=txt.charCodeAt(i);}word(0,'RIFF');view.setUint32(4,36+pcm.length*2,true);word(8,'WAVE');word(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);word(36,'data');view.setUint32(40,pcm.length*2,true);for(let i=0;i<pcm.length;i++)view.setInt16(44+i*2,Math.round(pcm[i]*32767),true);return bytes;}
const mdText=t=>String(t).replace(/\r/g,'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function researchMarkdown(s){return s.cards.map((c,i)=>`# Research card ${i+1}\n\n${Object.entries(c).map(([k,v])=>k+': '+mdText(v)).join('\n\n')}\n\nBefore claim: ${mdText(s.cardBefore[i].claim)}\n\nClaim scope revision: ${mdText(s.journal.revision)}\n\nActual recheck / uncertainty: ${mdText(s.journal.recheck)}\n`).join('\n---\n\n');}
export function brandMarkdown(s){return `# FIELD / provisional original identity\n\nSelected construction: ${mdText(s.documents[s.selected].title)}\n\nHuman selection: pending. Native: blocked/unrun. Trademark and cultural clearance: not performed.\n\n## Constants\nExact wordmark content; original mark construction; system-font and palette roles.\n\n## Variants\n32px and 256px mark-only; full 512px wordmark; one-color and reverse specimens.\n\n## Retained alternatives\n${s.documents.map(d=>'- '+mdText(d.title)).join('\n')}\n\n## Rationale / rejection and optical revision\n${journalMarkdown(s)}\n\nNo legal clearance, universal readability or accepted identity outcome implied.\n`;}
export function journalMarkdown(s){return Object.entries(s.journal).map(([key,value])=>'## '+key+'\n'+mdText(value)).join('\n\n')+'\n';}
export function gates(s){return {source:'canonical statuses unchanged; learner claims unreviewed',rights:'original geometry/teaching; system fonts, no external assets; third-party clearance not claimed',software:'browser original-only SVG/Canvas and portable JSON; host acceptance pending',artifact:'working source; downloaded formats require actual readback',video:['09','10','11'].includes(s.origin||s.id)?'capability-available / actual encoded receipt-required':'not-applicable',speech:(s.origin||s.id)==='11'?'blocked-no-recorded-speech':'not-applicable',native:'blocked/unrun; SVG is not native Adobe proof',human:'pending; no aesthetic/mastery/learner acceptance',independent:'pending parent stable-tree review'};}
export function adoptCaseSource(s,source,meta,data){require(s.id==='12'&&source.kind==='lesson'&&['05','06','08','10','11'].includes(source.id));const valid=validatePractice(source,meta,data),n=copy(s);n.origin=valid.id;n.documents=copy(valid.documents);n.before=copy(valid.before);n.alternatives=copy(valid.alternatives);n.selected=valid.selected;n.controlBefore=copy(valid.controlBefore);n.controls=copy(valid.controls);n.snapshots=copy(valid.snapshots);n.playback=copy(valid.playback);n.ledger=[{artifact:'Selected source '+valid.id+' / '+valid.documents[valid.selected].id,criterion:'Actual before/revised editable production',source:'',locator:'Portable source project version 2',rights:'Original authored geometry',limits:valid.journal.limitations}];n.journal.revision=valid.journal.revision;n.journal.recheck=valid.journal.recheck;return validatePractice(n,meta,data);}
export function caseMarkdown(s){return `# Original case study\n\nSelected production source: ${s.origin||'not-yet-imported'}\n\n${journalMarkdown(s)}\n## Artifact/criterion support ledger\n${s.ledger.map(r=>Object.entries(r).map(([k,v])=>k+': '+mdText(v)).join('\n')).join('\n\n')}\n\n## Retained alternatives\n${[...s.documents,...s.alternatives].map(d=>'- '+mdText(d.id)+' / '+mdText(d.title)+' / '+d.width+'x'+d.height).join('\n')}\n\n## Actual before/after\n${JSON.stringify(s.documents)!==JSON.stringify(s.before)?'Source geometry/copy/timing differs; inspect exports and recorded recheck.':'No actual production delta retained yet.'}\n\n## Separate gates\n${Object.entries(gates(s)).map(([k,v])=>k+': '+v).join('\n')}\n`;}
export function publicationHTML(s){return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Original static publication</title><style>body{margin:1rem;background:#f5f1e8;color:#20251f;font:18px system-ui}figure{margin:1rem auto;max-width:700px}svg{width:100%;height:auto}figcaption{padding:1rem} @media print{figure{break-after:page}}</style><h1>Original static sequence / no motion or encoded-video claim</h1>'+s.documents.map((d,i)=>'<figure>'+documentSVG(s,i)+'<figcaption>Page '+(i+1)+' / '+escapeText(d.title)+' / '+escapeText(d.purpose)+'</figcaption></figure>').join('')+'</html>';}
// Distinct contemporary construction rules; the unchanged owned reference stays alongside them.
function rng(seed){let n=seed;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
export function movementScene(s,meta){
 const entry=meta.movements.find(e=>e.id===s.id);require(s.kind==='movement'&&entry);validateControls(s.controls,'movement',s.id,meta);const c=s.controls;
 const blocks={},bounds={};const group=(id,svg,rect)=>{blocks[id]=`<g data-region="${id}">${svg}</g>`;bounds[id]=rect;};
 const label=(words,x,y,size=26,fill='#20251f')=>`<text x="${x}" y="${y}" font-family="system-ui" font-size="${size}" fill="${fill}">${String(words).split('\n').map((l,i)=>`<tspan x="${x}" dy="${i?size*1.25:0}">${escapeText(l)}</tspan>`).join('')}</text>`;
 const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
 switch(entry.engine){
 case 'material-repeat':{
  let units='';for(let i=0;i<c.repeat;i++){const x=55+i*480/c.repeat;units+=`<g transform="translate(${x} 180)" fill="none" stroke="#234d86" stroke-width="${c.stroke}"><path d="M0 150 Q-28 75 4 0 Q60 95 0 150 M4 0 L0 150"/></g>`;}group('structure',c.motif?units:'',[25,165,535,175]);group('message',label('MAKE / WITH CARE',50,440,32),[45,400,500,55]);group('relationship',`<path d="M50 370 H550" stroke="#a34120" stroke-width="${c.stroke}"/>`,[45,350,510,30]);break;}
 case 'contour-line':group('structure',`<path d="M160 500 C${160-c.bow} 330 ${160+c.bow} 210 240 90" fill="none" stroke="#234d86" stroke-width="${c.stroke}"/>`,[Math.max(10,160-c.bow),80,2*c.bow+90,430]);group('message',label(c.headline,280,400,24),[275,350,300,100]);group('relationship','<ellipse cx="200" cy="220" rx="70" ry="24" transform="rotate(-30 200 220)" fill="none" stroke="#a34120" stroke-width="4"/><ellipse cx="130" cy="350" rx="65" ry="25" transform="rotate(30 130 350)" fill="none" stroke="#a34120" stroke-width="4"/>',[65,170,225,220]);break;
 case 'stepped-symmetry':{let tiers='';for(let i=0;i<c.steps;i++){const w=(c.steps-i)*c.stepWidth;tiers+=rect(300-w/2,400-i*42,w,38,c.monochrome?'#20251f':i%2?'#a34120':'#234d86');}group('structure',tiers,[300-c.steps*c.stepWidth/2,400-(c.steps-1)*42,c.steps*c.stepWidth,c.steps*42]);group('message',label('A NEW WORKSHOP',135,510,30),[120,465,400,65]);group('relationship','<path d="M300 65 V440" stroke="#565c52" stroke-width="2"/>',[285,65,30,380]);break;}
 case 'orthogonal-fields':group('structure',rect(50,60,c.split-50,220,c.monochrome?'#808080':'#234d86')+rect(c.split,60,550-c.split,220,c.monochrome?'#20251f':'#a34120')+rect(50,280,160,220,'#e5be42'),[50,60,500,440]);group('message',label('ORIGINAL / FIELD',240,440,26),[235,400,320,60]);group('relationship',`<path d="M${c.split} 60 V280 M50 280 H550 M210 280 V500" fill="none" stroke="#20251f" stroke-width="${c.weight}"/>`,[45,55,510,450]);break;
 case 'direction-purpose':group('structure',`<g transform="rotate(${c.angle} 300 240)">${rect(90,170,420,100,'#a34120')}</g>`,[55,80,490,320]);group('message',`<g transform="translate(70 340) scale(${c.scale})">${label(c.headline,0,0,30)}</g>`,[65,290,490,90]);group('relationship',label('WHO DOES THIS SERVE?',80,500,22),[75,465,465,65]);break;
 case 'geometric-tension':group('structure',`<rect x="${150+c.offset}" y="160" width="150" height="150" transform="rotate(${c.rotation} ${225+c.offset} 235)" fill="#234d86"/>`,[70+c.offset,85,310,310]);group('message',`<circle cx="420" cy="390" r="${c.radius}" fill="#a34120"/>`,[420-c.radius,390-c.radius,2*c.radius,2*c.radius]);group('relationship',rect(80,460,220,25,'#20251f'),[80,455,220,40]);break;
 case 'seeded-juxtaposition':{const random=rng(c.seed);let fragments='';for(let i=0;i<5;i++){const x=c.chance?250+(random()-.5)*c.scatter*2:70+i*90,y=c.chance?210+(random()-.5)*c.scatter*2:180,angle=c.chance?(random()-.5)*60:0;fragments+=`<g transform="translate(${x} ${y}) rotate(${angle})">${rect(-35,-20,70,80,i%2?'#234d86':'#a34120')}</g>`;}group('structure',fragments,[40,35,520,380]);group('message',label(c.headline,45,470,24),[40,425,525,70]);group('relationship',label('SEED '+c.seed+' / '+(c.chance?'CHANCE':'PLANNED'),45,540,20),[40,505,520,65]);break;}
 case 'unexpected-scale':{const cup=layer('cup','vessel',90,290-c.lift,100*c.vesselScale,120*c.vesselScale,'#a34120');group('structure',layerMarkup(cup),[85,280-c.lift,110*c.vesselScale,140*c.vesselScale]);group('message',label(c.headline,45,535,28),[40,490,525,70]);group('relationship',layerMarkup(layer('arch','arch',340,200,150,250)),[335,195,160,260]);break;}
 case 'content-hierarchy':{const x=c.centered?170:80;group('structure','<path d="M60 70 V440 M60 70 H540" fill="none" stroke="#a34120" stroke-width="4"/>',[50,60,500,390]);group('message',`<text x="${x}" y="150" font-family="system-ui" font-size="${c.size}" fill="#20251f">${c.headline.split('\n').map((l,i)=>`<tspan x="${x}" y="${150+i*c.leading}">${escapeText(l)}</tspan>`).join('')}</text>`,[x-5,100,410,Math.max(80,c.headline.split('\n').length*c.leading)]);group('relationship',label('12 OCT / ROOM 2 — FICTIONAL',80,520,21),[75,475,490,70]);break;}
 case 'ordinary-panels':{let panels='',cups='';for(let i=0;i<c.panels;i++){const x=40+i*520/c.panels;panels+=rect(x,140,510/c.panels,260,i%2?'#e5be42':'#f5f1e8');cups+=layerMarkup(layer('cup-'+i,'vessel',x+25,230,70*c.cupScale,120*c.cupScale,i%2?'#a34120':'#234d86'));}group('structure',cups,[40,200,520,190]);group('message',label(c.headline,40,490,20),[35,445,530,65]);group('relationship',panels,[40,140,520,260]);break;}
 case 'static-rhythm':{let field=rect(65,100,470,280,'#f5f1e8');if(!c.quiet)for(let x=70;x<530;x+=c.pitch)field+=`<path d="M${x} 110 Q${x+30} 235 ${x} 370" fill="none" stroke="#20251f" stroke-width="${c.width}"/>`;group('structure',field,[60,95,480,290]);group('message',label(c.quiet?'QUIET / STATIC ALTERNATIVE':'STATIC / STOP IF UNCOMFORTABLE',40,470,22),[35,425,540,70]);group('relationship','<path d="M55 90 H545 V390 H55 Z" fill="none" stroke="#234d86" stroke-width="3"/>',[50,85,500,310]);break;}
 case 'spatial-reduction':{let units='';for(let i=0;i<c.count;i++)units+=layerMarkup(layer('unit-'+i,c.stage===1?'vessel':c.stage===2?'rect':'line',70+i*c.interval,220,c.stage===3?6:50,c.stage===3?120:100,'#20251f'));group('structure',units,[65,200,Math.min(480,(c.count-1)*c.interval+65),150]);group('message',label('WHAT MEANING REMAINS?',70,500,25),[65,455,490,70]);group('relationship',rect(70,370,420,2,'#a34120'),[65,345,430,65]);break;}
 case 'context-narrative':{
  const x=60+c.viewpoint,scenes=[
   rect(65,100,180,280,'#234d86')+`<rect x="${x}" y="230" width="90" height="110" fill="#fffdf7" stroke="#20251f" stroke-width="3"/>`,
   rect(90,260,420,25,'#a34120')+layerMarkup(layer('tool','fold',x,130,120,120,'#234d86')),
   rect(320,100,170,180,'#234d86')+layerMarkup(layer('cup','vessel',x,290,80,100,'#a34120')),
   rect(110,270,380,25,'#a34120')+`<circle cx="${x+40}" cy="170" r="38" fill="#234d86"/><circle cx="430" cy="170" r="38" fill="#a34120"/>`,
   rect(80,100,440,280,'#f5f1e8')+rect(x,140,140,160,'#234d86')+label('NOTICE / A LOCAL WORKSHOP',95,340,18),
   rect(100,170,160,220,'#234d86')+rect(x+160,130,160,220,'#a34120')+label('KEEP THE PROCESS',100,360,20)
  ];group('structure',scenes[c.scene-1]+label('SCENE '+c.scene,300,80,18),[55,60,485,340]);group('message',label(c.headline,45,450,22),[40,405,530,80]);group('relationship',label('REISS / PAINTING + DRAWING\nS45 AUDIO 681 / NOT THIS VECTOR',45,525,17),[40,490,530,85]);break;}

 default:fail();
 }
 // Panel backgrounds must not cover foregrounds: relationship first, then structure and message.
 return {markup:['relationship','structure','message'].map(id=>blocks[id]).join(''),bounds};
}
export function movementSVG(s,meta,region=null){const scene=movementScene(s,meta);let out=svgHeader(600,600,600,600,'Original contemporary '+s.id+' interpretation')+scene.markup;if(region&&scene.bounds[region]){const [x,y,w,h]=scene.bounds[region];out+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#a34120" stroke-width="3" stroke-dasharray="8 5"/>`; }return out+'</svg>';}
export function movementAnalysisSVG(s,meta){const e=meta.movements.find(e=>e.id===s.id),scene=movementScene(s,meta);let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1100" viewBox="0 0 1200 1100"><rect width="1200" height="1100" fill="#fffdf7"/>`+movementSVG(s,meta).replace('<svg ','<svg x="20" y="20" ');for(const [i,r] of e.regions.entries()){const [x,y,w,h]=scene.bounds[r.id];out+=`<rect x="${x+20}" y="${y+20}" width="${w}" height="${h}" fill="none" stroke="#a34120" stroke-width="3"/><text x="${x+20}" y="${y+40}" font-size="24" fill="#20251f">${i+1}</text>`;}out+=`<text x="20" y="700" font-size="24">${escapeText(e.title)} / original spatial analysis</text>`;for(const [i,r] of e.regions.entries())out+=`<text x="20" y="${760+i*80}" font-size="17">${escapeText((i+1)+' / '+r.label)}</text><text x="20" y="${790+i*80}" font-size="14">${escapeText(r.explanation)}</text>`;return out+'</svg>';}
