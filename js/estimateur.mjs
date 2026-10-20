import { estimate, domains, stages, goals, complexityLabels } from './estimateur-engine.mjs?v=20261019-4';
const form = document.querySelector('#estimate-form');
const panels = [...form.querySelectorAll('[data-step]')];
const steps = [...document.querySelectorAll('.steps li')];
const result = document.querySelector('#result');
const money = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const range = values => values.map(money).join(' à ');
let report = '';
let currentStep = 0;
function show(step) {
  currentStep = step;
  panels.forEach((panel, i) => { panel.hidden = i !== step; });
  form.hidden = step === 2;
  result.hidden = step !== 2;
  steps.forEach((item, i) => { if (i === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
  const focus = step === 2 ? document.querySelector('#result-title') : panels[step].querySelector('textarea,select,input');
  focus.focus();
  // Revenir au début de l’étape, même après un long formulaire sur mobile.
  const anchor = step === 2 ? document.querySelector('#result-title') : document.querySelector('.steps');
  anchor.scrollIntoView({ block: 'start', behavior: 'instant' });
}
function validate(panel) {
  for (const field of panel.querySelectorAll('input,select,textarea')) {
    if (field.id === 'description') field.setCustomValidity(field.value.trim().length < 20 ? 'Décrivez votre projet en au moins 20 caractères.' : '');
    if (!field.reportValidity()) return false;
  }
  return true;
}
document.querySelector('#description').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#next').addEventListener('click', () => { if (validate(panels[0])) show(1); });
document.querySelector('#back').addEventListener('click', () => show(0));
document.querySelector('#edit').addEventListener('click', () => show(0));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (currentStep === 0) { if (validate(panels[0])) show(1); return; }
  if (!validate(panels[0])) { show(0); return; }
  if (!validate(panels[1])) return;
  const values = new FormData(form);
  const data = Object.fromEntries(values);
  data.domains = values.getAll('domains');
  const error = document.querySelector('#form-error');
  error.textContent = '';
  if (!data.domains.length) { error.textContent = 'Choisissez au moins un domaine pour poursuivre.'; panels[1].querySelector('input').focus(); return; }
  const output = estimate(data);
  const title = output.status === 'estimated' ? 'Votre première estimation.' : 'Votre projet est prêt à être précisé.';
  document.querySelector('#result-title').textContent = title;
  document.querySelector('#result-message').textContent = output.status === 'estimated' ? 'Une enveloppe pour préparer votre prochaine étape, sur la base de vos réponses.' : output.status === 'review' ? 'Ce projet nécessite un échange technique pour établir une fourchette pertinente.' : 'Un échange permettra de préciser votre budget. Vous pouvez déjà nous transmettre ce récapitulatif.';
  document.querySelector('#budget').hidden = !output.total;
  document.querySelector('#total').textContent = output.total ? range(output.total) : '';
  const reasons = document.querySelector('#review-reasons');
  reasons.replaceChildren(...output.reasons.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  const entries = [
    ['Votre projet', data.description.trim()], ['Situation actuelle', stages[data.stage]], ['Objectif', goals[data.goal]],
    ['Domaines', data.domains.map(key => domains[key].label).join(', ')], ['Fonctions', complexityLabels[data.complexity]],
    ...(data.domains.includes('electronics') ? [['Réalisation électronique', { custom: 'Une carte sur mesure', modules: 'Assemblage de modules existants', multiple: 'Plusieurs cartes ou appareils' }[data.hardware]]] : []),
    ['Logiciel complémentaire', data.softwareScope === 'external' ? 'Application, PC ou serveur à chiffrer' : 'Aucun logiciel externe indiqué'],
    ['Sécurité', { standard: 'Pas d’enjeu particulier identifié', sensitive: 'Secteur sensible ou risque pour les personnes', unknown: 'À vérifier ensemble' }[data.constraints]],
    ['Échéance souhaitée', data.timing.trim() || 'À définir']
  ];
  document.querySelector('#summary').replaceChildren(...entries.flatMap(([label, value]) => { const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = label; dd.textContent = value; return [dt, dd]; }));
  const breakdown = document.querySelector('#breakdown'); breakdown.replaceChildren();
  if (output.total) {
    const table = document.createElement('table');
    const caption = table.createCaption(); caption.textContent = 'Répartition du budget de prestation HT';
    const head = table.createTHead().insertRow();
    for (const label of ['Étape', 'Fourchette HT']) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = label; head.append(th); }
    const body = table.createTBody();
    for (const line of output.lines) { const row = body.insertRow(); const th = document.createElement('th'); th.scope = 'row'; th.textContent = line.label; row.append(th); row.insertCell().textContent = range(line.amounts); }
    breakdown.append(table);
  }
  document.querySelector('#scope').textContent = output.scope;
  document.querySelector('#exclusions').textContent = output.exclusions;
  report = ['ORBIVIA — Projet et estimation indicative', '', ...entries.map(([key, value]) => `${key} : ${value}`), '', output.total ? `Budget de prestation : ${range(output.total)} HT` : 'Budget : à préciser après échange.', ...output.lines.filter(line => line.amounts).map(line => `${line.label} : ${range(line.amounts)} HT`), ...output.reasons, '', output.scope, output.exclusions, '', 'Estimation non contractuelle à confirmer après étude. Calendrier à convenir.', `Grille : ${output.revision}`].join('\n');
  const shortEntries = entries.map(([key, value]) => `${key} : ${value.length > 350 ? value.slice(0, 350) + '… (description complète à joindre)' : value}`);
  const mailBody = ['Bonjour,', '', 'Je souhaite préciser ce projet :', ...shortEntries, '', output.total ? `Budget indicatif de prestation : ${range(output.total)} HT.` : 'Budget à préciser après échange.', output.scope, '', 'Mon nom / entreprise :', 'Mon téléphone (facultatif) :'].join('\n');
  const mailPrefix = `mailto:pierre.charlier@orbivia.fr?subject=${encodeURIComponent('Mon projet — estimation Orbivia')}&body=`;
  const compactMail = ['Bonjour,', '', `Mon projet : ${data.description.trim().slice(0, 150)}`, '', 'Je souhaite préciser mon budget. Je joins le récapitulatif complet copié depuis l’estimateur.', '', 'Mon nom / entreprise :'].join('\n');
  const longMail = mailPrefix + encodeURIComponent(mailBody);
  document.querySelector('#email').href = longMail.length > 1900 ? mailPrefix + encodeURIComponent(compactMail) : longMail;
  document.querySelector('#copy-status').textContent = '';
  document.querySelector('#copy-fallback').hidden = true;
  show(2);
});
document.querySelector('#copy').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(report); status.textContent = 'Récapitulatif copié.'; }
  catch { const fallback = document.querySelector('#copy-fallback'); fallback.value = report; fallback.hidden = false; fallback.focus(); fallback.select(); status.textContent = 'Sélectionnez et copiez le texte ci-dessous.'; }
});
document.querySelector('#print').addEventListener('click', () => window.print());
// Initialisation uniquement après le chargement réussi de tous les modules.
document.querySelector('#estimator').hidden = false;
document.querySelector('#estimator-fallback').hidden = true;

form.querySelectorAll('input[name=domains]').forEach(field => field.addEventListener('change', () => { document.querySelector('#hardware-options').hidden = !form.querySelector('input[value=electronics]').checked; }));
