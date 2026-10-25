/* Offline browsing and explicit agent handoff. No generation service is called. */
const cards=[...document.querySelectorAll('article[data-id]')];
let saved=[];
try{const value=JSON.parse(localStorage.getItem('design-taste-graphic-saved')||'[]');if(Array.isArray(value))saved=value.filter(x=>typeof x==='string');}catch{}
const field=id=>document.getElementById(id);
function filter(){if(!cards.length)return;const terms=field('search').value.toLowerCase().trim().split(/\s+/).filter(Boolean),style=field('style').value,use=field('use').value,onlySaved=field('saved').checked;let count=0;for(const card of cards){const tags=card.dataset.tags.split(' ');card.hidden=!!(terms.some(q=>!card.dataset.search.includes(q))||(style&&!tags.includes(style))||(use&&!tags.includes(use))||(onlySaved&&!saved.includes(card.dataset.id)));if(!card.hidden)count++;}field('count').textContent=count+' references';field('empty').hidden=count!==0;}
for(const card of cards){const button=card.querySelector('.save');const update=()=>{const active=saved.includes(card.dataset.id);button.setAttribute('aria-pressed',String(active));button.textContent=active?'Saved on this device':'Save locally';};update();button.addEventListener('click',()=>{saved=saved.includes(card.dataset.id)?saved.filter(x=>x!==card.dataset.id):[...saved,card.dataset.id];try{localStorage.setItem('design-taste-graphic-saved',JSON.stringify(saved));}catch{field('count').textContent='Storage unavailable; saved for this session only';}update();filter();});}
for(const id of ['search','style','use','saved'])field(id)?.addEventListener('input',filter);
field('reset')?.addEventListener('click',()=>{for(const id of ['search','style','use'])field(id).value='';field('saved').checked=false;filter();field('search').focus();});
field('copy')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(field('prompt').value);field('copy-status').textContent=' Prompt copied.';}catch{field('prompt').focus();field('prompt').select();field('copy-status').textContent=' Select and copy the prompt manually.';}});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&field('search')){event.preventDefault();field('search').focus();}});
filter();
field('revision')?.addEventListener('change',event=>{const option=event.target.selectedOptions[0];field('trial-image').src=option.dataset.image;field('trial-source').href=option.dataset.source;field('revision-note').textContent=option.dataset.note;});
