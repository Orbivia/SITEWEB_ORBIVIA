const test=require('node:test');
const assert=require('node:assert/strict');
const presentation=require('../outils/classification/presentation.js');
const questions=['classification-engine','ivdr-engine'].flatMap(name=>require('../outils/shared/'+name+'.js').allQuestions);
test('every MDR and IVDR question has a presentation with preserved criteria and answer values',()=>{
 assert.equal(questions.length,96);
 assert.deepEqual(Object.keys(presentation.questions).sort(),questions.map(q=>q.id).sort());
 for(const q of questions){
  const original=JSON.stringify(q),p=presentation.questions[q.id],view=presentation.view(q);
  assert.equal(p.sourceLabel,q.label.trim(),q.id+' regulatory wording changed: review the presentation');
  assert.ok(view.title.trim(),q.id+' title');
  if(q.id!=='scope'&&view.title!==q.label.trim())assert.ok(view.criterion.trim(),q.id+' qualifying criterion must remain visible');
  assert.deepEqual(view.options.map(([v])=>v),q.options.map(([v])=>v),q.id+' answer values/order');
  for(const [value,label] of view.options){
   assert.ok(label.trim(),q.id+' answer label');
   assert.doesNotMatch(presentation.answerIcon(q,value),/undefined|NaN/);
  }
  assert.equal(JSON.stringify(q),original,q.id+' engine question must not mutate');
 }
});
test('only concrete entry choices use decorative SVGs; other answers remain text-only',()=>{
 for(const name of Object.keys(presentation.icons)){
  const svg=presentation.icon(name);
  assert.match(svg,/aria-hidden="true"/);assert.match(svg,/viewBox="0 0 32 32"/);assert.match(svg,/focusable="false"/);
  assert.doesNotMatch(svg,/<script|onload=|https?:/);
 }
 for(const q of questions.filter(q=>q.options.every(([v])=>['yes','no'].includes(v)))){
  assert.equal(presentation.answerIcon(q,'yes'),'');
  assert.equal(presentation.answerIcon(q,'no'),'');
 }
});

test('IVDR families cover every role exactly once, with three choices per screen',()=>{
 const groups=Object.values(presentation.roleGroups);
 assert.equal(groups.length,3);
 for(const g of groups)assert.equal(g.values.length,3);
 const values=groups.flatMap(g=>g.values);
 assert.equal(new Set(values).size,values.length);
 assert.deepEqual(values.sort(),questions.find(q=>q.id==='ivdRole').options.map(([v])=>v).sort());
});
