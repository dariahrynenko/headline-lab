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
  return `You are a performance-marketing copywriter. Produce ${count} ad headlines for the topic below, working from the structure below.

## The topic — this is where the headline actually comes from

Name: ${topic.name}

Description:
${topic.description || "(none provided)"}

Pains (in the audience's own words):
${painsBlock(topic.pains)}

Your process is:  TOPIC  →  the pain / the tension  →  a specific insight  →  the headline.
NOT:  structure  →  fill in the blanks  →  headline.

A "specific insight" is a concrete observation about a real behaviour, situation, contradiction, or consequence in this person's life — for example: "they do the work but a colleague gets asked to present it", "their best line only arrives on the drive home", "the room reacts when someone else says the exact thing they just said". Mine the description and pains for that kind of material. Do not restate the description.

## The structure — this is the psychological move, not the wording

<structure name="${structure.title || "Untitled"}">
${structure.content}
</structure>

Read the structure for the move it makes on the reader: the tension it sets up, the turn, the payoff. Then make that move with your insight. The structure tells you WHAT KIND of psychological move to make. It does not tell you which exact words or grammatical construction to repeat.

Worked example. Structure: "THIS IS HOW [X] IS COSTING YOU [Y]". The move is: name an overlooked behaviour → reveal its hidden cost → trigger a "wait — I do that" moment. Run on different insights, that becomes:
- "This Is How Saying 'Whatever You Think' Makes Your Opinion Worth Less"
- "You Did the Work. Someone Else Got the Credit."
- "Your Boss Can't Promote What They Never Hear."
- "If Your Best Idea Only Comes Out When Someone Asks, It's Already Too Late."
Four different insights making the same move — not one sentence with the nouns swapped. Some keep the literal "This Is How…" wording; some don't. Keep whatever makes the structure recognisable as that move (a verbal formula like "Never, and I mean never…" or a strict parallelism stays intact; a described move can be worded your way). The rest of the wording is yours.

## What is the actual thing I'm saying here?

Ask this of every headline. If the honest answer is a generic line — "this habit is hurting your career", "not speaking up holds you back", "being too modest costs you" — it is not specific enough. Cut it. Every headline must carry a concrete behaviour, situation, contradiction, consequence, or uncomfortable truth.

BAD (generic, template-shaped, abstract outcome):
- "This Is How Being Too Humble Is Costing You Opportunities"
- "This Is How Playing It Safe Is Costing You the Next Level"
- "This Is How Not Selling Yourself Is Costing You Success"

GOOD (a real, specific idea):
- "You Did the Work. Someone Else Got the Credit."
- "Your Boss Can't Promote What They Never Hear."
- "If Your Best Idea Only Comes Out When Someone Asks, It's Already Too Late."
- "Being Good at Your Job Doesn't Help Much If Nobody Remembers What You Said."

## Quality test — every headline must pass all of it

1. Is there a real idea here, not just a rearranged cliché?
2. Is there a specific human behaviour or situation in it?
3. Does it point at something the reader might not have noticed about themselves?
4. Would the target audience read it and think "…yeah, I actually do that"?
5. Is there tension, curiosity, or a useful contradiction?
6. Would a strong performance marketer put real spend behind this exact line?
7. Does it still clearly make the structure's psychological move?
8. Is it materially different from the other 9 — a different idea, not a different phrasing?

## Diversity — different ideas, not different words

The ${count} finalists must be ${count} genuinely different angles on the topic. Compare each against the other 9: if two could trade places without changing the underlying point, one has to go. Optimise for idea variety, not grammatical variety.

Do not lean on a repeated skeleton across the set (e.g. "This Is How…", "Being [X]…", "[X] Is Costing You…"). Drop the filler abstractions: "the next level", "opportunities", "success", "your career", "your promotion", "your potential". A repeated skeleton and those abstractions are what mechanical generation looks like.

## Don't

- Don't swap synonyms into the structure and call it a new headline.
- Don't manufacture "humanness" with random quirky phrases, and don't try to sound clever. A plain sentence naming a real behaviour beats a clever sentence that says nothing.
- Don't use motivational-poster language or "here's how" explainer framing.
- Don't use a vague abstraction where a concrete situation would work.
- Don't sound like ChatGPT, a LinkedIn post, a self-help article, a corporate blog, or a marketing course.
- Don't invent statistics, research, results, career outcomes, testimonials, timeframes, or medical / comparative claims.

## How to work — internal only, never shown

Draft 30 candidates, each built from a different insight in the topic. Then aggressively remove: template variations, synonym swaps, generic career advice, abstract outcomes, motivational language, AI-sounding phrasing, anything that just restates the topic, and any two candidates that share the same underlying insight. Keep the ${count} strongest.

## Output

Output ONLY the final ${count} headlines, numbered 1 to ${count}, one per line. No candidate pool, no scoring, no preamble, no commentary.`;
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

module.exports = { assemblePrompt, compliancePrompt, complianceFixPrompt };
