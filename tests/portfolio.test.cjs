const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function page(query = '') {
  class Element {
    constructor() { this.children = []; this.attributes = {}; this.handlers = {}; this.isConnected = true; this.open = false; this.classList = { add() {}, remove() {} }; }
    append(...items) { this.children.push(...items); }
    replaceChildren(...items) { this.children.forEach(item => { item.isConnected = false; }); this.children = items; }
    setAttribute(key, value) { this.attributes[key] = value; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    querySelector() { return close; }
    showModal() { this.open = true; }
    close() { this.open = false; this.handlers.close?.(); }
    focus() { this.focused = true; }
  }
  const close = new Element();
  const filters = ['All', 'Medical', 'IOT', 'Autre', 'Logiciel'].map(value => Object.assign(new Element(), { dataset: { filter: value } }));
  const nodes = new Map();
  const node = selector => { if (!nodes.has(selector)) nodes.set(selector, new Element()); return nodes.get(selector); };
  const location = { href: 'https://orbivia.fr/realisations.html' + query, search: query };
  const window = { handlers: {}, addEventListener(name, handler) { this.handlers[name] = handler; } };
  const context = {
    URL, URLSearchParams, location, window,
    history: { replaceState(state, title, url) { location.href = String(url); location.search = new URL(url).search; } },
    document: { querySelector: node, querySelectorAll() { return filters; }, createElement() { return new Element(); }, body: new Element() }
  };
  vm.createContext(context);
  for (const file of ['projects.js', 'portfolio.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), context);
  return { node, filters, location, window, close };
}

test('le filtre Logiciel peut être partagé et restauré après rechargement', () => {
  const p = page();
  p.filters.find(button => button.dataset.filter === 'Logiciel').handlers.click();
  assert.equal(new URL(p.location.href).searchParams.get('categorie'), 'Logiciel');
  const restored = page(p.location.search);
  assert.equal(restored.node('#gallery').children.length, 4);
  assert.equal(restored.filters.at(-1).attributes['aria-pressed'], 'true');
});

test('ouvrir puis fermer un projet conserve le filtre et restaure le focus', () => {
  const p = page('?categorie=Logiciel');
  const card = p.node('#gallery').children[0];
  card.handlers.click();
  assert.equal(p.node('#project-dialog').open, true);
  assert.ok(new URL(p.location.href).searchParams.get('projet'));
  p.close.handlers.click();
  assert.equal(p.node('#project-dialog').open, false);
  assert.equal(new URL(p.location.href).searchParams.has('projet'), false);
  assert.equal(new URL(p.location.href).searchParams.get('categorie'), 'Logiciel');
  assert.equal(card.focused, true);
});

test('un lien de projet fonctionne même avec un filtre incompatible', () => {
  const p = page('?categorie=Medical&projet=Panopt%C3%A8s+AI');
  assert.equal(p.node('#dialog-title').textContent, 'Panoptès AI');
  assert.equal(p.node('#project-dialog').open, true);
  assert.equal(new URL(p.location.href).searchParams.has('categorie'), false);
});

test('une catégorie ou un projet inconnu revient à une galerie utilisable', () => {
  const p = page('?categorie=__proto__&projet=inconnu');
  assert.equal(p.node('#project-dialog').open, false);
  assert.ok(p.node('#gallery').children.length > 20);
  assert.equal(p.location.search, '');
});

test('la navigation d’historique restaure le filtre et ferme le dialogue', () => {
  const p = page('?projet=ORBI');
  p.location.href = 'https://orbivia.fr/realisations.html?categorie=Logiciel';
  p.location.search = '?categorie=Logiciel';
  p.window.handlers.popstate();
  assert.equal(p.node('#project-dialog').open, false);
  assert.equal(p.node('#gallery').children.length, 4);
  assert.equal(new URL(p.location.href).searchParams.get('categorie'), 'Logiciel');
});
