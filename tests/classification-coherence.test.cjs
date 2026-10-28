const test=require('node:test'),assert=require('node:assert/strict');
const mdr=require('../outils/shared/classification-engine.js');
const ivdr=require('../outils/shared/ivdr-engine.js');
const classification=require('../outils/shared/classification-router.js').create(mdr,ivdr);
const presentation=require('../outils/classification/presentation.js');
const model=require('../outils/tool-model.js').create({classification,presentation});

function complete(engine,overrides={}){
 const defaults={scope:'md',form:'physical',active:'yes',contact:'none',implant:'no',duration:'short',cleaning:'none',tissue:'none',controlTherapy:'none',diagnosticUse:'routine',multiPurpose:'yes',ivdQualification:'yes',ivdRole:'test',ivdAllUses:'yes',...overrides},answers={};
 for(let i=0;i<100;i++){
  const q=engine.questions(answers).find(q=>!engine.known(q,answers));if(!q)return answers;
  const value=defaults[q.id]??'no';assert.ok(q.options.some(([v])=>v===value),q.id);answers[q.id]=value;
 }throw Error('Non-terminating route');
}
const rule=(answers,n)=>mdr.evaluate(answers).rules.find(r=>r.n===n);

test('rule 10 explains only selected diagnostic criteria, without naming an unasked technology',()=>{
 for(const [overrides,expected,absent] of [
  [{diagnostic:'yes'},/Diagnostic direct ou mesure d’un processus vital/,/EEG|ECG|cérébral|radiopharmaceutiques|Énergie diagnostique/],
  [{diagnostic:'yes',diagnosticUse:'other',diagnosticEnergy:'yes'},/Énergie diagnostique absorbée/,/radiopharmaceutiques|Diagnostic direct/],
  [{diagnostic:'yes',diagnosticUse:'other',radiopharm:'yes'},/distribution de produits radiopharmaceutiques/,/Énergie diagnostique|Diagnostic direct/]
 ]){
  const r=rule(complete(mdr,overrides),10);assert.equal(r.class,'IIa');assert.match(r.reason,expected);assert.doesNotMatch(r.reason,absent);
 }
 const r=rule(complete(mdr,{diagnostic:'yes',diagnosticEnergy:'yes',radiopharm:'yes'}),10);
 assert.match(r.reason,/Énergie diagnostique.*radiopharmaceutiques.*Diagnostic direct/);
});

test('body-orifice result never invents an anatomical answer for a transient route',()=>{
 const a=complete(mdr,{active:'no',contact:'orifice',duration:'transient'});
 assert.equal(mdr.questions(a).some(q=>q.id==='orificeCavity'),false);
 assert.doesNotMatch(rule(a,5).reason,/exception anatomique/);
});

test('implant result does not duplicate a criterion or infer an external accessory',()=>{
 const r=rule(complete(mdr,{implant:'yes',implantActive:'yes'}),8);
 assert.equal(r.class,'III');assert.equal(r.reason.match(/Implant actif ou accessoire d’implant actif/g).length,1);
 assert.doesNotMatch(r.reason,/externe/);
});

test('the same question and answer labels are used in review and the PDF profile',()=>{
 const answers=complete(mdr,{diagnostic:'yes',form:'combined',softwareRole:'drives'});
 const state={answers},rows=model.answerRows('classification',state);
 for(const q of model.visible('classification',answers)){
  const view=presentation.view(q),row=rows.find(r=>r.id===q.id);
  assert.equal(row.label,view.title);assert.equal(row.answer,view.options.find(([v])=>v===answers[q.id])[1]);
 }
 assert.doesNotMatch(rows.find(r=>r.id==='diagnosticUse').answer,/EEG|ECG/);
 const profile=model.summary('classification',state).sections.find(s=>s.title==='Profil déclaré');
 assert.ok(profile.items.some(i=>i.text.endsWith(presentation.questions.form.options.combined)));
});

test('editing a parent removes obsolete answers and their guidance, including after reload',()=>{
 const a=complete(mdr,{diagnostic:'yes',diagnosticUse:'critical'});
 const state={answers:a,clarifications:{diagnosticUse:{value:'critical',steps:[]}}};
 state.answers.diagnostic='no';model.prune('classification',state);
 assert.equal(state.answers.diagnosticUse,undefined);assert.equal(state.clarifications.diagnosticUse,undefined);
 state.answers.diagnostic='yes';
 assert.equal(model.visible('classification',state.answers).find(q=>q.id==='diagnosticUse')?.id,'diagnosticUse');
 assert.equal(model.analysis('classification',state.answers).complete,false);
 const restored=model.restore('classification',{answers:{...a,diagnostic:'no',diagnosticUse:'critical'},result:true});
 assert.equal(restored.answers.diagnosticUse,undefined);
 const ivdState={answers:{scope:'ivd',...complete(ivdr,{ivdInfection:'yes',ivdSexual:'yes'})}};
 ivdState.answers.ivdInfection='no';model.prune('classification',ivdState);
 assert.equal(ivdState.answers.ivdSexual,undefined);
});

test('IVDR summaries name the declared product role rather than every possible class-A role',()=>{
 for(const [role,expected,absent] of [
  ['receptacle',/Récipient de prélèvement/,/instrument|Accessoire|Produit général/i],
  ['instrument',/Instrument support/,/Récipient|Accessoire|Produit général/i],
  ['lab',/Produit général IVD/,/Récipient|instrument|Accessoire/i],
  ['accessory',/Accessoire de DIV/,/Récipient|instrument|Produit général/i]
 ]){
  const r=ivdr.evaluate(complete(ivdr,{ivdRole:role,ivdInstrumentIndependent:'no',ivdGeneral:'yes',ivdAccessoryCritical:'no'}));
  assert.equal(r.highest,'A');const reason=r.rules.find(r=>r.n===5).reason;
  assert.match(reason,expected);assert.doesNotMatch(reason,absent);
 }
 const r=ivdr.evaluate(complete(ivdr,{ivdGenetic:'yes'}));
 assert.match(r.rules.find(r=>r.n===3).reason,/Examen génétique humain\./);
 assert.doesNotMatch(r.rules.find(r=>r.n===3).reason,/\?/);
});
