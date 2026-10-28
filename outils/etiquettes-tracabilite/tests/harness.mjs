import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../questionnaire.js',import.meta.url),'utf8').replace(
 /render\(\);\s*\}\)\(\);\s*$/,
 'window.__probe={Q,applicable,current,selectChoice,next,conclusions,symbolImage,renderShortList,sanitize,render,doReset,get answers(){return answers},get position(){return position},get editing(){return editing},get finished(){return finished}};\nrender();})();'
);
assert(source.includes('window.__probe='),'Test hook injection failed');

export const base={
 status:'market',territory:'eu',support:'unit',pack:'one',carrier:'one',
 class:'iia',ce:'ce-nb',manufacturer:'eu',import:'no',implant:'no',
 reuse:'single',sterile:'nonsterile',nonsterilevariants:'no',fluidpath:'no',
 expiry:'yes',tracking:'lot',storage:['none'],substances:['none'],
 instructions:['ifu'],electronic:'no',space:'large',language:'fr'
};

export function create(saved=null){
 let stored=JSON.stringify(saved);
 const events={},sections=[{open:false},{open:true},{open:false}];
 const answersPanel={open:false,setAttribute(name){if(name==='open')this.open=true;},scrollIntoView(){}};
 const root={innerHTML:'',handlers:{},addEventListener(type,handler){this.handlers[type]=handler;},
  querySelector(selector){return selector==='.label-answers'?answersPanel:null;},
  querySelectorAll(){return sections;},contains(){return true;}};
 const window={scrollTo(){},print(){},addEventListener(type,handler){events[type]=handler;}};
 const document={getElementById(id){return id==='label-app'?root:null;}};
 const sessionStorage={getItem(){return stored;},setItem(_key,value){stored=value;}};
 vm.runInNewContext(source,{document,window,sessionStorage});
 const app=window.__probe;
 return Object.assign(app,{root,events,sections,answersPanel,
  saved(){return JSON.parse(stored);},
  edit(id){root.handlers.click({target:{closest(selector){return selector==='[data-edit]'?{dataset:{edit:id}}:null;}}});},
  action(action){root.handlers.click({target:{closest(selector){return selector==='[data-action]'?{dataset:{action}}:null;}}});}
 });
}

export function finish(app,overrides={}){
 const defaults={...base,...overrides};let steps=0;
 while(!app.finished&&steps++<80){
  const q=app.current(),value=defaults[q.id]??q.options[0][0];
  if(q.type==='multi'){
   for(const item of Array.isArray(value)?value:[value])if(!app.answers[q.id]?.includes(item))app.selectChoice(item);
   app.next();
  }else app.selectChoice(value);
 }
 assert.ok(app.finished,'Questionnaire must finish');return steps;
}
