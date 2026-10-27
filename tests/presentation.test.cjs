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
test('each question uses one local solid SVG; answers stay text-only',()=>{
 const fs=require('node:fs'),path=require('node:path');
 for(const q of questions){const markup=presentation.questionIcon(q),asset=markup.match(/src="\.\.\/shared\/icons\/([a-z]+\.svg)/);assert.ok(asset,q.id);assert.equal((markup.match(/<img /g)||[]).length,1);assert.ok(fs.existsSync(path.join(__dirname,'../outils/shared/icons',asset[1])));assert.doesNotMatch(markup,/.png|onerror=|https?:/i);}
});

test('IVDR families cover every role exactly once, with three choices per screen',()=>{
 const groups=Object.values(presentation.roleGroups);
 assert.equal(groups.length,3);
 for(const g of groups)assert.equal(g.values.length,3);
 const values=groups.flatMap(g=>g.values);
 assert.equal(new Set(values).size,values.length);
 assert.deepEqual(values.sort(),questions.find(q=>q.id==='ivdRole').options.map(([v])=>v).sort());
});

test('semantic icon mapping is stable for selected MDR and IVDR questions',()=>{
 assert.match(presentation.questionIcon({id:'scope'}),/medical.svg/);
 assert.match(presentation.questionIcon({id:'form'}),/product.svg/);
 assert.match(presentation.questionIcon({id:'tissue'}),/cells.svg/);
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
