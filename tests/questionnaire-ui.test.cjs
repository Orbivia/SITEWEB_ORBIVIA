const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const load = p => fs.readFileSync(path.join(root, p), "utf8");

test("les trois questionnaires chargent le même thème de base après leur CSS métier", () => {
 for (const page of ["outils/classification/index.html", "outils/connectivite/index.html", "outils/etiquettes-tracabilite/index.html"]) {
  const html = load(page);
  const localCss = page.includes("classification") ? "design.css" : page.includes("connectivite") ? "connectivite.css" : "questionnaire.css";
  assert.match(html, /data-questionnaire-ui="v1"/);
  assert.ok(html.indexOf(localCss) < html.indexOf("questionnaire-ui.css"), page);
  assert.match(html, /shared\/questionnaire-ui\.js\?v=\d+/);
 }
});

test("les informations sont des panneaux superposés, pas des éléments qui déplacent les réponses", () => {
 const css = load("outils/shared/questionnaire-ui.css");
 const content = css.match(/\.question-heading \.info-bubble\[open\]>div\{([\s\S]*?)\}/);
 assert.ok(content);
 assert.match(content[1], /position:absolute/);
 assert.match(content[1], /max-height:/);
 assert.match(content[1], /overflow-y:auto/);
 assert.match(css, /flex-wrap:nowrap/);
 const commonJs = load("outils/shared/questionnaire-ui.js");
 assert.doesNotThrow(() => new vm.Script(commonJs));
 assert.match(commonJs, /event\.key!=="Escape"/);
});

test("des indications optionnelles sont disponibles dans les choix de connectivité", () => {
 const js = load("outils/connectivite/connectivite.js");
 const start = js.indexOf("const Q=[");
 const end = js.indexOf("];", start) + 2;
 assert.ok(start >= 0 && end > start);
 const questions = vm.runInNewContext(js.slice(start, end) + "\nQ");
 const peer = questions.find(q => q.id === "peer");
 assert.ok(peer);
 assert.ok(peer.options.some(o => o[2]), "les réponses ambiguës fournissent une précision");
 assert.ok(peer.options.some(o => !o[2]), "pas de sous-titre superflu sur chaque réponse");
 assert.ok(questions.reduce((sum, q) => sum + q.options.filter(o => o[2]).length, 0) >= 12);
 assert.doesNotThrow(() => new vm.Script(js));
});

test("Lot 1 : fréquence de connectivité sans regroupement secondes/minutes", () => {
 const source = load("outils/connectivite/connectivite.js");
 const start = source.indexOf("const Q=[");
 const end = source.indexOf("];", start) + 2;
 const questions = vm.runInNewContext(source.slice(start, end) + "\nQ");
 const frequency = questions.find(q => q.id === "frequency");
 assert.deepEqual(Array.from(frequency.options, o => o[0]), [
  "rare", "daily", "minutes", "seconds", "continuous", "unknown"
 ]);
 assert.match(frequency.options.find(o => o[0] === "minutes")[1], /minutes/);
 assert.match(frequency.options.find(o => o[0] === "seconds")[1], /secondes/);
 assert.equal(questions.find(q => q.id === "peer").type, "single");
 assert.equal(questions.find(q => q.id === "security").type, "multi");
 assert.match(source, /q\.id==="security"&&id==="normal"/);
 assert.match(source, /q\.id==="infra"&&id==="none"/);
});

test("Lot 1 : les 96 questions MDR/IVDR conservent les identifiants réglementaires", () => {
 const mdr = require("../outils/shared/classification-engine.js");
 const ivdr = require("../outils/shared/ivdr-engine.js");
 const presentation = require("../outils/classification/presentation.js");
 const all = [...mdr.allQuestions, ...ivdr.allQuestions];
 assert.equal(all.length, 96);
 for (const q of all) {
  assert.ok(presentation.questions[q.id], "question absente : " + q.id);
  const expectedKeys = q.options.map(o => o[0]);
  const actualKeys = Object.keys(presentation.questions[q.id].options);
  assert.deepEqual(actualKeys, expectedKeys, "valeurs changées : " + q.id);
 }
 const contact = presentation.questions.contact.options;
 assert.match(contact.none, /contact externe possible/);
 assert.match(presentation.questions.diagnosticUse.options.routine, /sans danger vital immédiat/);
 assert.match(presentation.questions.ivdMarkers.descriptions.listed, /RHW1/);
 assert.match(presentation.questions.ivdSelfException.title, /autotest/);
});


test("les pictogrammes partagés restent des SVG simples sans ressources externes",()=>{
 for(const file of fs.readdirSync(path.join(root,'outils/shared/icons'))){const svg=load('outils/shared/icons/'+file);assert.match(svg,/viewBox="0 0 32 32"/);assert.doesNotMatch(svg,/<(?:script|image|foreignObject|text)\b|https?:[^/]/i);}
});

