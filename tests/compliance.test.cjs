const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.join(__dirname,'../outils/compliance');
function model(){const context=vm.createContext({window:{},df:p=>(p.docflow??={documents:[]})});vm.runInContext(fs.readFileSync(path.join(root,'v4-data.js'),'utf8'),context);return context.window.ORBIVIA_V4_DATA;}
test('an existing project keeps its documents; attaching a proof never marks it reviewed',()=>{
 const d=model(),p={docflow:{documents:[{id:'proof-a',title:'preuve.pdf',revision:'A'}]}};
 const v=d.ensure(p);assert.equal(p.docflow.documents.length,1);v.links['DT-DES-01']=['proof-a'];
 assert.equal(d.status(p,'DT-DES-01'),'attached');
 v.reviews['DT-DES-01']={status:'reviewed',fingerprint:d.fingerprint(p,'DT-DES-01')};
 assert.equal(d.status(p,'DT-DES-01'),'reviewed');
 p.docflow.documents[0].revision='B';assert.equal(d.status(p,'DT-DES-01'),'stale');
});
test('unlinking or replacing a reviewed proof requires a new review',()=>{
 const d=model(),p={docflow:{documents:[{id:'a',title:'a.pdf',revision:'A',hash:'original'}]}};
 d.ensure(p).links['DT-RIS-01']=['a'];d.ensure(p).reviews['DT-RIS-01']={status:'gap',fingerprint:d.fingerprint(p,'DT-RIS-01')};
 p.docflow.documents[0].hash='replacement';assert.equal(d.status(p,'DT-RIS-01'),'stale');
 d.ensure(p).links['DT-RIS-01']=[];assert.equal(d.status(p,'DT-RIS-01'),'stale');
});
test('JSON validation accepts older projects and guided drafts, rejects malformed guided backups',()=>{
 const source=fs.readFileSync(path.join(root,'core.js'),'utf8');
 const validator=source.slice(source.indexOf('function validateBackup(obj){'),source.indexOf('// Project changes must not keep',source.indexOf('function validateBackup(obj){')));
 const context=vm.createContext({});vm.runInContext(validator,context);
 const p={id:'p',name:'Projet'},backup={version:1,projects:[p]};
 assert.equal(context.validateBackup(backup),true);
 p.v4={reviews:{},links:{},actions:[],journey:{answers:{'DT-DES-01':'present'},comments:{'DT-DES-01':'Note'},drafts:{'DT-DES-01':{checked:[0,1],status:'pending'}},queue:['DT-DES-01'],cursor:'DT-DES-01',screen:'proof'}};
 assert.equal(context.validateBackup(JSON.parse(JSON.stringify(backup))),true);
 p.v4.journey.answers['DT-DES-01']='certified';assert.throws(()=>context.validateBackup(backup),/Disponibilité/);
 p.v4.journey.answers['DT-DES-01']='present';p.v4.journey.drafts['DT-DES-01'].checked='yes';assert.throws(()=>context.validateBackup(backup),/Brouillons/);
});
test('ZIP export roundtrips the real file, Unicode paths, journey and missing-file index',async()=>{
 const context=vm.createContext({window:{},TextEncoder,Uint8Array,DataView,Blob,crypto:require('node:crypto').webcrypto});
 vm.runInContext(fs.readFileSync(path.join(root,'v4-files.js'),'utf8'),context);
 const f=context.window.ORBIVIA_V4_FILES;let blob;
 f.read=async(_p,id)=>id==='stored'?new Blob(['preuve originale éç']):null;
 f.exportBlob=(data)=>{blob=data;};
 const result=await f.exportProject({id:'p',name:'Essai'},[{id:'stored',title:'preuve.txt',path:'Dossier/Évaluation/preuve.txt',v4FileKey:true,size:24},{id:'missing',title:'manquante.pdf',v4FileKey:true}],['Dossier/Évaluation'],{journey:{cursor:'DT-DES-01',answers:{'DT-DES-01':'present'}}});
 assert.equal(result.files,1);assert.equal(result.missing[0],'manquante.pdf');
 const verify=spawnSync('python3',['-c',`import sys,io,zipfile,json
z=zipfile.ZipFile(io.BytesIO(sys.stdin.buffer.read()))
assert z.testzip() is None
assert z.read('Dossier/Évaluation/preuve.txt').decode() == 'preuve originale éç'
i=json.loads(z.read('index_documents.json'))
assert i['missingFiles'] == ['manquante.pdf']
assert i['work']['journey']['cursor'] == 'DT-DES-01'
assert 'Dossier/Évaluation/' in z.namelist()
`],{input:Buffer.from(await blob.arrayBuffer())});
 assert.equal(verify.status,0,verify.stderr.toString());
});
test('all app scripts parse and the core is loaded externally to avoid HTML script-tokenizer failures',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/<script src="\.\/core\.js"><\/script>/);
 for(const name of fs.readdirSync(root).filter(name=>name.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
});
const {calculate}=require('../outils/compliance/journey-metrics.js');
test('global percentage counts applicable completed answers without treating an unknown as answered',()=>{
 const m=calculate([{id:0,done:8,total:8},{id:1,done:4,total:20},{id:2,done:0,total:12}]);
 assert.equal(m.percent,30);assert.equal(m.chapters[0].percent,100);assert.equal(m.complete,false);
 const expanded=calculate([{done:8,total:8},{done:4,total:30},{done:0,total:12}]);assert.equal(expanded.percent,24);
 assert.equal(calculate([{done:399,total:400}]).percent,99);
 assert.equal(calculate([{done:2,total:2}]).complete,true);
 assert.equal(calculate([{done:0,total:0}]).complete,false);
});
