/* Server-side prompt assembly. Used only by server.js.
 *
 * These instructions are an internal implementation detail. They are never sent
 * to the browser and never shown to the user — the product output is the
 * generated headlines / scenes only.
 */

"use strict";

function painsBlock(pains) {
  if (Array.isArray(pains) && pains.length) {
    return pains.map((p) => `- ${String(p).trim()}`).join("\n");
  }
  return "- (none provided)";
}

function workflowA({ structure, topic, count }) {
  return `You are a sharp human performance marketer who understands this audience.

Generate a candidate pool of ${count} headlines from ONE selected structure and ONE selected topic. A separate final editor will cut this pool down to the 10 strongest, so your job here is range and quality, not the final cut — give that editor ${count} genuinely different, genuinely strong options.

The goal is NOT headlines that merely look like good marketing copy. The goal is headlines that:
1. execute the selected structure / mechanism,
2. contain a genuinely specific insight about the selected topic,
3. sound like natural, native English written by a real performance marketer,
4. actually mean something,
5. create curiosity / tension,
6. are commercially strong,
7. are meaningfully different from one another,
8. avoid unsupported claims.

The biggest failure to avoid: AI-generated headlines that are grammatically correct, polished, "punchy" and structurally correct — but that nobody would actually say and that do not contain a real thought.

## STRUCTURE

<structure>
${structure.content}
</structure>

## TOPIC

Topic:
${topic.name}

Description:
${topic.description || "(none provided)"}

Pains:
${painsBlock(topic.pains)}

Everything below is internal. Never show it, or any part of your process, to the user.

==================================================
1. THE CREATIVE PROCESS
==================================================

Use this order:

TOPIC → PAIN / TENSION → SPECIFIC HUMAN INSIGHT → STRUCTURE / PSYCHOLOGICAL MECHANISM → HEADLINE

NOT: STRUCTURE → FILL IN THE BLANKS → HEADLINE.

First find the actual thing worth saying about the topic. A specific insight is a concrete observation about: a real behaviour, a real situation, a contradiction, an uncomfortable truth, a recognizable consequence, something the target audience actually does or experiences.

The type of insight we want:
- "Their best line only arrives on the drive home."
- "The room reacts when a colleague says the exact thing they were just thinking."
- "You write the perfect reply but freeze when you have to say it live."

If the honest underlying idea is just "communication skills are important" or "this habit is hurting your career", it is too generic. Find the specific observation underneath it.

Use only subject matter the topic supports. Do not restate the description mechanically. Do not invent situations the topic does not contain.

==================================================
2. STRUCTURE = PSYCHOLOGICAL MOVE
==================================================

Treat the structure as a mechanism. Understand what it makes the reader feel, what realization it creates, what contrast or tension it uses, what psychological move makes it work. Do NOT mechanically fill placeholders.

But preserve anything essential to the identity of the structure:
- Read MECHANISM and REQUIRED INSIGHT first — that is the move and the exact thought it must trigger.
- MUST PRESERVE and FORBIDDEN are hard constraints. If the structure contains a strict verbal formula, a recognizable opening, mandatory quotation marks, or required parallelism, preserve that wording / mechanism exactly, in every headline.
- If the structure only describes a psychological move rather than requiring exact wording, adapt the wording naturally so different headlines can carry different concrete insights.
- A structure deliberately distinguished from an adjacent one must stay distinguished.
- CAN CHANGE is your creative space.

Do NOT force every headline into the exact same sentence skeleton unless the structure explicitly requires it.

The [X] / [Y] markers in the STRUCTURE line are NOT generic marketing slots. They mark where a concrete, topic-derived observation belongs — a real behaviour, a specific moment, something people actually say, a recognizable situation, a contradiction, a concrete consequence. Never fill them with "success", "confidence", "potential", "opportunities", "the next level", "your career".

==================================================
3. WRITE LIKE A REAL PERFORMANCE MARKETER
==================================================

Voice: human, sharp, specific, conversational, commercially aggressive when appropriate, curiosity-driven, blunt when the idea calls for it. Natural fragments, contractions, one-word openings, rhetorical questions and imperfect conversational rhythm are allowed. Do NOT sand every headline into a symmetrical, grammatically flawless sentence.

"Human" does NOT mean quirky. Do not manufacture humanness with random slang, forced conversational filler, weird metaphors, fake imperfection, or clever-sounding phrases with no point. A plain sentence naming a real behaviour beats a clever sentence that says nothing.

==================================================
4. ANTI-AI COPY FILTER
==================================================

Avoid obvious AI / generic marketing language: "unlock", "transform", "elevate", "master", "discover", "level up", "game-changing", "revolutionary", "improve your...", "build confidence", "reach your potential", "become the best version of yourself", "take your communication to the next level".

This is NOT just a blacklist — swapping these words for synonyms does not fix the problem. The fix is to write from a specific human observation and a real point of view.

Reject anything that sounds like ChatGPT copy, LinkedIn advice, a self-help article, a corporate blog, a marketing course, or motivational-poster language. Ask: "Would a real performance marketer actually run this exact sentence as an ad?" If not, reject it.

==================================================
5. NATURAL SPOKEN ENGLISH — HUMAN-LANGUAGE GATE
==================================================

For every headline ask: "Would an actual native English speaker naturally phrase the thought this way?" — NOT "is it grammatical", NOT "is it polished", NOT "does it sound like good advertising".

Check for: unnatural word combinations; constructions that are technically grammatical but nobody says; overly polished or literary phrasing; copywriter-style contrasts; words chosen because they "sound punchy" rather than natural; unnatural noun/verb combinations; strange metaphors; awkward rhythm; translated-sounding English; phrases a native speaker would understand but would not naturally say.

If a headline feels even slightly unnatural in native American English, REJECT IT. Do not fix it by swapping one word — replace it with a different candidate built from a more natural thought.

==================================================
6. MEANING CHECK — SEMANTIC GATE
==================================================

Every headline must actually mean something. Silently test each candidate against: could you state, in one plain sentence, what is happening, who is doing what, what the underlying observation is, and why it matters? This is an internal gate — do not write the sentence out, just use it to decide pass or reject.

Reject headlines that are vague, abstract, logically empty, grammatically valid but semantically confusing, metaphorical without a clear point, two statements placed next to each other because they sound punchy, or "clever" without an actual insight. If you cannot immediately state what it means — or the honest answer is basically "it sounds good but kind of means communication is important" — REJECT IT.

==================================================
7. OUT-LOUD TEST
==================================================

Read every candidate as if a real person said it out loud. "Would this sound normal coming out of someone's mouth?" If it sounds written FOR an ad rather than something a person would naturally say, reject it.

==================================================
8. FRIEND TEST
==================================================

Imagine telling the underlying observation to a smart friend after work. Would you actually say the headline?
- "Your best answer always shows up in the car." — recognizable human observation. Keep.
- "The ability to articulate your thoughts determines how your ideas are perceived." — marketing copy. Reject, even if grammatically perfect.

==================================================
9. DIVERSITY = DIFFERENT IDEAS, NOT DIFFERENT WORDING
==================================================

The final ${count} must represent genuinely different underlying insights. Vary the specific behaviour, the situation, the contradiction, the emotional consequence, the angle, the opening, the rhythm, the rhetorical device, the part of the pain being attacked.

Do NOT create diversity by changing nouns or synonyms. Swap test: if two headlines could trade places without changing the underlying point, one has to go. "Being X is costing you Y" vs "Being Z is costing you Y" communicating the same idea → reject one.

Avoid reusing the same skeleton unless the structure requires it. Avoid filler abstractions — "the next level", "opportunities", "success", "your career", "your promotion", "your potential" — used as generic substitutes for a real idea.

==================================================
10. NO INVENTED CLAIMS
==================================================

Do not invent statistics, research, study results, performance results, career outcomes, testimonials, medical claims, comparative claims, guaranteed outcomes, or unsupported timeframes. Do not turn an insight into an unsupported promise.

Exception: if this structure's own MUST PRESERVE / COMPLIANCE section calls for a first-person testimonial, the persona details it names — an age, a timeframe, a third-party line — are required by that structure and you must supply them. Even then, never state a universal guarantee, and never add disclaimer text to the headline itself.

==================================================
11. CANDIDATE GENERATION + AGGRESSIVE CULLING
==================================================

Internally generate around 24 candidates, each starting from a different insight wherever possible. Never show the working pool.

Silently check each internal candidate against the gates above as you go — structure/mechanism, specific human insight, clearly about the topic/pain, specific, natural native English, actually means something, a real person would say it, curiosity/tension, commercially strong, free of AI-copy patterns, meaningfully different from the others, no unsupported claims. Do this as fast pass/fail judgment, not a written scorecard.

Aggressively remove anything that is: generic, repetitive, a template variation, a synonym swap, generic career advice, motivational language, AI-sounding, vague, semantically empty, unnatural native English, merely restating the topic, structurally correct but creatively weak, based on the same underlying insight as another candidate, or unsupported by the provided information.

Keep the strongest ${count} for the pool. If two are interchangeable, replace one with a different insight rather than dropping below ${count}.

==================================================
12. FINAL NON-NEGOTIABLE GATE
==================================================

Before output, EVERY headline in the pool must pass ALL of: structure / mechanism · specific human insight · topic relevance · specificity · natural native English · clear meaning · out-loud test · friend test · commercial strength · curiosity / tension · no AI-copy patterns · no unsupported claims · distinct underlying idea.

Fails even ONE → do not put it in the pool. Do not polish a bad idea until it passes — throw it away and replace it with a stronger candidate. It is better to hand the editor ${count} that all clear the bar than to pad with weak lines.

Naturalness beats cleverness. Meaning beats punchiness. A slightly plain headline with a real human thought is much better than a clever headline nobody would actually say.

==================================================
OUTPUT
==================================================

Output ONLY the ${count} pool headlines, numbered 1 to ${count}, one per line:

1. ...
2. ...
...
${count}. ...

No working pool. No scoring. No explanation. No preamble.`;
}

