const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'../outils');
const mdr=require('../outils/shared/classification-engine.js');
const ivdr=require('../outils/shared/ivdr-engine.js');
const classification=require('../outils/shared/classification-router.js').create(mdr,ivdr);
const norms=require('../outils/shared/normes-model.js');
const questions=require('../outils/shared/normes-questions.js');
const explanations=require('../outils/shared/normes-explications.js');
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'shared/normes-catalogue.js'),'utf8'),context);
const model=require('../outils/tool-model.js').create({classification,norms,questions,explanations,catalogue:context.window.ORBIVIA_NORMES_CATALOGUE});
function complete(overrides={}){
 const answers={};
 const defaults={scope:'md',form:'physical',contact:'none',cleaning:'none',controlTherapy:'none',tissue:'none',multiPurpose:'yes',...overrides};
 for(let i=0;i<100;i++){
  const q=classification.questions(answers).find(q=>!classification.known(q,answers));if(!q)return answers;
  const value=defaults[q.id]??'no';assert.ok(q.options.some(([v])=>v===value),'Missing fixture answer: '+q.id);answers[q.id]=value;
 }
 throw Error('Questionnaire did not terminate');
}
test('the public class questionnaire finishes without any project identity or intended-use form',()=>{
 const answers=complete(),result=classification.evaluate(answers);
 assert.equal(result.complete,true);assert.equal(result.highest,'I');
 const legacy=classification.evaluate(answers,{requireIntended:true});
 assert.equal(legacy.complete,false);assert.match(legacy.missing.join(' '),/destination/);
 assert.equal(classification.evaluate(answers,{requireIntended:true,intended:'Usage documenté'}).complete,true);
});
test('the shared engine retains active-device, software and unsupported-scope outcomes',()=>{
 const active=classification.evaluate(complete({active:'yes',therapyEnergy:'yes',energyHazard:'no'}));
 assert.equal(active.highest,'IIa');assert.ok(active.rules.find(r=>r.n===9&&r.applies==='yes'));
 const software=classification.evaluate(complete({form:'software',softwareRole:'independent',softwareDecision:'yes',softwareImpact:'death'}));
 assert.equal(software.highest,'III');assert.ok(software.rules.find(r=>r.n===11&&r.applies==='yes'));
 const ivd=classification.evaluate({scope:'ivd'});assert.equal(ivd.complete,false);assert.equal(ivd.highest,'');assert.match(ivd.missing.join(' '),/IVDR/);
 const checking=complete();checking.nano='checking';assert.equal(classification.evaluate(checking).complete,false);
});
test('normative suggestions use active answers and contain human-readable reasons and publisher sources',()=>{
 const a=Object.fromEntries(questions.map(q=>[q.id,'no']));
 a.software='yes';a.alarm='yes'; // Alarm is inactive when electric is no.
 const r=model.analysis('norms',a);
 assert.equal(r.complete,true);
 assert.ok(r.suggested.some(x=>x.id==='IEC 62304'));
 assert.equal(r.suggested.some(x=>x.id==='IEC 60601-1'),false);
 const software=r.suggested.find(x=>x.id==='IEC 62304');assert.match(software.reasons.join(' '),/logiciel médical/);assert.match(software.url,/iec\.ch/);
 assert.equal(a.alarm,'yes');
});
test('PDF summaries retain reasons and sources, while comments stay safely available to the UI',()=>{
 const state={answers:complete(),comments:{scope:'<img src=x onerror=alert(1)>'}};
 const summary=model.summary('classification',state);
 assert.equal(summary.outcome,'Classe proposée : I');
 assert.ok(summary.sections.some(s=>s.items.some(i=>i.url?.includes('eur-lex'))));
 const row=model.answerRows('classification',state).find(q=>q.id==='scope');
 assert.equal(model.escape(row.comment),'&lt;img src=x onerror=alert(1)&gt;');
 const normative=model.summary('norms',{answers:{software:'yes'},comments:{}});
 assert.ok(normative.sections.some(s=>s.items.some(i=>i.text==='IEC 62304')));
 assert.match(model.summary('norms',{answers:{ivd:'yes'},comments:{}}).note,/aucune classification IVDR/);
});
test('restoring a tool ignores invalid answers and keeps its state independent of projects',()=>{
 const restored=model.restore('classification',{answers:{scope:'md',form:'bogus',name:'Projet'},comments:{scope:15,form:'Note'},cursor:'bogus',result:true});
 assert.deepEqual(restored.answers,{scope:'md'});assert.equal(restored.comments.form,'Note');assert.equal(restored.comments.scope,undefined);assert.equal(restored.cursor,'form');
 const script=fs.readFileSync(path.join(root,'questionnaire.js'),'utf8');
 assert.match(script,/orbivia-public-/);assert.doesNotMatch(script,/pickProject|activeProject|projectSelect/);
});
test('each public page resolves its local scripts and styles and exposes both tools from the site',()=>{
 for(const name of ['index.html','classification/index.html','normes/index.html']){
  const file=path.join(root,name),html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)){
   const href=match[1].split('?')[0];if(/^https?:/.test(href))continue;
   const resolved=href.startsWith('/')?path.join(root,'..',href):path.resolve(path.dirname(file),href);
   assert.ok(fs.existsSync(resolved),name+': '+href);
  }
 }
 assert.match(fs.readFileSync(path.join(root,'../index.html'),'utf8'),/>Outils<\/a>/);
 assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/href="classification\/"/);
 assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/href="normes\/"/);
});
test('public progress keeps fixed positions and never retreats on a forward conditional route',()=>{
 for(const kind of ['classification','norms']){
  for(const variant of [0,1,2]){
   const answers={};let last=0;
   for(let i=0;i<150;i++){
    const progress=model.progress(kind,answers),q=model.visible(kind,answers).find(q=>!model.visited(q,answers));
    assert.ok(progress.percent>=last,kind+': percentage retreated');last=progress.percent;
    if(!q){if(model.orientation(kind,answers))assert.ok(progress.percent<100);else assert.equal(progress.percent,model.visible(kind,answers).some(q=>!model.resolved(q,answers))?99:100);break;}
    answers[q.id]=q.options[Math.min(variant,q.options.length-1)][0];
   }
  }
 }
 const a=complete();assert.equal(model.progress('classification',a).percent,100);
 a.nano='checking';assert.ok(model.progress('classification',a).percent<100);
 const one=model.progress('classification',{scope:'md',form:'physical',active:'no'}).percent;
 const two=model.progress('classification',{scope:'md',form:'physical',active:'yes'}).percent;
 assert.equal(one,two,'a future branch cannot change the current fixed position');
});
test('one-page PDFs preserve reasons and all linked references, including the entire catalogue',async()=>{
 const pdf=require('../outils/vendor/pdf-lib.min.js');
 const exporter=require('../outils/pdf-export.js');
 const allYes=Object.fromEntries(questions.map(q=>[q.id,'yes']));
 for(const [kind,state] of [
  ['classification',{answers:complete(),comments:{}}],
  ['classification',{answers:complete({active:'yes',therapyEnergy:'yes',energyHazard:'yes'}),comments:{}}],
  ['classification',{answers:{scope:'ivd'},comments:{}}],
  ['norms',{answers:allYes,comments:{}}],
  ['norms',{answers:Object.fromEntries(questions.map(q=>[q.id,'no'])),comments:{}}]
 ]){
  const summary=model.summary(kind,state);
  const bytes=await exporter.create(summary,pdf);
  assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
  const document=await pdf.PDFDocument.load(bytes);assert.equal(document.getPageCount(),1);
  const annotations=document.getPage(0).node.lookup(pdf.PDFName.of('Annots'));
  if(kind==='norms'){
   const expected=model.analysis(kind,state.answers).suggested;
   assert.equal(annotations.size(),expected.length);
   assert.equal(summary.sections.reduce((n,s)=>n+s.items.filter(i=>i.url).length,0),expected.length);
  }else assert.equal(annotations.size(),1);
 }
 const full=model.summary('norms',{answers:allYes,comments:{}});
 assert.equal(full.sections.reduce((n,s)=>n+s.items.length,0),context.window.ORBIVIA_NORMES_CATALOGUE.length);
});
test('legacy uncertain answers return directly to an unanswered question without blocking',()=>{
 for(const kind of ['classification','norms']){
  const id=kind==='classification'?'scope':'electric';
  const state=model.restore(kind,{answers:{[id]:'checking'},comments:{[id]:'Conserver cette note'},cursor:kind==='classification'?'form':'ivd',result:true});
  assert.equal(state.answers[id],undefined);assert.equal(state.cursor,id);assert.equal(state.result,false);
  assert.equal(state.comments[id],'Conserver cette note');
  assert.equal(model.visited(model.visible(kind,state.answers)[0],state.answers),false);
 }
 const q=model.visible('classification',{})[0];assert.match(q.label,/type de produit/);
 assert.equal(q.options.length,5);assert.equal(Object.keys(q.optionHelp).length,5);
 const script=fs.readFileSync(path.join(root,'questionnaire.js'),'utf8');
 assert.doesNotMatch(script,/\['checking','À vérifier'\]/);
});
test('every public question has several product-specific examples',()=>{
 const examples=require('../outils/question-examples.js');
 for(const [kind,all] of [['classification',classification.allQuestions],['norms',questions]]){
  for(const q of all){
   assert.ok((q.examples||examples[kind][q.id])?.length>=2,kind+': '+q.id);
   assert.ok((q.examples||examples[kind][q.id]).every(text=>typeof text==='string'&&text.length>30));
  }
 }
});
test('common answer ordering is stable, semantic and never preselects an answer',()=>{
 const empty=model.restore('classification',null);
 assert.deepEqual(empty.answers,{});
 const first=id=>model.visible('classification',{scope:'md',form:'physical',active:'yes'}).find(q=>q.id===id)?.options[0][0];
 assert.equal(first('active'),'yes');assert.equal(first('medicinal'),'no');assert.equal(first('nano'),'no');assert.equal(first('implant'),'no');
 assert.equal(model.visible('classification',{scope:'md',form:'software'}).find(q=>q.id==='softwareRole').options[0][0],'independent');
 const a=model.visible('classification',{scope:'md',form:'physical',active:'yes',nano:'yes'}).find(q=>q.id==='nano').options.map(([v])=>v);
 const b=model.visible('classification',{scope:'md',form:'physical',active:'yes',nano:'no'}).find(q=>q.id==='nano').options.map(([v])=>v);
 assert.deepEqual(a,b);
});
test('legacy diagnostic answers require the clearer clinical-context question',()=>{
 const answers=complete({active:'yes',diagnostic:'yes',diagnosticUse:'routine'});delete answers.diagnosticUse;answers.diagnosticVital='yes';answers.diagnosticImmediate='no';
 const state=model.restore('classification',{answers,cursor:'multiPurpose',result:true});
 assert.equal(state.result,false);assert.equal(state.cursor,'diagnosticUse');
 assert.equal(state.answers.diagnosticVital,undefined);assert.equal(state.answers.diagnosticUse,undefined);
});
test('unresolved points persist without becoming false, blocking the result or counting as complete',()=>{
 const answers=complete();answers.nano='unresolved';
 const state=model.restore('classification',{answers,cursor:'multiPurpose',result:true,comments:{nano:'Donnée fournisseur attendue'}});
 assert.equal(state.answers.nano,'unresolved');assert.equal(state.result,true);
 const nano=model.visible('classification',state.answers).find(q=>q.id==='nano');
 assert.equal(model.visited(nano,state.answers),true);assert.equal(model.known(nano,state.answers),false);
 assert.equal(model.analysis('classification',state.answers).complete,false);
 assert.ok(model.progress('classification',state.answers).percent<100);
 assert.match(model.answerRows('classification',state).find(q=>q.id==='nano').answer,/À préciser/);
 assert.match(model.summary('classification',state).outcome,/préciser/);
 assert.equal(state.comments.nano,'Donnée fournisseur attendue');
});
test('a restored assistance draft retains its current question and explanatory trace',()=>{
 const state=model.restore('classification',{answers:{scope:'md'},assistance:{question:'form',version:'clarification-1',path:['physical']},clarifications:{scope:{value:'md',steps:[{question:'Fonction médicale propre ?',answer:'Oui'}]}}});
 assert.equal(state.assistance.question,'form');assert.equal(state.result,false);
 assert.deepEqual(state.assistance.path,['physical']);assert.equal(state.clarifications.scope.steps[0].answer,'Oui');
 assert.equal(model.restore('classification',{assistance:{question:'bad',path:['yes']}}).assistance,null);
});
test('a fully deferred normative route terminates and its provisional PDF remains one page',async()=>{
 const answers={};let count=0;
 while(count<100){const q=model.visible('norms',answers).find(q=>!model.visited(q,answers));if(!q)break;answers[q.id]='unresolved';count++;}
 assert.ok(count>10&&count<100);
 assert.equal(model.analysis('norms',answers).complete,false);
 const restored=model.restore('norms',{answers,result:true});assert.equal(restored.result,true);
 const pdf=require('../outils/vendor/pdf-lib.min.js'),exporter=require('../outils/pdf-export.js');
 const bytes=await exporter.create(model.summary('norms',restored),pdf);
 assert.equal((await pdf.PDFDocument.load(bytes)).getPageCount(),1);
});
test('deferred inactive branches do not prevent completion or affect the standards result',()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,'no']));answers.cloud='unresolved';
 assert.equal(model.analysis('norms',answers).complete,true);
 assert.equal(model.visible('norms',answers).some(q=>q.id==='cloud'),false);
});
test('targeted review and answer editing survive a reload without restarting the whole route',()=>{
 const state=model.restore('classification',{answers:complete(),editing:true,reviewMode:true,reviewSeen:['scope','bogus','scope'],assistance:{question:'form',version:'clarification-1',path:[]}});
 assert.equal(state.editing,true);assert.equal(state.reviewMode,true);assert.deepEqual(state.reviewSeen,['scope']);
 assert.equal(state.assistance.version,'clarification-1');
});
test('an unresolved clinical context cannot export a fallback class I as a proposed rule',()=>{
 const answers=complete({active:'yes',diagnostic:'yes',diagnosticUse:'routine'});answers.diagnosticUse='unresolved';
 const summary=model.summary('classification',{answers,comments:{}});
 assert.match(summary.outcome,/préciser/);
 assert.equal(summary.sections.find(s=>s.title==='Règles proposées, à confirmer').items.some(i=>/Règle (1|13) ·/.test(i.text)),false);
});

