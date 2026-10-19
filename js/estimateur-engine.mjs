// Grille initiale proposée : à calibrer sur les missions réalisées avant activation.
export const pricing = Object.freeze({ dailyRateHT: null, rulesApproved: false, revision: '2026-10-v1' });
export const domains = {
  electronics: { label: 'Carte électronique', days: [3, 7] },
  firmware: { label: 'Logiciel embarqué', days: [3, 8] },
  mechanical: { label: 'Boîtier et intégration', days: [2, 5] },
  testing: { label: 'Mesures et mise au point', days: [1, 3] },
  ce: { label: 'Accompagnement CE', days: [2, 5] }
};
export const stages = { idea: 'Une idée à explorer', specified: 'Un besoin déjà défini', existing: 'Un prototype ou produit existant' };
export const goals = { feasibility: 'Vérifier la faisabilité', prototype: 'Obtenir un prototype fonctionnel', production: 'Préparer la fabrication' };
export const complexityLabels = { simple: 'Quelques fonctions simples', connected: 'Un produit connecté ou plusieurs fonctions', advanced: 'Fonctions avancées ou contraintes fortes', unknown: 'À définir ensemble' };
export function estimate(input, config = pricing) {
  const selected = [...new Set(input.domains || [])];
  if (!selected.length || selected.some(key => !Object.hasOwn(domains, key))) throw new Error('Choisissez au moins un domaine valide.');
  if (!Object.hasOwn(stages, input.stage) || !Object.hasOwn(goals, input.goal) || !Object.hasOwn(complexityLabels, input.complexity)) throw new Error('Précisez le projet.');
  if (!['standard', 'sensitive', 'unknown'].includes(input.constraints)) throw new Error('Précisez les contraintes.');
  const manual = [];
  if (input.goal === 'production') manual.push('La préparation à la fabrication nécessite une analyse du produit, des volumes et des fournisseurs.');
  if (input.constraints !== 'standard') manual.push('Les contraintes de sécurité et réglementaires doivent être clarifiées.');
  if (input.complexity === 'advanced' || input.complexity === 'unknown') manual.push('Le périmètre technique nécessite un échange avant chiffrage.');
  const feasibility = input.goal === 'feasibility';
  const factor = input.complexity === 'connected' ? 1.5 : 1;
  const rows = [{ label: feasibility ? 'Cadrage et étude de faisabilité' : 'Cadrage du besoin', days: input.stage === 'idea' ? [1, 3] : [0.5, 1.5] }];
  if (feasibility) {
    rows.push({ label: 'Analyse des fonctions et des risques techniques', days: [selected.length * 0.5, selected.length * 1.5] });
  } else {
    for (const key of selected) rows.push({ label: domains[key].label, days: domains[key].days.map(d => d * factor) });
    if (selected.length > 1) rows.push({ label: 'Intégration des différentes fonctions', days: [1, 3] });
  }
  const validRate = typeof config.dailyRateHT === 'number' && Number.isFinite(config.dailyRateHT) && config.dailyRateHT > 0;
  const enabled = validRate && config.rulesApproved === true && manual.length === 0;
  const lines = rows.map(row => ({ label: row.label, amounts: enabled ? [Math.floor(row.days[0] * config.dailyRateHT / 50) * 50, Math.ceil(row.days[1] * config.dailyRateHT / 50) * 50] : null }));
  return {
    status: manual.length ? 'review' : enabled ? 'estimated' : 'unconfigured',
    reasons: manual,
    lines,
    total: enabled ? lines.reduce((sum, row) => sum.map((v, i) => v + row.amounts[i]), [0, 0]) : null,
    scope: feasibility ? 'Étude de faisabilité uniquement, sans conception détaillée ni réalisation du prototype.' : 'Prestations de développement pour un premier prototype, dans le périmètre indiqué.',
    exclusions: 'Composants, cartes et boîtiers fabriqués, transports, essais de laboratoire, certification et production en série : à chiffrer séparément. Application mobile, site et service cloud non compris.',
    revision: config.revision
  };
}
