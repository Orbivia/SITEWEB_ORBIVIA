import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimate } from '../js/estimateur-engine.mjs';
const project = { domains: ['electronics', 'firmware'], stage: 'specified', goal: 'prototype', complexity: 'simple', constraints: 'standard' };
// Tarif fictif réservé aux tests ; aucune valeur commerciale par défaut.
const config = { dailyRateHT: 600, rulesApproved: true, revision: 'test' };
test('aucun prix avec la grille non configurée ou non approuvée', () => {
  assert.equal(estimate(project).total, null);
  assert.equal(estimate(project, { ...config, rulesApproved: false }).total, null);
  for (const rate of [0, -1, null, NaN, Infinity, '600']) assert.equal(estimate(project, { ...config, dailyRateHT: rate }).total, null);
});
test('les postes arrondis concordent avec le budget total', () => {
  const result = estimate(project, config);
  assert.equal(result.status, 'estimated');
  assert.deepEqual(result.total, [4500, 11700]);
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