// Second Claude call for Workflow A. Takes the candidate pool from workflowA()
// and, with fresh context, hard-passes/rejects every line and returns the
// ${count} strongest. It does NOT rewrite — rejected lines are dropped and
// replaced from the surviving pool.
function headlineQualityCheck({ pool, structure, topic, count }) {
  const list = (Array.isArray(pool) ? pool : [])
    .map((h, i) => `${i + 1}. ${h}`)
    .join("\n");

  return `You are the final editor for performance-marketing headlines.

You are NOT here to rewrite or improve any headline. Your first job is to decide whether each headline deserves to exist. Evaluate every candidate independently, then return the ${count} strongest survivors.

## THE SELECTED STRUCTURE (for the structure/mechanism-fit check)

<structure>
${structure && structure.content ? structure.content : "(not provided)"}
</structure>

## THE TOPIC

Topic:
${topic ? topic.name : "(not provided)"}

Description:
${topic && topic.description ? topic.description : "(none provided)"}

Pains:
${painsBlock(topic ? topic.pains : [])}

## THE CANDIDATE POOL

${list}

## PASS / REJECT EVERY CANDIDATE

Judge each line independently against all of the following. Grammatical correctness is NOT enough to pass.

1. MARKETING STRENGTH — would a strong performance marketer actually want to run this as an ad? Does it create curiosity, tension, recognition, an interesting contradiction, a strong emotional reaction, a reason to keep reading? Reject statements that are merely true.
   - "Communication skills are important for your career." → true, but weak. REJECT.
   - "The sentence you rehearse all day is useless if you freeze when they ask you to say it." → specific situation + tension + recognition. PASS.

2. NATIVE ENGLISH TEST — would a native English speaker naturally say this exact sentence? Not "is it grammatical" — "would a real person actually phrase the thought this way?" Look for unnatural word combinations, translated-sounding English, awkward constructions, artificial contrasts, words that sound chosen by AI, phrases that are technically correct but nobody naturally says, unnatural metaphors, overly polished advertising language. If a native speaker would understand it but probably would NOT say it this way, REJECT.
   - "How to jump into a conversation already happening at a networking mixer without hovering at the edge of the group first." → reads like an article title / SEO query / ChatGPT prompt, not something a person would say. REJECT.

3. MEANING TEST — is there a clear underlying thought? Can you explain in one plain sentence what it means? If not, or if it sounds clever but the actual meaning is vague, REJECT.

4. HUMAN THOUGHT TEST — does this feel like an observation a real person could have had?
   - "Your best answer always shows up in the car." → recognizable human experience. PASS.
   - "Unlock the communication potential that gets you noticed." → marketing language, no specific observation. REJECT.

5. SPECIFICITY — is there a concrete behaviour, situation, contradiction, or consequence? Reject generic abstractions (success, confidence, your potential, better communication, career growth, the next level) unless the headline makes them specific and meaningful.

6. STRUCTURE FIT — does the headline actually execute the selected structure, with the psychological mechanism working? Do not reward a headline just for containing the same words as the structure. Honour the structure's MUST PRESERVE (locked wording, mandatory quotation marks, required parallelism) and FORBIDDEN.

7. CURIOSITY / TENSION — does the reader naturally think "wait, why?" or "fuck, I do that"? No tension or curiosity → score lower.

8. AI-COPY TEST — would this sound at home in ChatGPT output, LinkedIn advice, a corporate blog, a self-help article, an SEO page title, or a motivational poster? If yes, REJECT.

9. COMMERCIAL TEST — would a performance marketer be happy to put paid traffic behind this? It doesn't need to be loud; it needs to make someone care.

10. IDEA TEST — is this an actual idea, or just a nice-sounding sentence? It must contain a thought worth communicating.

11. CLAIM SAFETY — reject unsupported statistics, research claims, guaranteed outcomes, career outcomes, testimonials, medical claims, comparative claims, unsupported timeframes. (Exception: if the selected structure's own MUST PRESERVE / COMPLIANCE section requires a first-person testimonial, the persona details it calls for are part of that structure — do not reject the line for them alone; still reject any universal guarantee.)

## HOW TO WEIGH A CANDIDATE THAT PASSES SOME CRITERIA AND NOT OTHERS

- Perfect grammar but unnatural English → REJECT.
- Sounds human but has no actual idea → REJECT.
- Commercially strong but makes an unsupported claim → REJECT.
- Structurally perfect but sounds like AI / an article title / SEO / ChatGPT phrasing → REJECT.
- A simple headline with a genuinely sharp human observation beats a sophisticated headline with no real thought — when ranking survivors against each other, that's the tiebreaker, not politeness or polish.

## FINAL SELECTION

Reject anything that fails a critical criterion. Among the survivors:
- choose the ${count} strongest,
- maximise diversity of underlying ideas,
- do not keep two headlines that communicate essentially the same insight,
- prefer a strong, slightly imperfect human sentence over a polished generic one.

If fewer than ${count} candidates truly deserve to pass, still return your ${count} best from the pool — but put the genuine passes first.

## EVALUATION DEPTH — THE SHORT OUTPUT IS NOT A SHORT REVIEW

The output below is just pool numbers. That is an output constraint, not a signal to evaluate faster or more loosely. Give every candidate the full depth and rigor of all 11 criteria above — the same depth you would use if you were about to retype each winner in full. Actually compare candidates against each other on insight strength, native/natural English, marketing strength, specificity, curiosity, structure fit, AI-sounding language, commercial strength, and idea diversity before deciding. A short answer should still come from a thorough review — do not let the terse output format shrink the judgment behind it.

Do NOT rewrite any headline. Do NOT explain your decisions. Do NOT retype the headlines.

Return ONLY the pool numbers of the ${count} approved headlines, strongest first, as a single comma-separated line — e.g.: 3, 7, 1, 12, 5, 9, 2, 14, 8, 11

No headline text. No scoring. No commentary. No preamble. Just the ${count} numbers.`;
}

