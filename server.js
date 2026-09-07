/* Headline Lab — local proxy server.
 *
 * Serves the static app AND the /api/* endpoints, which are the only things
 * that talk to the Anthropic API. The API key lives here in a server-side
 * environment variable and is never sent to the browser.
 *
 *   POST /api/generate    — headline / scene generation
 *   POST /api/compliance  — compliance risk assessment + compliant rewrite
 *
 * No dependencies — Node's built-in http + fetch (Node 18+).
 *
 *   1. cp .env.example .env  and put your key in it
 *   2. npm start   (or: node server.js)
 *   3. open http://127.0.0.1:8000
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { assemblePrompt, compliancePrompt, complianceFixPrompt } = require("./prompts");
const { scenarioDesignPrompt, sceneWritePrompt } = require("./scene-prompts");

/* ---------- minimal .env loader (no dependency) ---------- */
(function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
})();

// Bind to 0.0.0.0 so hosted platforms (e.g. Render) can route traffic to the
// container; locally this is still reachable as 127.0.0.1 / localhost.
const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 10000;
const DISPLAY_HOST = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
const ROOT = __dirname;

const MODEL = "claude-sonnet-5"; // verified against platform.claude.com/docs (Models overview)
const ANTHROPIC_VERSION = "2023-06-01";
const MAX_TOKENS = 4000; // workflow B (reference-headline adaptation)
const HEADLINE_MAX_TOKENS = 20000; // workflow A: the single-pass generator does all its
// candidate generation, rejection and comparison internally in adaptive-thinking tokens.
const SCENE_MAX_TOKENS = 8000; // one full dialogue scene (Scene Generator stage 2)
const SCENARIO_MAX_TOKENS = 6000; // Scene Generator stage 1: structured scenario design
const COMPLIANCE_MAX_TOKENS = 6000; // structured risk assessment / rewrite
const HEADLINE_COUNT = 10; // what the UI receives

const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};
const HIDDEN_FILES = new Set([
  "server.js",
  "prompts.js",
  "scene-prompts.js",
  "package.json",
  "package-lock.json",
]);

/* ---------- helpers ---------- */

function sendJson(res, status, obj) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function parseHeadlines(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const numbered = lines
    .filter((l) => /^\d+[.)]\s+/.test(l))
    .map((l) => l.replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);
  return numbered.length ? numbered : lines;
}

// Read a JSON request body (shared by the /api endpoints). Returns the parsed
// object, or { __error } with a ready-to-send message.
async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 200000) {
      req.destroy();
      return { __error: { status: 413, message: "Request too large." } };
    }
  }
  try {
    return JSON.parse(raw || "{}");
  } catch (e) {
    return { __error: { status: 400, message: "Invalid request." } };
  }
}

