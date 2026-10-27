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
test('each question has one PNG icon and an SVG fallback; answer buttons stay text-only',()=>{
 const matchedIcons=new Set();
 for(const q of questions){
  const markup=presentation.questionIcon(q);
  const asset=markup.match(/icones-raster\/icones\/(icon-\d{2}\.png)/);
  assert.ok(asset,q.id+' raster');
  matchedIcons.add(asset[1]);
  assert.match(markup,/mdr-svg-fallback/);
  assert.doesNotMatch(markup,/<script|onload=|onerror=|https?:/i);
 }
 assert.equal(matchedIcons.size,57,'the planned reuse of the source artwork is preserved');
 const renderer=require('node:fs').readFileSync(require('node:path').join(__dirname,'../outils/questionnaire.js'),'utf8');
 assert.match(renderer,/presentation\.questionIcon\(q\)/);
 assert.doesNotMatch(renderer,/presentation\.answerIcon\(/);
});

test('IVDR families cover every role exactly once, with three choices per screen',()=>{
 const groups=Object.values(presentation.roleGroups);
 assert.equal(groups.length,3);
 for(const g of groups)assert.equal(g.values.length,3);
 const values=groups.flatMap(g=>g.values);
 assert.equal(new Set(values).size,values.length);
 assert.deepEqual(values.sort(),questions.find(q=>q.id==='ivdRole').options.map(([v])=>v).sort());
});

test('explicit PNG mapping is stable for selected MDR and IVDR questions',()=>{
 assert.match(presentation.questionIcon({id:'scope'}),/icon-01\.png/);
 assert.match(presentation.questionIcon({id:'form'}),/icon-56\.png/);
 assert.match(presentation.questionIcon({id:'ivdNear'}),/icon-15\.png/);
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
