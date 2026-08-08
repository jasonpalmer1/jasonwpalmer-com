export const meta = {
  name: 'go-no-go',
  description: 'Adversarially proof a product/project idea across viability lenses with live web research, stress-test damaging findings, and return a scored+veto verdict',
  phases: [
    { title: 'Forge' },
    { title: 'Proof' },
    { title: 'Stress' },
    { title: 'Synthesize' },
  ],
}

// ─── Mode definitions ──────────────────────────────────────────────────────────

const COMMERCIAL_LENSES = [
  {
    key: 'buyer',
    title: 'Buyer & willingness-to-pay',
    weight: 25,
    q: `Does the target buyer actually EXIST in meaningful numbers, and is it reachable and willing to PAY for this product? Or do buyers in this space rely on consultants/brokers and never buy software? How many firms/people fit the ICP? What do they spend today on comparable intelligence/tools? Find evidence of comparable products this buyer tier actually pays for and at what price point.`,
  },
  {
    key: 'competition',
    title: 'Competition & moat durability',
    weight: 20,
    q: `Who already serves this market or use-case? For each incumbent found: do they already cover this problem, at what price tier, and for which buyer? Is the claimed gap REAL, or is it covered by free data plus a cheap consultant? How durable is the proposed moat against a well-funded incumbent simply adding the feature?`,
  },
  {
    key: 'effort',
    title: 'Effort / time-to-revenue / opportunity cost',
    weight: 20,
    q: `Honestly scope the effort to reach a PAID, trustworthy product given the builder profile described in the plan. Where are the real time sinks? What is a realistic time-to-first-paying-customer? What ongoing maintenance burden does the core data or operations impose? Frame the opportunity cost for this specific builder.`,
  },
  {
    key: 'gtm',
    title: 'Distribution / GTM',
    weight: 15,
    q: `Is the primary distribution channel realistic for this buyer? Investigate actual demand signals (search volume, community behavior, comparable GTM plays). Is the conversion path from top-of-funnel to paid realistic? Assess channel saturation and whether a new entrant can win attention.`,
  },
  {
    key: 'data',
    title: 'Data/inputs + legal/ToS',
    weight: 10,
    q: `Can the available data (public or licensable) produce output credible to a sophisticated buyer, or will estimates be too coarse/hand-wavy? Are the TERMS OF USE / licensing of key data sources compatible with building a COMMERCIAL paid product on top of their synthesis? Find actual ToS/license language. Flag any redistribution or commercial-use restriction.`,
  },
  {
    key: 'methodology',
    title: 'Methodology / credibility',
    weight: 10,
    q: `Adopt the persona of a domain expert AND a skeptical end-user. Would the proposed scoring or output methodology read as RIGOROUS, or as a naive toy? What critical inputs does real domain due diligence require that the proposed data sources CANNOT provide? Could the output be confidently wrong in a way that destroys trust?`,
  },
]

const PURPOSE_LENSES = [
  {
    key: 'purpose_fit',
    title: 'Purpose-fit / achieves its actual goal',
    weight: 30,
    q: `Does this project do the one thing it is supposed to do? Is the core goal achievable with the proposed approach? Where does the core thesis break?`,
  },
  {
    key: 'recipient_value',
    title: 'Recipient/user value & actual use',
    weight: 25,
    q: `Will the intended user actually use this? Assess friction, context, habit, and whether the format matches how they naturally engage. Are there simpler substitutes they'd default to?`,
  },
  {
    key: 'reliability',
    title: 'Reliability & quality bar',
    weight: 20,
    q: `Is the quality bar achievable with the proposed build approach and effort level? Where is it most likely to break or disappoint? What's the minimum viable quality threshold for the intended use?`,
  },
  {
    key: 'maintenance',
    title: 'Maintenance burden & sustainability',
    weight: 15,
    q: `What keeps this alive after launch? How much ongoing effort does it require? What breaks first if the builder disengages? Is the ongoing burden proportionate to the value?`,
  },
  {
    key: 'credibility',
    title: 'Represents-well / credibility or discoverability',
    weight: 10,
    q: `If public-facing: does it reflect well on the builder? Is it discoverable by people who should see it? If private: does the polish match the relationship/context?`,
  },
]

// ─── Schemas ───────────────────────────────────────────────────────────────────

const PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['thesis', 'buyerOrUser', 'dataOrInputs', 'buildState', 'distribution', 'monetizationOrPurpose', 'builderAndEffort'],
  properties: {
    thesis: { type: 'string', description: 'One-sentence falsifiable claim about why this idea works' },
    buyerOrUser: { type: 'string', description: 'Specific ICP: who, how many, what pain, what they do today' },
    dataOrInputs: { type: 'string', description: 'What data/content/inputs the product depends on and their availability' },
    buildState: { type: 'string', description: 'Current build phase and what is done vs. remaining' },
    distribution: { type: 'string', description: 'Primary channel(s) to reach the buyer/user' },
    monetizationOrPurpose: { type: 'string', description: 'How it makes money (commercial) or what it achieves (purpose)' },
    builderAndEffort: { type: 'string', description: 'Who is building, their constraints, realistic time estimate' },
  },
}

const LENS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'lensScore', 'verdict', 'confidence', 'keyFindings', 'whatMustBeTrue', 'bottomLine'],
  properties: {
    lens: { type: 'string' },
    lensScore: { type: 'number', description: '0–100 score for this dimension; higher = more viable on this lens' },
    verdict: { type: 'string', enum: ['viable', 'conditional', 'fatal-risk'] },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    keyFindings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['claim', 'evidence', 'severity'],
        properties: {
          claim: { type: 'string', description: 'A specific, falsifiable assertion about the plan' },
          evidence: { type: 'string', description: 'Concrete evidence (numbers, competitor names, prices, ToS clauses, search volumes)' },
          sourceUrl: { type: 'string' },
          severity: { type: 'string', enum: ['kills', 'major', 'minor', 'supports'], description: 'kills = could sink the product; supports = evidence FOR viability' },
        },
      },
    },
    whatMustBeTrue: { type: 'array', items: { type: 'string' }, description: 'Conditions that must hold for the plan to work on this dimension' },
    bottomLine: { type: 'string' },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['claim', 'holdsUp', 'reasoning', 'revisedSeverity'],
  properties: {
    claim: { type: 'string' },
    holdsUp: { type: 'boolean', description: 'true if the claim survives adversarial scrutiny' },
    reasoning: { type: 'string' },
    sourceUrl: { type: 'string' },
    revisedSeverity: { type: 'string', enum: ['kills', 'major', 'minor', 'supports', 'refuted'] },
  },
}

