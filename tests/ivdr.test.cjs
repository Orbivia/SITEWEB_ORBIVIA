const test=require('node:test'),assert=require('node:assert/strict');
const ivd=require('../outils/shared/ivdr-engine.js');
// Fixtures describe the declared use; product names are never passed to the engine.
function complete(overrides={}){
 const defaults={ivdQualification:'yes',ivdRole:'test',ivdSoftwareRole:'independent',ivdLinkedClass:'C',ivdInstrumentIndependent:'no',ivdGeneral:'yes',ivdAccessoryCritical:'no',ivdMarkers:'other',ivdSelfException:'other',ivdAllUses:'yes',...overrides},answers={};
 for(let i=0;i<100;i++){
  const q=ivd.questions(answers).find(q=>!ivd.known(q,answers));if(!q)return answers;
  const value=defaults[q.id]??'no';assert.ok(q.options.some(([v])=>v===value),q.id);answers[q.id]=value;
 }throw Error('Route did not finish');
}
function expect(overrides,cl,rule){const r=ivd.evaluate(complete(overrides));assert.equal(r.complete,true,r.missing.join('; '));assert.equal(r.highest,cl);assert.ok(r.rules.some(r=>r.n===rule&&r.applies==='yes'));return r;}
test('ordinary assay is B only after all active intended-purpose questions are answered',()=>{expect({},'B',6);const r=ivd.evaluate({ivdQualification:'yes',ivdRole:'test'});assert.equal(r.complete,false);assert.equal(r.highest,'');assert.equal(r.rules.find(r=>r.n===6).applies,'no');});
for(const key of ['ivdDonor','ivdPropagation','ivdLoad'])test('rule 1 D: '+key,()=>expect({[key]:'yes'},'D',1));
test('rule 2 other compatibility markers C; listed markers D',()=>{expect({ivdCompatibility:'yes'},'C',2);expect({ivdCompatibility:'yes',ivdMarkers:'listed'},'D',2);});
const clauses=['ivdSexual','ivdBloodAgent','ivdInfectionHarm','ivdPrenatalImmune','ivdImmuneRisk','ivdCompanion','ivdStaging','ivdCancer','ivdGenetic','ivdLevelsRisk','ivdLifeManagement','ivdCongenital','ivdNewborn'];
for(const key of clauses)test('rule 3 C: '+key,()=>expect({ivdInfection:'yes',[key]:'yes'},'C',3));
for(const exception of ['pregnancy','fertility','cholesterol','urine'])test('rule 4 exception B: '+exception,()=>expect({ivdSelf:'yes',ivdSelfException:exception},'B',4));
test('self blood glucose / other or mixed assays C; no urine exception applied',()=>expect({ivdSelf:'yes',ivdSelfException:'other'},'C',4));
test('self exception never lowers a higher rule',()=>{expect({ivdSelf:'yes',ivdSelfException:'urine',ivdCancer:'yes'},'C',3);expect({ivdSelf:'yes',ivdSelfException:'cholesterol',ivdDonor:'yes'},'D',1);});
for(const role of ['receptacle','instrument','lab','accessory'])test('rule 5 own low-risk function A: '+role,()=>expect({ivdRole:role},'A',5));
test('sterile class A stays A with sterile assessment note',()=>{assert.equal(expect({ivdRole:'receptacle',ivdSterile:'yes'},'A',5).sterileA,true);});
test('independent instrument measure is classified for its analytic purpose',()=>{expect({ivdRole:'instrument',ivdInstrumentIndependent:'yes',ivdLifeManagement:'yes'},'C',3);expect({ivdRole:'instrument',ivdInstrumentIndependent:'yes'},'B',6);});
test('kit or additional diagnostic function is not reduced to its class A receptacle',()=>{expect({ivdRole:'receptacle',ivdAdditional:'yes',ivdCancer:'yes'},'C',3);expect({ivdRole:'receptacle',ivdAdditional:'yes'},'B',6);});
test('specific reagent / critical accessory has no automatic class A shortcut',()=>{expect({ivdRole:'lab',ivdGeneral:'no',ivdGenetic:'yes'},'C',3);expect({ivdRole:'accessory',ivdAccessoryCritical:'yes'},'B',6);});
test('rule 7 control without any assigned value B',()=>expect({ivdRole:'unassignedControl'},'B',7));
for(const role of ['calibrator','assignedControl'])for(const cl of ['A','B','C','D'])test('implementing 1.5/1.6 '+role+' follows '+cl,()=>expect({ivdRole:role,ivdLinkedClass:cl},cl,'1.4–1.6'));
test('driving software inherits instrument class, independent software examines its own purpose',()=>{expect({ivdRole:'software',ivdSoftwareRole:'drives',ivdLinkedClass:'A'},'A','1.4–1.6');expect({ivdRole:'software',ivdGenetic:'yes'},'C',3);});
test('software both functions retains maximum of inherited and independent class',()=>{expect({ivdRole:'software',ivdSoftwareRole:'both',ivdLinkedClass:'D',ivdCancer:'yes'},'D','1.4–1.6');expect({ivdRole:'software',ivdSoftwareRole:'both',ivdLinkedClass:'A',ivdCancer:'yes'},'C',3);expect({ivdRole:'software',ivdSoftwareRole:'both',ivdLinkedClass:'A'},'B',6);});
test('near-patient testing does not itself impose C',()=>{expect({ivdNear:'yes'},'B',6);expect({ivdNear:'yes',ivdCancer:'yes'},'C',3);expect({ivdNear:'yes',ivdPropagation:'yes'},'D',1);});
test('missing linked class and uncertain marker never become a complete result',()=>{for(const overrides of [{ivdRole:'calibrator',ivdLinkedClass:'unknown'},{ivdCompatibility:'yes',ivdMarkers:'unknown'}])assert.equal(ivd.evaluate(complete(overrides)).complete,false);});
test('qualification outside IVDR cannot yield a class',()=>{const r=ivd.evaluate({ivdQualification:'no',ivdRole:'test',ivdCancer:'yes'});assert.equal(r.complete,false);assert.equal(r.highest,'');});
test('inactive infection answers are ignored and do not produce C',()=>{const a=complete();Object.assign(a,{ivdInfection:'no',ivdBloodAgent:'yes',ivdSexual:'yes'});assert.equal(ivd.evaluate(a).highest,'B');});
test('deferred uncertainty never silently becomes no or fallback B',()=>{for(const q of ivd.questions(complete())){const a=complete();a[q.id]='unresolved';const r=ivd.evaluate(a);assert.equal(r.complete,false,q.id);assert.equal(r.rules.find(r=>r.n===6).applies,'no');}});
test('all intended uses must be covered before a final class',()=>{const r=ivd.evaluate(complete({ivdAllUses:'no',ivdCancer:'yes'}));assert.equal(r.complete,false);assert.equal(r.highest,'C');});
module.exports={complete};