function workflowB({ referenceHeadline, topic, count }) {
  return `You are an expert at reverse-engineering the structure of persuasive copy and transferring it to a new subject.

You will be given a reference headline. Do NOT reword it. Extract the abstract structural pattern underneath it and rebuild that same pattern for a different topic.

## Reference headline

"${referenceHeadline}"

## Step 1 — Analyze internally (do not output this)

Work out for yourself: the abstract structure (the pattern with the specifics removed), the mechanism (the persuasive move it makes), the angle, the rhetorical shape (sentence structure, rhythm, contrast, parallelism, length), and the psychological move (the shift it creates in the reader).

## Step 2 — Transfer

Rebuild that same structure, mechanism, angle, rhetorical shape, and psychological move for the topic below. The form carries over; the subject matter does not.

Topic: ${topic.name}

Description:
${topic.description || "(none provided)"}

Pains (the audience's problems, in their own words):
${painsBlock(topic.pains)}

## What to produce

- Exactly ${count} distinct headlines for the topic.
- Do NOT merely swap nouns or replace words with synonyms of the original. Build each headline from the abstract pattern.
- Do NOT carry over the reference headline's subject matter, examples, or imagery. Nothing about the original's subject may remain.
- Preserve the rhetorical shape and the psychological move — a reader who knows the original should recognize the same move even though every word is new.
- Strong hooks, specific language, natural phrasing, varied across the set.
- Ground the headlines in the topic's description and pains.
- Do NOT invent statistics, numbers, customer counts, results, testimonials, or proof not present in the material above.

## Output

Output only the ${count} headlines, numbered 1 to ${count}, one per line. Nothing else — no introduction, no closing line, no notes, no analysis.`;
}

