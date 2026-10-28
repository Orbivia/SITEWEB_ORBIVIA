import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {create,base,finish} from '../outils/etiquettes-tracabilite/tests/harness.mjs';

const has=(items,code)=>items.some(it=>it.code===code);
function scenario(overrides={},date){const app=create();Object.assign(app.answers,base,overrides);return app.conclusions(date);}

test('labelling: complete route, review edits and a coherent summary share the same answers',()=>{
 const app=create();assert.equal(finish(app),22);
 assert.match(app.root.innerHTML,/Code UDI — AIDC \+ HRI/);
 assert.match(app.root.innerHTML,/data-edit="sterile"/);
 app.action('back');assert.equal(app.finished,true);assert.equal(app.answersPanel.open,true);
 app.edit('space');assert.equal(app.current().id,'space');assert.equal(app.editing,true);
 app.selectChoice('small');assert.equal(app.finished,true);
 assert.ok(app.conclusions().review.some(it=>it.title.includes('Place réduite')));
});

test('labelling: changing sterility requests new information and removes old hidden answers',()=>{
 const app=create();finish(app);
 app.edit('sterile');app.selectChoice('sterile');
 assert.equal(app.finished,false);assert.equal(app.current().id,'sterilmethod');
 assert.equal(app.answers.fluidpath,undefined);assert.equal(app.answers.nonsterilevariants,undefined);
 app.selectChoice('eo');app.selectChoice('single');app.selectChoice('no');assert.equal(app.finished,true);
 assert.ok(has(app.conclusions().required,'5.2.3'));
 app.edit('sterile');app.selectChoice('nonsterile');
 assert.equal(app.current().id,'nonsterilevariants');assert.equal(app.answers.sterilmethod,undefined);
 finish(app);assert.equal(has(app.conclusions().required,'5.2.3'),false);
});

test('labelling: reuse and commercial-status edits purge obsolete branches',()=>{
 const app=create();finish(app,{reuse:'reusable',patient:'same',reprocess:'clean'});
 app.edit('reuse');app.selectChoice('single');
 assert.equal(app.finished,true);assert.equal(app.answers.patient,undefined);assert.equal(app.answers.reprocess,undefined);
 assert.equal(has(app.conclusions().conditional,'5.4.12'),false);
 app.edit('status');app.selectChoice('custom');
 assert.equal(app.finished,true);assert.equal(app.answers.ce,undefined);assert.equal(app.answers.carrier,undefined);assert.equal(app.answers.class,undefined);
 assert.equal(has(app.conclusions().required,'CE + ON'),false);
 app.edit('status');app.selectChoice('market');
 assert.equal(app.finished,false);assert.equal(app.current().id,'carrier');
});

test('labelling: non-EU destination ends the MDR route for every product status',()=>{
 for(const status of ['market','custom','investigation','draft']){
  const app=create();assert.equal(finish(app,{status,territory:'outside'}),2);
  assert.deepEqual(Object.keys(app.answers).sort(),['status','territory']);
  assert.equal(app.conclusions().required.length,0);assert.match(app.root.innerHTML,/Marché hors périmètre/);
  app.edit('territory');app.selectChoice('eu');assert.equal(app.current().id,'support');assert.equal(app.finished,false);
 }
});

test('labelling: invalid saved shapes and missing responses cannot yield a finished summary',()=>{
 for(const malformed of [
  {status:['market']},{storage:'temperature'},{storage:['none','temperature']},{substances:[]},{tracking:'unknown'}
 ]){
  const app=create({answers:{...base,...malformed,unrecognised:'yes'},finished:true});
  assert.equal(app.finished,false);assert.equal(app.answers.unrecognised,undefined);
  assert.doesNotMatch(app.root.innerHTML,/label-summary-heading/);
 }
 const app=create({answers:{...base,reuse:'single',patient:'same',reprocess:'sterilize'},finished:true});
 assert.equal(app.finished,true);assert.equal(app.answers.patient,undefined);assert.equal(app.answers.reprocess,undefined);
 app.doReset();assert.equal(app.finished,false);assert.equal(Object.keys(app.answers).length,0);assert.equal(app.current().id,'status');
});