test("les trois questionnaires utilisent une seule mise en page responsive", () => {
 const pages=["outils/classification/index.html","outils/connectivite/index.html","outils/etiquettes-tracabilite/index.html"];
 const css=load("outils/shared/questionnaire-layout.css");
 const script=load("outils/shared/questionnaire-layout.js");
 for(const page of pages){
  const html=load(page);
  assert.match(html, /questionnaire-layout\.css\?v=\d+/);
  assert.match(html, /questionnaire-layout\.js\?v=\d+/);
  assert.ok(html.indexOf("questionnaire-ui.css")<html.indexOf("questionnaire-layout.css"),page);
  const app=page.includes("classification")?"../questionnaire.js":page.includes("connectivite")?"connectivite.js":"questionnaire.js";
  assert.ok(html.indexOf(app)<html.indexOf("questionnaire-layout.js"),page);
  assert.doesNotMatch(html, /(?:href|src)="viewport\.(?:css|js)/);
 }
 assert.match(css, /100dvh/);
 assert.match(css, /quiz-scroll/);
 assert.match(css, /quiz-compact/);
 assert.match(css, /quiz-dense/);
 assert.match(css, /quiz-tight/);
 assert.match(css, /max-width:899px/);
 assert.match(css, /min-width:900px/);
 assert.match(css, /min-height:44px/);
 assert.match(css, /\.question-heading h1/);
 assert.match(script, /MutationObserver/);
 assert.match(script, /requestAnimationFrame\(fit\)/);
 assert.match(script, /scrollHeight/);
 assert.doesNotMatch(script, /display\s*:\s*none|\.hidden\s*=\s*true/);
 assert.doesNotThrow(()=>new vm.Script(script));
});

test("le responsive ne change pas les valeurs métier ni la synthèse",()=>{
 const classification=load("outils/classification/presentation.js");
 const connectivity=load("outils/connectivite/connectivite.js");
 const labelling=load("outils/etiquettes-tracabilite/questionnaire.js");
 for(const source of [classification,connectivity,labelling])
  assert.doesNotThrow(()=>new vm.Script(source));
 assert.doesNotMatch(connectivity+labelling,/type=["']range["']/);
 assert.doesNotMatch(classification,/questionIconTypes|function questionIcon/);
 assert.match(connectivity,/function renderResult/);
 assert.match(labelling,/function summary/);
});


test("le moteur d'affichage passe de la question à la synthèse sans piéger l'écran",()=>{
 const source=load("outils/shared/questionnaire-layout.js");
 for(const rootId of ["tool-app","connect-app","label-app"]){
  let cardPresent=true,observerCallback,runFrame;
  const classes=new Set();
  const classList={
   add(...names){names.forEach(n=>classes.add(n))},
   remove(...names){names.forEach(n=>classes.delete(n))},
   toggle(name,on){if(on)classes.add(name);else classes.delete(name)}
  };
  const card={
   clientHeight:400,
   get scrollHeight(){return classes.has("quiz-compact")?400:500},
   getBoundingClientRect(){return{bottom:680}},
   querySelector(){return null}
  };
  const rootNode={querySelector(selector){
   if(selector.startsWith(".question-card"))return cardPresent?card:null;
   if(selector===".question-controls")return{getBoundingClientRect(){return{bottom:700}}};
   return null;
  }};
  const documentFake={
   body:{classList},
   documentElement:{scrollHeight:740},
   querySelector(){return rootNode}
  };
  const windowFake={innerHeight:750,addEventListener(){}};
  const VMObserver=class{constructor(cb){observerCallback=cb}observe(){}};
  const request=cb=>(runFrame=cb,1);
  const context={document:documentFake,window:windowFake,
   MutationObserver:VMObserver,requestAnimationFrame:request,
   cancelAnimationFrame(){}};
  vm.runInNewContext(source,context,{filename:"questionnaire-layout.js"});
  runFrame();
  assert.ok(classes.has("quiz-active"),rootId);
  assert.ok(classes.has("quiz-compact"),rootId);
  assert.ok(!classes.has("quiz-scroll"),rootId);
  cardPresent=false;observerCallback();runFrame();
  assert.ok(!classes.has("quiz-active"),rootId+" summary");
  assert.ok(!classes.has("quiz-compact"),rootId+" summary density cleared");
 }
});


test("aucun des trois outils ne génère de pictogramme dans le titre des questions",()=>{
 const mdr=load("outils/questionnaire.js");
 const classification=load("outils/classification/presentation.js");
 const connectivity=load("outils/connectivite/connectivite.js");
 const label=load("outils/etiquettes-tracabilite/questionnaire.js");
 const sharedCss=load("outils/shared/questionnaire-ui.css")+load("outils/shared/questionnaire-layout.css");
 assert.doesNotMatch(mdr,/presentation\.questionIcon\(/);
 assert.doesNotMatch(classification,/function questionIcon\(|questionIconTypes/);
 assert.doesNotMatch(connectivity,/<img class="cx-question-icon"/);
 assert.doesNotMatch(label,/\+icon\(q\.icon\)/);
 assert.doesNotMatch(sharedCss,/\.cx-question-icon|\.mdr-question-icon|\.mdr-question-art/);
 for(const file of ["outils/classification/design.css","outils/connectivite/connectivite.css","outils/etiquettes-tracabilite/questionnaire.css"])
  assert.doesNotMatch(load(file),/\.cx-question-icon|\.mdr-question-icon|\.mdr-question-art/,file);
});