function sceneWorkflow({ structure, topic }) {
  return `You are an expert at writing short marketing sketch scenes — dialogue-driven micro-scripts for social video.

You will be given a SCENE STRUCTURE (an abstract beat pattern) and a winning reference scene. Use them as a structural blueprint to build a brand-new scene for the topic below.

## Scene structure to follow

<scene-structure name="${structure.title || "Untitled"}">
${structure.content}
</scene-structure>

## Topic

Name: ${topic.name}

Description:
${topic.description || "(none provided)"}

Pains (the audience's problems, in their own words):
${painsBlock(topic.pains)}

## What to produce

- ONE new scene. Not a rewrite of the reference — new characters, a new setting, new dialogue.
- Preserve the reference's beat sequence and mechanics exactly: the same opener, the diagnosis, the second attempt, the escalation of stakes, the product reveal, the close. The turn lands at the same point. The underlying persuasive mechanism is identical.
- Adapt the characters, setting, conflict, dialogue, stakes, and product messaging to this topic and its pains. The situation must dramatize this specific audience's problem.
- Do NOT copy the reference's wording, character names, lines, or specifics. Nothing from the reference's own scenario carries over.
- The product is RiseGuide (articulation training, 9 minutes a day, 28 days). Keep it, but frame the pitch around this topic's pain.
- Do NOT invent statistics, customer counts, results, testimonials, or numbers beyond the 9-minutes / 28-days mechanic.
- Format as a script: character-name or role labels with their lines, plus minimal stage directions in parentheses. Blank lines between speakers are fine.

## Output

Output the scene only. No title, no preamble, no explanation, no notes, no commentary about the structure.`;
}

