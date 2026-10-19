import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const expected = {
  voice: 'simulated_booked', gmail: 'simulated_sent',
  content: 'simulated_awaiting_human_review', estimate: 'simulated_sent',
  meeting: 'simulated_sent', missed: 'simulated_sms_accepted',
  research: 'simulated_research_ready', review: 'simulated_sent',
};
const exactKeys = (value, keys) => assert.deepEqual(Object.keys(value).sort(), [...keys].sort());
const hash = value => assert.match(value, /^[a-f0-9]{64}$/);

export function verify(proof) {
  exactKeys(proof, ['schemaVersion', 'recordedDate', 'release', 'evidenceKind', 'workflowExecution', 'externalServices', 'runs', 'database', 'limitations']);
  assert.equal(proof.schemaVersion, 1);
  assert.equal(proof.recordedDate, '2026-10-18');
  assert.equal(proof.release, 'v5-rc8');
  assert.equal(proof.evidenceKind, 'publisher-recorded-n8n-output');
  assert.equal(proof.workflowExecution, 'actual-n8n-account');
  assert.equal(proof.externalServices, 'simulated');
  assert.equal(proof.runs.length, Object.keys(expected).length);
  assert.deepEqual(proof.runs.map(run => run.id).sort(), Object.keys(expected).sort());
  for (const run of proof.runs) {
    exactKeys(run, ['id', 'name', 'mode', 'status', 'ok', 'mockedProviders', 'externalEffects', 'trace', 'sourceRecordSha256', 'originalWorkflowSha256']);
    assert.equal(typeof run.name, 'string');
    assert.ok(run.name.length > 0 && run.name.length < 100);
    assert.equal(run.mode, 'demo');
    assert.equal(run.ok, true);
    assert.equal(run.mockedProviders, true);
    assert.equal(run.externalEffects, 0);
    assert.equal(run.status, expected[run.id]);
    assert.ok(Array.isArray(run.trace) && run.trace.length >= 4);
    assert.equal(run.trace[0], 'validated_envelope');
    assert.equal(run.trace.at(-1), 'provider_result_checked');
    for (const step of run.trace) assert.match(step, /^[a-z_]+$/);
    hash(run.sourceRecordSha256);
    hash(run.originalWorkflowSha256);
  }
  exactKeys(proof.database, ['provider', 'checks', 'passed', 'mode', 'sourceRecordSha256']);
  assert.equal(proof.database.provider, 'Neon PostgreSQL');
  assert.equal(proof.database.mode, 'rollback-only');
  assert.equal(proof.database.checks, 44);
  assert.equal(proof.database.passed, 44);
  hash(proof.database.sourceRecordSha256);
  assert.deepEqual(proof.limitations, [
    'No live external-service acceptance demonstrated.',
    'No end-user message delivery demonstrated.',
    'Rollback-only database checks do not demonstrate durable production writes.',
    'No customer outcomes or revenue demonstrated.',
    'This bundle verifies records; it does not execute the private workflows.',
  ]);
  return { fixtureRuns: proof.runs.length, databaseChecks: proof.database.checks };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = verify(JSON.parse(readFileSync(new URL('./proof.json', import.meta.url), 'utf8')));
  console.log(`Evidence format verified: ${result.fixtureRuns} recorded fixture runs; ${result.databaseChecks} recorded rollback checks.`);
  console.log('This checks the published records, not the private workflows or live services.');
}
