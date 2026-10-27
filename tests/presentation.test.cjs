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
  for(const [,label] of view.options)assert.ok(label.trim(),q.id+' answer label');
  assert.equal(JSON.stringify(q),original,q.id+' engine question must not mutate');
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

test('mobile presentation skips needless offscreen measurement of 96 questions',()=>{
 const prior=global.window;
 let cleared=false;
 global.window={matchMedia:query=>({matches:query==='(max-width: 899px)'})};
 try{
  presentation.reservePrompt({
   querySelector(){throw new Error('DOM measurement must not run on mobile')},
   style:{removeProperty(key){assert.equal(key,'--question-prompt-height');cleared=true;}}
  });
  assert.ok(cleared);
 }finally{
  if(prior===undefined)delete global.window;else global.window=prior;
 }
});

test('MDR and IVDR questions render without decorative question icons',()=>{
 assert.equal(Object.keys(presentation.questions).length,96);
 assert.equal(typeof presentation.questionIcon,'undefined');
 assert.ok(presentation.view(questions[0]).title.trim());
});
