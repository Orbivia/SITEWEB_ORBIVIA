// Modèle initial de budget rapproché des devis envoyés, sans assimilation à du temps réellement passé.
export const pricing = Object.freeze({
  hourlyRatesHT: Object.freeze({ expert: 150, engineer: 120, technician: 80 }),
  effortBuffer: 1.25, estimatesEnabled: true, revision: '2026-10-v4-buffer'
});
export const domains = {
  electronics: { label: 'Carte électronique', role: 'engineer', hours: [10, 30], evolutionHours: [2, 10] },
  firmware: { label: 'Logiciel embarqué', role: 'engineer', hours: [10, 24], evolutionHours: [4, 24] },
  mechanical: { label: 'Conception mécanique du boîtier', role: 'engineer', hours: [6, 36], evolutionHours: [1, 10] },
  testing: { label: 'Mesures et mise au point', role: 'expert', hours: [4, 12] },
  ce: { label: 'Accompagnement CE', role: 'expert', hours: [3, 24] },
  printing: { label: 'Impression 3D du prototype', role: 'technician', hours: [1, 4] },
  assembly: { label: 'Assemblage électronique', role: 'technician', hours: [3, 12] },
  integration: { label: 'Intégration du produit', role: 'technician', hours: [4, 16] }
};
export const stages = { idea: 'Une idée à explorer', specified: 'Un besoin déjà défini', existing: 'Un prototype ou produit existant' };
export const goals = { feasibility: 'Vérifier la faisabilité', prototype: 'Obtenir un prototype fonctionnel', evolution: 'Faire évoluer un produit existant', production: 'Préparer la fabrication' };
export const complexityLabels = { simple: 'Quelques fonctions simples', connected: 'Un produit connecté ou plusieurs fonctions', advanced: 'Fonctions avancées ou contraintes fortes', unknown: 'À définir ensemble' };
export function estimate(input, config = pricing) {
  const selected = [...new Set(input.domains || [])];
  if (!selected.length || selected.some(key => !Object.hasOwn(domains, key))) throw new Error('Choisissez au moins un domaine valide.');
  if (!Object.hasOwn(stages, input.stage) || !Object.hasOwn(goals, input.goal) || !Object.hasOwn(complexityLabels, input.complexity)) throw new Error('Précisez le projet.');
  if (!['standard', 'sensitive', 'unknown'].includes(input.constraints)) throw new Error('Précisez les contraintes.');
  if (!['custom', 'modules', 'multiple'].includes(input.hardware)) throw new Error('Précisez la réalisation électronique.');
  if (!['embedded', 'external'].includes(input.softwareScope)) throw new Error('Précisez le périmètre logiciel.');
  const manual = [];
  if (selected.includes('electronics') && input.hardware === 'multiple') manual.push('Plusieurs cartes ou appareils nécessitent une décomposition du projet avant chiffrage.');
  if (input.softwareScope === 'external') manual.push('Une application, un logiciel PC ou un serveur nécessite un chiffrage logiciel complémentaire.');
  if (input.goal === 'evolution' && input.stage !== 'existing') manual.push('Une évolution nécessite un produit existant et une revue des éléments disponibles.');
  if (input.goal === 'production') manual.push('La préparation à la fabrication nécessite une analyse du produit, des volumes et des fournisseurs.');
  if (input.constraints !== 'standard') manual.push('Les contraintes de sécurité et réglementaires doivent être clarifiées.');
  if (input.complexity === 'advanced' || input.complexity === 'unknown') manual.push('Le périmètre technique nécessite un échange avant chiffrage.');
  const feasibility = input.goal === 'feasibility';
  const evolution = input.goal === 'evolution';
  const rows = [{ label: feasibility ? 'Cadrage et étude de faisabilité' : 'Cadrage du besoin', role: 'expert', hours: input.stage === 'idea' ? [3, 6] : [1, 3] }];
  if (feasibility) {
    rows.push({ label: 'Analyse des fonctions et des risques techniques', role: 'expert', hours: [selected.length * 2, selected.length * 6] });
  } else {
    for (const key of selected) {
      const domain = domains[key];
      const factor = input.complexity === 'connected' && ['electronics', 'firmware'].includes(key) ? 1.3 : 1;
      const hours = key === 'electronics' && input.hardware === 'modules' ? [4, 12] : evolution && domain.evolutionHours ? domain.evolutionHours : domain.hours;
      rows.push({ label: key === 'electronics' && input.hardware === 'modules' ? 'Intégration de modules électroniques existants' : domain.label, role: domain.role, hours: hours.map(h => h * factor) });
    }
    if (selected.some(key => ['electronics', 'mechanical'].includes(key)) && selected.some(key => ['firmware', 'assembly'].includes(key)) && !selected.includes('integration')) rows.push({ label: 'Intégration des différentes fonctions', role: 'technician', hours: [4, 12] });
  }
  const validRates = rows.every(row => {
    const rate = config.hourlyRatesHT?.[row.role];
    return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
  });
  const validBuffer = typeof config.effortBuffer === 'number' && Number.isFinite(config.effortBuffer) && config.effortBuffer >= 1;
  const enabled = validBuffer && validRates && config.estimatesEnabled === true && manual.length === 0;
  const lines = rows.map(row => ({
    label: row.label, role: row.role,
    amounts: enabled ? [Math.floor(row.hours[0] * config.effortBuffer * config.hourlyRatesHT[row.role] / 50) * 50, Math.ceil(row.hours[1] * config.effortBuffer * config.hourlyRatesHT[row.role] / 50) * 50] : null
  }));
  return {
    status: manual.length ? 'review' : enabled ? 'estimated' : 'unconfigured',
    reasons: manual,
    lines,
    total: enabled ? lines.reduce((sum, row) => sum.map((v, i) => v + row.amounts[i]), [0, 0]) : null,
    scope: feasibility ? 'Étude de faisabilité uniquement, sans conception détaillée ni réalisation du prototype.' : evolution ? 'Évolution ciblée du produit existant, sous réserve de l’accès aux sources et à un exemplaire fonctionnel.' : 'Prestations de développement pour un premier prototype, dans le périmètre indiqué.',
    exclusions: 'Composants, matières et consommables, fabrication sous-traitée des cartes et boîtiers, transports, essais de laboratoire, certification et production en série : à chiffrer séparément. Application mobile, site et service cloud non compris.',
    revision: config.revision
  };
}
