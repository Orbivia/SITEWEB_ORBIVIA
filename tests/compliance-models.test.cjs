const test=require('node:test');
const assert=require('node:assert/strict');
const review=require('../outils/compliance/document-review.js');
const norms=require('../outils/compliance/normes-model.js');
const backup=require('../outils/compliance/backup-validation.js');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

test('changed proofs clear old checks but preserve a newly checked draft',()=>{
 const saved={status:'reviewed',checked:[0,1],fingerprint:'old',reviewer:'Test'};
 const reset=review.prepare(saved,null,'new',true);
 assert.equal(reset.status,'pending');assert.deepEqual(reset.checked,[]);
 assert.equal(reset.reviewer,'Test');assert.deepEqual(saved.checked,[0,1]);
 const current={status:'pending',checked:[0],fingerprint:'new'};
 assert.deepEqual(review.prepare(saved,current,'new',true).checked,[0]);
 assert.deepEqual(review.prepare(saved,current,'newer',true).checked,[]);
});
test('a sufficient review requires actual proof and all distinct valid controls',()=>{
 const entry={checks:['A','B','C']},value={status:'reviewed',checked:[0,0,0],reviewer:'Test',method:'§1'};
 assert.ok(review.validate(value,entry,1));
 value.checked=[0,1,2];assert.equal(review.validate(value,entry,1),'');
 assert.ok(review.validate(value,entry,0));
 value.checked=[0,1,3];assert.ok(review.validate(value,entry,1));
 assert.ok(review.validate({status:'na',finding:'Hors périmètre',checked:[]},entry,0));
 assert.equal(review.validate({status:'na',finding:'Hors périmètre',reviewer:'Test',checked:[]},entry,0),'');
});
test('inactive descendants cannot suggest standards, and their original answers survive',()=>{
 const qs=[{id:'connected'},{id:'cloud',dependency:'connected'},{id:'remote',dependency:'cloud'}];
 const answers={connected:'no',cloud:'yes',remote:'yes'};
 const effective=norms.effectiveAnswers(qs,answers);
 assert.equal(norms.classify({when:'cloud'},effective),'all');
 assert.equal(effective.remote,undefined);assert.equal(answers.remote,'yes');
 answers.connected='yes';assert.equal(norms.classify({when:'cloud+remote'},norms.effectiveAnswers(qs,answers)),'suggested');
 assert.equal(norms.classify({when:'base'},{}),'suggested');
});
test('reviewing uncertain answers does not loop and includes newly active questions',()=>{
 const qs=[{id:'a'},{id:'b'},{id:'new-child'}];
 const session={answers:{a:'checking',b:'checking'},reviewOnly:true};
 assert.equal(norms.nextQuestion(qs,session,'a').id,'b');
 session.answers.b='yes';assert.equal(norms.nextQuestion(qs,session,'b').id,'new-child');
 session.answers['new-child']='no';assert.equal(norms.nextQuestion(qs,session,'new-child'),undefined);
});
test('malformed normative, review and MDR data are rejected before restoration',()=>{
 const valid=()=>({version:1,projects:[{id:'p',name:'Test',docflow:{norms:{answers:{electric:'yes'},decisions:{'ISO 13485':{status:'retained',edition:'2016'}}},gsprMatrix:{entries:{},drafts:{'1':{applicability:'yes',finding:'Brouillon'}}}},v4:{reviews:{},actions:[]}}]});
 assert.equal(backup.validate(valid()),true);
 for(const mutate of [
  x=>x.projects[0].docflow.norms.decisions['ISO 13485'].reason=12,
  x=>x.projects[0].docflow.norms.answers.electric={},
  x=>x.projects[0].docflow.norms.notes=[],
  x=>x.projects[0].docflow.gsprMatrix.entries=[],
  x=>x.projects[0].docflow.gsprMatrix.drafts['1'].finding=[],
  x=>x.projects[0].v4.actions.push({id:'a',entry:'DT-DES-01',title:{}}),
 ]){const x=valid();mutate(x);assert.throws(()=>backup.validate(x));}
 assert.throws(()=>backup.validate(null));
 const poisoned=JSON.parse('{"version":1,"projects":[{"id":"p","name":"Test","__proto__":{}}]}');
 assert.throws(()=>backup.validate(poisoned),/Clé non autorisée/);
});

