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
 const context={validateBackup:require('../outils/compliance/backup-validation.js').validate};
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
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/<script src="\.\/core\.js(?:\?v=[^"]+)?"><\/script>/);
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
test('reviewing the standards catalogue does not inflate the questionnaire denominator or block its completion',()=>{
 const source=fs.readFileSync(path.join(root,'v4-app.js'),'utf8');
 const code=source.slice(source.indexOf('function questionnaireMetrics(p){'),source.indexOf('function chapterProgress(',source.indexOf('function questionnaireMetrics(p){')));
 const normative={known:2,total:5,decided:0,decisions:278,confirmed:false};
 const context=vm.createContext({window:{ORBIVIA_NORMES_INFO:{journey:()=>normative},ORBIVIA_JOURNEY_METRICS:{calculate}},profileFields:[['name']],cqEvaluate:()=>({questions:[{}]}),cqContext:()=>({}),cqKnown:()=>true,dfClassConfirmed:()=>true,progress:()=>({filled:0,total:1})});
 vm.runInContext(code,context);
 const first=context.questionnaireMetrics({name:'Projet'});
 assert.equal(first.chapters[1].total,7);
 normative.decided=278;normative.confirmed=true;normative.decisions=400;
 const changed=context.questionnaireMetrics({name:'Projet'});assert.equal(changed.total,first.total);assert.equal(changed.percent,first.percent);
 normative.known=5;assert.equal(context.questionnaireMetrics({name:'Projet'}).chapters[1].percent,100);
});
test('every catalogue reference gets subject-specific help and an official publisher link',()=>{
 const {describe}=require('../outils/compliance/normes-explications.js');
 const context=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(path.join(root,'normes-catalogue.js'),'utf8'),context);
 for(const entry of context.window.ORBIVIA_NORMES_CATALOGUE){const help=describe(entry);assert.ok(help.scope.length>30,entry.id);assert.ok(help.title);assert.ok(['www.iso.org','webstore.iec.ch','www.cencenelec.eu'].includes(new URL(help.url).hostname),entry.id);}
 const qms=describe({id:'ISO 13485',title:'Management de la qualité',family:'SMQ',when:'base'});assert.match(qms.scope,/management de la qualité/);assert.equal(qms.curated,true);
 const reason=describe({id:'IEC 62304',title:'Logiciel',family:'Logiciel',when:'software'},{software:'yes'},[{id:'software',title:'Comprend-il un logiciel médical ?'}]);assert.equal(reason.criteria[0],'Comprend-il un logiciel médical ?');assert.match(reason.url,/webstore\.iec\.ch/);
});
