const test=require('node:test');
const assert=require('node:assert/strict');
const c=require('../outils/shared/classification-engine.js');
// Expected outcomes derived from MDR Annex VIII and MDCG 2021-24 Rev.1 (April 2026).
// Defaults describe a passive, external device, with no special function.
function complete(overrides={}){
 const defaults={scope:'md',form:'physical',active:'no',contact:'none',implant:'no',duration:'short',cleaning:'none',controlTherapy:'none',tissue:'none',multiPurpose:'yes',diagnosticUse:'routine',softwareRole:'independent',softwareImpact:'other',nanoExposure:'negligible',...overrides};
 const answers={};
 for(let i=0;i<120;i++){
  const q=c.questions(answers).find(q=>!c.known(q,answers));if(!q)return answers;
  const value=defaults[q.id]??'no';
  assert.ok(q.options.some(([v])=>v===value),'Fixture needs an explicit answer: '+q.id);answers[q.id]=value;
 }
 throw Error('Questionnaire did not terminate');
}
const active={active:'yes'};
const surgical={contact:'surgical',duration:'transient'};
const software={form:'software',softwareRole:'independent'};
const cases=[
 [1,'Passive EEG cap / electrodes only',{},'I'],
 [2,'Tubing connected to active IIa device',{channel:'yes',channelActive:'yes'},'IIa'],
 [2,'Blood storage bag',{channel:'yes',bloodBag:'yes'},'IIb'],
 [3,'Biological composition modification',{modify:'yes',modifySimple:'no'},'IIb'],
 [3,'Simple filtration only',{modify:'yes',modifySimple:'yes'},'IIa'],
 [3,'Organ preservation substance',{invitroSubstance:'yes'},'III'],
 [4,'Wound micro-environment',{wound:'yes',woundDeep:'no',woundBarrier:'no'},'IIa'],
 [4,'Simple barrier dressing',{wound:'yes',woundDeep:'no',woundBarrier:'yes'},'I'],
 [4,'Deep lesion by body orifice',{contact:'orifice',duration:'transient',wound:'yes',woundDeep:'yes'},'IIb'],
 [5,'Short-term body orifice',{contact:'orifice',duration:'short'},'IIa'],
 [5,'Short-term oral cavity',{contact:'orifice',duration:'short',orificeCavity:'yes'},'I'],
 [5,'Long-term oral appliance, non-absorbing',{contact:'orifice',duration:'long',orificeCavity:'yes',orificeAbsorb:'no'},'IIa'],
 [5,'Long-term tracheal tube, active connection does not downgrade',{contact:'orifice',duration:'long',orificeActive:'yes'},'IIb'],
 [6,'Single-use surgical transient',surgical,'IIa'],
 [6,'Reusable manual surgical instrument',{...surgical,reusableSurgical:'yes'},'I'],
 [6,'Central nervous system contact',{...surgical,centralContact:'yes'},'III'],
 [6,'Absorbing transient surgical',{...surgical,bioAbsorb:'yes'},'IIb'],
 [7,'Short-term surgical',{contact:'surgical',duration:'short'},'IIa'],
 [7,'Absorbing short-term surgical',{contact:'surgical',duration:'short',bioAbsorb:'yes'},'III'],
 [7,'Chemical change short-term',{contact:'surgical',duration:'short',chemical:'yes'},'IIb'],
 [8,'Passive implant',{implant:'yes'},'IIb'],
 [8,'Placed in teeth',{implant:'yes',dental:'yes'},'IIa'],
 [8,'Joint replacement',{implant:'yes',implantSpecial:'yes'},'III'],
 [8,'External accessory to active implant',{scope:'accessory',implantActive:'yes'},'III'],
 [9,'Simple CPAP, spontaneously breathing patient',{...active,therapyEnergy:'yes',energyHazard:'no'},'IIa'],
 [9,'Ventilator replacing vital ventilation',{...active,therapyEnergy:'yes',energyHazard:'yes'},'IIb'],
 [9,'Therapeutic ionising radiation',{...active,therapyIonising:'yes'},'IIb'],
 [9,'Control active implant',{...active,controlTherapy:'implant'},'III'],
 [10,'Diagnostic EEG headset, routine examination',{...active,diagnostic:'yes',diagnosticUse:'routine'},'IIa'],
 [10,'Critical care EEG vital surveillance',{...active,diagnostic:'yes',diagnosticUse:'critical'},'IIb'],
 [10,'Apnoea safety monitor',{...active,diagnostic:'yes',diagnosticUse:'critical'},'IIb'],
 [10,'Diagnostic ultrasound',{...active,diagnostic:'yes',diagnosticEnergy:'yes',diagnosticUse:'other'},'IIa'],
 [10,'Gamma camera',{...active,diagnostic:'yes',radiopharm:'yes',diagnosticUse:'other'},'IIa'],
 [10,'Diagnostic X-ray generator',{...active,diagnosticXray:'yes'},'IIb'],
 [11,'Diagnostic software, other consequences',{...software,softwareDecision:'yes',softwareImpact:'other'},'IIa'],
 [11,'Diagnostic software, serious consequences',{...software,softwareDecision:'yes',softwareImpact:'serious'},'IIb'],
 [11,'Diagnostic software, fatal consequences',{...software,softwareDecision:'yes',softwareImpact:'death'},'III'],
 [11,'Software physiological monitoring',{...software,softwareMonitor:'yes'},'IIa'],
 [11,'Software monitoring immediate vital danger',{...software,softwareMonitor:'yes',softwareVital:'yes'},'IIb'],
 [11,'Other already-qualified medical software',software,'I'],
 [12,'Air or fluid administration, nonhazardous declared',{...active,administer:'yes',adminHazard:'no'},'IIa'],
 [12,'Critical substance administration',{...active,administer:'yes',adminHazard:'yes'},'IIb'],
 [13,'Electric wheelchair, no specific function',active,'I'],
 [14,'Ancillary integral medicinal substance',{medicinal:'yes'},'III'],
 [15,'Nonimplantable contraception',{contraception:'yes'},'IIb'],
 [15,'Implantable contraception',{contraception:'yes',implant:'yes'},'III'],
 [16,'Medical device disinfection',{cleaning:'disinfect'},'IIa'],
 [16,'Contact lens cleaning',{cleaning:'lens'},'IIb'],
 [16,'Final invasive-device disinfection',{cleaning:'final'},'IIb'],
 [17,'Active X-ray recording detector',{...active,xrecord:'yes'},'IIa'],
 [18,'Nonviable human derivatives',{tissue:'human'},'III'],
 [18,'Animal origin outside intact skin',{tissue:'animal',animalIntact:'no'},'III'],
 [19,'High internal nano exposure',{nano:'yes',nanoContact:'yes',nanoExposure:'high'},'III'],
 [19,'Low internal nano exposure',{nano:'yes',nanoContact:'yes',nanoExposure:'low'},'IIb'],
 [19,'Negligible internal nano exposure',{nano:'yes',nanoContact:'yes',nanoExposure:'negligible'},'IIa'],
 [20,'Inhalation spacer',{contact:'orifice',duration:'transient',inhalation:'yes'},'IIa'],
 [20,'Critical inhaled medicine delivery',{contact:'orifice',duration:'transient',inhalation:'yes',inhalationRisk:'yes'},'IIb'],
 [21,'Systemically absorbed substance',{substance:'yes',substanceSystemic:'yes'},'III'],
 [21,'Lower GI systemic absorption',{substance:'yes',substanceGI:'yes'},'III'],
 [21,'Local nasal substance',{substance:'yes',substanceLocal:'yes'},'IIa'],
 [21,'Other locally dispersed substance',{substance:'yes'},'IIb'],
 [22,'Therapy governed by incorporated diagnostic function',{...active,therapyEnergy:'yes',closedLoop:'yes',closedLoopDiagnostic:'yes'},'III']
];
for(const [rule,name,answers,expected] of cases)test('MDR rule '+rule+' — '+name,()=>{
 const state=complete(answers),r=c.evaluate(state);
 assert.equal(r.complete,true,r.missing.join('; '));assert.equal(r.highest,expected);
 assert.equal(r.rules[rule-1].applies,'yes');
 assert.equal(r.rules[rule-1].class,expected);
});
test('all 22 rules have independent example fixtures',()=>assert.deepEqual([...new Set(cases.map(c=>c[0]))].sort((a,b)=>a-b),Array.from({length:22},(_,i)=>i+1)));
test('diagnostic use and closed-loop diagnosis cannot silently become a class I or III conclusion',()=>{
 for(const overrides of [{...active,diagnostic:'yes',diagnosticUse:'unclear'},{...active,therapyEnergy:'yes',closedLoop:'yes',closedLoopDiagnostic:'unclear'},{nano:'yes',nanoContact:'yes',nanoExposure:'unknown'}]){
  const r=c.evaluate(complete(overrides));assert.equal(r.complete,false);assert.ok(r.missing.length>0);
 }
 const cpap=c.evaluate(complete({...active,therapyEnergy:'yes',administer:'yes',closedLoop:'yes',closedLoopDiagnostic:'no'}));
 assert.equal(cpap.complete,true);assert.equal(cpap.highest,'IIa');assert.equal(cpap.rules[21].applies,'no');
});
test('more-specific active rules replace fallback rule I in EEG and CPAP explanations',()=>{
 for(const overrides of [{...active,diagnostic:'yes',diagnosticUse:'routine'},{...active,therapyEnergy:'yes'}]){
  const r=c.evaluate(complete(overrides));assert.equal(r.rules[0].applies,'no');assert.equal(r.rules[12].applies,'no');
 }
});
test('passive cap, research-only EEG and medical EEG do not share one inferred classification',()=>{
 assert.equal(c.evaluate(complete()).highest,'I');
 assert.equal(c.evaluate({scope:'other'}).complete,false);
 assert.equal(c.evaluate(complete({...active,diagnostic:'yes',diagnosticUse:'routine'})).highest,'IIa');
});
