const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'../outils');
const classification=require('../outils/compliance/classification-engine.js');
const norms=require('../outils/compliance/normes-model.js');
const questions=require('../outils/compliance/normes-questions.js');
const explanations=require('../outils/compliance/normes-explications.js');
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'compliance/normes-catalogue.js'),'utf8'),context);
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
test('reports contain reasons, all applicable answers and sources without unescaped comments',()=>{
 const state={answers:complete(),comments:{scope:'<img src=x onerror=alert(1)>'}};
 const html=model.report('classification',state);
 assert.match(html,/Classe proposée : I/);assert.match(html,/Examen des 22 règles/);assert.match(html,/eur-lex/);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img src=x/);
 const normative=model.report('norms',{answers:{software:'yes'},comments:{}});
 assert.match(normative,/IEC 62304/);assert.match(normative,/Caractéristiques restant à préciser/);assert.match(normative,/Pourquoi elle est proposée/);
 assert.match(model.report('norms',{answers:{ivd:'yes'},comments:{}}),/ne réalise pas la qualification ni la classification IVDR/);
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
    if(!q){assert.equal(progress.percent,100);break;}
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
   assert.ok(examples[kind][q.id]?.length>=2,kind+': '+q.id);
   assert.ok(examples[kind][q.id].every(text=>typeof text==='string'&&text.length>30));
  }
 }
});
