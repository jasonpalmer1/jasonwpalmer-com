# go-no-go

Adversarial viability proofing for product ideas: forge a falsifiable plan, run skeptical research lenses, adversarially stress-test damaging findings, then synthesize a GO / CONDITIONAL-GO / NO-GO verdict.

## How to run

```bash
# From a Claude Code session (or wherever this skill is installed):
node go-no-go.js "<idea or path>"
# Serial mode (one agent at a time under API load):
node go-no-go.js --serial "<idea or path>"
```

See `README.md` and `PROTOCOL.md` for lenses, scoring, and veto rules.

## Parallel-verdict fix

In the parallel Stress path, a null agent result was wrapped as `{ finding, verdict: null }`, so `filter(Boolean)` kept empty verifications. Serial only pushed when the verdict was truthy. Parallel now filters with `x && x.verdict`. If any lens returns null, the run fails closed before Synthesize (`cleanLensData.length !== lenses.length`).
