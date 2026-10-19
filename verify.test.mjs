import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verify } from './verify.mjs';

const original = JSON.parse(readFileSync(new URL('./proof.json', import.meta.url), 'utf8'));
test('accepts the recorded bundle', () => assert.deepEqual(verify(original), { fixtureRuns: 8, databaseChecks: 44 }));
for (const [name, mutate] of [
  ['a duplicate workflow replacing a missing workflow', p => { p.runs[1] = p.runs[0]; }],
  ['a simulated result relabeled as live', p => { p.runs[0].mode = 'live'; }],
  ['a nonzero external effect', p => { p.runs[0].externalEffects = 1; }],
  ['a mismatched recorded outcome', p => { p.runs[0].status = 'simulated_sent'; }],
  ['a truncated execution trace', p => { p.runs[0].trace.pop(); }],
  ['an account identifier added to the public format', p => { p.runs[0].accountId = 'example'; }],
  ['an invalid source fingerprint', p => { p.runs[0].sourceRecordSha256 = 'unverified'; }],
  ['an altered database count', p => { p.database.passed = 43; }],
  ['removed limitations', p => { p.limitations = []; }],
]) {
  test(`rejects ${name}`, () => {
    const proof = structuredClone(original);
    mutate(proof);
    assert.throws(() => verify(proof));
  });
}
