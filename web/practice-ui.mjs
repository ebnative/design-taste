import * as P from './practice.mjs';
import {decodeWav,MAX_WAV_BYTES,audioBuffer,audioReceipt} from './speech-audio.mjs';
import {history} from './studio.mjs';
import {videoCapability,exportOriginalVideo} from './video-export.mjs';
const clone=v=>structuredClone(v);
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
let dirty=false;
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
function svgInto(target,svg){const parsed=new DOMParser().parseFromString(svg,'image/svg+xml');if(parsed.querySelector('parsererror'))throw Error('SVG rendering failed; valid work retained.');target.replaceChildren(document.importNode(parsed.documentElement,true));}
function download(blob,name,message){if(!blob)throw Error('Export failed; work retained.');const url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);message.textContent='Prepared '+name+'. Browser controls saving; this is not a persistence receipt.';}
async function raster(svg,name,message){
 message.textContent='PNG rendering pending. No file saved yet.';const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('PNG decode failed; SVG and work retained.'));img.src=url;});const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;canvas.getContext('2d').drawImage(img,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));download(blob,name,message);}catch(e){message.textContent=e.message;}finally{URL.revokeObjectURL(url);}
}
export function mountPractice(host,data){
 const meta=data.practice,params=new URLSearchParams(location.search),readonly=host.dataset.readonly==='true';
 let kind=host.dataset.kind||'lesson',id=host.dataset.id||'03';
 if(host.dataset.lab){if(meta.movements.some(e=>e.id===params.get('movement'))){kind='movement';id=params.get('movement');}else if(meta.lessons.some(e=>e.id===params.get('lesson'))&&!['01','02'].includes(params.get('lesson')))id=params.get('lesson');}
 const entry=(kind==='lesson'?meta.lessons:meta.movements).find(e=>e.id===id);
 let state=P.createPractice(meta,kind,id,data),timeline=history(state),selectedLayer=state.documents[0]?.layers[0].id,region=entry.regions?.some(r=>r.id===params.get('region'))?params.get('region'):entry.regions?.[0].id,small=false,time=0,playing=false,raf=0,started=0,playFrom=0,frames=0,playView='after',audio=null,audioSource=null,importGeneration=0,speech=null,speechOffset=0,speechGeneration=0;
 host.replaceChildren();host.classList.add('practice','studio');
 host.append(node('h3',(kind==='movement'?entry.title:id+' / '+entry.title)));
 const grid=node('div',null,'practice-grid'),center=node('div',null,'practice-center'),rail=node('aside',null,'practice-rail'),inspector=node('aside',null,'practice-inspector');grid.append(center,rail,inspector);host.append(grid,node('p',entry.task||entry.teaching,'studio-teaching'));
 const comparison=node('div',null,'practice-comparison'),before=node('div',null,'practice-before'),stage=node('div',null,'practice-stage');comparison.append(before,stage);center.append(comparison);
 const description=node('p',null,'region-explanation');description.setAttribute('aria-live','polite');center.append(description);
 const ref=node('figure'),image=node('img');image.src='reference.svg';image.width=960;image.height=640;image.alt='Unchanged project-owned original still life';ref.append(image,node('figcaption','Unchanged original / '+meta.reference));rail.append(ref,node('p',meta.ownership,'small'));
 rail.append(node('p',entry.limitations||entry.limits,'small'));
 const status=node('p','Working source / no completion awarded','practice-status');status.setAttribute('aria-live','polite');host.append(status);
 const message=node('p',null,'practice-message');message.setAttribute('role','status');host.append(message);
 const fieldNodes={};let docSelect,layerSelect,view,undo,redo,scrub,hold,caption,purpose,staticGrid,evidence,labLink,encoding=false;
 function action(parent,label,fn){const b=node('button',label);b.type='button';b.onclick=async()=>{try{await fn();}catch(e){message.textContent=e.message;sync();}};parent.append(b);return b;}
 function field(parent,label,type,value,onchange,options={}){const wrap=node('label',label),input=node(type==='textarea'?'textarea':type==='select'?'select':'input');if(type!=='textarea'&&type!=='select')input.type=type;
  if(type==='select')for(const [v,name] of options.choices||[]){const o=node('option',name);o.value=v;input.append(o);}
  if(type==='checkbox')input.checked=value;else input.value=value;for(const k of ['min','max','step','maxLength'])if(options[k]!==undefined)input[k]=options[k];input.onchange=()=>{try{onchange(type==='checkbox'?input.checked:type==='number'?Number(input.value):input.value);}catch(e){message.textContent=e.message;sync();}};wrap.append(input);parent.append(wrap);return input;
 }
 function adopted(viewName='after'){return viewName==='before'?{...state,documents:state.before,controls:state.controlBefore}:state;}
 function mutate(fn){pause();const n=clone(state);fn(n);commit(n);}
 function commit(n){state=P.validatePractice(n,meta,data);state=timeline.commit(state);dirty=true;sync();render();}
 function textExport(content,name,type='text/plain;charset=utf-8'){download(new Blob([content],{type}),name,message);}
 function currentSVG(viewName='after',at=time,width=null){const s=adopted(viewName);if(kind==='movement')return P.movementSVG(s,meta,region);if(P.duration(s)>0){const f=P.frameAt(s,Math.min(at,P.duration(s)));return P.documentSVG(s,f.index,width,Math.min(at,P.duration(s))-f.start);}return P.documentSVG(s,s.selected,width);}
 function sync(){
  if(docSelect){docSelect.replaceChildren();state.documents.forEach((d,i)=>{const o=node('option',`${i+1} / ${d.title} / ${d.width}×${d.height}${d.duration?' / '+d.duration+'s':''}`);o.value=i;docSelect.append(o);});docSelect.value=state.selected;}
  if(layerSelect){const d=state.documents[state.selected];if(!d.layers.some(l=>l.id===selectedLayer))selectedLayer=d.layers[0].id;layerSelect.replaceChildren();d.layers.forEach((l,i)=>{const o=node('option',`${i+1} / ${l.id} / ${l.type}`);o.value=l.id;layerSelect.append(o);});layerSelect.value=selectedLayer;const l=d.layers.find(l=>l.id===selectedLayer);for(const [k,input] of Object.entries(fieldNodes)){if(k==='visible')input.checked=l[k];else input.value=l[k];input.closest('label').hidden=(['text','font','size','tracking','leading'].includes(k)&&l.type!=='text')||(['mask','opacity'].includes(k)&&id==='03');}}
  if(undo)undo.disabled=!timeline.canUndo;if(redo)redo.disabled=!timeline.canRedo;
  if(hold){const d=state.documents[state.selected];hold.value=d.duration;caption.value=d.caption;purpose.value=d.purpose;scrub.max=P.duration(adopted(playView));scrub.value=time;}
  for(const input of host.querySelectorAll('[data-journal]'))if(document.activeElement!==input)input.value=state.journal[input.dataset.journal];
  for(const input of host.querySelectorAll('[data-control]')){const value=state.controls[input.dataset.control];if(input.type==='checkbox')input.checked=value;else input.value=value;}
 }
 function render(){
  const width=small?(kind==='movement'?150:state.documents[state.selected].width===1920?480:state.documents[state.selected].width===512?256:state.documents[state.selected].width/4):null;
  svgInto(stage,currentSVG('after',time,width));svgInto(before,currentSVG('before',time,width));before.hidden=readonly||view?.value==='after';stage.hidden=view?.value==='before';comparison.classList.toggle('inspection',small);
  if(kind==='movement'){description.textContent=entry.regions.find(r=>r.id===region).explanation;if(labLink)labLink.href=`lab.html?movement=${id}&region=${region}#full-practice`;}else description.textContent=state.documents[state.selected].purpose;
  for(const b of host.querySelectorAll('[data-region-button]'))b.setAttribute('aria-pressed',String(b.dataset.regionButton===region));
  const delta=kind==='movement'?JSON.stringify(state.controls)!==JSON.stringify(state.controlBefore):JSON.stringify(state.documents)!==JSON.stringify(state.before)||JSON.stringify(state.cards)!==JSON.stringify(state.cardBefore);
  status.textContent=`${delta?'Actual source delta retained':'No source delta yet'} · ${state.snapshots.length} retained alternatives · ${state.playback.length} browser timing receipts · working evidence, not assessment.`;
  if(scrub)scrub.value=time;
  if(staticGrid){staticGrid.replaceChildren();state.documents.forEach((d,i)=>{const f=node('figure'),v=node('div');svgInto(v,P.documentSVG(state,i,192));f.append(v,node('figcaption',`${i+1} / ${d.title} / hold ${d.duration}s`));staticGrid.append(f);});}
  for(const prior of host.querySelectorAll('[data-card-prior]')){const i=Number(prior.dataset.cardPrior);prior.textContent='Pinned source / claim / scope: '+state.cardBefore[i].source+' / '+state.cardBefore[i].claim+' / '+state.cardBefore[i].limits;}
  for(const input of host.querySelectorAll('[data-card-field]')){const [i,k]=input.dataset.cardField.split(':');if(document.activeElement!==input)input.value=state.cards[Number(i)][k];}
 }
 // Real selection is available both on the artwork and through keyboard-native selects.
 stage.onclick=e=>{const l=e.target.closest('[data-layer]')?.dataset.layer,r=e.target.closest('[data-region]')?.dataset.region;if(l&&layerSelect){selectedLayer=l;sync();}if(r&&kind==='movement'){region=r;render();}};
 if(host.dataset.lab){const choose=field(rail,'Practice / navigation (download work first)','select',kind+':'+id,()=>{}, {choices:[...meta.lessons.map(e=>['lesson:'+e.id,e.id+' / '+e.title]),...meta.movements.map(e=>['movement:'+e.id,e.id])]});choose.onchange=()=>{if(dirty&&!confirm('Navigate away from unsaved practice? Download JSON first.')){choose.value=kind+':'+id;return;}const [k,v]=choose.value.split(':');location.href=k==='movement'?`lab.html?movement=${v}#full-practice`:`lab.html?lesson=${v}#${['01','02'].includes(v)?'editable-studio':'full-practice'}`;};}
 if(kind==='movement'){
  const hotspots=node('div',null,'hotspots');inspector.append(node('h4','Spatial decisions'),hotspots);
  entry.regions.forEach((r,i)=>{const b=action(hotspots,`${i+1} / ${r.label}`,()=>{region=r.id;render();});b.dataset.regionButton=r.id;});
  labLink=node('a','Edit this linked study in Lab →','button primary');labLink.href=`lab.html?movement=${id}&region=${region}#full-practice`;inspector.append(labLink);const rec=data.records.find(r=>r.id===id);for(const sid of rec.source_ids){const a=node('a',sid+' / actual source and unchanged status','source-link');a.href='atlas.html#'+sid;rail.append(a);}if(entry.contextEvidence){rail.append(node('p',Object.values(entry.contextEvidence).join(' · '),'small'));}
  if(!readonly)for(const c of entry.controls){const input=field(inspector,c.label,c.type==='boolean'?'checkbox':c.type==='text'?'textarea':'number',state.controls[c.key],v=>commit(P.setControl(state,c.key,v,meta)),{min:c.min,max:c.max,step:c.step,maxLength:160});input.dataset.control=c.key;}
 }
 if(readonly){before.hidden=true;description.textContent=entry.regions[0].explanation;render();before.hidden=true;return {getState:()=>clone(state)};}
 const actions=node('div',null,'studio-actions');center.append(actions);
 undo=action(actions,'Undo practice',()=>{pause();state=timeline.undo();time=0;dirty=true;sync();render();});redo=action(actions,'Redo practice',()=>{pause();state=timeline.redo();time=0;dirty=true;sync();render();});
 action(actions,'Pin current before',()=>mutate(n=>{n.before=clone(n.documents);n.controlBefore=clone(n.controls);n.cardBefore=clone(n.cards);}));
 view=field(actions,'Same-size comparison','select','both',()=>render(),{choices:[['both','Before and revised'],['before','Before only'],['after','Revised only']]});
 action(actions,'Full / reduced inspection',()=>{small=!small;render();message.textContent='Actual SVG export viewport '+stage.querySelector('svg').getAttribute('width')+'×'+stage.querySelector('svg').getAttribute('height')+'. Inspect at the same dimensions; fitted display is not measured readability.';});
 action(actions,'Retain alternative / revision snapshot',()=>mutate(n=>{if(n.snapshots.length>=6)throw Error('Six snapshots retained. Export evidence; no existing snapshot is erased.');n.snapshots.push({label:'Retained state '+(n.snapshots.length+1),documents:clone(n.documents),controls:clone(n.controls),cards:clone(n.cards)});}));
 action(actions,'Reset practice',()=>{if(!confirm('Discard only this practice state? Download JSON first. Pilot/pixel work is separate.'))return;importGeneration++;speechGeneration++;speech=null;speechOffset=0;pause();state=P.createPractice(meta,kind,id,data);timeline=history(state);time=0;small=false;dirty=true;sync();render();});
 if(kind==='lesson'){
  docSelect=field(rail,'Page / concept / format / shot','select',0,v=>{pause();state.selected=Number(v);selectedLayer=state.documents[state.selected].layers[0].id;time=state.documents.slice(0,state.selected).reduce((t,d)=>t+d.duration,0);sync();render();},{choices:[]});
  inspector.append(node('h4','Independent editable layers'));
  layerSelect=field(inspector,'Selected layer','select',selectedLayer,v=>{selectedLayer=v;sync();},{choices:[]});
  const ranges={x:[-1920,2880,1],y:[-1600,2400,1],w:[1,3840,1],h:[1,3200,1],rotation:[-180,180,1],size:[8,200,1],tracking:[-8,20,.5],leading:[8,260,1],mask:[0,70,1],opacity:[.1,1,.05],endX:[-1920,2880,1],endY:[-1600,2400,1],endScale:[.25,2,.05]};
  const labels={x:'Left / pixels',y:'Top or type baseline / pixels',w:'Layer width / pixels',h:'Layer height / pixels',rotation:'Layer rotation / degrees',size:'Type size / pixels',tracking:'Tracking / pixels',leading:'Leading / pixels',mask:'Mask left crop / percent',opacity:'Layer opacity',endX:'Motion end left / pixels',endY:'Motion end top / pixels',endScale:'Motion end scale'};
  for(const [k,[min,max,step]] of Object.entries(ranges)){if(k.startsWith('end')&&!['09','10','11','12'].includes(id))continue;fieldNodes[k]=field(inspector,labels[k],'number',0,v=>commit(P.editLayer(state,state.selected,selectedLayer,{[k]:v})),{min,max,step});}
  fieldNodes.fill=field(inspector,'Layer fill / RGB','color','#234d86',v=>commit(P.editLayer(state,state.selected,selectedLayer,{fill:v})));
  fieldNodes.visible=field(inspector,'Layer visible','checkbox',true,v=>commit(P.editLayer(state,state.selected,selectedLayer,{visible:v})));
  fieldNodes.text=field(inspector,'Exact copy / line breaks and glyphs','textarea','',v=>commit(P.editLayer(state,state.selected,selectedLayer,{text:v})),{maxLength:800});
  fieldNodes.font=field(inspector,'System font family / fallback must be journaled','select','system-ui',v=>commit(P.editLayer(state,state.selected,selectedLayer,{font:v})),{choices:['system-ui','Georgia','monospace'].map(v=>[v,v])});
  action(inspector,'Layer backward',()=>mutate(n=>{const layers=n.documents[n.selected].layers,i=layers.findIndex(l=>l.id===selectedLayer);if(i>0)[layers[i-1],layers[i]]=[layers[i],layers[i-1]];}));
  action(inspector,'Layer forward',()=>mutate(n=>{const layers=n.documents[n.selected].layers,i=layers.findIndex(l=>l.id===selectedLayer);if(i<layers.length-1)[layers[i+1],layers[i]]=[layers[i],layers[i+1]];}));
 }
 evidence=node('div',null,'practice-evidence');host.append(evidence);evidence.append(node('h4','Concept → predict → manipulate → compare → explain → revise → evidence'));
 for(const k of Object.keys(state.journal)){const input=field(evidence,k==='font'?'Font / actual fallback / glyph inspection journal':k[0].toUpperCase()+k.slice(1),'textarea',state.journal[k],v=>mutate(n=>{n.journal[k]=v;}),{maxLength:2000});input.dataset.journal=k;}
 if(id==='04'&&kind==='lesson'){
  const cards=node('div',null,'research-cards');evidence.append(cards);
  for(let i=0;i<2;i++){
   const card=node('fieldset');card.append(node('legend','Research card '+(i+1)+' / learner-unreviewed'));
   const prior=node('p');prior.dataset.cardPrior=i;card.append(prior);
   const record=field(card,'Canonical record / category / first source','select',state.cards[i].record,v=>mutate(n=>{const r=data.records.find(r=>r.id===v),s=data.sources.find(s=>s.id===r.source_ids[0]);Object.assign(n.cards[i],{record:r.id,category:r.record_type,source:s.id,page:s.url,claim:r.historical_context,locator:'',accessed:'',passage:'',limits:'Named passage inspection required; source import and learner review are separate.'});}),{choices:data.records.map(r=>[r.id,r.title_en+' / '+r.record_type])});record.dataset.cardField=i+':record';
   for(const k of ['source','page','locator','accessed','passage','claim','category','context','proposal','limits']){
    const input=field(card,k,'textarea',state.cards[i][k],v=>mutate(n=>{if(k==='source'){const s=data.sources.find(s=>s.id===v);if(!s)throw Error('Choose an actual canonical source ID; previous card retained.');n.cards[i].source=v;n.cards[i].page=s.url;}else n.cards[i][k]=v;}),{maxLength:2000});input.dataset.cardField=i+':'+k;if(['page','category'].includes(k))input.readOnly=true;
   }
   const a=node('a','Open exact source ↗');a.href=state.cards[i].page;a.onclick=()=>{a.href=state.cards[i].page;};card.append(a);cards.append(card);
  }
 }
 if(kind==='lesson'&&id==='07'){
  for(const k of ['event','date','place']){const input=field(evidence,'Exact '+k+' across all six formats','textarea',state.controls[k],v=>commit(P.setCopy(state,k,v)),{maxLength:k==='event'?80:120});input.dataset.control=k;}
  action(actions,'Shortest headline specimen',()=>commit(P.seriesStress(state,'short')));action(actions,'Longest headline specimen',()=>commit(P.seriesStress(state,'long')));
 }
 if(kind==='lesson'&&id==='08'){
  const covers=node('div',null,'practice-covers');center.append(covers);
  state.alternatives.forEach((d,i)=>{const f=node('figure'),art=node('div');svgInto(art,P.documentSVG({...state,documents:[d],selected:0},0,240));f.append(art,node('figcaption',d.title));action(f,'Choose cover direction '+(i+1)+' provisionally',()=>mutate(n=>{n.documents[0]={...clone(n.alternatives[i]),id:'page-1'};}));action(f,'Download cover direction '+(i+1),()=>textExport(P.documentSVG({...state,documents:[d],selected:0},0),`cover-direction-${i+1}.svg`,'image/svg+xml'));covers.append(f);});
 }
 if(kind==='lesson'&&id==='06'){
  const specimens=node('div',null,'identity-specimens');center.append(specimens);
  action(actions,'Declared long wordmark use case',()=>mutate(n=>{const l=n.documents[n.selected].layers.find(l=>l.id==='wordmark');l.text='FIELD / SHARED WORKSHOP';l.size=26;l.tracking=1;n.journal.limitations+=' Long-content fixture: FIELD / SHARED WORKSHOP at full 512px wordmark use; 32px is mark-only. Inspect glyphs/counters and same-size optical spacing; no reader test.';}));
  action(actions,'Render actual 32 / 256 specimens',()=>{specimens.replaceChildren();for(const size of [32,256])for(const mode of ['color','one-color','reverse']){const f=node('figure'),v=node('div'),svg=P.identitySVG(state,size,mode);svgInto(v,svg);v.className='actual-identity-size';f.append(v,node('figcaption',size+'px / '+mode+' / mark-only'));action(f,'SVG '+size+' '+mode,()=>textExport(svg,`identity-${size}-${mode}.svg`,'image/svg+xml'));action(f,'PNG '+size+' '+mode,()=>raster(svg,`identity-${size}-${mode}.png`,message));specimens.append(f);}});
 }
 const motion=kind==='lesson'&&['09','10','11'].includes(id);
 function stopAudio(){if(audioSource){try{audioSource.stop();}catch{}audioSource=null;}}
 function pause(){
  if(!playing){stopAudio();return;}playing=false;cancelAnimationFrame(raf);stopAudio();
  const receipt={view:playView,from:playFrom,to:time,seconds:(performance.now()-started)/1000,frames,mode:'browser-raf'};
  if(state.playback.length<20){state.playback.push(receipt);timeline.commit(state);dirty=true;}status.textContent='Paused / actual browser time '+time.toFixed(3)+'s / '+frames+' rendered frames; encoding not claimed.';
 }
 async function startAudio(at,viewName){if(id!=='11')return;if(!window.AudioContext)throw Error('Web Audio unavailable; silent playback only. Original WAV export remains available.');audio ||= new AudioContext();await audio.resume();let buffer;if(speech)buffer=audioBuffer(audio,speech,P.duration(adopted(viewName)),speechOffset);else{const samples=P.audioSamples(adopted(viewName),24000);buffer=audio.createBuffer(1,samples.length,24000);buffer.copyToChannel(samples,0);}audioSource=audio.createBufferSource();audioSource.buffer=buffer;audioSource.connect(audio.destination);audioSource.start(0,at);}
 async function play(viewName){
  pause();playView=viewName;const total=P.duration(adopted(viewName));if(time>=total)time=0;playFrom=time;started=performance.now();frames=0;
  if(id==='11')try{await startAudio(time,viewName);}catch(e){message.textContent=e.message;}
  // Explicit user action only, including when reduced motion is preferred.
  started=performance.now();playing=true;function tick(now){if(!playing)return;const exact=Math.min(total,playFrom+Math.max(0,(now-started)/1000));time=P.playbackTime(playFrom,now,started,total,state.controls.fps);render();frames++;if(exact>=total){time=total;pause();render();}else raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);sync();
 }
 if(motion){
  const transport=node('fieldset',null,'practice-transport');transport.append(node('legend','Actual browser playback / no autoplay / static alternative'));center.append(transport);
  action(transport,'Play revised',()=>play('after'));action(transport,'Play before',()=>play('before'));action(transport,'Pause',()=>pause());
  scrub=field(transport,'Scrub exact seconds','range',0,v=>{}, {min:0,max:P.duration(state),step:1/state.controls.fps});scrub.oninput=()=>{pause();time=Number(scrub.value);render();message.textContent=`Static scrub ${time.toFixed(3)}s / ${state.controls.fps}fps frame grid. Not a playback receipt.`;};
  hold=field(transport,'Selected shot hold / seconds','number',0,v=>mutate(n=>{n.documents[n.selected].duration=v;}),{min:.25,max:10,step:.25});
  caption=field(transport,'Selected shot caption / exact UTF-8','textarea','',v=>mutate(n=>{n.documents[n.selected].caption=v;}),{maxLength:800});
  purpose=field(transport,'Selected shot communication purpose','textarea','',v=>mutate(n=>{n.documents[n.selected].purpose=v;}),{maxLength:800});
  const fps=field(transport,'Declared frame rate','select',state.controls.fps,v=>mutate(n=>{n.controls.fps=Number(v);}),{choices:[['24','24 fps'],['30','30 fps']]});fps.dataset.control='fps';
  staticGrid=node('div',null,'static-sequence');center.append(staticGrid);
  if(id==='11'){for(const [key,label,min,max,step] of [['gain','Original tone gain / max .3',0,.3,.01],['frequency','Original fundamental / Hz',80,600,10]]){const input=field(transport,label,'number',state.controls[key],v=>mutate(n=>{n.controls[key]=v;}),{min,max,step});input.dataset.control=key;}
   action(transport,'Measure original PCM peaks',()=>{message.textContent=JSON.stringify(P.audioPeaks(state));});
   action(transport,'Download original audio WAV',()=>download(new Blob([P.wavBytes(state)],{type:'audio/wav'}),'original-narrative.wav',message));
   action(transport,'Download UTF-8 captions SRT',()=>textExport(P.srt(state),'original-captions.srt'));
   const attest=field(transport,'I own this recording or have permission to use it locally','checkbox',false,()=>{});
   const speechInput=field(transport,'Import local speech WAV / PCM16 mono or stereo / 8–48 kHz / 36s / 8 MB','file','',()=>{});speechInput.accept='.wav,audio/wav';
   speechInput.onchange=async()=>{const token=++speechGeneration,file=speechInput.files?.[0],allowed=attest.checked;if(!file)return;try{if(!allowed||file.size>MAX_WAV_BYTES)throw Error('Rights attestation and bounded WAV required. Previous audio retained.');const next=decodeWav(new Uint8Array(await file.arrayBuffer()),allowed);if(token!==speechGeneration)return;audioReceipt(next,P.duration(state),speechOffset);pause();speech=next;dirty=true;message.textContent='Local recording admitted in page memory. Listen and compare every caption text and timestamp; alignment is unknown until manually heard. No upload.';}catch(e){if(token===speechGeneration)message.textContent=e.message;}finally{if(token===speechGeneration)speechInput.value='';}};
   field(transport,'Speech start offset / timeline seconds','number',0,v=>{if(!Number.isFinite(v)||v<0||v>=P.duration(state))throw Error('Offset outside timeline; previous audio offset retained.');if(speech)audioReceipt(speech,P.duration(state),v);pause();speechOffset=v;dirty=true;},{min:0,max:35.9,step:.1});
   action(transport,'Measure admitted recording / reload recipe',()=>{if(!speech)throw Error('Import an authorized speech WAV first.');const receipt=audioReceipt(speech,P.duration(state),speechOffset);message.textContent=JSON.stringify(receipt);textExport(JSON.stringify({...receipt,captions:P.timingManifest(state).shots},null,2),'local-speech-recipe.json','application/json');});
   action(transport,'Remove local recording',()=>{pause();speechGeneration++;speech=null;speechOffset=0;message.textContent='Recording cleared. Tone fallback is non-speech, not alignment evidence.';});
   transport.append(node('p','Imported speech is played from the scrub position and muxed into WebM; captions/SRT use the same timeline. Listen to recheck text and time; no recognition or mastery claim. Original tone fallback is not speech. Recording and offset are page-memory only: project JSON excludes media and paths; reimport WAV after reload. WebM is a candidate only after its actual receipt.','small'));
  }
  action(transport,'First / middle / final SVG frames',()=>{const total=P.duration(state);for(const [name,t] of [['first',0],['mid',total/2],['final',total]])textExport(currentSVG('after',t),`${id}-${name}-1920x1080.svg`,'image/svg+xml');});
  action(transport,'First / middle / final PNG frames',async()=>{const total=P.duration(state);for(const [name,t] of [['first',0],['mid',total/2],['final',total]])await raster(currentSVG('after',t),`${id}-${name}-1920x1080.png`,message);});
  action(transport,'Timing JSON + CSV',()=>{textExport(JSON.stringify(P.timingManifest(state),null,2),`${id}-timing.json`,'application/json');textExport(P.timingCSV(state),`${id}-timing.csv`,'text/csv');});
  action(transport,'Check native WebM export capability',()=>{message.textContent=JSON.stringify(videoCapability());});
  action(transport,'Encode original WebM / real-time',async()=>{
   if(encoding)throw Error('One encoding is pending. Existing work and source are retained.');
   pause();encoding=true;message.textContent='Encoding pending. No saved or verified video claimed.';
   try{const snapshot=P.validatePractice(state,meta,data),result=await exportOriginalVideo(snapshot,p=>{message.textContent=`Encoding ${p.seconds.toFixed(2)} / ${p.total}s. Pending; no saved-file claim.`;},speech?{source:speech,offset:speechOffset}:null);download(result.blob,`${id}-original.webm`,message);textExport(JSON.stringify(result.receipt,null,2),`${id}-video-export-receipt.json`,'application/json');}
   catch(e){message.textContent='Video export failed: '+e.message+' Keep editable source, frames and timing; encoded gate is unverified.';}
   finally{encoding=false;}
  });
 }
 const outputs=node('div',null,'studio-actions');evidence.append(outputs);
 action(outputs,'Download editable project JSON',()=>textExport(P.serializePractice(P.validatePractice(state,meta,data)),`${kind}-${id}-project.json`,'application/json'));
 action(outputs,'Download current editable SVG',()=>textExport(currentSVG(),`${kind}-${id}-current.svg`,'image/svg+xml'));
 action(outputs,'Download current PNG',()=>raster(currentSVG(),`${kind}-${id}-current.png`,message));
 if(kind==='lesson'){
  action(outputs,'Download all full + reduced SVG before/revised',()=>{for(const name of ['before','after']){const s=adopted(name);s.documents.forEach((d,i)=>{for(const width of [d.width,d.width===1920?480:d.width===512?256:d.width/4])textExport(P.documentSVG(s,i,width),`${id}-${d.id}-${name}-${width}.svg`,'image/svg+xml');});}});
  action(outputs,'Download all full + reduced PNG before/revised',async()=>{for(const name of ['before','after']){const s=adopted(name);for(const [i,d] of s.documents.entries())for(const width of [d.width,d.width===1920?480:d.width===512?256:d.width/4])await raster(P.documentSVG(s,i,width),`${id}-${d.id}-${name}-${width}.png`,message);}});
  action(outputs,'Download static publication / sequence',()=>textExport(P.publicationHTML(state),`${id}-static-publication.html`,'text/html'));
  action(outputs,'Download process / rights / gates',()=>{textExport(P.journalMarkdown(state),`${id}-PROCESS.md`);textExport(JSON.stringify({gates:P.gates(state),assets:state.documents.flatMap(d=>d.layers.map(l=>({artifact:d.id,layer:l.id,medium:l.type,ownership:'original-project-geometry-or-user-original-copy',font:l.type==='text'?l.font:null,limits:'No external asset/font imported; user copy rights require actual review'})))},null,2),`${id}-rights-gates.json`,'application/json');});
  if(id==='04')action(outputs,'Download two research cards Markdown',()=>textExport(P.researchMarkdown(state),'RESEARCH-CARDS.md'));
  if(id==='06'||id==='10')action(outputs,'Download BRAND.md',()=>textExport(P.brandMarkdown(state),'BRAND.md'));
 }else action(outputs,'Download spatial annotation SVG',()=>textExport(P.movementAnalysisSVG(state,meta),`${id}-spatial-analysis.svg`,'image/svg+xml'));
 const importInput=field(evidence,'Import same practice / typed original-only JSON / max 400 KB','file','',()=>{});importInput.accept='application/json,.json';
 importInput.onchange=async()=>{const token=++importGeneration,file=importInput.files?.[0];if(!file)return;message.textContent='Import pending validation. Existing work retained.';try{if(file.size>400000)throw Error('Project exceeds 400 KB; existing work retained.');const next=P.importPractice(await file.text(),meta,data);if(token!==importGeneration)return;if(next.kind!==kind||next.id!==id)throw Error('Choose the matching practice first; current project retained.');if(!confirm('Replace current practice with validated portable evidence? Download current work first.'))return;pause();speechGeneration++;speech=null;speechOffset=0;state=next;timeline=history(state);time=0;dirty=true;sync();render();message.textContent='Validated project restored in page memory. No upload or persistent save occurred.';}catch(e){message.textContent=e.message;}finally{if(token===importGeneration)importInput.value='';}};
 if(kind==='lesson'&&id==='12'){
  const sourceInput=field(evidence,'Import selected production source / 05 06 08 10 11 / version 2','file','',()=>{});sourceInput.accept='application/json,.json';sourceInput.onchange=async()=>{const token=++importGeneration,file=sourceInput.files?.[0];if(!file)return;try{if(file.size>400000)throw Error('Source exceeds 400 KB; case study retained.');const source=P.importPractice(await file.text(),meta,data),next=P.adoptCaseSource(state,source,meta,data);if(token!==importGeneration)return;if(!confirm('Adopt this validated production source, before/revised and alternatives?'))return;commit(next);}catch(e){if(token===importGeneration)message.textContent=e.message;}finally{if(token===importGeneration)sourceInput.value='';}};
  const ledger=node('fieldset');ledger.append(node('legend','Artifact → criterion → support ledger'));evidence.append(ledger);const row={artifact:'',criterion:'',source:'',locator:'',rights:'',limits:''};for(const key of Object.keys(row))field(ledger,key,'textarea','',v=>{row[key]=v;},{maxLength:2000});action(ledger,'Retain support row',()=>mutate(n=>{if(n.ledger.length>=20)throw Error('Twenty support rows retained; export before adding more.');n.ledger.push(clone(row));}));action(outputs,'Download case study Markdown',()=>textExport(P.caseMarkdown(state),'CASE-STUDY.md'));action(outputs,'Download support ledger + separate gates',()=>textExport(JSON.stringify({ledger:state.ledger,gates:P.gates(state)},null,2),'support-gates.json','application/json'));
 }
 evidence.append(node('p','No learner notes, media or uploads are stored automatically. JSON download/import is the portable transfer; links do not carry edits. Errors retain current work. Export prepared is not saved. Native, source, rights, artifact, software, independent and human states remain separate.','small'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 sync();render();return {getState:()=>clone(state),pause};
}
export function initializePractices(data){
 for(const host of document.querySelectorAll('.practice-host')){
  let mounted=false;const mount=()=>{if(mounted)return;mounted=true;try{mountPractice(host,data);}catch(e){host.append(node('p','Practice unavailable: '+e.message+'. Static reference/source links and canonical contracts remain readable.'));}};
  const details=host.closest('details');if(details&&!details.open){details.addEventListener('toggle',()=>{if(details.open)mount();});}else mount();
 }
}