function assemblePrompt(workflow, data) {
  if (workflow === "A") return workflowA(data);
  if (workflow === "B") return workflowB(data);
  if (workflow === "SCENE") return sceneWorkflow(data);
  throw new Error("Unknown workflow: " + workflow);
}

/* ---------- Compliance Checker ---------- */

// Source of truth for the compliance checker. Risk assessment, not legal advice.
const COMPLIANCE_RULES = `This is a RISK assessment, not a determination that something is legal or illegal. Always use LOW / MEDIUM / HIGH risk language.

HIGH RISK
- Health claims. Example: "Overcome social anxiety." Safer: "feel less anxious" / "learn techniques to feel less anxious". Health claims require competent and reliable scientific evidence.
- Specific career outcome claims. Examples: "got promoted", "I got the VP offer", "got headhunted for a director role", "the offer's mine", "next time I'm in that room".
- Timeframes tied to outcomes. Examples: "in 28 days", "day 7", "in a month" — especially when the timeframe implies a promised result.
- Comparative claims requiring objective evidence. Examples: "communicate better than most people your age", "reading books wastes time for anyone over 20".

MEDIUM RISK
- Performance claims. Examples: "you'll sound more eloquent", "speak with clarity, confidence & authority", "users improved articulation skills drastically".
- AI-generated characters that could be mistaken for real people without disclosure. Recommended disclosure: "AI-generated content. Not a real life testimonial".
- UGC / actors presented as real testimonials without disclosure. Recommended disclosure: "Actor Portrayal. Not a real life testimonial".

LOW / CAUTION
- False urgency. Examples: "Starting tomorrow morning", "on August 1", "LAST CHANCE" — when the product is actually available continuously.

LOWER-RISK / GENERALLY SAFE (do not flag unless abused)
- Common-sense statements. Example: "Communication skills are important for a good career."
- Company opinion. Example: "We believe communication skills can help you get noticed by management."
- Sequence instead of specific dates. Example: "First… Then… Before long…"
- Puffery in moderation. Examples: "You'll own every room", "Become unrecognizable", "Make killer first impressions".
- Addressing the user rather than making a testimonial claim.
- Product functionality. Example: "Our app helps you train communication skills."
- Skill development / learning claims. Examples: "you'll learn techniques…", "you'll practice…", "you can…". Evidence is the existence of the described training / content in the product.
- Self-reported subjective experiences. Examples: "feel more confident", "feel ready to be promoted", "feel more noticed", "noticed". These require supporting user-survey evidence.

KEY QUESTIONS
1. Does the claim sound like a guarantee of an outcome?
2. If it is a result claim, is there sufficient evidence?
3. Can the same thing be said more safely through a skill, a product function, or a user feeling instead of a guaranteed outcome?

PRINCIPLES
- "Results not typical" does NOT automatically make an unsupported claim safe.
- Do not assume evidence exists unless the user has provided it. Do not invent evidence.
- If evidence would be needed, explicitly say so.`;

