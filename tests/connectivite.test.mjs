import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
const base=path.resolve("outils/connectivite");
const js=fs.readFileSync(path.join(base,"connectivite.js"),"utf8");
function harness(saved){
 let html="";const callbacks={};let memory=saved===undefined?{}:{"orbivia-connectivite-v2":saved};
 const root={set innerHTML(value){html=value},get innerHTML(){return html},addEventListener(name,fn){callbacks[name]=fn},querySelector(){return {disabled:false}}};
 const document={getElementById(){return root},activeElement:null};
 const localStorage={getItem(k){return memory[k]??null},setItem(k,v){memory[k]=v},removeItem(k){delete memory[k]}};
 vm.runInNewContext(js,{document,localStorage});
 return {
  get html(){return html},get saved(){return memory["orbivia-connectivite-v2"]},
  option(id){callbacks.click({target:{closest(sel){return sel==="[data-option]"?{dataset:{option:id}}:null}}})},
  action(id){callbacks.click({target:{closest(sel){return sel==="[data-action]"?{dataset:{action:id}}:null}}})},
  slide(n){callbacks.input({target:{id:"range-control",value:String(n)}})}
 };
}

test("restauration des anciennes réponses et données invalides",()=>{
 const t=harness(JSON.stringify({peer:"obsolete",range:"room",payload:["video","video","bogus"],priorities:["bogus"]}));
 t.action("next");
 assert.match(t.html,/data-option="phone"/);
 t.option("phone");
 const restored=JSON.parse(t.saved);
 assert.equal(restored.peer,"phone");
 assert.deepEqual(restored.payload,["video"]);
 assert.deepEqual(restored.priorities,[]);
 assert.equal(restored.range,"room");
});
test("20 questions, syntaxe valide, présentation sans pictogrammes",()=>{
 new vm.Script(js);
 assert.equal((js.match(/"?section"?:/g)||[]).length,20);
 assert.doesNotMatch(harness().html, /<img|<svg/);
});
test("navigation complète sans blocage et synthèse",()=>{
 const t=harness();
 for(let i=0;i<25&&!t.html.includes("Votre synthèse");i++){
  const option=t.html.match(/data-option="([^"]+)"/);
  if(option)t.option(option[1]);else t.slide(6);
  t.action("next");
 }
 assert.match(t.html,/Votre synthèse/);
 assert.match(t.html,/Détails et points à vérifier/);
 assert.match(t.html,/Relire mes réponses/);
 assert.doesNotMatch(t.html,/100 % parcouru|cx-result-warning|PISTE À EXAMINER/);
 assert.ok(t.saved?.includes("priorities"));
 t.action("reset");
 assert.match(t.html,/data-option="phone"/);
 assert.match(t.html,/0 % parcouru/);
 assert.equal(t.saved,undefined);
});
test("autonomie conditionnelle lorsque l'objet est alimenté",()=>{
 const t=harness();
 for(let i=0;i<6;i++){
  const options=[...t.html.matchAll(/data-option="([^"]+)"/g)].map(x=>x[1]);
  const value=i===5?"mains":options[0];
  t.option(value);
  t.action("next");
 }
 assert.doesNotMatch(t.html,/Quelle autonomie souhaitez-vous/);
});
