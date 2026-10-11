import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as Studio from './studio.mjs';
const spec=JSON.parse(fs.readFileSync(new URL('../curriculum/studio.json',import.meta.url)));
let failures=0;
async function test(name,fn){try{await fn();console.log('PASS '+name);}catch(e){failures++;console.error('FAIL '+name+': '+e.message);}}
await test('analysis follows moved/scaled revised reconstruction',()=>{
 const s=Studio.editObject(Studio.createState(spec),'vessel',{x:.8,scale:.5});
 assert.match(Studio.analysisSVG(s,spec),/x="501" y="321" width="69" height="114"/);
 assert.match(Studio.analysisSVG(s,spec),/Revised reconstruction/);
});
await test('planes unequal areas, interruption and enclosing highlight',()=>{
 const s=Studio.createState(spec,'planes'),svg=Studio.sceneSVG(s,600,'arch',spec);
 assert.match(svg,/width="105" height="150"/);assert.match(svg,/width="120" height="60"/);assert.match(svg,/width="70" height="80"/);
 assert.match(svg,/M0 0 H130 V210 H90 V65 H40 V210 H0 Z/);
 assert.match(svg,/x="272" y="164" width="138" height="218"/);
 for(const [id,w,h] of [['vessel',105,150],['arch',130,210],['sphere',70,80],['fold',120,60]]){
  const moved=Studio.editObject(s,id,{x:.4,y:.3,scale:.5});
  assert.ok(Studio.sceneSVG(moved,600,id,spec).includes(`x="238" y="178" width="${(w+8)*.5}" height="${(h+8)*.5}"`),id+' scaled bounds');
 }
});
class Node {
 constructor(tag,text=''){this.tagName=tag.toUpperCase();this.textContent=text;this.children=[];this.dataset={};this.value='';this.classList={add(){},toggle(){}};}
 append(...n){this.children.push(...n);} replaceChildren(...n){this.children=n;} setAttribute(k,v){this[k]=v;}
 get options(){return this.children;} addEventListener(){} focus(){} remove(){}
 querySelectorAll(selector){return all(this).filter(n=>selector==='input'?n.tagName==='INPUT':false);}
}
function all(n){return n.children.flatMap(c=>[c,...all(c)]);}
function mount(exercise){
 const host=new Node('div');host.dataset.exercise=exercise;
 const document={createElement:t=>new Node(t),importNode:n=>n,activeElement:null};
 const source=fs.readFileSync(new URL('./app.mjs',import.meta.url),'utf8');
 const code=source.slice(source.indexOf('function element('),source.indexOf('if(studioHosts.length)'));
 const ctx=vm.createContext({Studio,document,location:{search:''},URLSearchParams,structuredClone,confirm:()=>true,DOMParser:class{parseFromString(svg){return {querySelector:()=>null,documentElement:Object.assign(new Node('svg'),{svg})};}},studioDirty:false});
 vm.runInContext(code+';globalThis.mount=mountStudio;',ctx);ctx.mount(host,spec);
 const button=name=>all(host).find(n=>n.tagName==='BUTTON'&&n.textContent===name);
 const input=label=>all(host).find(n=>n.tagName==='LABEL'&&n.textContent===label).children[0];
 const section=cls=>all(host).find(n=>n.className===cls);
 // element assigns className directly, as the real DOM does.
 return {host,button,input,section};
}
await test('source-mounted color comparison and pin use variants',()=>{
 const ui=mount('color');ui.button('Create six equal-size specimens').onclick();
 const third=ui.input('Revise background 3');third.value='#00ff00';third.onchange();
 const bg=ui.input('Revise background 1');bg.value='#ff0000';bg.onchange();
 const view=ui.input('Compare');view.value='before';view.onchange();
 const before=ui.section('studio-before'),stage=ui.section('studio-stage');
 assert.equal(before.hidden,false);assert.equal(stage.hidden,true);assert.match(before.children[0].svg,/fill="#fffdf7"/);
 const card=ui.section('color-specimens').children[2];assert.equal(card.children[0].hidden,false);assert.equal(card.children[1].hidden,true);assert.match(card.children[0].children[0].svg,/fill="#234d86"/);assert.match(card.children[1].children[0].svg,/fill="#00ff00"/);
 view.value='after';view.onchange();assert.equal(before.hidden,true);assert.equal(stage.hidden,false);assert.match(stage.children[0].svg,/fill="#ff0000"/);
 ui.button('Pin before').onclick();view.value='before';view.onchange();assert.match(before.children[0].svg,/fill="#ff0000"/);
 view.value='both';view.onchange();assert.equal(before.hidden,false);assert.equal(stage.hidden,false);const pinned=ui.section('color-specimens').children[2];assert.match(pinned.children[0].children[0].svg,/fill="#00ff00"/);assert.equal(pinned.children[0].hidden,false);assert.equal(pinned.children[1].hidden,false);
});
await test('source-mounted background sync after undo redo reset import',async()=>{
 const ui=mount('composition'),bg=ui.input('Scene background / RGB');bg.value='#ff0000';bg.onchange();
 ui.button('Undo').onclick();assert.equal(bg.value,'#fffdf7');ui.button('Redo').onclick();assert.equal(bg.value,'#ff0000');
 ui.button('Reset studio').onclick();assert.equal(bg.value,'#fffdf7');
 const s=Studio.createState(spec);s.background='#234d86';const upload=ui.input('Import original-only evidence / max 200 KB');upload.files=[{size:100,text:async()=>Studio.serialize(s)}];await upload.onchange();assert.equal(bg.value,'#234d86');
});
if(failures)process.exitCode=1;
