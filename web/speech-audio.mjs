// PCM stays in page memory, never in the portable project or an asset URI.
export const MAX_WAV_BYTES=8000000;
const check=ok=>{if(!ok)throw Error('Use an authorized local PCM16 WAV: mono/stereo, 8–48 kHz, at most 36 seconds / 8 MB. Previous audio retained.');};
export function decodeWav(bytes,attested){
 check(attested===true&&bytes instanceof Uint8Array&&bytes.length>=44&&bytes.length<=MAX_WAV_BYTES);
 const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),word=p=>String.fromCharCode(...bytes.subarray(p,p+4));
 check(word(0)==='RIFF'&&word(8)==='WAVE'&&v.getUint32(4,true)+8===bytes.length);
 let fmt=null,data=null;
 for(let p=12;p<bytes.length;){check(p+8<=bytes.length);const n=v.getUint32(p+4,true),end=p+8+n;check(end<=bytes.length);const tag=word(p);
  if(tag==='fmt '){check(!fmt&&n===16);fmt={format:v.getUint16(p+8,true),count:v.getUint16(p+10,true),rate:v.getUint32(p+12,true),byteRate:v.getUint32(p+16,true),align:v.getUint16(p+20,true),bits:v.getUint16(p+22,true)};}
  if(tag==='data'){check(!data);data={start:p+8,n};}p=end+(n%2);check(p<=bytes.length);
 }
 check(fmt&&data&&fmt.format===1&&[1,2].includes(fmt.count)&&fmt.bits===16&&fmt.rate>=8000&&fmt.rate<=48000&&fmt.align===fmt.count*2&&fmt.byteRate===fmt.rate*fmt.align&&data.n>0&&data.n%fmt.align===0);
 const frames=data.n/fmt.align;check(frames/fmt.rate<=36);
 const channels=Array.from({length:fmt.count},()=>new Float32Array(frames));
 for(let i=0;i<frames;i++)for(let c=0;c<fmt.count;c++)channels[c][i]=v.getInt16(data.start+i*fmt.align+c*2,true)/32768;
 return {sampleRate:fmt.rate,channels,duration:frames/fmt.rate,rights:'user-attested-original-or-authorized',medium:'local-imported-PCM16-recording',speechAlignment:'unknown-until-manual-listening'};
}
export function timelineAudio(source,total,offset=0){
 check(source&&Number.isFinite(total)&&total>0&&total<=36&&Number.isFinite(offset)&&offset>=0&&offset<total);
 check(Number.isInteger(source.sampleRate)&&source.sampleRate>=8000&&source.sampleRate<=48000&&Array.isArray(source.channels)&&[1,2].includes(source.channels.length));
 const frames=source.channels[0].length;check(frames>0&&frames/source.sampleRate<=36&&source.channels.every(c=>c instanceof Float32Array&&c.length===frames&&c.every(v=>Number.isFinite(v)&&Math.abs(v)<=1)));
 const length=Math.round(total*source.sampleRate),start=Math.round(offset*source.sampleRate);
 const channels=source.channels.map(c=>{const out=new Float32Array(length);out.set(c.subarray(0,Math.max(0,length-start)),start);return out;});
 return {...source,channels,duration:total,offset};
}
export function audioReceipt(source,total,offset=0){
 const pcm=timelineAudio(source,total,offset);let peak=0,power=0,clipped=0;
 for(const c of pcm.channels)for(const v of c){peak=Math.max(peak,Math.abs(v));power+=v*v;if(Math.abs(v)>=1)clipped++;}
 return {medium:source.medium,rights:source.rights,sampleRate:pcm.sampleRate,channels:pcm.channels.length,sourceDuration:source.duration,timelineDuration:total,offset,trimmed:source.duration+offset>total,peak,rms:Math.sqrt(power/(pcm.channels.length*pcm.channels[0].length)),clippedSamples:clipped,speechAlignment:'unknown-until-manual-listening',reload:'Reimport the same authorized WAV after reload; JSON contains no audio bytes, path, URI or portable blob.'};
}
export function audioBuffer(context,source,total,offset=0){const pcm=timelineAudio(source,total,offset),buffer=context.createBuffer(pcm.channels.length,pcm.channels[0].length,pcm.sampleRate);pcm.channels.forEach((c,i)=>buffer.copyToChannel(c,i));return buffer;}
