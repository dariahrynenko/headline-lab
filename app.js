/* Headline Lab — app logic.
 *
 * Stores two local libraries (Structures, Topics) in localStorage and drives the
 * Generator, which calls the local /api/generate proxy to produce headlines.
 * The API key lives only on the server — never in this file or the browser.
 */

(function () {
  "use strict";

  /* ---------------- state ---------------- */

  const state = {
    tab: "generator",
    structures: [], // canonical headline structures
    topics: [],

    structuresSearch: "",
    topicsSearch: "",
    selectedStructureId: null,
    selectedTopicId: null,
    structureRefTopicId: "", // topic shown beside an open structure

    wb: {
      mode: "A", // "A" = write with structure, "B" = adapt reference headline
      structureId: "",
      topicId: "",
      referenceHeadline: "",
      results: null, // string[] — generated headlines
      error: null, // error message string, or null
      loading: false,
    },

    cc: {
      input: "", // current textarea value (the original — never overwritten)
      analyzedText: "", // frozen copy of `input` at the moment Check was run
      analysis: null, // { overallRisk, summary, issues[], needsEvidence, evidenceNote }
      compliant: null, // { compliantText, changes[] }
      error: null,
      loading: null, // null | "check" | "fix"
    },

    sg: {
      inputs: {
        topic: "",
        setting: "RANDOM",
        characterA: "RANDOM",
        characterB: "RANDOM",
        socialDynamic: "RANDOM",
        scenario: "",
        scenarioMode: "ai", // "ai" | "manual"
        dramaticTurn: "RANDOM",
        escalationPattern: "RANDOM",
        productPlacement: "RANDOM",
        length: "60 sec",
        creativeDirection: "",
      },
      scenario: null, // last ScenarioSpec from the server
      result: null, // last { title, setting, characters, scenario, dramaticTurn, scene, creativeLogic }
      history: [], // [{title, angle}] — session anti-repeat list
      error: null,
      loading: false,
    },
  };

  function reloadLibraries() {
    state.structures = Store.loadStructures();
    state.topics = Store.loadTopics();
  }

  /* ---------------- helpers ---------------- */

  const view = document.getElementById("view");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function snippet(s, n) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function byUpdatedDesc(a, b) {
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  }

  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // Fallback for older / non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (_) {
        ok = false;
      }
      document.body.removeChild(ta);
      return ok;
    }
  }

  function structureById(id) {
    return state.structures.find((s) => s.id === id) || null;
  }
  function topicById(id) {
    return state.topics.find((t) => t.id === id) || null;
  }

  /* ---------------- render dispatch ---------------- */

  function render() {
    document.querySelectorAll("#tabs .tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === state.tab);
    });
    if (state.tab === "structures") renderStructures();
    else if (state.tab === "topics") renderTopics();
    else if (state.tab === "compliance") renderCompliance();
    else if (state.tab === "scene-gen") renderSceneGen();
    else renderGenerator();
  }

  function copyIconSVG() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="12" height="12" rx="2"/>' +
      '<path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
    );
  }

  /* ---------------- Structures tab ---------------- */

  function renderStructures() {
    const dataset = state.structures;

    const q = state.structuresSearch.trim().toLowerCase();
    const items = dataset
      .filter(
        (s) =>
          !q ||
          (s.title || "").toLowerCase().includes(q) ||
          (s.content || "").toLowerCase().includes(q)
      )
      .sort(byUpdatedDesc);

    const selected = dataset.find((s) => s.id === state.selectedStructureId) || null;

    const emptyText = dataset.length ? "No structures match your search." : "No structures.";
    const placeholderText = "Select a structure to read it.";

    view.innerHTML = `
      <div class="split">
        <div>
          <div class="list-head">
            <h1>Structures</h1>
          </div>
          <input class="search" id="structures-search" type="search"
                 placeholder="Search structures…" value="${esc(state.structuresSearch)}" />
          <div class="card-list">
            ${
              items.length
                ? items
                    .map(
                      (s) => `
              <button class="card ${s.id === state.selectedStructureId ? "selected" : ""}"
                      data-action="open-structure" data-id="${esc(s.id)}">
                <div class="card-title">${esc(s.title || "(untitled)")}</div>
                <div class="card-snippet">${esc(snippet(s.example || s.content, 140))}</div>
              </button>`
                    )
                    .join("")
                : `<div class="empty">${emptyText}</div>`
            }
          </div>
        </div>
        <div class="panel">
          ${selected ? structureDetailHTML(selected) : `<div class="empty">${placeholderText}</div>`}
        </div>
      </div>
    `;

    const search = document.getElementById("structures-search");
    search.addEventListener("input", () => {
      state.structuresSearch = search.value;
      renderStructures();
      document.getElementById("structures-search").focus();
    });

    const refSel = document.getElementById("structure-ref-topic");
    if (refSel) {
      refSel.addEventListener("change", () => {
        state.structureRefTopicId = refSel.value;
        renderStructures();
      });
    }
  }

  function structureDetailHTML(s) {
    const refTopic = topicById(state.structureRefTopicId);
    return `
      <div class="detail-head">
        <h1>${esc(s.title || "(untitled)")}</h1>
      </div>
      <div class="detail-meta">Shared structure library · read-only</div>
      <div class="detail-body">${esc(s.content || "")}</div>

      <div class="ref-box">
        <div class="field-label">Topic reference (working aid)</div>
        <div class="select-wrap">
          <select id="structure-ref-topic">
            <option value="">— none —</option>
            ${state.topics
              .slice()
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
              .map(
                (t) =>
                  `<option value="${esc(t.id)}" ${
                    t.id === state.structureRefTopicId ? "selected" : ""
                  }>${esc(t.name || "(unnamed)")}</option>`
              )
              .join("")}
          </select>
        </div>
        ${
          refTopic
            ? `<div class="ref-content">
                 <div class="field-label" style="margin-top:0">Description</div>
                 <div>${esc(refTopic.description || "—")}</div>
                 <div class="field-label">Pains</div>
                 ${painsListHTML(refTopic.pains)}
               </div>`
            : ""
        }
      </div>
    `;
  }

  function painsListHTML(pains) {
    if (!Array.isArray(pains) || !pains.length) return `<div class="muted">—</div>`;
    return `<ul class="pains-list">${pains.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
  }

  /* ---------------- Topics tab ---------------- */

  function renderTopics() {
    const q = state.topicsSearch.trim().toLowerCase();
    const items = state.topics
      .filter((t) => {
        if (!q) return true;
        return (
          (t.name || "").toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q) ||
          (Array.isArray(t.pains) ? t.pains.join(" ") : "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    const selected = topicById(state.selectedTopicId);

    view.innerHTML = `
      <div class="split">
        <div>
          <div class="list-head">
            <h1>Topics</h1>
          </div>
          <input class="search" id="topics-search" type="search"
                 placeholder="Search topics…" value="${esc(state.topicsSearch)}" />
          <div class="card-list">
            ${
              items.length
                ? items
                    .map(
                      (t) => `
              <button class="card ${t.id === state.selectedTopicId ? "selected" : ""}"
                      data-action="open-topic" data-id="${esc(t.id)}">
                <div class="card-title">
                  ${esc(t.name || "(unnamed)")}
                  ${t.seed ? `<span class="tag">starter</span>` : ""}
                </div>
                <div class="card-snippet">${esc(snippet(t.description, 140))}</div>
              </button>`
                    )
                    .join("")
                : `<div class="empty">${
                    state.topics.length ? "No topics match your search." : "No topics yet."
                  }</div>`
            }
          </div>
        </div>
        <div class="panel">
          ${selected ? topicDetailHTML(selected) : `<div class="empty">Select a topic to read it.</div>`}
        </div>
      </div>
    `;

    const search = document.getElementById("topics-search");
    search.addEventListener("input", () => {
      state.topicsSearch = search.value;
      renderTopics();
      document.getElementById("topics-search").focus();
    });
  }

  function topicDetailHTML(t) {
    return `
      <div class="detail-head">
        <h1>${esc(t.name || "(unnamed)")}</h1>
      </div>
      <div class="detail-meta">Shared topic library · read-only</div>
      <div class="field-label">Description</div>
      <div>${esc(t.description || "—")}</div>
      <div class="field-label">Pains</div>
      ${painsListHTML(t.pains)}
    `;
  }

  /* ---------------- Generator ---------------- */

  const HEADLINE_COUNT = 10;

  function topicOptions(selectedId) {
    return (
      `<option value="">Select a topic…</option>` +
      state.topics
        .slice()
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .map(
          (t) =>
            `<option value="${esc(t.id)}" ${t.id === selectedId ? "selected" : ""}>${esc(
              t.name || "(unnamed)"
            )}</option>`
        )
        .join("")
    );
  }

  // The Generator's structure picker shows the canonical headline structures.
  function wbSelectedStructure() {
    return state.structures.find((s) => s.id === state.wb.structureId) || null;
  }

  function structureOptions(selectedId, placeholder) {
    return (
      `<option value="">${esc(placeholder)}</option>` +
      state.structures
        .map(
          (s) =>
            `<option value="${esc(s.id)}" ${s.id === selectedId ? "selected" : ""}>${esc(
              s.title || "(untitled)"
            )}</option>`
        )
        .join("")
    );
  }

  function canGenerate() {
    if (!topicById(state.wb.topicId)) return false;
    if (state.wb.mode === "A") return !!wbSelectedStructure();
    return state.wb.referenceHeadline.trim().length > 0;
  }

  function generateHint() {
    if (state.wb.mode === "B") return "Enter a reference headline and select a topic.";
    return "Select a structure and a topic.";
  }

  function clearResults() {
    state.wb.results = null;
    state.wb.error = null;
    state.wb.loading = false;
  }

  function renderGenerator() {
    const m = state.wb.mode;
    view.innerHTML = `
      <header class="page-hero">
        <h1>Headline Lab</h1>
        <p class="page-sub">Your personal marketing headline laboratory. Pick a structure and a topic — generate headlines that follow the structure.</p>
      </header>

      <div class="segmented">
        <button data-action="wb-mode" data-mode="A" class="seg ${m === "A" ? "active" : ""}">Write with Structure</button>
        <button data-action="wb-mode" data-mode="B" class="seg ${m === "B" ? "active" : ""}">Adapt Reference Headline</button>
      </div>

      ${m === "A" ? generatorAHTML() : generatorBHTML()}

      <div class="gen-cta">
        <button class="btn-generate" data-action="wb-generate" ${canGenerate() ? "" : "disabled"}>
          Generate headlines
        </button>
        <span class="cta-hint" id="wb-generate-hint">${canGenerate() ? "" : esc(generateHint())}</span>
      </div>

      <section class="results">
        <div class="results-bar">
          <h2>Results</h2>
          <div id="results-bar-actions" class="results-bar-actions"></div>
        </div>
        <div id="wb-results"></div>
      </section>
    `;

    bindWorkbenchInputs();
    updateWorkbenchPreviews();
    renderResults();
  }

  function generatorAHTML() {
    return `
      <div class="gen-grid">
        <section class="gen-col">
          <span class="field-label">Structure</span>
          <div class="select-wrap">
            <select id="wb-structure">${structureOptions(state.wb.structureId, "Select a structure…")}</select>
          </div>
          <div id="wb-structure-preview" class="preview"></div>
        </section>
        <section class="gen-col">
          <span class="field-label">Topic</span>
          <div class="select-wrap">
            <select id="wb-topic">${topicOptions(state.wb.topicId)}</select>
          </div>
          <div id="wb-topic-preview" class="preview"></div>
        </section>
      </div>
    `;
  }

  function generatorBHTML() {
    return `
      <div class="gen-grid">
        <section class="gen-col">
          <span class="field-label">Reference headline</span>
          <input type="text" id="wb-ref" class="text-input"
            placeholder="Paste a headline whose structure you want to reuse…"
            value="${esc(state.wb.referenceHeadline)}" />
          <div class="preview preview-muted">Its underlying structure and rhetorical move are transferred to the topic. The wording itself is not reused.</div>
        </section>
        <section class="gen-col">
          <span class="field-label">Topic</span>
          <div class="select-wrap">
            <select id="wb-topic">${topicOptions(state.wb.topicId)}</select>
          </div>
          <div id="wb-topic-preview" class="preview"></div>
        </section>
      </div>
    `;
  }

  function bindWorkbenchInputs() {
    const sSel = document.getElementById("wb-structure");
    if (sSel)
      sSel.addEventListener("change", () => {
        state.wb.structureId = sSel.value;
        clearResults();
        renderGenerator();
      });

    const tSel = document.getElementById("wb-topic");
    if (tSel)
      tSel.addEventListener("change", () => {
        state.wb.topicId = tSel.value;
        clearResults();
        renderGenerator();
      });

    const ref = document.getElementById("wb-ref");
    if (ref)
      ref.addEventListener("input", () => {
        state.wb.referenceHeadline = ref.value;
        clearResults();
        const btn = document.querySelector('[data-action="wb-generate"]');
        const hint = document.getElementById("wb-generate-hint");
        if (btn) btn.disabled = !canGenerate();
        if (hint) hint.textContent = canGenerate() ? "" : generateHint();
        renderResults();
      });
  }

  function structurePreviewHTML(s) {
    if (!s) return `<span class="muted">No structure selected.</span>`;
    return `<strong>${esc(s.title || "(untitled)")}</strong>${esc(snippet(s.content, 400))}`;
  }

  function topicPreviewHTML(t) {
    if (!t) return `<span class="muted">No topic selected.</span>`;
    return `
      <strong>${esc(t.name || "(unnamed)")}</strong>
      <div style="margin-top:4px">${esc(snippet(t.description, 300))}</div>
      <div class="field-label">Pains</div>
      ${painsListHTML(t.pains)}
    `;
  }

  function updateWorkbenchPreviews() {
    const topic = topicById(state.wb.topicId);
    const topicPrev = document.getElementById("wb-topic-preview");
    if (topicPrev) topicPrev.innerHTML = topicPreviewHTML(topic);

    if (state.wb.mode === "A") {
      const structPrev = document.getElementById("wb-structure-preview");
      if (structPrev) structPrev.innerHTML = structurePreviewHTML(wbSelectedStructure());
    }
  }

  function renderResults() {
    const box = document.getElementById("wb-results");
    const barActions = document.getElementById("results-bar-actions");
    if (!box) return;
    const wb = state.wb;

    if (barActions) barActions.innerHTML = "";

    if (wb.loading) {
      box.innerHTML = `
        <div class="results-loading">
          <span class="spinner"></span>
          <span>Generating headlines…</span>
        </div>`;
      return;
    }
    if (wb.error) {
      box.innerHTML = `<div class="results-error">${esc(wb.error)}</div>`;
      return;
    }
    if (!wb.results || !wb.results.length) {
      box.innerHTML = `<div class="results-empty">Your generated headlines will appear here.</div>`;
      return;
    }

    if (barActions) {
      barActions.innerHTML = `
        <span class="results-count">${wb.results.length}</span>
        <button class="btn btn-ghost btn-sm" data-action="wb-copy-text">Copy all</button>
        <button class="btn btn-ghost btn-sm" data-action="wb-regenerate">Regenerate</button>
      `;
    }

    box.innerHTML = `
      <ol class="headline-list">
        ${wb.results
          .map(
            (h, i) => `
          <li class="headline-row" style="animation-delay:${Math.min(i * 40, 400)}ms">
            <span class="headline-index">${String(i + 1).padStart(2, "0")}</span>
            <span class="headline-text">${esc(h)}</span>
            <button class="headline-copy" data-action="wb-copy-one" data-index="${i}" aria-label="Copy headline" title="Copy">${copyIconSVG()}</button>
          </li>`
          )
          .join("")}
      </ol>
    `;
  }

  async function generate() {
    if (!canGenerate() || state.wb.loading) return;
    const wb = state.wb;

    wb.loading = true;
    wb.error = null;
    wb.results = null;

    const btn = document.querySelector('[data-action="wb-generate"]');
    if (btn) btn.disabled = true;
    renderResults();

    const topic = topicById(wb.topicId);
    const payload = {
      workflow: wb.mode,
      topic: { name: topic.name, description: topic.description, pains: topic.pains },
    };
    if (wb.mode === "A") {
      const s = wbSelectedStructure();
      payload.structure = { title: s.title, content: s.content };
    } else {
      payload.referenceHeadline = wb.referenceHeadline.trim();
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        wb.error = data.error || "Generation failed. Try again.";
      } else if (Array.isArray(data.headlines) && data.headlines.length) {
        wb.results = data.headlines;
      } else {
        wb.error = "Claude returned no headlines. Try again.";
      }
    } catch (e) {
      wb.error = "Generation service is not running. Start the server and try again.";
    } finally {
      wb.loading = false;
      const b = document.querySelector('[data-action="wb-generate"]');
      if (b) b.disabled = !canGenerate();
      renderResults();
    }
  }

  /* ---------------- Scene Generator ---------------- */

  // A large curated library of common, recognizable real-life situations. The
  // user casts a believable moment — the model finds the communication problem
  // inside the ordinary version of it, it does not invent a movie.
  const SG_SCENARIOS = {
    "WORK / OFFICE": [
      "Making small talk before a meeting starts",
      "Waiting for a meeting to start, seated next to a senior coworker",
      "Standing at the office coffee machine when a VP walks in",
      "In the office kitchen while a colleague makes coffee",
      "Passing a senior executive in the hallway",
      "Sharing an elevator with two coworkers",
      "Grabbing lunch with a coworker you don't know well",
      "First day at a new job, being walked around to meet the team",
      "A one-on-one with your manager",
      "Cornered by your manager for a 'quick update'",
      "In a performance review",
      "Asking your manager for a raise",
      "Introducing yourself at a work networking event",
      "Trying to work the room at an industry conference",
      "After-work drinks with the team",
      "A team happy hour where you know almost no one",
      "Sitting next to someone before an all-hands",
      "Meeting someone from another department for the first time",
      "Giving a short update to leadership",
      "Being introduced to a client",
      "Standing near the CEO at a company event",
      "Catching a senior colleague in the parking garage",
      "Small talk with the person at the next desk",
      "Waiting by the printer with a coworker",
    ],
    "SOCIAL": [
      "At a house party where you only know the host",
      "At a dinner party, seated next to a stranger",
      "At a friend's birthday, surrounded by their friends",
      "At a wedding reception, seated with people you've never met",
      "Standing at the bar waiting for a drink",
      "Waiting in line at a coffee shop",
      "Seated next to a stranger at a restaurant",
      "Being introduced to a friend's friend",
      "A mutual friend introduces you to someone",
      "Trying to join a group that's already mid-conversation",
      "Running into an acquaintance you half-remember",
      "Chatting with a neighbor you rarely see",
      "At a rooftop party, drink in hand",
      "On the sidelines of a kid's birthday party",
      "At a book club with people you've just met",
      "At a housewarming, waiting for someone you know to arrive",
      "Small talk with a friend's partner",
      "At a barbecue, meeting the other guests",
      "Stuck talking to one person for too long at a party",
    ],
    "TRAVEL": [
      "Sitting next to a stranger at the airport gate",
      "Next to someone on a plane",
      "In the hotel lobby at check-in",
      "Sharing a hotel elevator with another guest",
      "At the hotel bar after a conference",
      "Waiting out a delayed flight",
      "In the back of a rideshare",
      "In a taxi with a talkative driver",
      "On a train, seated across from a stranger",
      "Standing on the train platform",
      "At the conference hotel breakfast",
      "In the airport lounge",
      "Waiting at baggage claim",
      "Sharing a shuttle to the airport",
    ],
    "DATING / ROMANTIC": [
      "A first date at a bar",
      "Waiting at the bar before your date arrives",
      "Sitting across from someone on a first date",
      "Meeting someone through a friend at a party",
      "Meeting a dating-app match for the first time",
      "Walking someone to their car after a date",
      "Talking to someone you're attracted to at a party",
      "Introduced to someone single at a wedding",
      "Making conversation with a date who keeps giving short answers",
      "The post-date debrief with a friend",
    ],
    "EVERYDAY": [
      "On the treadmill next to a regular you see every morning",
      "At the gym reception desk",
      "Sharing the elevator in your apartment building",
      "Passing a neighbor in the apartment hallway",
      "In the grocery store checkout line",
      "At the dog park while the dogs play",
      "In a waiting room",
      "In the barber's chair",
      "At the hair salon",
      "At the nail salon",
      "In the doctor's waiting room",
      "In your building's lobby, waiting for the elevator",
      "Ordering at the counter of a busy coffee shop",
      "Browsing next to someone in a bookstore",
      "At the pharmacy counter",
      "Waiting for a table at a restaurant",
    ],
    "FAMILY / PERSONAL": [
      "At family dinner",
      "Talking to a sibling in the kitchen",
      "Visiting your parents for the weekend",
      "One-on-one with a parent",
      "At a friend's house, meeting their family",
      "Chatting with a neighbor over the fence",
      "School pickup, small talk with another parent",
      "At a relative's birthday gathering",
      "Catching up with a cousin you rarely see",
      "Helping a parent with something and trying to talk at the same time",
    ],
  };

  const SG_SETTINGS = [
    "Office kitchen / break room", "Coffee machine", "Meeting room before others arrive",
    "Office hallway", "Open-plan office", "Company all-hands", "Elevator with coworkers",
    "Parking garage", "Conference floor", "Interview waiting room", "Networking event",
    "After-work bar", "Restaurant", "Restaurant bar", "Coffee shop", "Cafe counter queue",
    "Hotel lobby", "Hotel bar", "Hotel elevator", "Airport gate", "Airport lounge",
    "Airplane cabin", "Back of a rideshare", "Taxi", "Train car", "Train platform",
    "House party kitchen", "Dinner table", "Backyard barbecue", "Rooftop party",
    "Wedding reception", "Kid's birthday party", "Gym floor", "Gym reception",
    "Apartment building elevator", "Apartment hallway", "Building lobby", "Dog park",
    "Supermarket checkout", "Pharmacy counter", "Doctor's waiting room", "Barber shop",
    "Hair salon", "Nail salon", "Bookstore", "School gate", "Parents' kitchen",
  ];
  const SG_ROLES = [
    "Coworker", "Coworker from another team", "Senior colleague", "Junior teammate",
    "Team lead", "Manager", "Direct report", "Skip-level manager", "Department head",
    "VP", "CEO", "Founder", "Board member", "New hire", "Contractor",
    "Recruiter", "Interviewer", "Job candidate", "Client", "Vendor", "Customer",
    "Service worker", "Barista", "Bartender", "Hairdresser", "Personal trainer",
    "Networking contact", "Old friend", "Friend of a friend", "Acquaintance",
    "Neighbor", "Date", "Someone you're attracted to", "Partner / spouse",
    "Parent", "Adult child", "Sibling", "Cousin", "Fellow parent", "Seatmate",
    "Person ahead of you in line", "Stranger",
  ];
  const SG_DYNAMICS = [
    "junior employee → senior employee", "senior → junior", "coworker ↔ coworker",
    "manager → direct report", "direct report → manager", "founder → employee",
    "employee → founder", "you → someone more senior", "candidate → interviewer",
    "customer → service worker", "service worker → customer", "client → professional",
    "professional → client", "friend → friend's friend", "neighbor ↔ neighbor",
    "adult child → parent", "sibling ↔ sibling", "stranger ↔ stranger",
    "passenger ↔ passenger", "guest ↔ guest at an event",
    "you → someone you're attracted to",
  ];
  const SG_TURNS = [
    "The conversation just dies", "The other person checks their phone",
    "They give a one-word answer and you keep going", "Someone walks away",
    "They get pulled away by someone else", "You run out of things to say",
    "A short, honest answer lands after too many words",
    "Someone finishes your sentence for you", "Someone else gets the credit",
    "A third party overhears", "A third party comments quietly afterward",
    "You realize afterward what you should have said",
    "A quiet, unspoken brush-off", "The other person gives you a way out and you take it",
    "They remember you did this last time", "You catch your own reflection",
    "You realize you keep repeating the same lines", "Failed second attempt",
    "An unexpected, ordinary bit of honesty",
  ];
  const SG_ESCALATIONS = [
    "The conversation slowly dies", "Polite → quietly desperate",
    "One-word answers, and you keep pushing", "Talking too much, filling every silence",
    "Over-explaining, one qualifier at a time", "Autopilot question loop",
    "Asking questions nobody wants to answer", "Circling back to the same topic",
    "Trying too hard to be interesting", "Answering a question that wasn't the point",
    "Rehearsing your next line instead of listening",
    "The other person is politely checking out", "Repeated failed attempts",
    "Good intention → increasingly awkward execution",
  ];
  const SG_PLACEMENTS = [
    "Personal confession (they had the same problem)",
    "Third-party recommendation (someone who overheard)",
    "Proof through behaviour (they show the better line, then say why they can)",
    "Named as the fix for the exact thing that just happened",
    "Quiet discovery (person searches for it alone, nobody sells anything)",
    "Shown, not spoken (a training app already open on someone's phone)",
  ];
  const SG_LENGTHS = ["30 sec", "45 sec", "60 sec", "90 sec"];

  function sgDefaultInputs() {
    return {
      topic: "",
      setting: "RANDOM",
      characterA: "RANDOM",
      characterB: "RANDOM",
      socialDynamic: "RANDOM",
      scenarioMode: "pick", // "pick" (from library) | "manual" (write it) | "ai" (let generator decide)
      scenarioPick: "RANDOM", // selected library situation
      scenario: "", // free-text situation
      dramaticTurn: "RANDOM",
      escalationPattern: "RANDOM",
      productPlacement: "RANDOM",
      length: "60 sec",
      creativeDirection: "",
    };
  }

  function sgSelect(id, list, selected, randomLabel) {
    const opts = list
      .map((v) => `<option value="${esc(v)}" ${v === selected ? "selected" : ""}>${esc(v)}</option>`)
      .join("");
    const isRandom = !selected || selected === "RANDOM";
    return `<div class="select-wrap"><select id="${id}">${opts}<option value="RANDOM" ${
      isRandom ? "selected" : ""
    }>${esc(randomLabel || "Random / AI decides")}</option></select></div>`;
  }

  function sgGroupedSelect(id, groups, selected) {
    const isRandom = !selected || selected === "RANDOM";
    const body = Object.keys(groups)
      .map(
        (g) =>
          `<optgroup label="${esc(g)}">${groups[g]
            .map(
              (v) =>
                `<option value="${esc(v)}" ${v === selected ? "selected" : ""}>${esc(v)}</option>`
            )
            .join("")}</optgroup>`
      )
      .join("");
    return `<div class="select-wrap"><select id="${id}"><option value="RANDOM" ${
      isRandom ? "selected" : ""
    }>Let the generator pick a common situation</option>${body}</select></div>`;
  }

  function sgTopicSelect(selected) {
    return `<div class="select-wrap"><select id="sg-topic"><option value="">Select a topic…</option>${state.topics
      .slice()
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .map(
        (t) =>
          `<option value="${esc(t.name)}" ${t.name === selected ? "selected" : ""}>${esc(t.name)}</option>`
      )
      .join("")}</select></div>`;
  }

  function sgCanGenerate() {
    return !!state.sg.inputs.topic && !state.sg.loading;
  }

  function renderSceneGen() {
    const sg = state.sg;
    const i = sg.inputs;
    view.innerHTML = `
      <header class="page-hero">
        <h1>Scene Generator</h1>
        <p class="page-sub">Cast a believable, everyday situation. The model finds the communication problem inside it and writes the scene — familiar situation first, creative interpretation second. Nothing here uses the 28 headline structures.</p>
      </header>

      <div class="sg-grid">
        <div class="sg-field"><span class="field-label">Topic</span>${sgTopicSelect(i.topic)}</div>
        <div class="sg-field"><span class="field-label">Setting</span>${sgSelect("sg-setting", SG_SETTINGS, i.setting)}</div>
        <div class="sg-field"><span class="field-label">Character A · Person 1 (fails)</span>${sgSelect("sg-charA", SG_ROLES, i.characterA)}</div>
        <div class="sg-field"><span class="field-label">Character B · Person 2 (notices)</span>${sgSelect("sg-charB", SG_ROLES, i.characterB)}</div>
        <div class="sg-field"><span class="field-label">Social dynamic</span>${sgSelect("sg-dynamic", SG_DYNAMICS, i.socialDynamic)}</div>
        <div class="sg-field"><span class="field-label">Dramatic turn</span>${sgSelect("sg-turn", SG_TURNS, i.dramaticTurn)}</div>
        <div class="sg-field"><span class="field-label">Escalation pattern</span>${sgSelect("sg-escalation", SG_ESCALATIONS, i.escalationPattern)}</div>
        <div class="sg-field"><span class="field-label">Product placement</span>${sgSelect("sg-placement", SG_PLACEMENTS, i.productPlacement, "Let the generator decide")}</div>
        <div class="sg-field"><span class="field-label">Length</span>${sgSelect("sg-length", SG_LENGTHS, i.length, "Let the generator decide")}</div>
      </div>

      <div class="sg-field" style="margin-top:14px">
        <span class="field-label">Situation</span>
        <div class="segmented" style="align-self:flex-start;margin-bottom:8px">
          <button class="seg ${i.scenarioMode === "pick" ? "active" : ""}" data-action="sg-scenario-mode" data-mode="pick">Pick a common situation</button>
          <button class="seg ${i.scenarioMode === "manual" ? "active" : ""}" data-action="sg-scenario-mode" data-mode="manual">Write my own</button>
          <button class="seg ${i.scenarioMode === "ai" ? "active" : ""}" data-action="sg-scenario-mode" data-mode="ai">Let the generator decide</button>
        </div>
        ${
          i.scenarioMode === "pick"
            ? sgGroupedSelect("sg-scenario-pick", SG_SCENARIOS, i.scenarioPick)
            : ""
        }
        <textarea id="sg-scenario" class="cc-textarea" rows="3" placeholder="Describe an ordinary situation that could happen tomorrow — what is happening, not the dialogue. e.g. &quot;Waiting for a meeting to start next to a senior coworker and trying to make conversation.&quot;" ${
          i.scenarioMode === "manual" ? "" : "hidden"
        }>${esc(i.scenario)}</textarea>
      </div>

      <div class="sg-field" style="margin-top:14px">
        <span class="field-label">Creative direction (optional)</span>
        <input type="text" id="sg-direction" class="text-input" placeholder="e.g. &quot;uncomfortable but funny&quot; · &quot;less dialogue, more physical storytelling&quot; · &quot;make the rejection brutal but realistic&quot;" value="${esc(i.creativeDirection)}" />
      </div>

      <div class="gen-cta">
        <button class="btn-generate" data-action="sg-generate" ${sgCanGenerate() ? "" : "disabled"}>Design &amp; write the scene</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-random" ${sg.loading ? "disabled" : ""}>Completely random</button>
        <span class="cta-hint">${sg.inputs.topic ? "" : "Pick a topic to start."}</span>
      </div>

      <section class="results">
        <div class="results-bar"><h2>Scene</h2><div id="sg-regen-bar" class="results-bar-actions"></div></div>
        <div id="sg-results"></div>
      </section>
    `;
    bindSceneGenInputs();
    renderSceneResults();
  }

  function bindSceneGenInputs() {
    const sg = state.sg;
    const bind = (id, key, ev) => {
      const el = document.getElementById(id);
      if (el)
        el.addEventListener(ev || "change", () => {
          sg.inputs[key] = el.value;
          if (key === "topic") {
            const btn = document.querySelector('[data-action="sg-generate"]');
            if (btn) btn.disabled = !sgCanGenerate();
            const hint = document.querySelector(".gen-cta .cta-hint");
            if (hint) hint.textContent = sg.inputs.topic ? "" : "Pick a topic to start.";
          }
        });
    };
    bind("sg-topic", "topic");
    bind("sg-setting", "setting");
    bind("sg-charA", "characterA");
    bind("sg-charB", "characterB");
    bind("sg-dynamic", "socialDynamic");
    bind("sg-turn", "dramaticTurn");
    bind("sg-escalation", "escalationPattern");
    bind("sg-placement", "productPlacement");
    bind("sg-length", "length");
    bind("sg-scenario-pick", "scenarioPick");
    bind("sg-scenario", "scenario", "input");
    bind("sg-direction", "creativeDirection", "input");
  }

  function sgLine(label, value) {
    if (!value) return "";
    return `<div class="sg-meta-row"><span class="sg-meta-label">${esc(label)}</span><span>${esc(value)}</span></div>`;
  }

  function renderSceneResults() {
    const box = document.getElementById("sg-results");
    const bar = document.getElementById("sg-regen-bar");
    if (!box) return;
    const sg = state.sg;

    if (bar) bar.innerHTML = "";

    if (sg.loading) {
      box.innerHTML = `<div class="results-loading"><span class="spinner"></span><span>Designing the situation, then writing the scene…</span></div>`;
      return;
    }
    if (sg.error) {
      box.innerHTML = `<div class="results-error">${esc(sg.error)}</div>`;
      return;
    }
    if (!sg.result) {
      box.innerHTML = `<div class="results-empty">Your scene will appear here.</div>`;
      return;
    }

    const r = sg.result;
    if (bar) {
      bar.innerHTML = `
        <button class="btn btn-ghost btn-sm" data-action="sg-copy">Copy scene</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-regen" data-mode="regen-scenario">New scenario</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-regen" data-mode="regen-turn">New turn</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-regen" data-mode="regen-characters">New characters</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-regen" data-mode="regen-ending">New ending</button>
        <button class="btn btn-ghost btn-sm" data-action="sg-regen" data-mode="regen-product">New product beat</button>
      `;
    }

    box.innerHTML = `
      ${r.title ? `<h3 class="sg-title">${esc(r.title)}</h3>` : ""}
      <div class="sg-meta">
        ${sgLine("Setting", r.setting)}
        ${sgLine("Characters", r.characters)}
        ${sgLine("Scenario", r.scenario)}
        ${sgLine("Dramatic turn", r.dramaticTurn)}
      </div>
      <div class="detail-body sg-scene">${esc(r.scene)}</div>
      ${
        r.creativeLogic
          ? `<details class="sg-logic"><summary>Creative logic</summary><div>${esc(r.creativeLogic)}</div></details>`
          : ""
      }
    `;
  }

  async function generateScene(mode) {
    const sg = state.sg;
    if (sg.loading) return;

    const needsPrev = mode !== "full" && mode !== "random";
    if (needsPrev && !sg.scenario) {
      toast("Generate a scene first.");
      return;
    }
    if (mode !== "random" && !sg.inputs.topic) {
      toast("Pick a topic first.");
      return;
    }
    if (mode === "full" && sg.inputs.scenarioMode === "manual" && !sg.inputs.scenario.trim()) {
      toast("Write the situation, or switch to picking or letting the generator decide.");
      return;
    }

    const prevSceneText = (sg.result && sg.result.scene) || "";

    sg.loading = true;
    sg.error = null;
    if (mode === "full" || mode === "random") sg.result = null;
    renderSceneResults();
    const gbtn = document.querySelector('[data-action="sg-generate"]');
    if (gbtn) gbtn.disabled = true;

    let inputs = sg.inputs;
    if (mode === "random") {
      inputs = Object.assign(sgDefaultInputs(), {
        topic: sg.inputs.topic || "RANDOM",
        scenarioMode: "ai",
        scenarioPick: "RANDOM",
        scenario: "",
        productPlacement: "RANDOM",
        length: sg.inputs.length || "60 sec",
        creativeDirection: sg.inputs.creativeDirection || "",
      });
    }

    // Collapse the 3-way situation control to what the server reads: a concrete
    // situation string (from the library or free text) or nothing.
    const chosenSituation =
      inputs.scenarioMode === "pick" && inputs.scenarioPick && inputs.scenarioPick !== "RANDOM"
        ? inputs.scenarioPick
        : inputs.scenarioMode === "manual" && inputs.scenario.trim()
        ? inputs.scenario.trim()
        : "";
    inputs = Object.assign({}, inputs, {
      scenario: chosenSituation,
      scenarioMode: chosenSituation ? "given" : "ai",
    });

    const avoid = sg.history
      .slice(-8)
      .map((h) => `${h.title} — ${h.angle}`)
      .filter(Boolean);

    const payload = {
      mode,
      inputs,
      scenarioSpec: sg.scenario || null,
      prevScene: prevSceneText,
      avoid,
    };

    try {
      const res = await fetch("/api/scene", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        sg.error = data.error || "Scene generation failed. Try again.";
      } else if (data.result && data.result.scene) {
        if (data.scenario) sg.scenario = data.scenario;
        sg.result = data.result;
        const angle =
          (sg.scenario && sg.scenario.conflictSource) ||
          (data.result.scenario || "").slice(0, 90);
        sg.history.push({ title: data.result.title || "untitled", angle });
        sg.history = sg.history.slice(-12);
      } else {
        sg.error = "Claude returned no scene. Try again.";
      }
    } catch (e) {
      sg.error = "Generation service is not running. Start the server and try again.";
    } finally {
      sg.loading = false;
      const b = document.querySelector('[data-action="sg-generate"]');
      if (b) b.disabled = !sgCanGenerate();
      renderSceneResults();
    }
  }

  /* ---------------- Compliance Checker ---------------- */

  const RISK_CLASS = { LOW: "low", MEDIUM: "med", HIGH: "high" };

  function riskCls(r) {
    return RISK_CLASS[String(r || "").toUpperCase()] || "med";
  }

  function higherRisk(a, b) {
    const order = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    return (order[a] || 0) >= (order[b] || 0) ? a : b;
  }

  // Wrap each issue's exact phrase in the analysed text with a coloured <mark>.
  // Works on plain-text index ranges so <mark> tags never nest or break.
  function highlightIssues(text, issues) {
    const ranges = [];
    for (const iss of issues || []) {
      const needle = String(iss.text || "").trim();
      if (needle.length < 2) continue;
      const hay = text.toLowerCase();
      const n = needle.toLowerCase();
      let from = 0;
      let idx;
      while ((idx = hay.indexOf(n, from)) !== -1) {
        ranges.push({ start: idx, end: idx + needle.length, risk: String(iss.risk || "MEDIUM").toUpperCase() });
        from = idx + needle.length;
      }
    }
    if (!ranges.length) return esc(text);
    ranges.sort((a, b) => a.start - b.start || b.end - a.end);
    const merged = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r.start < last.end) {
        last.end = Math.max(last.end, r.end);
        last.risk = higherRisk(last.risk, r.risk);
      } else {
        merged.push({ ...r });
      }
    }
    let out = "";
    let cur = 0;
    for (const r of merged) {
      out += esc(text.slice(cur, r.start));
      out += `<mark class="cc-mark ${riskCls(r.risk)}">${esc(text.slice(r.start, r.end))}</mark>`;
      cur = r.end;
    }
    out += esc(text.slice(cur));
    return out;
  }

  function renderCompliance() {
    const cc = state.cc;
    view.innerHTML = `
      <header class="page-hero">
        <h1>Compliance Checker</h1>
        <p class="page-sub">Risk assessment for marketing copy — headlines, scenes, ad copy. This is a LOW / MEDIUM / HIGH risk signal, not a determination that something is legal or illegal.</p>
      </header>

      <span class="field-label">Copy to check</span>
      <textarea id="cc-input" class="cc-textarea" placeholder="Paste your headline, scene, or ad copy…">${esc(cc.input)}</textarea>

      <div class="cc-cta">
        <button class="btn-generate" data-action="cc-check" ${cc.input.trim() ? "" : "disabled"}>Check compliance</button>
        <span class="cc-disclaimer">Nothing you paste is stored. Your original text is never overwritten.</span>
      </div>

      <section class="cc-results" id="cc-results"></section>
    `;

    const ta = document.getElementById("cc-input");
    ta.addEventListener("input", () => {
      state.cc.input = ta.value;
      const btn = document.querySelector('[data-action="cc-check"]');
      if (btn) btn.disabled = !ta.value.trim();
    });

    renderComplianceResults();
  }

  function renderComplianceResults() {
    const box = document.getElementById("cc-results");
    if (!box) return;
    const cc = state.cc;

    if (cc.loading === "check") {
      box.innerHTML = `<div class="results-loading"><span class="spinner"></span><span>Assessing compliance risk…</span></div>`;
      return;
    }
    if (cc.error) {
      box.innerHTML = `<div class="results-error">${esc(cc.error)}</div>`;
      return;
    }
    if (!cc.analysis) {
      box.innerHTML = "";
      return;
    }

    const a = cc.analysis;
    const issues = Array.isArray(a.issues) ? a.issues : [];
    const overall = String(a.overallRisk || "LOW").toUpperCase();

    const issuesHTML = issues.length
      ? issues
          .map((iss) => {
            const rc = riskCls(iss.risk);
            return `
        <div class="cc-issue ${rc}">
          <div class="cc-issue-head">
            <span class="cc-issue-phrase">“${esc(iss.text || "")}”</span>
            <span class="cc-tag">${esc(iss.category || "OTHER")}</span>
            <span class="cc-tag risk-${rc}">${esc(String(iss.risk || "").toUpperCase())} risk</span>
          </div>
          <div class="cc-issue-line"><b>Why it's risky:</b> ${esc(iss.reason || "")}</div>
          <div class="cc-issue-line"><b>Make it safer:</b> ${esc(iss.suggestion || "")}</div>
        </div>`;
          })
          .join("")
      : `<div class="cc-note">No phrases were flagged against the compliance ruleset.</div>`;

    const evidenceHTML =
      a.needsEvidence && String(a.evidenceNote || "").trim()
        ? `<div class="cc-note"><b>Evidence needed:</b> ${esc(a.evidenceNote)}</div>`
        : "";

    let compliantHTML = "";
    if (cc.loading === "fix") {
      compliantHTML = `<div class="results-loading"><span class="spinner"></span><span>Writing a compliant version…</span></div>`;
    } else if (cc.compliant) {
      const changes = Array.isArray(cc.compliant.changes) ? cc.compliant.changes : [];
      compliantHTML = `
        <div class="cc-compare">
          <div>
            <span class="field-label">Original</span>
            <div class="detail-body">${esc(cc.analyzedText)}</div>
          </div>
          <div>
            <span class="field-label">Compliant version</span>
            <div class="detail-body">${esc(cc.compliant.compliantText)}</div>
            <div class="cc-cta"><button class="btn btn-sm" data-action="cc-copy">Copy compliant version</button></div>
          </div>
        </div>
        ${
          changes.length
            ? `<span class="field-label" style="display:block;margin-top:16px">What changed</span>
               <div class="cc-changes">
                 ${changes
                   .map(
                     (ch) => `
                   <div class="cc-change">
                     <span class="from">${esc(ch.original || "")}</span> → <span class="to">${esc(ch.replacement || "")}</span>
                     <div class="why">${esc(ch.reason || "")}</div>
                   </div>`
                   )
                   .join("")}
               </div>`
            : ""
        }`;
    } else {
      compliantHTML = `<div class="cc-cta"><button class="btn btn-primary" data-action="cc-fix">Make compliant</button></div>`;
    }

    box.innerHTML = `
      <div class="cc-riskbar">
        <span class="cc-risk ${riskCls(overall)}">${esc(overall)} risk</span>
      </div>
      <p class="cc-summary">${esc(a.summary || "")}</p>

      <span class="field-label" style="display:block;margin-top:14px">Your copy — flagged phrases highlighted</span>
      <div class="detail-body">${highlightIssues(cc.analyzedText, issues)}</div>

      <span class="field-label" style="display:block;margin-top:16px">Issues (${issues.length})</span>
      <div class="cc-issues">${issuesHTML}</div>
      ${evidenceHTML}
      <div class="cc-note">Risk assessment only — not a determination that this copy is legal or illegal, and not legal advice.</div>

      <span class="field-label" style="display:block;margin-top:20px">Compliant rewrite</span>
      ${compliantHTML}
    `;
  }

  async function runComplianceCheck() {
    const cc = state.cc;
    const text = cc.input.trim();
    if (!text || cc.loading) return;
    cc.loading = "check";
    cc.error = null;
    cc.analysis = null;
    cc.compliant = null;
    cc.analyzedText = text;
    const btn = document.querySelector('[data-action="cc-check"]');
    if (btn) btn.disabled = true;
    renderComplianceResults();

    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "check", text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) cc.error = data.error || "Check failed. Try again.";
      else if (data.analysis) cc.analysis = data.analysis;
      else cc.error = "Claude returned an incomplete assessment. Try again.";
    } catch (e) {
      cc.error = "Compliance service is not running. Start the server and try again.";
    } finally {
      cc.loading = null;
      const b = document.querySelector('[data-action="cc-check"]');
      if (b) b.disabled = !cc.input.trim();
      renderComplianceResults();
    }
  }

  async function runComplianceFix() {
    const cc = state.cc;
    if (!cc.analysis || !cc.analyzedText || cc.loading) return;
    cc.loading = "fix";
    cc.error = null;
    renderComplianceResults();

    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "fix",
          text: cc.analyzedText,
          issues: Array.isArray(cc.analysis.issues) ? cc.analysis.issues : [],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) cc.error = data.error || "Rewrite failed. Try again.";
      else if (data.result && data.result.compliantText) cc.compliant = data.result;
      else cc.error = "Claude returned an incomplete rewrite. Try again.";
    } catch (e) {
      cc.error = "Compliance service is not running. Start the server and try again.";
    } finally {
      cc.loading = null;
      renderComplianceResults();
    }
  }

  /* ---------------- modal / forms ---------------- */

  const overlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  let modalSaveHandler = null;

  function openModal(title, bodyHTML, onSave) {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHTML;
    modalSaveHandler = onSave;
    overlay.hidden = false;
    const first = modalBody.querySelector("input, textarea");
    if (first) first.focus();
  }

  function closeModal() {
    overlay.hidden = true;
    modalBody.innerHTML = "";
    modalSaveHandler = null;
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.getElementById("modal-save").addEventListener("click", () => {
    if (modalSaveHandler) modalSaveHandler();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });

  /* ---------------- export / import ---------------- */

  function exportJSON() {
    const data = Store.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `headline-lab-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try {
        data = JSON.parse(reader.result);
      } catch (e) {
        toast("That file is not valid JSON.");
        return;
      }
      const mode = confirm(
        "Import Structures:\n\nOK = MERGE (add new structures, update ones with matching ids)\n" +
          "Cancel = REPLACE (overwrite the Structures library with the file)"
      )
        ? "merge"
        : "replace";
      try {
        const res = Store.importAll(data, mode);
        reloadLibraries();
        render();
        if (res.mode === "replace") {
          toast(`Replaced: ${res.structures} structures.`);
        } else {
          toast(`Merged: +${res.sAdded} / ~${res.sUpdated} structures.`);
        }
      } catch (e) {
        toast("Import failed: " + e.message);
      }
    };
    reader.readAsText(file);
  }

  /* ---------------- events ---------------- */

  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    state.tab = btn.dataset.tab;
    render();
  });

  view.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const id = el.dataset.id;
    switch (el.dataset.action) {
      case "open-structure":
        state.selectedStructureId = id;
        renderStructures();
        break;

      case "open-topic":
        state.selectedTopicId = id;
        renderTopics();
        break;

      case "wb-mode":
        if (state.wb.mode !== el.dataset.mode) {
          state.wb.mode = el.dataset.mode;
          clearResults();
        }
        renderGenerator();
        break;
      case "wb-generate":
      case "wb-regenerate":
        generate();
        break;
      case "wb-copy-text":
        (async () => {
          const ok = await copyText((state.wb.results || []).join("\n"));
          toast(ok ? "All headlines copied." : "Copy failed — select the text manually.");
        })();
        break;
      case "wb-copy-one": {
        const h = (state.wb.results || [])[Number(el.dataset.index)];
        if (h != null) {
          (async () => {
            const ok = await copyText(h);
            toast(ok ? "Headline copied." : "Copy failed.");
          })();
        }
        break;
      }

      case "sg-scenario-mode": {
        const d = el.dataset.mode;
        const m = d === "pick" || d === "manual" ? d : "ai";
        if (state.sg.inputs.scenarioMode !== m) {
          state.sg.inputs.scenarioMode = m;
          renderSceneGen();
        }
        break;
      }
      case "sg-generate":
        generateScene("full");
        break;
      case "sg-random":
        generateScene("random");
        break;
      case "sg-regen":
        generateScene(el.dataset.mode || "regen-scenario");
        break;
      case "sg-copy":
        (async () => {
          const r = state.sg.result;
          if (!r || !r.scene) return;
          const ok = await copyText(r.scene);
          toast(ok ? "Scene copied." : "Copy failed — select the text manually.");
        })();
        break;

      case "cc-check":
        runComplianceCheck();
        break;
      case "cc-fix":
        runComplianceFix();
        break;
      case "cc-copy":
        (async () => {
          const t = state.cc.compliant && state.cc.compliant.compliantText;
          if (!t) return;
          const ok = await copyText(t);
          toast(ok ? "Compliant version copied." : "Copy failed — select the text manually.");
        })();
        break;
    }
  });

  document.getElementById("btn-export").addEventListener("click", exportJSON);
  document.getElementById("btn-import").addEventListener("click", () => {
    document.getElementById("file-import").click();
  });
  document.getElementById("file-import").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) importJSON(file);
    e.target.value = "";
  });

  /* ---------------- boot ---------------- */

  reloadLibraries();
  render();
})();
