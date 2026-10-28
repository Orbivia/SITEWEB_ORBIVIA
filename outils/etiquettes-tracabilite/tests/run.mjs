/* Scénarios métier historiques, complétés par tests/etiquetage.test.mjs. */
import assert from "node:assert/strict";
import {create,base} from "./harness.mjs";
function scenario(overrides={}){
 const test=create();
 Object.assign(test.answers,base,overrides);
 return test.conclusions();
}
const has=(items,code)=>items.some(item=>item.code===code);
const titleHas=(items,s)=>items.some(item=>item.title.includes(s));
const baseline=scenario();
assert(has(baseline.required,"UDI (AIDC + HRI)"));
assert(!has(baseline.conditional,"5.7.10"),"UDI symbol is not mandatory");
assert(has(scenario({carrier:"multiple"}).conditional,"5.7.10"),"Multiple codes may use UDI symbol");
const eo=scenario({support:"sterile",sterile:"sterile",sterilmethod:"eo",barrier:"single",resterilize:"no"});
assert(has(eo.required,"5.2.3")&&!has(eo.required,"5.2.1"),"No incompatible sterile symbols");
assert(has(eo.conditional,"5.2.11"),"Single sterile barrier available");
assert(has(eo.required,"5.1.3")&&has(eo.required,"5.1.4"),"Sterile packaging requires manufacture and expiry dates");
const contradiction=scenario({support:"sterile",sterile:"sterile",sterilmethod:"eo",barrier:"double",resterilize:"no",reuse:"reusable",patient:"multiple",reprocess:"sterilize",expiry:"no"});
assert(!has(contradiction.conditional,"5.2.6"),"No contradictory do-not-resterilize");
assert(titleHas(contradiction.review,"Incompatibilité"));
assert(titleHas(contradiction.review,"Date limite"));
const vh2o2=scenario({sterile:"sterile",sterilmethod:"vph",barrier:"outer",resterilize:"yes",reuse:"reusable",patient:"same",reprocess:"clean"});
assert(has(vh2o2.required,"5.2.10"),"VHP symbol");
assert(has(vh2o2.conditional,"5.4.12"),"Same patient reuse symbol");
const nonsterile=scenario({sterile:"nonsterile",nonsterilevariants:"yes",fluidpath:"yes"});
assert(has(nonsterile.conditional,"5.2.7"),"Non-sterile symbol may distinguish variants");
assert(has(nonsterile.required,"5.2.9"),"Sterile fluid path");
assert(!has(baseline.conditional,"5.2.7"),"Non-sterile symbol not automatic");
const mat=scenario({substances:["latex","blood","med","animal","human","cmr","nano"],storage:["temperature","pressure","humidity"]});
for(const code of ["5.4.5","5.4.6","5.4.7","5.4.8","5.4.9","5.4.10","5.4.11","5.3.9"])assert(has([...mat.required,...mat.conditional],code),"Missing "+code);
const custom=scenario({status:"custom"});
const investigation=scenario({status:"investigation"});
assert(titleHas(custom.required,"sur mesure")&&!has(custom.required,"CE + ON")&&!has(custom.required,"UDI (AIDC + HRI)"));
assert(titleHas(investigation.required,"investigations cliniques")&&!has(investigation.required,"CE + ON"));
assert(has(scenario({reuse:"reusable",patient:"multiple",reprocess:"clean",support:"device",class:"iia"}).required,"UDI direct"));
assert(!has(scenario({reuse:"reusable",patient:"multiple",reprocess:"clean",support:"device",class:"i"}).required,"UDI direct"));
assert(has(scenario({reuse:"reusable",patient:"multiple",reprocess:"clean",support:"device",class:"i"}).conditional,"UDI direct"));
assert(titleHas(scenario({tracking:"lot",implant:"active"}).review,"numéro de série requis"));
assert(titleHas(scenario({support:"sterile",sterile:"nonsterile"}).review,"Support incohérent"));

// Le pictogramme n'est affiché qu'avec une référence ISO exactement indexée.
// CE et MD utilisent les fichiers fournis ; aucun remplacement pour une référence absente.
const visual=create();
assert.match(visual.symbolImage("5.1.1"),/symboles-iso\/5\.1\.1\.png/);
assert.match(visual.symbolImage("5.2.3"),/symboles-iso\/5\.2\.3\.png/);
assert.match(visual.symbolImage("5.4.11"),/symboles-iso\/5\.4\.11\.png/);
for(const code of ["Texte","Notice"])
 assert.equal(visual.symbolImage(code),"","Symbole graphique inexistant pour "+code);
assert.match(visual.symbolImage("5.7.7"),/symboles-iso\/5\.7\.7\.png/);
assert.match(visual.symbolImage("CE"),/symboles-iso\/CE\.png/);
assert.match(visual.symbolImage("CE + ON"),/symboles-iso\/CE\.png/);
assert.match(visual.symbolImage("5.7.10"),/symboles-iso\/5\.7\.10\.png/);
assert.match(visual.symbolImage("UDI (AIDC + HRI)"),/symboles-iso\/5\.7\.10\.png/);
const visualItems=[{code:"5.1.1",title:"Fabricant"},{code:"UDI (AIDC + HRI)",title:"Support UDI"}];
const rendered=visual.renderShortList(visualItems);
assert.match(rendered,/symboles-iso\/5\.1\.1\.png/);
assert.equal((rendered.match(/class="label-symbol-img/g)||[]).length,2);

const app=create();
assert(app.Q.length>=27);
assert(app.Q.every(q=>q.options.every(option=>option[0]!=="unknown")),"No undefined answers");
let steps=0;
while(!app.finished&&steps++<60){
 const question=app.current(),chosen=base[question.id]||question.options[0][0];
 if(question.type==="multi"){app.selectChoice(Array.isArray(chosen)?chosen[0]:chosen);app.next();}
 else app.selectChoice(chosen);
}
assert(app.finished,"Questionnaire must finish");
console.log("PASS: normative scenario assertions + end-to-end questionnaire ("+steps+" steps)");
