const test=require('node:test'),assert=require('node:assert/strict');
const c=require('../outils/shared/classification-engine.js'),n=require('../outils/shared/normes-questions.js');
const g=require('../outils/clarification.js');
const ivdr=require('../outils/shared/ivdr-engine.js');
const groups=[['classification',[...c.allQuestions,...ivdr.allQuestions]],['norms',n.map(q=>({...q,options:[['yes','Oui'],['no','Non']]}))]];
for(const [kind,questions] of groups)for(const q of questions)test('Clarification '+kind+'/'+q.id+' — all paths end with a valid proposal or an explicit unresolved point',()=>{
 let leaves=0;
 function visit(path){
  assert.ok(path.length<8,'cycle or overly long aid');
  const view=g.view(kind,q,path);
  if(view.type==='proposal'){assert.ok(q.options.some(([v])=>v===view.value));leaves++;return;}
  assert.ok(view.question.length>20);assert.ok(view.options.length>=2);
  const uncertain=g.view(kind,q,[...path,'?']);
  assert.equal(uncertain.type,'proposal');assert.equal(uncertain.value,'unresolved');
  assert.equal(uncertain.trace.length,path.length);
  for(const [v] of view.options)visit([...path,v]);
 }
 visit([]);assert.ok(leaves>=2);
});
function q(id){return c.allQuestions.find(q=>q.id===id);}
test('clinical guidance distinguishes routine EEG, critical surveillance and other measurements',()=>{
 assert.equal(g.view('classification',q('diagnosticUse'),['no','yes']).value,'routine');
 assert.equal(g.view('classification',q('diagnosticUse'),['no','no','yes']).value,'routine');
 assert.equal(g.view('classification',q('diagnosticUse'),['yes']).value,'critical');
 assert.equal(g.view('classification',q('diagnosticUse'),['no','no','no']).value,'other');
 assert.equal(g.view('classification',q('diagnosticUse'),['no','?']).value,'unresolved');
});
test('a technical regulation is not converted into a diagnostic therapeutic loop',()=>{
 assert.equal(g.view('classification',q('closedLoopDiagnostic'),['no']).value,'no');
 assert.equal(g.view('classification',q('closedLoopDiagnostic'),['yes','no']).value,'no');
 assert.equal(g.view('classification',q('closedLoopDiagnostic'),['yes','yes']).value,'yes');
 assert.equal(g.view('classification',q('closedLoopDiagnostic'),['yes','?']).value,'unresolved');
});
test('invalid drafts cannot inject a suggestion or skip confirmation',()=>{
 const view=g.view('classification',q('diagnosticUse'),['bogus','yes']);
 assert.equal(view.type,'step');assert.deepEqual(view.path,[]);
 assert.equal(g.view('classification',q('diagnosticUse'),['yes','no','yes']).value,'critical');
});
test('a medical purpose alone cannot turn a medicine into a medical device',()=>{
 assert.equal(g.view('classification',q('scope'),['no','yes']).type,'step');
 assert.equal(g.view('classification',q('scope'),['no','yes','yes']).value,'other');
 assert.equal(g.view('classification',q('scope'),['no','yes','no']).value,'md');
 assert.equal(g.view('classification',q('scope'),['no','yes','?']).value,'unresolved');
});
test('partial implantation uses the 30-day criterion instead of any temporary residence',()=>{
 assert.equal(g.view('classification',q('implant'),['yes']).value,'yes');
 assert.equal(g.view('classification',q('implant'),['no','yes']).value,'yes');
 assert.equal(g.view('classification',q('implant'),['no','no']).value,'no');
 assert.equal(g.view('classification',q('implant'),['no','?']).value,'unresolved');
});
test('special medical purposes are not silently treated as ordinary accessories',()=>{
 assert.equal(g.view('classification',q('scope'),['no','no','yes','no']).value,'md');
 assert.equal(g.view('classification',q('scope'),['no','no','no','yes']).value,'accessory');
 assert.equal(g.view('classification',q('scope'),['no','no','no','no','yes']).value,'annex16');
});
