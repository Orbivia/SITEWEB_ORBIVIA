/* ORBIVIA V4 — Fichiers en IndexedDB ; sortie locale sur consentement ; export ZIP autonome. */
(function(){
"use strict";
const DBNAME="orbivia-v4-evidence",STORE="files";
function db(){
 return new Promise(function(resolve,reject){
  if(!window.indexedDB){reject(Error("IndexedDB indisponible dans ce navigateur."));return;}
  const req=indexedDB.open(DBNAME,1);
  req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};
  req.onerror=function(){reject(req.error||Error("Ouverture du stockage impossible."));};
  req.onsuccess=function(){resolve(req.result);};
 });
}
async function transact(mode,cb){
 const base=await db();
 return new Promise(function(resolve,reject){
  const tx=base.transaction(STORE,mode),obj=tx.objectStore(STORE);let value;
  tx.oncomplete=function(){base.close();resolve(value);};
  tx.onerror=function(){base.close();reject(tx.error||Error("Écriture du fichier impossible."));};
  tx.onabort=function(){base.close();reject(tx.error||Error("Écriture interrompue."));};
  try{const request=cb(obj);request.onsuccess=function(){value=request.result;};request.onerror=function(){reject(request.error||Error("Accès au fichier impossible."));};}
  catch(e){tx.abort();reject(e);}
 });
}
const safe=function(name){
 const v=String(name||"document").replace(/[<>:"|?*\u0000-\u001f\\\/]/g,"_").replace(/^\.+/,"_").slice(0,150);
 return v||"document";
};
const key=function(projectId,documentId){return projectId+":"+documentId;};
async function sha(file){
 if(!crypto||!crypto.subtle)return "";
 const buf=await file.arrayBuffer(),hash=await crypto.subtle.digest("SHA-256",buf);
 return Array.from(new Uint8Array(hash)).map(function(v){return v.toString(16).padStart(2,"0");}).join("");
}
const files={
 directory:null,
 safe:safe,
 save:async function(projectId,documentId,file){
  await transact("readwrite",function(obj){return obj.put(file,key(projectId,documentId));});
 },
 read:async function(projectId,documentId){
  const data=await transact("readonly",function(obj){return obj.get(key(projectId,documentId));});
  return data||null;
 },
 chooseDirectory:async function(){
  if(typeof window.showDirectoryPicker!=="function")throw Error("Accès direct aux dossiers non pris en charge. Vous pouvez utiliser l’export ZIP.");
  this.directory=await window.showDirectoryPicker({mode:"readwrite"});
  return this.directory.name;
 },
 writeDirectory:async function(relativePath,file){
  if(!this.directory)return false;
  const components=relativePath.split("/").filter(Boolean).map(safe),filename=components.pop();
  let dir=this.directory;
  for(const name of components)dir=await dir.getDirectoryHandle(name,{create:true});
  const handle=await dir.getFileHandle(filename,{create:true}),stream=await handle.createWritable();
  try{await stream.write(file);await stream.close();}catch(e){try{await stream.abort();}catch(_e){}throw e;}
  return true;
 },
 hash:sha,
 exportBlob:function(blob,filename){
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=safe(filename);
  document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},120000);
 }
};
const encoder=new TextEncoder();
const crcTable=Array.from({length:256},function(_,i){let n=i;for(let j=0;j<8;j++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(data){let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function header(len){return new Uint8Array(len);}
function u16(v,o,n){v.setUint16(o,n,true);}function u32(v,o,n){v.setUint32(o,n>>>0,true);}
function zip(entries){
 let offset=0,body=[],central=[],total=0;
 for(const item of entries){
  const rawName=String(item.name),isDirectory=rawName.endsWith("/");
  const name=rawName.split("/").filter(Boolean).map(function(v){return safe(v);}).join("/")+(isDirectory?"/":"");
  const filename=encoder.encode(name),data=item.data instanceof Uint8Array?item.data:encoder.encode(String(item.data||""));
  const folder=name.endsWith("/");
  if(!name||name.includes("../")||filename.length>65535||data.length>=0xffffffff)throw Error("Fichier trop volumineux pour cet export.");
  const sum=folder?0:crc32(data),local=header(30),l=new DataView(local.buffer);
  u32(l,0,0x04034b50);u16(l,4,20);u16(l,6,0x0800);u16(l,8,0);u16(l,10,0);u16(l,12,0);
  u32(l,14,sum);u32(l,18,data.length);u32(l,22,data.length);u16(l,26,filename.length);u16(l,28,0);
  body.push(local,filename,data);
  const c=header(46),v=new DataView(c.buffer);
  u32(v,0,0x02014b50);u16(v,4,20);u16(v,6,20);u16(v,8,0x0800);u16(v,10,0);u16(v,12,0);u16(v,14,0);
  u32(v,16,sum);u32(v,20,data.length);u32(v,24,data.length);u16(v,28,filename.length);u16(v,30,0);u16(v,32,0);u16(v,34,0);u16(v,36,0);
  u32(v,38,folder?0x10:0);u32(v,42,offset);
  central.push(c,filename);
  offset+=local.length+filename.length+data.length;total++;
  if(total>6000||offset>=0xffffffff)throw Error("L'archive dépasse les limites du format ZIP classique.");
 }
 const centralSize=central.reduce(function(a,c){return a+c.length;},0),end=header(22),v=new DataView(end.buffer);
 u32(v,0,0x06054b50);u16(v,4,0);u16(v,6,0);u16(v,8,total);u16(v,10,total);u32(v,12,centralSize);u32(v,16,offset);u16(v,20,0);
 return new Blob(body.concat(central,[end]),{type:"application/zip"});
}
files.buildZip=zip;
files.exportProject=async function(p,docList,folders,extra){
 const entries=[],missing=[];
 for(const folder of folders){entries.push({name:folder.endsWith("/")?folder:folder+"/",data:""});}
 const items=docList.filter(function(x){return x.v4FileKey;});
 const total=items.reduce(function(n,d){return n+(Number(d.size)||0);},0);
 if(total>350*1024*1024)throw Error("Export supérieur à 350 Mo : utiliser le dossier local ou fractionner le projet.");
 for(const d of items){
  const blob=await this.read(p.id,d.id);
  if(!blob){missing.push(d.title||d.id);continue;}
  const bytes=new Uint8Array(await blob.arrayBuffer());
  const path=String(d.path||"Autres/"+d.title).split("/").map(safe).join("/");
  entries.push({name:path,data:bytes});
 }
 entries.push({name:"index_documents.json",data:JSON.stringify({project:p.id,projectName:p.name,exportedAt:new Date().toISOString(),documents:docList,missingFiles:missing,work:extra},null,2)});
 entries.push({name:"LISEZ_MOI.txt",data:"ORBIVIA — Export de travail. Les documents manquants sont signalés dans index_documents.json. La présence d'une pièce n'atteste ni l'approbation ni la conformité réglementaire.\n"});
 this.exportBlob(zip(entries),"ORBIVIA_"+(p.name||"Projet").replace(/[^a-z0-9-]/gi,"_")+"_dossier.zip");
 return {files:items.length-missing.length,missing:missing};
};
window.ORBIVIA_V4_FILES=files;
})();
