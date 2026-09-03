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
  return `You are a senior marketing copywriter generating a batch of headline options.

Write ${count} marketing headlines for one topic. Every headline must be built on the structure below. The structure is the structural and rhetorical framework the headline follows — not loose inspiration. The topic supplies the subject matter. The pains supply the audience's problems and the tension to press on.

## Structure to follow

<structure name="${structure.title || "Untitled"}">
${structure.content}
</structure>

## Topic

Name: ${topic.name}

Description:
${topic.description || "(none provided)"}

Pains (the audience's problems, in their own words):
${painsBlock(topic.pains)}

## What to produce

- Exactly ${count} distinct headlines. Each one clearly follows the structure above.
- Strong hooks. Specific, concrete language — no vague filler.
- Real emotional tension, drawn from the pains.
- Natural human phrasing. Not stiff, not "marketer voice".
- Vary the phrasing, rhythm, and sentence shape across the set. No two headlines should feel interchangeable.
- Every headline is about this topic and speaks to these pains.
- Do NOT invent statistics, numbers, customer counts, timeframes, results, testimonials, or proof of any kind.

## Output

Output only the ${count} headlines, numbered 1 to ${count}, one per line. Nothing else — no introduction, no closing line, no notes, no commentary, no description of the structure.`;
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

module.exports = { assemblePrompt };