const DIGEST_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['perLens', 'weightedComposite', 'realKillers', 'falseAlarms', 'strongestUpside', 'icpConsensus', 'finalVerdict'],
  properties: {
    perLens: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['lens', 'lensScore', 'verdict', 'risksHeld', 'refuted', 'whatMustBeTrue'],
        properties: {
          lens: { type: 'string' },
          lensScore: { type: 'number' },
          verdict: { type: 'string' },
          risksHeld: { type: 'array', items: { type: 'string' }, description: 'kills/major findings that SURVIVED verification, with key numbers/sources' },
          refuted: { type: 'array', items: { type: 'string' }, description: 'Damaging claims that were refuted or downgraded' },
          whatMustBeTrue: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    weightedComposite: { type: 'number', description: 'Σ(lensScore × weight)/100 across all lenses' },
    realKillers: { type: 'array', items: { type: 'string' }, description: 'Verified, cross-cutting deal-breakers that survived Stage 3' },
    falseAlarms: { type: 'array', items: { type: 'string' }, description: 'Scary-sounding findings that did NOT hold up under scrutiny' },
    strongestUpside: { type: 'array', items: { type: 'string' }, description: 'Verified evidence FOR viability' },
    icpConsensus: { type: 'string', description: 'Where the lenses converge on the right ICP/wedge' },
    finalVerdict: {
      type: 'object',
      additionalProperties: false,
      required: ['call', 'vetoTriggered', 'threeThingsMustBeTrue', 'cheapestNextTest', 'repositioningPath'],
      properties: {
        call: { type: 'string', enum: ['GO', 'CONDITIONAL-GO', 'NO-GO', 'KEEP-INVESTING', 'GOOD-ENOUGH', 'WIND-DOWN'] },
        vetoTriggered: { type: 'boolean', description: 'true if a verified deal-killer overrides the composite score' },
        threeThingsMustBeTrue: { type: 'array', items: { type: 'string' }, description: 'The 3 most critical conditions that must be validated' },
        cheapestNextTest: { type: 'string', description: 'Cheapest/fastest experiment to validate or kill the top uncertainty' },
        repositioningPath: { type: 'string', description: 'If conditional or no-go: what pivot could unlock a better verdict? Empty string if none.' },
      },
    },
  },
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

function forgePrompt(target, isPath) {
  if (isPath) {
    return `You are a product analyst writing a concrete, falsifiable one-page plan for a product or project.

Read the project's CLAUDE.md at ${target}/CLAUDE.md (and README.md if present) to understand the current state. Then produce the plan per the schema.

Rules:
- Be specific and falsifiable. "Targets SMBs" is useless; "Targets ~200 US mid-tier data-center developers spending $50–200K/yr on site selection" is useful.
- If something is unknown or unvalidated, say so explicitly in the relevant field — that becomes a "must be true."
- Build state should reflect what is ACTUALLY done vs. aspirational.`
  }

  return `You are a product analyst structuring an idea into a concrete, falsifiable one-page plan.

The idea as described:
${target}

Produce the plan per the schema. Be specific and falsifiable. Where the idea description is vague, make the most reasonable concrete interpretation and flag it in builderAndEffort as an assumption. Unknown/unvalidated elements become "must be true" conditions.`
}

function lensPrompt(plan, lens) {
  return `You are a hard-nosed, skeptical analyst whose ONLY job is to find why the plan below FAILS on one specific dimension. Do NOT cheerlead. Use live web research — load tools first with ToolSearch query "select:WebSearch,WebFetch". Cite real sources (URLs), real competitor names, real prices, real numbers wherever possible; if you cannot verify something, say so and lower confidence rather than inventing.

THE PLAN:
${JSON.stringify(plan, null, 2)}

YOUR LENS — ${lens.title}:
${lens.q}

Return findings per the schema. Set lensScore 0–100 where HIGHER = more viable on this dimension (not how scary the findings are). Mark each finding's severity honestly: "kills" only for things that could genuinely sink the product, "supports" for evidence the plan IS viable on this dimension. Be specific and falsifiable. Set verdict to fatal-risk only if this dimension alone could kill it.`
}

function verifyPrompt(f, lens, planTitle) {
  return `You are an independent adversarial verifier. A prior analyst made this claim while proofing the following plan on the "${lens.title}" dimension.

PLAN: ${planTitle}
LENS: ${lens.title}
CLAIM: ${f.claim}
THEIR EVIDENCE: ${f.evidence}
THEIR SOURCE: ${f.sourceUrl || '(none given)'}
THEY RATED IT: ${f.severity}

Your job: try to REFUTE this claim. Use live web research (ToolSearch query "select:WebSearch,WebFetch"). Check whether the evidence is real and correctly interpreted, whether it is cherry-picked, and whether a reasonable counter-case exists. Default toward skepticism: if the claim is unsupported or overstated, mark holdsUp=false. Return your verdict per schema, with revisedSeverity reflecting what the evidence ACTUALLY supports after scrutiny (use "refuted" if the claim does not hold up at all).`
}

function synthPrompt(plan, lensData, lenses, mode) {
  const lensTable = lenses.map(l => `${l.key} (weight ${l.weight})`).join(', ')
  const verdictFraming = mode === 'purpose'
    ? 'KEEP-INVESTING (composite ≥ 70) / GOOD-ENOUGH (50–69) / WIND-DOWN (< 50)'
    : 'GO (composite ≥ 70) / CONDITIONAL-GO (50–69) / NO-GO (< 50)'

  return `You are synthesizing a multi-lens adversarial proofing run. Below is the raw JSON output of all proofing lenses, each with findings AND a verification pass (verifications[].verdict.holdsUp / revisedSeverity tells you which findings survived adversarial scrutiny).

MODE: ${mode}
LENSES WITH WEIGHTS: ${lensTable}
VERDICT THRESHOLDS: ${verdictFraming}

SCORING RULES:
1. weightedComposite = Σ(lensScore × weight) / 100 — compute this from the lensScore values in the data.
2. VETO: any single verified deal-killer (holdsUp=true AND severity="kills") caps the verdict to NO-GO (or CONDITIONAL-GO if a repositioning path exists) regardless of composite.
3. finalVerdict.call must reflect the veto if triggered.

PLAN TITLE: ${plan.thesis}

RAW DATA:
${JSON.stringify(lensData, null, 2)}

Distill faithfully into the schema. CRUCIAL: only list a risk under risksHeld/realKillers if its verification shows holdsUp=true (or it was not verified, treat as held). Put refuted/downgraded ones under refuted/falseAlarms. Keep concrete numbers, competitor names, prices, and sources. Do not invent anything not in the data.`
}

// ─── Main workflow ────────────────────────────────────────────────────────────

// args may arrive as an object, a JSON string, or a bare path/plan string — normalize all three
let parsedArgs = args
if (typeof parsedArgs === 'string') {
  try { parsedArgs = JSON.parse(parsedArgs) } catch (e) { parsedArgs = { target: parsedArgs } }
}
const { target, mode = 'commercial', serial = false } = parsedArgs || {}
if (!target) throw new Error('go-no-go: no target provided. Pass args as {target: "<project path or inline plan>", mode?: "commercial"|"purpose"}')

const lenses = mode === 'purpose' ? PURPOSE_LENSES : COMMERCIAL_LENSES

// Detect whether target is a path or an inline plan string
const isPath = target.startsWith('/') || target.startsWith('~')
if (target.startsWith('~')) {
  throw new Error('go-no-go: the workflow sandbox cannot expand "~" — pass an absolute path (e.g. /Users/you/projects/my-idea)')
}

// ─── Stage 1: Forge ───────────────────────────────────────────────────────────

phase('Forge')

const plan = await agent(
  forgePrompt(target, isPath),
  { label: 'forge', phase: 'Forge', schema: PLAN_SCHEMA, model: 'sonnet' }
)

if (!plan) throw new Error('Forge stage returned no plan — cannot continue')

// ─── Stage 2: Proof + Stage 3: Stress (interleaved per lens) ─────────────────

phase('Proof')

async function proofOneLens(lens) {
  const res = await agent(lensPrompt(plan, lens), { label: `proof:${lens.key}`, phase: 'Proof', schema: LENS_SCHEMA, model: 'sonnet' })
  if (!res) return null
  const findings = res.keyFindings || []
  const damaging = findings.filter(f => f.severity === 'kills' || f.severity === 'major').slice(0, 3)
  const topSupport = findings.filter(f => f.severity === 'supports').slice(0, 1)
  const toVerify = [...damaging, ...topSupport]
  const verifications = []
  if (serial) {
    // one stress agent at a time — minimize concurrent load during API overload
    for (const f of toVerify) {
      const v = await agent(verifyPrompt(f, lens, plan.thesis), { label: `stress:${lens.key}`, phase: 'Stress', schema: VERDICT_SCHEMA, model: 'sonnet' })
      if (v) verifications.push({ finding: f, verdict: v })
    }
  } else {
    const verifs = await parallel(
      toVerify.map(f => () =>
        agent(verifyPrompt(f, lens, plan.thesis), { label: `stress:${lens.key}`, phase: 'Stress', schema: VERDICT_SCHEMA, model: 'sonnet' })
          .then(v => ({ finding: f, verdict: v }))
      )
    )
    // Match serial: drop entries where agent returned null (wrapper object is always truthy).
    verifications.push(...verifs.filter(x => x && x.verdict))
  }
  return { lens: lens.key, title: lens.title, weight: lens.weight, result: res, verifications }
}

let lensResults
if (serial) {
  // run lenses one at a time → max 1 concurrent agent, to slip under a concurrency-overloaded API
  lensResults = []
  for (const lens of lenses) {
    lensResults.push(await proofOneLens(lens))
  }
} else {
  lensResults = await parallel(lenses.map(lens => () => proofOneLens(lens)))
}

const cleanLensData = lensResults.filter(Boolean)
if (cleanLensData.length !== lenses.length) {
  throw new Error(
    `Incomplete proof: ${cleanLensData.length}/${lenses.length} lenses returned results — refusing to synthesize`
  )
}

// ─── Stage 4: Synthesize ──────────────────────────────────────────────────────

phase('Synthesize')

const digest = await agent(
  synthPrompt(plan, cleanLensData, lenses, mode),
  { label: 'synthesize', phase: 'Synthesize', schema: DIGEST_SCHEMA, model: 'sonnet' }
)

return { plan, digest, lensCount: cleanLensData.length, mode }
