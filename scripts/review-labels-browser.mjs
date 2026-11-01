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
  if(new URL(req.url,'http://localhost').pathname.endsWith('/'))file=join(file,'index.html');
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
  if(reports.length)await evaluate('sessionStorage.removeItem("orbivia-mdr-label-wizard-v3")');
  await call('Page.navigate',{url:origin+'/outils/etiquettes-tracabilite/'});
  await until('document.readyState==="complete" && !!document.querySelector(".question-card")').catch(async error=>{throw Error(error.message+' | '+JSON.stringify(await evaluate('({url:location.href,state:document.readyState,body:document.body?.innerText.slice(0,360),root:!!document.querySelector("#label-app")})')));});
  // Capture initial question as well as the final card grid.
  const firstShot=await call('Page.captureScreenshot',{format:'jpeg',quality:60,captureBeyondViewport:false});
  await writeFile(join(shots,name+'-question.jpg'),Buffer.from(firstShot.data,'base64'));

  const problems=[];let step=0,maxWidth=0;
  await delay(90);
  const help=await evaluate('(()=>{const trigger=document.querySelector(".info-bubble summary"),details=trigger?.parentElement;if(!trigger)return {missing:true};trigger.click();const panel=details.querySelector(":scope > div"),r=panel.getBoundingClientRect();const out={open:details.open,left:r.left,right:r.right,top:r.top,bottom:r.bottom,screen:innerWidth};trigger.click();return out;})()');
  if(help.missing||!help.open)problems.push('help popup failed to open');
  if(help.left< -2||help.right>width+2)problems.push('help popup offscreen: '+JSON.stringify(help));
  if(mobile){
   const menu=await evaluate('(()=>{const b=document.querySelector("button.menu");if(!b)return {missing:true};b.click();const open=b.getAttribute("aria-expanded");b.click();return {open,closed:b.getAttribute("aria-expanded")}})()');
   if(menu.missing||menu.open!=="true"||menu.closed!=="false")problems.push('mobile navigation toggle failed '+JSON.stringify(menu));
  }
  const stateExpr='(()=>{const d=document.documentElement,c=document.querySelector(".question-card"),a=[...document.querySelectorAll(".label-options .answer")],rect=e=>{if(!e)return null;const x=e.getBoundingClientRect();return {x:x.x,y:x.y,w:x.width,h:x.height,bottom:x.bottom};};return {done:!!document.querySelector(".label-summary-heading"),heading:c?.querySelector("h1")?.textContent||"",choices:a.length,scroll:d.scrollWidth,first:rect(a[0]),last:rect(a.at(-1)),controls:rect(document.querySelector(".question-controls")),card:rect(c),scrollAllowed:document.body.classList.contains("quiz-scroll")}})()';
  while(step++<80){
   const st=await evaluate(stateExpr);maxWidth=Math.max(maxWidth,st.scroll);
   if(st.scroll>width+3)problems.push('horizontal overflow at question '+step+' ('+st.scroll+'px): '+st.heading);
   if(st.done)break;
   if(st.choices===0)problems.push('no answers at question '+step);
   if(st.first?.w<150)problems.push('narrow answer at question '+step);
   if(st.first?.h<43)problems.push('touch target under 44px at '+step+': '+st.first.h);
   if(st.controls?.bottom>height+8&&!st.scrollAllowed)problems.push('bottom controls inaccessible at '+step);
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

  const report={name,width,height,questions:step,maximumWidth:maxWidth,symbols:quality.images,conditionalVisible:quality.optional,columns:quality.grid,pdfSize:quality.pdf?.bytes,problems};
  reports.push(report);console.log('REVIEW_VIEWPORT='+JSON.stringify(report));
 }

 // High-density path exercises dozens of symbols and PDF one-page sizing.
 // Clinical case verifies text placement on a phone.
 function chooseSpecial(mode){
  const q=document.querySelector(".question-heading h1")?.textContent||"";
  const list=[...document.querySelectorAll(".label-options .answer")];
  const find=value=>list.find(x=>x.dataset.choice===value);
  let button=list[0];
  if(mode==="clinical"&&q.includes("Dans quel cadre"))button=find("investigation")||button;
  if(mode==="stress"){
   if(q.includes("Sur quel support"))button=find("sterile")||button;
   else if(q.includes("Quel est le statut du marquage CE"))button=find("ce-nb")||button;
   else if(q.includes("Comment le dispositif est-il fourni"))button=find("sterile")||button;
   else if(q.includes("Date limite")||q.includes("date limite"))button=find("yes")||button;
   else if(q.includes("Comment les unités fabriquées"))button=find("both")||button;
   else if(find("yes"))button=find("yes");
  }
  button?.click();return !!button;
 }
 for(const [kind,width,height,mobile] of [['stress',1440,900,false],['clinical',390,844,true]]){
  await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await call('Emulation.setTouchEmulationEnabled',{enabled:mobile});
  await evaluate('sessionStorage.removeItem("orbivia-mdr-label-wizard-v3")');
  await call('Page.navigate',{url:origin+'/outils/etiquettes-tracabilite/'});
  await until('document.readyState==="complete"&&!!document.querySelector(".question-card")');
  let steps=0;while(steps++<90){
   if(await evaluate('!!document.querySelector(".label-summary-heading")'))break;
   await evaluate('('+chooseSpecial.toString()+')('+JSON.stringify(kind)+')');
   await delay(30);
  }
  await until('!!document.querySelector(".label-summary-heading")');
  const special=await evaluate('(async()=>{const imgs=[...document.querySelectorAll(".label-symbol-grid img")];await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));const a=document.querySelector("#label-pdf-download");let doc=null;for(let i=0;i<80&&!a?.hasAttribute("href");i++)await new Promise(r=>setTimeout(r,100));if(a?.href){const b=await fetch(a.href).then(r=>r.arrayBuffer());doc={bytes:b.byteLength,valid:String.fromCharCode(...new Uint8Array(b.slice(0,5)))==="%PDF-"}}return {heading:document.querySelector(".label-summary-heading").textContent,clinical:document.querySelector(".label-clinical-note")?.textContent||"",required:document.querySelectorAll(".label-main-grid li").length,optional:document.querySelectorAll(".label-optional-symbols li").length,images:imgs.length,broken:imgs.filter(x=>!x.naturalWidth).map(x=>x.src),pdf:doc,width:document.documentElement.scrollWidth}})()');
  const issues=[];
  if(!special.pdf?.valid)issues.push('PDF not valid on '+kind);
  if(special.broken.length)issues.push('Broken symbols on '+kind);
  if(special.width>width+3)issues.push('Overflow on '+kind);
  if(kind==='stress'&&special.images<10)issues.push('Stress path did not display enough selected ISO symbols');
  if(kind==='clinical'&&!special.clinical.includes("investigations cliniques"))issues.push('Regulatory clinical label missing');
  const screenshot=await call('Page.captureScreenshot',{format:'jpeg',quality:65,captureBeyondViewport:false});
  await writeFile(join(shots,kind+'-result.jpg'),Buffer.from(screenshot.data,'base64'));
  reports.push({name:kind,width,height,steps,special,problems:issues});
  console.log('REVIEW_SPECIAL='+JSON.stringify({name:kind,steps,special,problems:issues}));
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
