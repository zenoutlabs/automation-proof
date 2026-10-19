# Questions to ask before calling an automation ready

Use this blank checklist with a specific version of your own workflow. Keep evidence links alongside each answer. An unchecked item is work remaining, not a result.

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