test('labelling: contradictions are visible and an inconsistent CE logo is withheld',()=>{
 for(const overrides of [
  {class:'iia',ce:'ce-alone'}, {class:'i',ce:'ce-nb'},
  {class:'i',ce:'ce-alone',sterile:'sterile',sterilmethod:'eo',barrier:'single',resterilize:'no'},
  {ce:'notready'}
 ]){
  const app=create();finish(app,overrides);
  assert.equal(has(app.conclusions().required,'CE'),false);assert.equal(has(app.conclusions().required,'CE + ON'),false);
  assert.match(app.root.innerHTML,/point[s]? à corriger avant impression/);
  assert.match(app.root.innerHTML,/label-review" open/);
  assert.doesNotMatch(app.root.innerHTML,/symboles-iso\/CE\.png/);
 }
 assert.ok(has(scenario({class:'i',ce:'ce-alone'}).required,'CE'));
 assert.ok(has(scenario().required,'CE + ON'));
});

test('labelling: UDI direct marking follows class, reprocessing, support and the application date',()=>{
 const defaults={support:'device',reuse:'reusable',patient:'same',reprocess:'clean',class:'i',ce:'ce-alone'};
 assert.ok(has(scenario(defaults,new Date('2027-05-25T12:00:00Z')).conditional,'UDI direct'));
 assert.ok(has(scenario(defaults,new Date('2027-05-26T00:00:00Z')).required,'UDI direct'));
 assert.ok(has(scenario({...defaults,class:'iia'},new Date('2026-10-28T00:00:00Z')).required,'UDI direct'));
 assert.equal(has(scenario({...defaults,reprocess:'none'}).required,'UDI direct'),false);
 assert.equal(has(scenario({...defaults,status:'custom'}).required,'UDI direct'),false);
 const noProcessing=scenario({...defaults,reprocess:'none'});
 assert.ok(noProcessing.conditional.some(it=>it.title==='Instructions de réutilisation'));
 assert.equal(noProcessing.conditional.some(it=>it.title==='Instructions de retraitement'),false);
});

test('labelling: implant and sterile-pack contradictions cannot be silently hidden',()=>{
 for(const overrides of [
  {implant:'active',tracking:'lot'}, {implant:'active',class:'iia',tracking:'serial'},
  {support:'sterile',sterile:'nonsterile'},
  {support:'sterile',sterile:'sterile',sterilmethod:'eo',barrier:'single',resterilize:'no',expiry:'no'},
  {sterile:'sterile',sterilmethod:'eo',barrier:'single',resterilize:'no',reuse:'reusable',patient:'multiple',reprocess:'sterilize'}
 ])assert.ok(scenario(overrides).review.some(it=>it.blocking));
 const custom=scenario({status:'custom',implant:'active',tracking:'lot'});
 assert.equal(custom.review.some(it=>it.detail.includes('doit comprendre un numéro')),false);
});

test('labelling: every referenced PNG exists and printing expands then restores the regulatory details',()=>{
 const app=create();finish(app);
 for(const q of app.Q)for(const option of q.options){
  const value=q.type==='multi'?[option[0]]:option[0];
  const r=scenario({[q.id]:value});
  for(const it of [...r.required,...r.conditional]){
   const html=app.symbolImage(it.code),asset=html.match(/symboles-iso\/([^?]+)\?/);
   if(asset)assert.ok(existsSync(new URL('../outils/etiquettes-tracabilite/symboles-iso/'+asset[1],import.meta.url)));
  }
 }
 const states=app.sections.map(it=>it.open);app.events.beforeprint();assert.ok(app.sections.every(it=>it.open));
 app.events.afterprint();assert.deepEqual(app.sections.map(it=>it.open),states);
});

test('labelling: 300 deterministic paths terminate, survive reload and support earlier-answer edits',()=>{
 let seed=12345;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let route=0;route<300;route++){
  let app=create(),last=0;
  function walk(){
   for(let step=0;step<80&&!app.finished;step++){
    const q=app.current(),idx=app.Q.findIndex(it=>it.id===q.id);assert.ok(idx>=last);last=idx;
    const value=q.options[Math.floor(random()*q.options.length)][0];app.selectChoice(value);if(q.type==='multi')app.next();
    const before=JSON.stringify(app.answers),wasFinished=app.finished;
    app=create(app.saved());assert.equal(JSON.stringify(app.answers),before);assert.equal(app.finished,wasFinished);
   }
   assert.ok(app.finished);
  }
  walk();
  const qs=app.applicable(),parent=qs[Math.floor(random()*qs.length)];
  app.edit(parent.id);last=0;app.selectChoice(parent.options[Math.floor(random()*parent.options.length)][0]);if(parent.type==='multi')app.next();
  walk();
 }
});
