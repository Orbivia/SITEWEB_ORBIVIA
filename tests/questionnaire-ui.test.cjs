const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.join(__dirname, "..");
const load = p => fs.readFileSync(path.join(root, p), "utf8");

test("MDR/IVDR et connectivité chargent le même thème de questionnaire en dernier", () => {
 for (const page of ["outils/classification/index.html", "outils/connectivite/index.html"]) {
  const html = load(page);
  const localCss = page.includes("classification") ? "design.css" : "connectivite.css";
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

test("classification affiche une icône par question, jamais une icône pour chaque réponse", () => {
 const presentation = load("outils/classification/presentation.js");
 const app = load("outils/questionnaire.js");
 assert.match(presentation, /function questionIcon\(q\)/);
 assert.match(app, /presentation\.questionIcon\(q\)/);
 assert.doesNotMatch(app, /presentation\.answerIcon\(q,value\)/);
 assert.doesNotThrow(() => new vm.Script(presentation));
 assert.doesNotThrow(() => new vm.Script(app));
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


test("Lot 2.1 : chaque nouvelle icône de question est distincte de son ancien doublon", () => {
 const pairs = [
  ["autonomy", "power"],
  ["mobility", "range"],
  ["offline", "security"],
  ["priorities", "peer"]
 ];
 for (const [updated, original] of pairs) {
  const revised = load("outils/connectivite/icones/question-" + updated + ".svg");
  const previous = load("outils/connectivite/icones/question-" + original + ".svg");
  assert.notEqual(revised, previous, updated + " ne doit plus répéter " + original);
  assert.match(revised, /viewBox="0 0 32 32"/);
  assert.match(revised, /#17263a/);
  assert.match(revised, /#e7a116/);
  assert.doesNotMatch(revised, /<text[\s>]/);
 }
 const source = load("outils/connectivite/connectivite.js");
 assert.match(source, /\.svg\?v=3/);
});
