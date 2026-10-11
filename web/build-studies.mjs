// Developer-only deterministic original SVG derivation. Not a runtime dependency.
import fs from 'node:fs';
import {createPractice,movementSVG} from './practice.mjs';
const meta=JSON.parse(fs.readFileSync(new URL('../curriculum/practice.json',import.meta.url)));
const data={records:JSON.parse(fs.readFileSync(new URL('../knowledge/records.json',import.meta.url))),sources:JSON.parse(fs.readFileSync(new URL('../knowledge/sources.json',import.meta.url)))};
const directory=new URL('./art/studies/',import.meta.url),check=process.argv.includes('--check');
if(!check)fs.mkdirSync(directory,{recursive:true});
let stale=[];
for(const e of meta.movements){const svg=movementSVG(createPractice(meta,'movement',e.id,data),meta).replaceAll('\u2014','&#8212;')+'\n',target=new URL(e.id+'.svg',directory);if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==svg)stale.push(e.id);}else fs.writeFileSync(target,svg);}
if(stale.length){console.error('Stale original studies: '+stale.join(', '));process.exitCode=1;}else console.log((check?'Fresh':'Derived')+' 13 distinct original SVG studies; no external assets copied');
