import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
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

test('identifies the field and recorded status without echoing the rejected value', () => {
  const proof = structuredClone(original);
  proof.runs[0].status = 'private-value-must-not-be-printed';
  assert.throws(() => verify(proof), {
    message: `runs[0].status: expected "simulated_booked" for workflow "voice". Restore the recorded simulated status in proof.json.`,
  });
});

function runCli(t, contents, launch = 'direct') {
  const directory = realpathSync(mkdtempSync(join(tmpdir(), 'automation-proof-cli-')));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  copyFileSync(new URL('./verify.mjs', import.meta.url), join(directory, 'verify.mjs'));
  if (contents !== undefined) writeFileSync(join(directory, 'proof.json'), contents);
  let script = join(directory, 'verify.mjs');
  if (launch === 'linked file') {
    script = join(directory, 'linked.mjs');
    symlinkSync(join(directory, 'verify.mjs'), script, 'file');
  } else if (launch === 'linked directory') {
    symlinkSync(directory, join(directory, 'linked'), 'dir');
    script = join(directory, 'linked', 'verify.mjs');
  }
  const args = launch === 'import'
    ? ['--input-type=module', '--eval', 'await import(process.argv[1]);', pathToFileURL(script).href]
    : [script];
  const result = spawnSync(process.execPath, args, { encoding: 'utf8', cwd: tmpdir() });
  assert.ifError(result.error);
  return result;
}

for (const launch of ['linked file', 'linked directory']) {
  const options = { skip: process.platform === 'win32' ? 'Symbolic links may require Windows developer privileges.' : false };
  test(`CLI checks a valid record through a ${launch}`, options, t => {
    const result = runCli(t, JSON.stringify(original), launch);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /Evidence format verified: 8 recorded fixture runs; 44 recorded rollback checks/);
  });
  test(`CLI rejects an invalid record through a ${launch}`, options, t => {
    const proof = structuredClone(original);
    proof.runs[0].status = 'wrong_status';
    const result = runCli(t, JSON.stringify(proof), launch);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, 'Evidence verification failed: runs[0].status: expected "simulated_booked" for workflow "voice". Restore the recorded simulated status in proof.json.\n');
  });
}

test('importing the verifier does not run the command or inspect proof.json', t => {
  const result = runCli(t, 'not valid JSON', 'import');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, '');
});

test('CLI accepts the snapshot even when launched from another folder', t => {
  const result = runCli(t, JSON.stringify(original));
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /Evidence format verified: 8 recorded fixture runs; 44 recorded rollback checks/);
});

test('CLI explains a rejected status and exits with code 1', t => {
  const proof = structuredClone(original);
  proof.runs[0].status = 'private-value-must-not-be-printed';
  const result = runCli(t, JSON.stringify(proof));
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'Evidence verification failed: runs[0].status: expected "simulated_booked" for workflow "voice". Restore the recorded simulated status in proof.json.\n');
});

for (const [name, contents, message] of [
  ['invalid JSON', '{"private-value-must-not-be-printed":', 'proof.json is not valid JSON. Restore the published file or correct its JSON syntax, then try again.'],
  ['a missing file', undefined, 'Could not read proof.json. Keep it beside verify.mjs and make sure it is readable.'],
  ['an invalid record shape', 'null', 'The record does not match the published evidence format. Restore proof.json from this repository, then try again.'],
]) {
  test(`CLI explains ${name} without a stack trace or input dump`, t => {
    const result = runCli(t, contents);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, `Evidence verification failed: ${message}\n`);
  });
}
