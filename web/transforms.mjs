export const effects=['grayscale','duotone','posterization','pixelation','threshold','edges'];
export const studies=['de-stijl','constructivism','pop-art','minimalism','op-art'];
export function validateFile(file){if(!['image/png','image/jpeg','image/webp'].includes(file.type))return 'Choose a PNG, JPEG or WebP image; SVG and other formats are not accepted.';if(file.size>20*1024*1024)return 'Image exceeds 20 MB. Choose a smaller file.';return null;}
export function fitSize(w,h){if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>12000||h>12000||w*h>40000000)throw Error('Image dimensions exceed 12,000px or 40 megapixels, or are invalid. Choose a smaller image.');const scale=Math.min(1,960/Math.max(w,h));return [Math.max(1,Math.round(w*scale)),Math.max(1,Math.round(h*scale))];}
function check(input,w,h){if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w*h>960*960||input.length!==w*h*4)throw Error('Invalid bounded pixel buffer');}
const luma=(d,i)=>.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
export function transform(input,w,h,effect,param=50){check(input,w,h);if(!effects.includes(effect)||!Number.isFinite(param)||param<0||param>100)throw Error('Invalid operation or parameter');const out=new Uint8ClampedArray(input);const block=2+Math.round(param*.3),levels=2+Math.round(param*.14);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,L=luma(input,i);let rgb;
if(effect==='grayscale'){const value=Math.round(L);rgb=[value,value,value];}
if(effect==='duotone'){const t=Math.pow(L/255,.5+param/100);rgb=[32+(231-32)*t,49+(143-49)*t,78+(68-78)*t];}
if(effect==='posterization')rgb=[0,1,2].map(c=>Math.round(input[i+c]/255*(levels-1))*255/(levels-1));
if(effect==='pixelation'){const j=(Math.floor(y/block)*block*w+Math.floor(x/block)*block)*4;rgb=[input[j],input[j+1],input[j+2]];out[i+3]=input[j+3];}
if(effect==='threshold'){const v=L>=param*2.55?255:0;rgb=[v,v,v];}
if(effect==='edges'){const at=(a,b)=>luma(input,(Math.max(0,Math.min(h-1,b))*w+Math.max(0,Math.min(w-1,a)))*4);const gx=-at(x-1,y-1)+at(x+1,y-1)-2*at(x-1,y)+2*at(x+1,y)-at(x-1,y+1)+at(x+1,y+1);const gy=-at(x-1,y-1)-2*at(x,y-1)-at(x+1,y-1)+at(x-1,y+1)+2*at(x,y+1)+at(x+1,y+1);const v=Math.min(255,Math.hypot(gx,gy)*(.2+param/50));rgb=[v,v,v];}
out.set(rgb,i);}
return out;}
export function study(input,w,h,id){check(input,w,h);if(!studies.includes(id))throw Error('Visual study pending');const out=new Uint8ClampedArray(input);const palette=[[32,37,31],[245,241,232],[198,58,40],[35,77,134],[236,195,64]];
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,u=x/w,v=y/h;let rgb;
if(id==='de-stijl'){const plane=Math.floor(u*4)+Math.floor(v*3)*4;const c=palette[plane%palette.length];const L=luma(input,i)/255;rgb=c.map(a=>a*(.65+.35*L));if(Math.abs(u-.25)<.009||Math.abs(u-.7)<.009||Math.abs(v-.38)<.009||Math.abs(v-.75)<.009)rgb=palette[0];}
if(id==='constructivism'){const L=luma(input,i);rgb=[L,L*.93,L*.83];if(Math.abs(v-(.85-u*.7))<.055)rgb=[177,49,32];}
if(id==='pop-art'){const sx=Math.min(w-1,Math.floor((u*2%1)*w)),sy=Math.min(h-1,Math.floor((v*2%1)*h)),j=(sy*w+sx)*4;const panel=Math.floor(u*2)+2*Math.floor(v*2);const t=luma(input,j)/255;const a=palette[panel+1],b=palette[(panel+3)%5];rgb=a.map((c,k)=>c*(1-t)+b[k]*t);}
if(id==='minimalism'){const step=Math.max(1,Math.round(Math.min(w,h)/6));const j=(Math.min(h-1,Math.floor(y/step)*step)*w+Math.min(w-1,Math.floor(x/step)*step))*4;const L=luma(input,j);const value=L>170?245:L>90?150:38;rgb=[value,value*.98,value*.93];}
if(id==='op-art'){const L=luma(input,i);const stripe=Math.floor(u*24+Math.sin(v*8)*.65)%2;const value=stripe===0?25:235;rgb=[0,1,2].map(c=>value*.7+input[i+c]*.3);if(L<45)rgb=rgb.map(a=>a*.6);}
out.set(rgb,i);out[i+3]=255;}
return out;}
