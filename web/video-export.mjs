import {documentSVG,duration,frameAt,audioSamples,serializePractice} from './practice.mjs';
import {audioBuffer,audioReceipt} from './speech-audio.mjs';
export function videoCapability(){
 const mime=typeof MediaRecorder==='undefined'?null:['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 return {supported:!!mime&&typeof HTMLCanvasElement.prototype.captureStream==='function',mime:mime||null,limits:'Real-time browser WebM, not MP4/native proof; encoded frames and duration require actual readback.'};
}
async function image(svg){const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Frame decode failed; source and prior artifacts retained.'));img.src=url;});return img;}finally{URL.revokeObjectURL(url);}}
async function inspect(blob){
 const video=document.createElement('video'),url=URL.createObjectURL(blob);video.preload='metadata';video.muted=true;
 try{await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=()=>reject(Error('Encoded WebM metadata could not be read; do not claim verified video.'));video.src=url;});
  if(!Number.isFinite(video.duration)){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Encoded duration unavailable; preserve WebM as unverified output.')),8000);video.onseeked=()=>{clearTimeout(timer);resolve();};video.currentTime=1e6;});}
  return {width:video.videoWidth,height:video.videoHeight,duration:Number.isFinite(video.duration)?video.duration:null};
 }finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
}
export async function exportOriginalVideo(source,progress=()=>{},speech=null){
 const capability=videoCapability();if(!capability.supported)throw Error('Encoded export unsupported in this browser. Retain original project, frames and timing; video gate BLOCKED.');
 const snapshot=structuredClone(source),total=duration(snapshot);if(!(total>0&&total<=36))throw Error('Only bounded original timelines can be encoded.');
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;const ctx=canvas.getContext('2d'),stream=canvas.captureStream(snapshot.controls.fps);let audio=null,audioNode=null,recorder=null,rendered=0;
 try{
  if((snapshot.origin||snapshot.id)==='11'){
   if(!window.AudioContext)throw Error('Original audio cannot be muxed; video/audio gate blocked, source retained.');
   audio=new AudioContext();await audio.resume();let buffer;if(speech)buffer=audioBuffer(audio,speech.source,total,speech.offset);else{const samples=audioSamples(snapshot,24000);buffer=audio.createBuffer(1,samples.length,24000);buffer.copyToChannel(samples,0);}audioNode=audio.createBufferSource();audioNode.buffer=buffer;const destination=audio.createMediaStreamDestination();audioNode.connect(destination);destination.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
  }
  const initial=frameAt(snapshot,0);ctx.drawImage(await image(documentSVG(snapshot,initial.index,1920,0)),0,0);
  const chunks=[];recorder=new MediaRecorder(stream,{mimeType:capability.mime,videoBitsPerSecond:4000000});
  let error;const stopped=new Promise(resolve=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=e=>{error=e.error||Error('MediaRecorder failed');};recorder.onstop=resolve;});
  recorder.start(250);if(audioNode)audioNode.start();const started=performance.now();let last=-1;
  while(true){await new Promise(requestAnimationFrame);const t=Math.min(total,(performance.now()-started)/1000),frame=Math.floor(t*snapshot.controls.fps);if(frame!==last){last=frame;const f=frameAt(snapshot,t);ctx.drawImage(await image(documentSVG(snapshot,f.index,1920,t-f.start)),0,0);rendered++;progress({seconds:t,total,rendered,status:'encoding-pending-no-saved-claim'});}if(t>=total)break;if(document.hidden)throw Error('Encoding interrupted by hidden tab. Keep source/frame/timing; no verified video claimed.');}
  recorder.stop();await stopped;if(error)throw error;const blob=new Blob(chunks,{type:capability.mime});if(blob.size===0)throw Error('Encoder returned an empty output; source retained.');
  let metadata,inspectionError=null;try{metadata=await inspect(blob);}catch(e){inspectionError=e.message;metadata={width:null,height:null,duration:null};}
  const fingerprint=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(serializePractice(snapshot)));
  const receipt={schema:'design-taste-video-export/1',format:'WebM',mime:capability.mime,bytes:blob.size,sourceSha256:Array.from(new Uint8Array(fingerprint),v=>v.toString(16).padStart(2,'0')).join(''),declared:{width:1920,height:1080,fps:snapshot.controls.fps,duration:total},observed:metadata,renderedFrames:rendered,encodedFrameCount:'not-inspected',audioTracks:stream.getAudioTracks().length,audioSource:speech?audioReceipt(speech.source,total,speech.offset):{medium:(snapshot.origin||snapshot.id)==='11'?'original-non-speech-tones':'none'},audioTrackReadback:'not-inspected',speechAlignment:(snapshot.origin||snapshot.id)==='11'?(speech?'unknown-until-manual-listening':'blocked-no-recorded-speech'):'not-applicable',inspectionError,status:metadata.width===1920&&metadata.height===1080&&metadata.duration!==null?'encoded-metadata-readback-candidate':'encoded-output-unverified',native:'not-run',human:'pending'};
  return {blob,receipt};
 }finally{if(recorder&&recorder.state!=='inactive')recorder.stop();if(audioNode){try{audioNode.stop();}catch{}}if(audio)await audio.close();stream.getTracks().forEach(track=>track.stop());}
}
