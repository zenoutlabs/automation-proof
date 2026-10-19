# Evidence provenance and limits

This is a publisher-prepared record, not an independent certification.

## Origin

The source is ZenOut Labs' original Phase Two automation project, release `v5-rc8`, inspected on October 18, 2026. Eight small output records were captured from the results shown in the owner's n8n account. Their own source note states: “Rendered n8n output table; values preserved as display text; not a provider receipt.”

The public export retains only each demonstration's name, outcome, mode, ordered trace, zero-effect marker, and source fingerprints. Display text such as `true` and `0` is normalized to JSON booleans/numbers. Numbered trace text is split into an ordered list without changing step names. A local comparison verifies the public fields against the recorded source files.

Private account links, execution IDs, credential references, screenshots of the account, contact fields, local file paths, commercial archives, and the full workflow source are excluded.

`sourceRecordSha256` identifies the original local output record. `originalWorkflowSha256` identifies the workflow file listed in that project's release provenance. These hashes help the publisher detect source changes; public readers cannot independently authenticate unavailable private originals from hashes alone.

## Database evidence

The original Neon summary reports 44 checks, 44 passes, and no failure. Its test transaction was rolled back. The public export records that scope and a fingerprint of the source summary. The source project retains the detailed test SQL and private execution evidence. This repository does not claim that n8n used a live production database or that data persisted after the rollback test.

## What verification here means

`verify.mjs` checks the eight expected records, required fields, simulated mode, outcomes, trace shape, source-hash format, database count, and explicit limitations. `verify.test.mjs` checks rejection of corrupted or misleading records. The CI workflow, when present, runs those same checks.

A passing CI result means **the published evidence bundle passed these checks**. It is not a passing live-automation acceptance test, a security audit of the commercial product, or proof that a message reached a person.

The underlying source workflows were not rebuilt or changed to create this proof package. No paid provider request or external message was sent by this package.

## Rights and attribution

The selected results describe ZenOut's own demonstrations. The prose, verifier, tests, and checklist were authored for this public package with Codex assistance. No code, branding assets, or documentation from a purchased reference pack was copied into it. n8n and Neon are third-party products named only to identify the execution environments; this project is not endorsed by either vendor.
