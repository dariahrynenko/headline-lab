/* Headline Lab — local proxy server.
 *
 * Serves the static app AND exposes one endpoint, POST /api/generate, which is
 * the only thing that talks to the Anthropic API. The API key lives here in a
 * server-side environment variable and is never sent to the browser.
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
const { assemblePrompt } = require("./prompts");

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
const MAX_TOKENS = 4000;
const HEADLINE_COUNT = 10;

const STATIC_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};
const HIDDEN_FILES = new Set(["server.js", "prompts.js", "package.json", "package-lock.json"]);

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

/* ---------- POST /api/generate ---------- */

async function handleGenerate(req, res) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 100000) {
      sendJson(res, 413, { error: "Request too large." });
      req.destroy();
      return;
    }
  }

  let body;
  try {
    body = JSON.parse(raw || "{}");
  } catch (e) {
    return sendJson(res, 400, { error: "Invalid request." });
  }

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

  const prompt = assemblePrompt(workflow, {
    structure: body.structure,
    topic: {
      name: topic.name,
      description: topic.description,
      pains: Array.isArray(topic.pains) ? topic.pains : [],
    },
    referenceHeadline: body.referenceHeadline,
    count: HEADLINE_COUNT,
  });

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
        max_tokens: MAX_TOKENS,
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (e) {
    console.error("Network error calling Anthropic:", e.message);
    return sendJson(res, 502, { error: "Could not reach Claude. Check your connection." });
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
      return sendJson(res, 502, { error: "The generation service key was rejected." });
    }
    if (apiRes.status === 429) {
      return sendJson(res, 502, { error: "Rate limit reached. Try again in a moment." });
    }
    return sendJson(res, 502, { error: "Claude is unavailable right now. Try again." });
  }

  let data;
  try {
    data = await apiRes.json();
  } catch (e) {
    return sendJson(res, 502, { error: "Claude returned an unreadable response." });
  }

  const text = (data.content || [])
    .filter((b) => b && b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  if (!text) {
    return sendJson(res, 502, { error: "Claude returned no headlines. Try again." });
  }

  sendJson(res, 200, { headlines: parseHeadlines(text) });
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
    res.writeHead(200, { "content-type": STATIC_TYPES[ext] });
    res.end(buf);
  });
}

/* ---------- server ---------- */

const server = http.createServer((req, res) => {
  if (req.method === "POST" && (req.url || "").split("?")[0] === "/api/generate") {
    handleGenerate(req, res).catch((e) => {
      console.error("Unexpected error in /api/generate:", e);
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