test('all thirty document views render for each availability and the dossier renders without a DOM',()=>{
 const root=path.join(__dirname,'../outils/compliance');
 const sandbox=vm.createContext({window:{ORBIVIA_DOCUMENT_REVIEW:review},df:p=>p.docflow});
 for(const name of ['v4-data.js','document-views.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),sandbox);
 const D=sandbox.window.ORBIVIA_V4_DATA;
 const ui={entry:'DT-DES-01',scope:'mdr',folder:'DT01',sections:{}};
 const p={id:'test',name:'Test',docflow:{documents:[]}};
 const j={answers:{},comments:{},drafts:{},queue:D.expected.map(e=>e.id),cursor:'DT-DES-01'};
 const E=x=>String(x??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const bindings={D,ui,E,A:E,
  button:(text)=>'<button type="button">'+E(text)+'</button>',
  status:(_p,id)=>D.status(p,id),pill:s=>'<span>'+E(s)+'</span>',
  journey:()=>j,availability:(_p,e)=>j.answers[e.id],documentPill:()=>'',allDocs:()=>p.docflow.documents,
  actionBy:()=>null,comment:()=>'',stageNav:()=>'',chapterProgress:()=>'',progress:()=>({inspected:0,total:30}),
  unresolved:()=>true,title:heading=>'<h1>'+E(heading)+'</h1>',stageState:()=>({done:false}),
  normReviewSummary:()=>'',countActions:()=>0,pickFolder:scope=>D.folders.filter(f=>f.scope===scope),
  pickEntry:folder=>D.expected.filter(e=>e.folder===folder),presenceOptions:[['absent','Non']],autosave:()=>''};
 // Use the actual controller's dependency list, so missing wiring fails the test.
 Object.assign(sandbox,bindings);
 const app=fs.readFileSync(path.join(root,'v4-app.js'),'utf8');
 const call=app.match(/window\.ORBIVIA_DOCUMENT_VIEWS\.create\(\{[^}]+\}\)/)[0];
 const views=vm.runInContext(call,sandbox);
 for(const entry of D.expected){j.cursor=entry.id;for(const answer of ['','present','partial','absent','checking','na']){j.answers[entry.id]=answer;const html=views.proof(p);assert.ok(html.includes(entry.id));assert.ok(html.includes(entry.title));}}
 assert.match(views.bilan(p),/Documents classés/);
 assert.match(views.bilan(p),/Rapports, exports et sauvegarde/);
});

test('MDR drafts are not counted as reviews and saved reviews become stale when the device changes',()=>{
 const p={id:'p',device:'Version A',intended:'Usage de test',docflow:{documents:[]}};
 const context=vm.createContext({window:{ORBIVIA_NORMES_CATALOGUE:[],ORBIVIA_NORMES_INFO:{answers:()=>({})}},
  df:()=>p.docflow,cqContext:()=>({scope:'md'}),flowProgress:()=>({}),dfInventory:()=>'',dfReview:()=>'',dfSummary:()=>'',dfReport:()=>'',
  save:()=>{},render:()=>{},document:{addEventListener:()=>{},createElement:()=>({}),head:{append:()=>{}}}});
 const root=path.join(__dirname,'../outils/compliance');
 for(const name of ['gspr-catalogue.js','gspr.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context);
 const g=context.window.ORBIVIA_GSPR,row=context.window.ORBIVIA_GSPR_CATALOGUE[0];
 p.docflow.gsprMatrix={entries:{},drafts:{[row.ref]:{applicability:'yes',evidence:'present',finding:'Brouillon'}}};
 assert.equal(g.stats(p).reviewed,0);
 assert.ok(g.saveEntry(row,p,{applicability:'yes',evidence:'present',finding:'Constat'}));
 assert.ok(g.saveEntry(row,p,{applicability:'no',evidence:'pending',reason:'Motif'}));
 assert.equal(g.saveEntry(row,p,{applicability:'yes',evidence:'absent',finding:'Preuve manquante'}),'');
 assert.equal(p.docflow.gsprMatrix.drafts[row.ref],undefined);
 assert.equal(g.check(row,p).gap,true);assert.equal(g.stats(p).reviewed,1);
 p.device='Version B';assert.equal(g.check(row,p).fresh,false);assert.equal(g.stats(p).reviewed,0);assert.equal(g.stats(p).stale,1);
});

test('duplicating a project copies proof bytes under the new project ID and identifies missing files',async()=>{
 const context=vm.createContext({window:{},TextEncoder,Uint8Array,DataView,Blob});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../outils/compliance/v4-files.js'),'utf8'),context);
 const f=context.window.ORBIVIA_V4_FILES,writes=[];
 f.read=async(projectId,documentId)=>{assert.equal(projectId,'source');return documentId==='stored'?new Blob(['preuve originale']):null;};
 f.save=async(projectId,documentId,blob)=>writes.push([projectId,documentId,await blob.text()]);
 const missing=await f.copyProject('source','copy',[{id:'stored',v4FileKey:true},{id:'missing',v4FileKey:true},{id:'reference'}]);
 assert.deepEqual(writes,[['copy','stored','preuve originale']]);assert.equal(missing.length,1);assert.equal(missing[0],'missing');
});
