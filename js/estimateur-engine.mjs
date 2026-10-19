// Grille initiale proposée : à calibrer sur les missions réalisées avant activation.
export const pricing = Object.freeze({
  hourlyRatesHT: Object.freeze({ expert: 150, engineer: 120, technician: 80 }),
  rulesApproved: false, revision: '2026-10-v2-hourly'
});
export const domains = {
  electronics: { label: 'Carte électronique', role: 'engineer', hours: [21, 49] },
  firmware: { label: 'Logiciel embarqué', role: 'engineer', hours: [21, 56] },
  mechanical: { label: 'Conception mécanique du boîtier', role: 'engineer', hours: [14, 35] },
  testing: { label: 'Mesures et mise au point', role: 'expert', hours: [7, 21] },
  ce: { label: 'Accompagnement CE', role: 'expert', hours: [14, 35] },
  printing: { label: 'Impression 3D du prototype', role: 'technician', hours: [2, 6] },
  assembly: { label: 'Assemblage électronique', role: 'technician', hours: [3, 10] },
  integration: { label: 'Intégration du produit', role: 'technician', hours: [7, 21] }
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
  const rows = [{ label: feasibility ? 'Cadrage et étude de faisabilité' : 'Cadrage du besoin', role: 'expert', hours: input.stage === 'idea' ? [7, 21] : [4, 12] }];
  if (feasibility) {
    rows.push({ label: 'Analyse des fonctions et des risques techniques', role: 'expert', hours: [selected.length * 4, selected.length * 12] });
  } else {
    for (const key of selected) {
      const domain = domains[key];
      rows.push({ label: domain.label, role: domain.role, hours: domain.hours.map(h => h * factor) });
    }
    if (selected.length > 1 && !selected.includes('integration')) rows.push({ label: 'Intégration des différentes fonctions', role: 'technician', hours: [7, 21] });
  }
  const validRates = rows.every(row => {
    const rate = config.hourlyRatesHT?.[row.role];
    return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
  });
  const enabled = validRates && config.rulesApproved === true && manual.length === 0;
  const lines = rows.map(row => ({
    label: row.label, role: row.role,
    amounts: enabled ? [Math.floor(row.hours[0] * config.hourlyRatesHT[row.role] / 50) * 50, Math.ceil(row.hours[1] * config.hourlyRatesHT[row.role] / 50) * 50] : null
  }));
  return {
    status: manual.length ? 'review' : enabled ? 'estimated' : 'unconfigured',
    reasons: manual,
    lines,
    total: enabled ? lines.reduce((sum, row) => sum.map((v, i) => v + row.amounts[i]), [0, 0]) : null,
    scope: feasibility ? 'Étude de faisabilité uniquement, sans conception détaillée ni réalisation du prototype.' : 'Prestations de développement pour un premier prototype, dans le périmètre indiqué.',
    exclusions: 'Composants, matières et consommables, fabrication sous-traitée des cartes et boîtiers, transports, essais de laboratoire, certification et production en série : à chiffrer séparément. Application mobile, site et service cloud non compris.',
    revision: config.revision
  };
}
