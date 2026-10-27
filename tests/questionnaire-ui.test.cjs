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
