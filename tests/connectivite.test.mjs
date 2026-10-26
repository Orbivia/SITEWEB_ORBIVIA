import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
const base=path.resolve("outils/connectivite");
const js=fs.readFileSync(path.join(base,"connectivite.js"),"utf8");
function harness(){
 let html="";const callbacks={};let memory={};
 const root={set innerHTML(value){html=value},get innerHTML(){return html},addEventListener(name,fn){callbacks[name]=fn},querySelector(){return {disabled:false}}};
 const document={getElementById(){return root},activeElement:null};
 const localStorage={getItem(k){return memory[k]??null},setItem(k,v){memory[k]=v},removeItem(k){delete memory[k]}};
 vm.runInNewContext(js,{document,localStorage});
 return {
  get html(){return html},get saved(){return memory["orbivia-connectivite-v1"]},
  option(id){callbacks.click({target:{closest(sel){return sel==="[data-option]"?{dataset:{option:id}}:null}}})},
  action(id){callbacks.click({target:{closest(sel){return sel==="[data-action]"?{dataset:{action:id}}:null}}})},
  slide(n){callbacks.input({target:{id:"range-control",value:String(n)}})}
 };
}
test("20 questions, syntaxe valide, icônes locales",()=>{
 new vm.Script(js);
 assert.equal((js.match(/id:"[a-z]+",section:/g)||[]).length,20);
 for(const m of js.matchAll(/icon\("([a-z]+)"\)/g))assert.ok(fs.existsSync(path.join(base,"icones",m[1]+".svg")),m[1]);
});
test("navigation complète sans blocage et synthèse",()=>{
 const t=harness();
 for(let i=0;i<25&&!t.html.includes("Premières pistes de connectivité");i++){
  const option=t.html.match(/data-option="([^"]+)"/);
  if(option)t.option(option[1]);else t.slide(6);
  t.action("next");
 }
 assert.match(t.html,/Premières pistes de connectivité/);
 assert.match(t.html,/Points à vérifier/);
 assert.ok(t.saved?.includes("priorities"));
 t.action("reset");
 assert.match(t.html,/Avec quoi votre objet doit-il communiquer/);
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
