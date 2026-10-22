# Questions to ask before calling an automation ready

Use this blank checklist with a specific version of your own workflow. Keep evidence links alongside each answer. An unchecked item is work remaining, not a result.

## How to use this checklist

1. Copy this checklist into a separate file for one workflow version.
2. Add a short answer and an evidence link beside each question you check. Evidence can be a saved test result or a record of the observed outcome. Keep private evidence in a location with restricted access.
3. Leave a question unchecked if you cannot verify the answer. Write what is missing and who must check it next.

Checking this list is a review step. It does not run or test your workflow. The `node verify.mjs` command in this repository checks the published record format. It does not complete this checklist for you.

## Terms used below

- **Workflow:** a series of steps that processes an input, such as a missed-call event.
- **File fingerprint:** a value calculated from a file's contents. It helps identify the exact file version. A matching fingerprint alone does not prove that the file is trustworthy or that a workflow works.
- **Validation:** checks that an input has the required information in the expected form.
- **Simulated service:** a test substitute for a real service. Its response does not show that a real provider accepted a request.
- **Connected service:** a real service that the workflow can contact. A connection alone does not prove that the intended result reached a recipient.
- **Rollback:** reversing test changes in a database. A successful rollback test does not prove that production data was saved permanently.
- **Handover:** the instructions and evidence another person needs to operate and maintain the workflow.

## Describe the work

- [ ] Name the business task, input, expected output, and person responsible.
- [ ] Identify the exact workflow version or file fingerprint.
- [ ] State whether the input is fictional, approved test data, or actual customer data.
- [ ] List the services involved and identify each as simulated or connected.

## Check one successful journey

- [ ] Record what arrived and which validation checks accepted it.
- [ ] Show any decision or approval a person must make.
- [ ] Record the service response without publishing credentials or personal details.
- [ ] Separately verify that the intended result reached its destination.
- [ ] State whether stored data survives a restart or was deliberately rolled back.

## Check the exceptions

- [ ] Missing required information produces an understandable result.
- [ ] Repeated input does not cause an unwanted repeated action.
- [ ] A service timeout leaves a visible record and a clear recovery step.
- [ ] A rejected approval or stop request prevents the corresponding action.
- [ ] Failed work can be reviewed by the responsible person.

## Prepare a handover

- [ ] Explain setup, accounts, costs, and required permissions.
- [ ] Document how to stop, inspect, recover, and update the workflow.
- [ ] Preserve attribution and licenses for included third-party material.
- [ ] Inspect the files and history selected for public release for secrets/private data.
- [ ] Describe remaining limitations beside the demonstrated results.

Use precise statements: “the mock returned success,” “the provider accepted the request,” and “the recipient received it” describe different observations. Test counts do not substitute for that distinction.
