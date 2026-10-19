import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate, pricing } from '../js/estimateur-engine.mjs';
const project = { domains: ['electronics', 'firmware'], stage: 'specified', goal: 'prototype', complexity: 'simple', constraints: 'standard' };
// Les taux sont fournis par Pierre ; l'activation des durées est simulée uniquement dans les tests.
const config = { ...pricing, rulesApproved: true, revision: 'test' };
test('aucun prix avec la grille non configurée ou non approuvée', () => {
  assert.equal(estimate(project).total, null);
  assert.equal(estimate(project, { ...config, rulesApproved: false }).total, null);
  for (const rate of [0, -1, null, NaN, Infinity, '600']) assert.equal(estimate(project, { ...config, hourlyRatesHT: { ...config.hourlyRatesHT, engineer: rate } }).total, null);
});
test('les postes arrondis concordent avec le budget total', () => {
  const result = estimate(project, config);
  assert.equal(result.status, 'estimated');
  assert.deepEqual(result.total, [6150, 16150]);
  assert.deepEqual(result.total, result.lines.reduce((sum, line) => sum.map((value, i) => value + line.amounts[i]), [0, 0]));
});
test('les cas nécessitant une étude ne montrent aucun prix', () => {
  for (const update of [{ goal: 'production' }, { complexity: 'advanced' }, { complexity: 'unknown' }, { constraints: 'sensitive' }, { constraints: 'unknown' }]) {
    const result = estimate({ ...project, ...update }, config);
    assert.equal(result.status, 'review'); assert.equal(result.total, null); assert.ok(result.reasons.length);
  }
});
test('la faisabilité exclut la conception et la réalisation', () => {
  const result = estimate({ ...project, goal: 'feasibility' }, config);
  assert.equal(result.lines.length, 2);
  assert.match(result.scope, /sans conception détaillée/);
  assert.ok(result.total[1] < estimate(project, config).total[1]);
});
test('les domaines ne peuvent pas être comptés deux fois', () => {
  assert.deepEqual(estimate({ ...project, domains: [...project.domains, 'electronics'] }, config).total, estimate(project, config).total);
});
test('les valeurs invalides sont refusées', () => {
  for (const update of [{ domains: [] }, { domains: ['__proto__'] }, { stage: 'constructor' }, { constraints: '' }]) assert.throws(() => estimate({ ...project, ...update }, config));
});

test('chaque catégorie de travail utilise son propre taux horaire', () => {
  const input = { ...project, domains: ['electronics', 'testing', 'assembly'] };
  const result = estimate(input, config);
  assert.equal(result.lines.find(line => line.role === 'engineer').amounts[0], 2500);
  assert.equal(result.lines.find(line => line.label === 'Mesures et mise au point').amounts[0], 1050);
  assert.equal(result.lines.find(line => line.label === 'Assemblage électronique').amounts[0], 200);
  const higher = estimate(input, { ...config, hourlyRatesHT: { ...config.hourlyRatesHT, technician: 160 } });
  assert.deepEqual(higher.lines.filter(line => line.role !== 'technician'), result.lines.filter(line => line.role !== 'technician'));
  assert.ok(higher.total[0] > result.total[0]);
});
test('une intégration explicitement sélectionnée ne crée pas de doublon', () => {
  const result = estimate({ ...project, domains: ['electronics', 'integration'] }, config);
  assert.equal(result.lines.filter(line => line.role === 'technician').length, 1);
});
test('les taux horaires de la grille reçue sont conservés', () => {
  assert.deepEqual(pricing.hourlyRatesHT, { expert: 150, engineer: 120, technician: 80 });
});
