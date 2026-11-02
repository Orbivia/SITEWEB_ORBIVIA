import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {create,base,finish} from '../outils/etiquettes-tracabilite/tests/harness.mjs';

const has=(items,code)=>items.some(it=>it.code===code);
function scenario(overrides={},date){const app=create();Object.assign(app.answers,base,overrides);return app.conclusions(date);}

test('labelling: complete route, review edits and a coherent summary share the same answers',()=>{
 const app=create();assert.equal(finish(app),30);
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


test('labelling: progress remains monotonic when yes answers reveal extra questions',()=>{
 const app=create();let previous=-1,steps=0,expanded=0;
 const read=()=>Number(app.root.innerHTML.match(/<progress max="100" value="(\d+)"/)?.[1]||0);
 while(!app.finished&&steps++<90){
  const q=app.current(),before=read();
  assert.ok(before>=previous,'Progress must not decrease at '+q.id+': '+before+' < '+previous);
  previous=before;
  const choice=['storage','substances'].includes(q.id)?'yes':(base[q.id]??q.options[0][0]);
  app.selectChoice(choice);
  if(['storage','substances'].includes(q.id))expanded++;
 }
 assert.equal(expanded,2);assert.equal(app.finished,true);
 assert.ok(steps>26,'Conditional yes answers should expand the route');
});


test('labelling: electrical equipment suggests WEEE mark only when in scope',()=>{
 const device=scenario({electronic:'yes',support:'device',status:'market',elec_weee:'yes',elec_battery:'no',elec_ip:'no',elec_60601:'no',elec_manual:'no',elec_supply:'yes',elec_indoor:'no'});
 assert.ok(has(device.required,'DEEE'),"WEEE required on device");
 assert.ok(has(device.required,'Alim.'),"Electrical ratings suggested for device");
 const packaging=scenario({electronic:'yes',support:'unit',status:'market',elec_weee:'yes',elec_battery:'no',elec_ip:'no',elec_60601:'no',elec_manual:'no',elec_supply:'yes',elec_indoor:'no'});
 assert.ok(has(packaging.conditional,'DEEE'),"WEEE not presumed on packaging");
 assert.ok(packaging.review.some(x=>x.title.includes('Poubelle barrée')),"Location warning is clear");
 const excluded=scenario({electronic:'yes',support:'device',status:'market',elec_weee:'no',elec_battery:'no',elec_ip:'no',elec_60601:'no',elec_manual:'no',elec_supply:'no',elec_indoor:'no'});
 assert.equal(has(excluded.required,'DEEE'),false);
 assert.match(create().symbolImage('DEEE'),/WEEE\.svg/,"Exact supplied external graphic is visible");
});

test('labelling: IP rating is text only and requires explicit established value',()=>{
 const noIp=scenario({electronic:'yes',elec_ip:'no'});
 assert.equal([...noIp.required,...noIp.conditional].some(x=>/^IP\d|^IPX/i.test(x.code)),false);
 const ip=scenario({electronic:'yes',support:'device',elec_ip:'yes',elec_ip_value:'ip67'});
 assert.ok(has(ip.required,'IP67'),"Actual specified IP rating must appear");
 assert.equal(create().symbolImage('IP67'),"","IP67 is a code, not an invented ISO logo");
 const other=scenario({electronic:'yes',elec_ip:'yes',elec_ip_value:'other'});
 assert.ok(other.review.some(x=>x.title==='Indice IP à reporter'));
});

test('labelling: IEC 60417 symbols require the declared safety class and patient protection',()=>{
 const baseline=scenario({electronic:'no'});
 assert.equal([...baseline.required,...baseline.conditional].some(x=>x.code.startsWith('IEC 60417-')),false);
 const selected=scenario({
  electronic:'yes',support:'device',elec_60601:'yes',elec_insulation:'class2',
  elec_applied:'bf',elec_defib:'yes',elec_manual:'yes',elec_indoor:'yes',
  elec_ip:'yes',elec_ip_value:'ip22'
 });
 assert.ok(has(selected.required,'IEC 60417-5172'));
 assert.ok(has(selected.required,'IEC 60417-5334'));
 assert.ok(!has(selected.required,'IEC 60417-5333'),"Use defibrillation-proof symbol instead of incompatible base");
 assert.ok(has(selected.required,'ISO 7010-M002'));
 assert.ok(has(selected.required,'IEC 60417-5957'));
 assert.ok(has(selected.required,'IP22'));
 assert.match(create().symbolImage('ISO 7010-M002'),/symboles-iec\/ISO-7010-M002\.png/);
 const other=scenario({electronic:'yes',elec_60601:'no',elec_applied:'bf',elec_insulation:'class2'});
 assert.equal([...other.required,...other.conditional].some(x=>x.code.startsWith('IEC 60417-5333')),false);
});

test('labelling: batteries and medical instructions are not conflated with WEEE',()=>{
 const battery=scenario({electronic:'yes',elec_battery:'yes',elec_weee:'no',support:'device'});
 assert.ok(has(battery.conditional,'BAT-DEEE'));
 assert.equal(has(battery.required,'DEEE'),false);
 const ifu=scenario({electronic:'no',instructions:'yes',instructions_ifu:'yes'});
 assert.ok(has(ifu.required,'5.4.3'),"Show the existing genuine ISO consult-IFU pictogram");
 assert.equal(has(ifu.required,'ISO 7010-M002'),false);
 const none=scenario({electronic:'no',instructions:'none'});
 assert.equal(has(none.required,'5.4.3'),false);
});

test('labelling: electrical subquestions are conditional and old answers are discarded',()=>{
 const app=create();finish(app,{electronic:'yes',elec_weee:'yes',elec_battery:'yes',elec_ip:'yes',elec_ip_value:'ip67',elec_60601:'yes',elec_insulation:'class2',elec_applied:'bf',elec_defib:'yes',elec_manual:'yes',elec_supply:'yes',elec_indoor:'yes'});
 assert.ok(app.answers.elec_applied);
 app.edit('electronic');app.selectChoice('no');
 assert.equal(app.answers.elec_weee,undefined);
 assert.equal(app.answers.elec_ip_value,undefined);
 assert.equal(app.answers.elec_applied,undefined);
 assert.equal(app.answers.elec_manual,undefined);
 assert.equal(app.finished,true);
});


test('labelling: the uploaded EN 60601-1 Annex D references are distinguished',()=>{
 const values=scenario({electronic:"yes",support:"device",elec_60601:"yes",elec_manual:"yes",
  elec_supply:"yes",elec_supply_kind:"dc",instructions:"yes",instructions_ifu:"yes",elec_ifu_reference:"operating",elec_warning_electric:"yes"});
 assert.ok(has(values.required,"ISO 7010-M002"),"Obligatory instruction manual sign");
 assert.ok(has(values.required,"ISO 7000-1641"),"Alternative instructions symbol requires explicit selection");
 assert.equal(has(values.required,"5.4.3"),false,"Do not automatically duplicate the consultation symbol");
 assert.ok(has(values.required,"IEC 60417-5031"),"Direct current");
 assert.ok(has(values.required,"ISO 7010-W012"),"Electricity warning");
 assert.equal(has(values.required,"IEC 60417-1641"),false,"Previously incorrect IEC code must not return");
 const alternating=scenario({electronic:"yes",support:"device",elec_supply:"yes",elec_supply_kind:"ac"});
 assert.ok(has(alternating.required,"IEC 60417-5032"),"Alternating-current symbol");
 const mixed=scenario({electronic:"yes",support:"device",elec_supply:"yes",elec_supply_kind:"both"});
 assert.ok(has(mixed.required,"IEC 60417-5033"),"Both AC and DC");
 assert.match(create().symbolImage("ISO 7010-M002"),/symboles-iec\/ISO-7010-M002\.png/);
});

test('labelling: alarm controls use EN 60601-1-8 Annex C only when applicable',()=>{
 const noAlarm=scenario({electronic:"yes",elec_60601:"yes",elec_alarm:"no"});
 assert.equal(has(noAlarm.conditional,"IEC 60417-5307"),false);
 const alarm=scenario({electronic:"yes",elec_60601:"yes",elec_alarm:"yes",elec_alarm_on:"yes",elec_alarm_reset:"yes",elec_alarm_silence:"off"});
 assert.ok(has(alarm.conditional,"IEC 60417-5307"));
 assert.ok(has(alarm.conditional,"IEC 60417-5309"));
 assert.ok(has(alarm.conditional,"IEC 60417-5576"));
 assert.equal(has(alarm.required,"IEC 60417-5307"),false,"Interface mark is not mandatory packaging label");
 const onlyAlarm=scenario({electronic:"yes",elec_60601:"yes",elec_alarm:"yes",elec_alarm_on:"no",elec_alarm_reset:"no",elec_alarm_silence:"none"});
 assert.equal(has(onlyAlarm.conditional,"IEC 60417-5309"),false);
 assert.equal(has(onlyAlarm.conditional,"IEC 60417-5576"),false);
});

test('labelling: official IEC and ISO PNGs map to the correct symbol files',()=>{
 const app=create();
 for(const [code,file] of [
 ['IEC 60417-5031','IEC-60417-5031.png'],
 ['IEC 60417-5172','IEC-60417-5172.png'],
 ['IEC 60417-5334','IEC-60417-5334.png'],
 ['IEC 60417-5309','IEC-60417-5309.png'],
 ['ISO 7000-1641','ISO-7000-1641.png'],
 ['ISO 7010-M002','ISO-7010-M002.png'],
 ['ISO 7010-W012','ISO-7010-W012.png']]){
  assert.match(app.symbolImage(code),new RegExp(file.replace('.','\\.')));
 }
 assert.equal(app.symbolImage('IEC 60417-5957'),'');
});


test('labelling: every supplied IEC/ISO graphic has an explicit selection route',()=>{
 const noIcon=scenario({electronic:"yes",elec_60601:"yes",elec_alarm:"no",elec_insulation:"class1",elec_earth_terminal:"no",elec_applied:"none",elec_manual:"no",elec_warning_electric:"no",elec_supply:"no"});
 assert.equal(has([...noIcon.required,...noIcon.conditional],"IEC 60417-5019"),false);
 assert.equal(has([...noIcon.required,...noIcon.conditional],"IEC 60417-5307"),false);
 assert.equal(has([...noIcon.required,...noIcon.conditional],"ISO 7010-M002"),false);
 const routes=[
  ["IEC 60417-5019",{elec_insulation:"class1",elec_earth_terminal:"yes"}],
  ["IEC 60417-5172",{elec_insulation:"class2"}],
  ["IEC 60417-5031",{elec_supply:"yes",elec_supply_kind:"dc"}],
  ["IEC 60417-5032",{elec_supply:"yes",elec_supply_kind:"ac"}],
  ["IEC 60417-5033",{elec_supply:"yes",elec_supply_kind:"both"}],
  ["IEC 60417-5840",{elec_applied:"b",elec_defib:"no"}],
  ["IEC 60417-5841",{elec_applied:"b",elec_defib:"yes"}],
  ["IEC 60417-5333",{elec_applied:"bf",elec_defib:"no"}],
  ["IEC 60417-5334",{elec_applied:"bf",elec_defib:"yes"}],
  ["IEC 60417-5335",{elec_applied:"cf",elec_defib:"no"}],
  ["IEC 60417-5336",{elec_applied:"cf",elec_defib:"yes"}],
  ["IEC 60417-5307",{elec_alarm:"yes",elec_alarm_on:"yes"}],
  ["IEC 60417-5309",{elec_alarm:"yes",elec_alarm_reset:"yes"}],
  ["IEC 60417-5576",{elec_alarm:"yes",elec_alarm_silence:"off"}],
  ["ISO 7000-1641",{elec_ifu_reference:"operating",instructions:"yes",instructions_ifu:"yes"}],
  ["ISO 7010-M002",{elec_manual:"yes"}],
  ["ISO 7010-W012",{elec_warning_electric:"yes"}]
 ];
 for(const [code,overrides] of routes){
  const result=scenario({electronic:"yes",elec_60601:"yes",support:code==="ISO 7000-1641"?"unit":"device",...overrides});
  assert.ok(has([...result.required,...result.conditional],code),"Unreachable symbol "+code);
  assert.match(create().symbolImage(code),/symboles-iec\/.+\.png/);
 }
});

test('labelling: distributor, model, manufacture and biohazard have distinct answers',()=>{
 const baseResult=scenario();
 for(const code of ["5.1.9","5.1.10","5.1.11","5.4.1"])assert.equal(has([...baseResult.required,...baseResult.conditional],code),false);
 const selected=scenario({distributor:"yes",modelnumber:"yes",madein:"yes",biologicalrisk:"yes"});
 for(const code of ["5.1.9","5.1.10","5.1.11","5.4.1"])assert.ok(has([...selected.required,...selected.conditional],code),"Missing new symbol "+code);
 assert.ok(selected.conditional.find(x=>x.code==="5.1.11").detail.includes("CC"),"Country placeholder must be explained");
});

test('labelling: thermal limits select one and only one temperature symbol',()=>{
 for(const [mode,expected] of [["both","5.3.7"],["max","5.3.6"],["min","5.3.5"]]){
  const result=scenario({storage:"yes",storage_temperature:"yes",storage_temperature_mode:mode,storage_heat:"yes"});
  assert.ok(has(result.required,expected));
  assert.ok(has(result.required,"5.3.3"));
  for(const code of ["5.3.5","5.3.6","5.3.7"].filter(code=>code!==expected))assert.equal(has(result.required,code),false);
 }
});

test('labelling: second applied part and alarm sound variants are independent',()=>{
 const parts=scenario({electronic:"yes",elec_60601:"yes",support:"device",elec_applied:"bf",elec_defib:"no",
   elec_applied_more:"yes",elec_applied_second:"cf",elec_defib_second:"yes"});
 assert.ok(has(parts.required,"IEC 60417-5333"));assert.ok(has(parts.required,"IEC 60417-5336"));
 const duplicate=scenario({electronic:"yes",elec_60601:"yes",elec_applied:"bf",elec_applied_more:"yes",elec_applied_second:"bf"});
 assert.ok(duplicate.review.some(x=>x.blocking&&x.title.includes("identique")));
 const paused=scenario({electronic:"yes",elec_60601:"yes",elec_alarm:"yes",elec_alarm_silence:"pause"});
 assert.ok(has(paused.conditional,"IEC 60417-5576-2"));
 assert.equal(has(paused.conditional,"IEC 60417-5576"),false);
});

test('labelling: changing upstream choices drops obsolete dependent answers',()=>{
 const app=create();
 finish(app,{electronic:"yes",elec_60601:"yes",elec_insulation:"class1",elec_earth_terminal:"yes",
  elec_applied:"bf",elec_applied_more:"yes",elec_applied_second:"cf",elec_defib_second:"yes",
  elec_alarm:"yes",elec_alarm_on:"yes",elec_alarm_silence:"off"});
 app.edit("elec_60601");app.selectChoice("no");
 assert.equal(app.answers.elec_earth_terminal,undefined);
 assert.equal(app.answers.elec_applied_second,undefined);
 assert.equal(app.answers.elec_alarm_on,undefined);
 assert.equal(app.finished,true);
});