// Single place that calls the Anthropic Messages API. Returns { ok: true, text }
// or { ok: false, status, error }. Used by every /api endpoint so the key
// handling and error mapping stay in one place.
async function claudeComplete(apiKey, { maxTokens, prompt }) {
  let apiRes;
  try {
    apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (e) {
    console.error("Network error calling Anthropic:", e.message);
    return { ok: false, status: 502, error: "Could not reach Claude. Check your connection." };
  }

  if (!apiRes.ok) {
    let detail = "";
    try {
      const j = await apiRes.json();
      detail = (j && j.error && j.error.message) || "";
    } catch (e) {
      /* ignore */
    }
    console.error("Anthropic API error", apiRes.status, detail);
    if (apiRes.status === 401) {
      return { ok: false, status: 502, error: "The generation service key was rejected." };
    }
    if (apiRes.status === 429) {
      return { ok: false, status: 502, error: "Rate limit reached. Try again in a moment." };
    }
    return { ok: false, status: 502, error: "Claude is unavailable right now. Try again." };
  }

  let data;
  try {
    data = await apiRes.json();
  } catch (e) {
    return { ok: false, status: 502, error: "Claude returned an unreadable response." };
  }

  const text = (data.content || [])
    .filter((b) => b && b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return { ok: true, text };
}

// Best-effort JSON extraction from a model response (tolerates ``` fences and
// stray prose around the object). Returns the parsed object or null.
function extractJson(text) {
  let t = String(text || "").trim();
  t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}

/* ---------- POST /api/generate ---------- */

async function handleGenerate(req, res) {
  const body = await readJsonBody(req);
  if (body.__error) return sendJson(res, body.__error.status, { error: body.__error.message });

  const workflow = body.workflow;
  if (workflow !== "A" && workflow !== "B") {
    return sendJson(res, 400, { error: "Unknown workflow." });
  }

  const topic = body.topic;
  if (!topic || typeof topic.name !== "string" || !topic.name.trim()) {
    return sendJson(res, 400, { error: "A topic is required." });
  }
  if (workflow === "A") {
    if (!body.structure || typeof body.structure.content !== "string" || !body.structure.content.trim()) {
      return sendJson(res, 400, { error: "A structure is required." });
    }
  } else {
    if (typeof body.referenceHeadline !== "string" || !body.referenceHeadline.trim()) {
      return sendJson(res, 400, { error: "A reference headline is required." });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return sendJson(res, 503, {
      error:
        "ANTHROPIC_API_KEY is not configured on the server. Add it to a .env file and restart the server.",
    });
  }

  const normalizedTopic = {
    name: topic.name,
    description: topic.description,
    pains: Array.isArray(topic.pains) ? topic.pains : [],
  };

  const prompt = assemblePrompt(workflow, {
    structure: body.structure,
    topic: normalizedTopic,
    referenceHeadline: body.referenceHeadline,
    count: HEADLINE_COUNT,
  });

  const maxTokens = workflow === "A" ? HEADLINE_MAX_TOKENS : MAX_TOKENS;
  const result = await claudeComplete(apiKey, { maxTokens, prompt });
  if (!result.ok) return sendJson(res, result.status, { error: result.error });

  const text = result.text;
  if (!text) {
    return sendJson(res, 502, { error: "Claude returned no headlines. Try again." });
  }

  if (workflow !== "A") {
    return sendJson(res, 200, { headlines: parseHeadlines(text) });
  }

  // Workflow A is single-pass: the generator does all candidate generation,
  // rejection and comparison internally and returns the final headlines
  // directly. Only output hygiene here — dedupe, cap at HEADLINE_COUNT.
  const headlines = dedupeHeadlines(parseHeadlines(text)).slice(0, HEADLINE_COUNT);
  if (!headlines.length) {
    return sendJson(res, 502, { error: "Claude returned no headlines. Try again." });
  }
  sendJson(res, 200, { headlines });
}

// Minimal output hygiene: drop case-insensitive duplicates, keep order.
function dedupeHeadlines(list) {
  const seen = new Set();
  const out = [];
  for (const h of list) {
    const key = String(h).trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(String(h).trim());
  }
  return out;
}

/* ---------- POST /api/compliance ---------- */

async function handleCompliance(req, res) {
  const body = await readJsonBody(req);
  if (body.__error) return sendJson(res, body.__error.status, { error: body.__error.message });

  const action = body.action === "fix" ? "fix" : body.action === "check" ? "check" : null;
  if (!action) {
    return sendJson(res, 400, { error: "Unknown action." });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return sendJson(res, 400, { error: "Paste some copy to check." });
  }
  if (text.length > 20000) {
    return sendJson(res, 400, { error: "That's too long — keep it under 20,000 characters." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return sendJson(res, 503, {
      error:
        "ANTHROPIC_API_KEY is not configured on the server. Add it to a .env file and restart the server.",
    });
  }

  const prompt =
    action === "check"
      ? compliancePrompt(text)
      : complianceFixPrompt(text, Array.isArray(body.issues) ? body.issues : null);

  const result = await claudeComplete(apiKey, { maxTokens: COMPLIANCE_MAX_TOKENS, prompt });
  if (!result.ok) return sendJson(res, result.status, { error: result.error });

  const parsed = extractJson(result.text);
  if (!parsed) {
    return sendJson(res, 502, { error: "Claude returned an unreadable response. Try again." });
  }

  if (action === "check") {
    if (typeof parsed.overallRisk !== "string") {
      return sendJson(res, 502, { error: "Claude returned an incomplete assessment. Try again." });
    }
    return sendJson(res, 200, { analysis: parsed });
  }

  // fix
  if (typeof parsed.compliantText !== "string" || !parsed.compliantText.trim()) {
    return sendJson(res, 502, { error: "Claude returned an incomplete rewrite. Try again." });
  }
  return sendJson(res, 200, { result: parsed });
}

/* ---------- POST /api/scene ---------- */

// Two-stage Scene Generator, separate from headline generation. Stage 1 designs
// a structured scenario from the user's manual ingredient selections; stage 2
// writes the scene from that scenario. Regenerate modes reuse a prior scenario:
//   full / random          — stage 1 + stage 2
//   regen-scenario/-turn/-characters — stage 1 (constrained) + stage 2
//   regen-ending / regen-product     — stage 2 only, on the prior scenario+scene
const SCENE_REGEN_MODES = new Set([
  "full",
  "random",
  "regen-scenario",
  "regen-turn",
  "regen-characters",
  "regen-ending",
  "regen-product",
]);

// The stage-2 output is a labelled block (TITLE: / SETTING: / ... / SCENE: /
// CREATIVE LOGIC:). Locate each label at the start of a line, then take the
// text between one label and the next — position-based, so a multi-paragraph
// SCENE body survives intact.
function parseSceneResult(text) {
  const LABELS = [
    "TITLE",
    "SETTING",
    "CHARACTERS",
    "SCENARIO",
    "DRAMATIC TURN",
    "SCENE",
    "CREATIVE LOGIC",
  ];
  const src = String(text || "");
  const found = [];
  for (const lab of LABELS) {
    const re = new RegExp("^[ \\t>*#-]*" + lab.replace(/ /g, "[ \\t]+") + "[ \\t]*:", "im");
    const m = src.match(re);
    if (m) found.push({ lab, start: m.index, bodyStart: m.index + m[0].length });
  }
  found.sort((a, b) => a.start - b.start);
  const out = {};
  for (let k = 0; k < found.length; k++) {
    const end = k + 1 < found.length ? found[k + 1].start : src.length;
    out[found[k].lab] = src.slice(found[k].bodyStart, end).trim();
  }
  return {
    title: out["TITLE"] || "",
    setting: out["SETTING"] || "",
    characters: out["CHARACTERS"] || "",
    scenario: out["SCENARIO"] || "",
    dramaticTurn: out["DRAMATIC TURN"] || "",
    scene: out["SCENE"] || "",
    creativeLogic: out["CREATIVE LOGIC"] || "",
  };
}

async function handleScene(req, res) {
  const body = await readJsonBody(req);
  if (body.__error) return sendJson(res, body.__error.status, { error: body.__error.message });

  const mode = SCENE_REGEN_MODES.has(body.mode) ? body.mode : "full";
  const inputs = body.inputs && typeof body.inputs === "object" ? body.inputs : {};
  const prevSpec =
    body.scenarioSpec && typeof body.scenarioSpec === "object" ? body.scenarioSpec : null;
  const prevScene = typeof body.prevScene === "string" ? body.prevScene : "";
  const avoid = Array.isArray(body.avoid)
    ? body.avoid.filter((a) => typeof a === "string" && a.trim()).slice(0, 12)
    : [];

  const stage2Only = mode === "regen-ending" || mode === "regen-product";
  if (stage2Only && !prevSpec) {
    return sendJson(res, 400, { error: "That regenerate needs an existing scene. Generate one first." });
  }
  const regenTarget = mode === "regen-ending" ? "ending" : mode === "regen-product" ? "product" : null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return sendJson(res, 503, {
      error:
        "ANTHROPIC_API_KEY is not configured on the server. Add it to a .env file and restart the server.",
    });
  }

  // ---- Stage 1: scenario design (skipped for ending / product regenerates) ----
  let spec = prevSpec;
  if (!stage2Only) {
    const s1 = await claudeComplete(apiKey, {
      maxTokens: SCENARIO_MAX_TOKENS,
      prompt: scenarioDesignPrompt({ inputs, mode, prevSpec, avoid }),
    });
    if (!s1.ok) return sendJson(res, s1.status, { error: s1.error });
    const parsed = extractJson(s1.text);
    if (parsed && typeof parsed === "object" && parsed.scenario) {
      spec = parsed;
    } else if (s1.text && s1.text.trim()) {
      // JSON parse failed — degrade to a prose brief so stage 2 still runs.
      spec = Object.assign({}, prevSpec, {
        scenario: s1.text.trim(),
        length: inputs.length || (prevSpec && prevSpec.length) || "60 sec",
        creativeDirection: inputs.creativeDirection || "",
        _parseFallback: true,
      });
    } else {
      return sendJson(res, 502, { error: "Claude returned no scenario. Try again." });
    }
  }

  // ---- Stage 2: scene writing ----
  const s2 = await claudeComplete(apiKey, {
    maxTokens: SCENE_MAX_TOKENS,
    prompt: sceneWritePrompt({ spec, regenTarget, prevScene, avoid }),
  });
  if (!s2.ok) return sendJson(res, s2.status, { error: s2.error });
  if (!s2.text || !s2.text.trim()) {
    return sendJson(res, 502, { error: "Claude returned no scene. Try again." });
  }

  const result = parseSceneResult(s2.text);
  if (!result.scene) {
    // Format slip — hand back the raw text as the scene so nothing is lost.
    result.scene = s2.text.trim();
  }

  sendJson(res, 200, { scenario: spec, result });
}

/* ---------- static files ---------- */

function serveStatic(req, res) {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  const ext = path.extname(urlPath);
  if (!STATIC_TYPES[ext]) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  const base = path.basename(filePath);
  if (base.startsWith(".") || HIDDEN_FILES.has(base)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    // no-cache: browsers revalidate every load, so a redeployed seed-topics.js
    // (the canonical Topic library) reaches returning users immediately.
    res.writeHead(200, {
      "content-type": STATIC_TYPES[ext],
      "cache-control": "no-cache",
    });
    res.end(buf);
  });
}

/* ---------- server ---------- */

const server = http.createServer((req, res) => {
  const route = (req.url || "").split("?")[0];
  if (req.method === "POST" && route === "/api/generate") {
    handleGenerate(req, res).catch((e) => {
      console.error("Unexpected error in /api/generate:", e);
      if (!res.headersSent) sendJson(res, 500, { error: "Unexpected server error." });
    });
    return;
  }
  if (req.method === "POST" && route === "/api/compliance") {
    handleCompliance(req, res).catch((e) => {
      console.error("Unexpected error in /api/compliance:", e);
      if (!res.headersSent) sendJson(res, 500, { error: "Unexpected server error." });
    });
    return;
  }
  if (req.method === "POST" && route === "/api/scene") {
    handleScene(req, res).catch((e) => {
      console.error("Unexpected error in /api/scene:", e);
      if (!res.headersSent) sendJson(res, 500, { error: "Unexpected server error." });
    });
    return;
  }
  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }
  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, HOST, () => {
  console.log(`Headline Lab running at http://${DISPLAY_HOST}:${PORT} (listening on ${HOST}:${PORT})`);
  if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_API_KEY.trim()) {
    console.log(
      "WARNING: ANTHROPIC_API_KEY is not set — the library works, but Generate will return " +
        '"The generation service is not configured." Copy .env.example to .env and add your key.'
    );
  }
});
