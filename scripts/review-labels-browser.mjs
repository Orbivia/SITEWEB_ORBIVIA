/* ORBIVIA — revue Chromium desktop/mobile sans dépendance npm. */
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,extname,sep} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {existsSync} from 'node:fs';

const root=process.cwd(),shots=join(root,'artifacts','etiquetage-review');
const types={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
 try{
  let file=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403).end();return;}
  if(file.endsWith(sep))file=join(file,'index.html');
  const data=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data);
 }catch{res.writeHead(404).end('Not found');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
await mkdir(shots,{recursive:true});
const origin='http://127.0.0.1:'+server.address().port;
const tmp=await mkdtemp(join(tmpdir(),'orbivia-chrome-'));
const exe=['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/opt/google/chrome/chrome'].find(existsSync)||'google-chrome';
const proc=spawn(exe,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--remote-debugging-port=0','--user-data-dir='+tmp,'about:blank'],{stdio:'ignore'});
let ws,seq=0;const pending=new Map(),reports=[];
function call(method,params={}){
 return new Promise((resolve,reject)=>{
  const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout '+method));},20000);
  pending.set(id,{timer,resolve,reject});ws.send(JSON.stringify({id,method,params}));
 });
}
async function evaluate(expr){
 const r=await call('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw Error('Chrome: '+r.exceptionDetails.text+' '+r.exceptionDetails.exception?.description);
 return r.result.value;
}
async function until(expr,limit=15000){
 const start=Date.now();while(Date.now()-start<limit){if(await evaluate(expr))return;await delay(110);}
 throw Error('Timed out: '+expr);
}
try{
 let port=0;
 for(let i=0;i<130;i++){try{port=+(await readFile(join(tmp,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(100);}}
 if(!port)throw Error('No remote debugging port for '+exe);
 const tab=await(await fetch('http://127.0.0.1:'+port+'/json/new?about:blank',{method:'PUT'})).json();
 ws=new WebSocket(tab.webSocketDebuggerUrl);
 await new Promise((done,reject)=>{ws.onopen=done;ws.onerror=reject;});
 ws.onmessage=message=>{
  const response=JSON.parse(message.data),entry=pending.get(response.id);if(!entry)return;
  pending.delete(response.id);clearTimeout(entry.timer);
  if(response.error)entry.reject(Error(JSON.stringify(response.error)));else entry.resolve(response.result||{});
 };
 await call('Page.enable');await call('Runtime.enable');
 const sizes=[
  ['desktop-wide',1440,900,false],
  ['desktop-compact',1024,720,false],
  ['tablet',768,1024,true],
  ['mobile-large',430,932,true],
  ['mobile-standard',390,844,true],
  ['mobile-small',360,640,true],
  ['mobile-narrow',320,568,true]
 ];
 for(const [name,width,height,mobile] of sizes){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await call('Emulation.setTouchEmulationEnabled',{enabled:mobile});
  await call('Page.navigate',{url:origin+'/outils/etiquettes-tracabilite/'});
  await until('document.readyState==="complete" && !!document.querySelector(".question-card")');
  const problems=[];let step=0,maxWidth=0;
  const stateExpr='(()=>{const d=document.documentElement,c=document.querySelector(".question-card"),a=[...document.querySelectorAll(".label-options .answer")],rect=e=>{if(!e)return null;const x=e.getBoundingClientRect();return {x:x.x,y:x.y,w:x.width,h:x.height,bottom:x.bottom};};return {done:!!document.querySelector(".label-summary-heading"),heading:c?.querySelector("h1")?.textContent||"",choices:a.length,scroll:d.scrollWidth,first:rect(a[0]),last:rect(a.at(-1)),controls:rect(document.querySelector(".question-controls")),card:rect(c),scrollAllowed:document.body.classList.contains("quiz-scroll")}})()';
  while(step++<80){
   const st=await evaluate(stateExpr);maxWidth=Math.max(maxWidth,st.scroll);
   if(st.scroll>width+3)problems.push('horizontal overflow at question '+step+' ('+st.scroll+'px): '+st.heading);
   if(st.done)break;
   if(st.choices===0)problems.push('no answers at question '+step);
   if(st.first?.w<150)problems.push('narrow answer at question '+step);
   if(st.last&&st.card&&st.last.bottom>st.card.bottom+6&&!st.scrollAllowed)problems.push('clipped answer at '+step);
   await evaluate('(()=>{const options=[...document.querySelectorAll(".label-options .answer")];let btn=options[0];const h=document.querySelector(".question-heading h1")?.textContent||"";if(h.includes("précautions particulières de stockage")||h.includes("Des substances ou matériaux"))btn=options.find(x=>x.dataset.choice==="yes")||btn;btn?.click();})()');
   await delay(38);
  }
  const final=await evaluate(stateExpr);if(!final.done)problems.push('no summary after '+step+' steps');
  await until('document.querySelector("#label-pdf-download")?.hasAttribute("href")===true').catch(e=>problems.push('PDF preparation: '+e.message));
  const quality=await evaluate('(async()=>{const imgs=[...document.querySelectorAll(".label-symbol-grid .label-symbol-img")];await Promise.all(imgs.map(x=>x.decode().catch(()=>{})));const a=document.querySelector("#label-pdf-download"),opt=document.querySelector(".label-optional-symbols");let pdf=null;if(a?.href){const bytes=await fetch(a.href).then(r=>r.arrayBuffer());pdf={bytes:bytes.byteLength,header:String.fromCharCode(...new Uint8Array(bytes.slice(0,5)))}}return {images:imgs.length,broken:imgs.filter(x=>!x.naturalWidth).map(x=>x.src),optional:!!opt,grid:opt?getComputedStyle(opt.querySelector(".label-symbol-grid")).gridTemplateColumns:null,pdf,scroll:document.documentElement.scrollWidth};})()');
  if(quality.broken.length)problems.push('broken symbols: '+quality.broken.join(','));
  if(quality.pdf?.header!=='%PDF-')problems.push('invalid PDF download '+JSON.stringify(quality.pdf));
  if(quality.scroll>width+3)problems.push('summary horizontal overflow: '+quality.scroll);
  const shot=await call('Page.captureScreenshot',{format:'jpeg',quality:60,captureBeyondViewport:false});
  await writeFile(join(shots,name+'.jpg'),Buffer.from(shot.data,'base64'));
  if(name==='desktop-wide'||name==='mobile-standard'){
   const thumb=await call('Page.captureScreenshot',{format:'jpeg',quality:36,captureBeyondViewport:false});
   console.log('REVIEW_SCREENSHOT_'+name+'='+thumb.data);
  }
  reports.push({name,width,height,questions:step,maximumWidth:maxWidth,symbols:quality.images,conditionalVisible:quality.optional,columns:quality.grid,pdfSize:quality.pdf?.bytes,problems});
 }
 console.log('REVIEW_METRICS='+JSON.stringify(reports));
 if(reports.some(r=>r.problems.length))throw Error('Browser review failures: '+JSON.stringify(reports.filter(r=>r.problems.length)));
 console.log('PASS: Chromium labels on seven desktop/tablet/mobile viewport configurations');
}catch(e){console.error('REVIEW_FAILED '+e.stack);process.exitCode=1;}
finally{
 try{ws?.close();}catch{}
 for(const call of pending.values())clearTimeout(call.timer);
 proc.kill();server.close();
 await rm(tmp,{recursive:true,force:true}).catch(()=>{});
}
