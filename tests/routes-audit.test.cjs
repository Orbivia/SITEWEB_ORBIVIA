const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const mdr=require('../outils/shared/classification-engine.js'),ivdr=require('../outils/shared/ivdr-engine.js');
const classification=require('../outils/shared/classification-router.js').create(mdr,ivdr);
const norms=require('../outils/shared/normes-model.js'),questions=require('../outils/shared/normes-questions.js'),explanations=require('../outils/shared/normes-explications.js');
const ctx=vm.createContext({window:{}});vm.runInContext(fs.readFileSync(require.resolve('../outils/shared/normes-catalogue.js'),'utf8'),ctx);
const model=require('../outils/tool-model.js').create({classification,norms,questions,explanations,catalogue:ctx.window.ORBIVIA_NORMES_CATALOGUE});
function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
for(const route of ['md','accessory','ivd','norms'])test('route audit: 300 deterministic paths with reload, uncertainty and parent edits: '+route,()=>{
 for(let seed=1;seed<=300;seed++){
  const rnd=random(seed),kind=route==='norms'?'norms':'classification';let state={answers:route==='norms'?{}:{scope:route},comments:{},result:false};let iterations=0,last=0;
  function finish(){
   last=0;
   while(iterations++<250){
    const active=model.visible(kind,state.answers),q=active.find(q=>!model.visited(q,state.answers));
    const progress=model.progress(kind,state.answers,state.cursor);assert.ok(progress.percent>=0&&progress.percent<=100);
    assert.ok(progress.percent>=last,route+'/'+seed+': forward progress retreated');last=progress.percent;
    if(!q){state.result=true;break;}
    const answer=rnd()<0.08?'unresolved':q.options[Math.floor(rnd()*q.options.length)][0];
    state.answers[q.id]=answer;state.cursor=q.id;state.comments[q.id]='Note <test> '+seed;
    const restored=model.restore(kind,JSON.parse(JSON.stringify(state)));
    assert.deepEqual(restored.answers,state.answers,'reload preserves valid answers');state=restored;
   }
   assert.ok(iterations<250,'route terminates: '+route+'/'+seed);
   const result=model.analysis(kind,state.answers),active=model.visible(kind,state.answers);
   if(active.some(q=>!model.resolved(q,state.answers)))assert.equal(result.complete,false,'uncertainty prevents a definitive result');
   const restored=model.restore(kind,{...state,result:true});assert.equal(restored.result,true,'visited uncertain points do not block result restoration');
   const summary=model.summary(kind,state);assert.ok(summary.title);assert.ok(summary.sections.length);
  }
  finish();
  // Edit an earlier answer, then complete only the newly active fields.
  const candidates=model.visible(kind,state.answers).filter(q=>q.id!=='scope');const parent=candidates[Math.floor(rnd()*candidates.length)];
  if(parent){state.answers[parent.id]=parent.options[Math.floor(rnd()*parent.options.length)][0];state.result=false;iterations=0;finish();}
 }
});