test('each initial product choice either continues MDR or gives a specific orientation',()=>{
 for(const scope of ['md','accessory']){
  assert.equal(model.orientation('classification',{scope}),null);
  assert.ok(model.visible('classification',{scope}).some(q=>q.id==='form'));
  assert.equal(model.restore('classification',{answers:{scope},result:true}).result,false);
 }
 for(const scope of ['annex16','other','unresolved']){
  const info=model.orientation('classification',{scope});assert.ok(info?.title);assert.ok(info.text.length>100);
  assert.equal(model.visible('classification',{scope}).length,1);
  assert.equal(model.progress('classification',{scope},'scope').percent,0);
 }
 assert.equal(model.orientation('classification',{scope:'ivd'}),null);
 assert.ok(model.visible('classification',{scope:'ivd'}).some(q=>q.id==='ivdQualification'));
 assert.equal(model.restore('classification',{answers:{scope:'ivd'},result:true}).cursor,'ivdQualification');
 assert.match(model.orientation('classification',{scope:'annex16'}).text,/pas pris en charge/);
 assert.equal(model.orientation('norms',{scope:'ivd'}),null);
});

test('IVDR PDF summaries use IVDR rules and sources and remain one page',async()=>{
 const PDFLib=require('../outils/vendor/pdf-lib.min.js');
 const exporter=require('../outils/pdf-export.js');
 function route(overrides){const answers={scope:'ivd'},defaults={ivdQualification:'yes',ivdRole:'test',ivdAllUses:'yes',ivdMarkers:'listed',ivdSelfException:'other',...overrides};for(let i=0;i<100;i++){const q=model.visible('classification',answers).find(q=>!model.visited(q,answers));if(!q)return answers;answers[q.id]=defaults[q.id]??'no';}throw Error('Route did not finish');}
 for(const overrides of [{ivdSelf:'yes',ivdSelfException:'pregnancy'},{ivdRole:'receptacle',ivdSterile:'yes'},Object.fromEntries(ivdr.allQuestions.filter(q=>q.options.some(([v])=>v==='yes')).map(q=>[q.id,'yes']))]){
  const answers=route(overrides),summary=model.summary('classification',{answers,comments:{}});
  assert.equal(summary.title,'Classification IVDR');assert.ok(summary.sections.some(s=>s.items.some(i=>i.url===ivdr.source)));
  const bytes=await exporter.create(summary,PDFLib),doc=await PDFLib.PDFDocument.load(bytes);
  assert.equal(doc.getPageCount(),1);assert.ok(bytes.length>1000);
 }
 const restored=model.restore('classification',{answers:{scope:'ivd'},result:true});assert.equal(restored.cursor,'ivdQualification');assert.equal(restored.result,false);
 const answers=route({ivdSelf:'yes',ivdSelfException:'pregnancy'});answers.ivdPropagation='unresolved';
 const r=model.analysis('classification',answers);assert.equal(r.complete,false);assert.equal(model.summary('classification',{answers,comments:{}}).outcome,'Classification à préciser');
 const changed={...answers,scope:'md'};assert.equal(model.analysis('classification',changed).regulation,'MDR');assert.equal(model.visible('classification',changed).some(q=>q.id.startsWith('ivd')),false);
});