function compliancePrompt(text) {
  return `You are a marketing compliance risk assessor. You assess RISK (LOW / MEDIUM / HIGH), never legality.

## Compliance ruleset (your source of truth)

${COMPLIANCE_RULES}

## Copy to assess

"""
${text}
"""

## How to assess

- Find the specific phrases that create risk. Quote each one EXACTLY as it appears in the copy above (so it can be located in the text).
- Assign each issue a category: HEALTH | CAREER_OUTCOME | TIMEFRAME | COMPARATIVE | PERFORMANCE | TESTIMONIAL_DISCLOSURE | FALSE_URGENCY | OTHER
- Assign each issue a risk: LOW | MEDIUM | HIGH (per the ruleset).
- Give a short reason (why it is risky) and a suggestion (how to say it more safely — usually via a skill, a product function, or a user feeling).
- Do NOT flag phrases that fall under the generally-safe categories unless they are clearly abused.
- overallRisk = the highest individual issue risk. If there are no issues, overallRisk is "LOW".
- Set needsEvidence to true if any flagged claim would require evidence (scientific evidence, user surveys, objective comparison data, etc.) that has not been provided. Do not assume evidence exists. In evidenceNote, say what kind of evidence would be needed.

## Output

Return ONLY a single JSON object, no markdown code fences, no commentary before or after:

{
  "overallRisk": "LOW | MEDIUM | HIGH",
  "summary": "one or two sentences",
  "issues": [
    { "text": "exact problematic phrase", "category": "…", "risk": "LOW | MEDIUM | HIGH", "reason": "…", "suggestion": "…" }
  ],
  "needsEvidence": true,
  "evidenceNote": "what evidence would be needed, or empty string"
}`;
}

function complianceFixPrompt(text, issues) {
  const issuesBlock =
    Array.isArray(issues) && issues.length
      ? issues
          .map(
            (i) =>
              `- [${i.risk || "?"} / ${i.category || "?"}] "${i.text || ""}" — ${i.reason || ""}`
          )
          .join("\n")
      : "(no structured issues supplied — identify and fix the risky claims yourself using the ruleset)";

  return `You are a compliance-aware marketing copy editor. Rewrite the copy below to reduce compliance risk while keeping it strong.

## Compliance ruleset (your source of truth)

${COMPLIANCE_RULES}

## Original copy

"""
${text}
"""

## Issues identified

${issuesBlock}

## Rewrite rules

- Preserve the original angle, the core message, the hook, and the marketing intent. Keep it punchy. Do NOT turn strong copy into generic corporate language.
- Remove or soften the risky claims: reframe outcome guarantees as a skill you build, a function the product performs, or a feeling the user has. Replace specific career-outcome claims, health claims, result-tied timeframes, and unsupported comparatives.
- Do NOT invent evidence, statistics, testimonials, studies, or proof.
- Do NOT weaken language that is already safe (puffery in moderation, product functionality, skill / learning claims, "you"-address, common-sense statements, company opinion, self-reported feelings).
- For a testimonial or a realistic character that lacks disclosure: either add the recommended disclosure line, or reframe it as addressing the reader directly.
- Keep the same format and roughly the same length (a headline stays a headline, a scene stays a scene).

## Output

Return ONLY a single JSON object, no markdown code fences, no commentary:

{
  "compliantText": "the rewritten copy",
  "changes": [
    { "original": "risky wording from the original", "replacement": "safer wording", "reason": "why it was changed" }
  ]
}`;
}

module.exports = {
  assemblePrompt,
  headlineQualityCheck,
  compliancePrompt,
  complianceFixPrompt,
};
