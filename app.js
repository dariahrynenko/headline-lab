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
    structures: [],
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
      results: null, // string[] of generated headlines, or null
      error: null, // error message string, or null
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
    const q = state.structuresSearch.trim().toLowerCase();
    const items = state.structures
      .filter(
        (s) =>
          !q ||
          (s.title || "").toLowerCase().includes(q) ||
          (s.content || "").toLowerCase().includes(q)
      )
      .sort(byUpdatedDesc);

    const selected = structureById(state.selectedStructureId);

    view.innerHTML = `
      <div class="split">
        <div>
          <div class="list-head">
            <h1>Structures</h1>
            <button class="btn btn-primary btn-sm" data-action="add-structure">Add Structure</button>
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
                <div class="card-sub">Updated ${esc(fmtDate(s.updatedAt))}</div>
                <div class="card-snippet">${esc(snippet(s.content, 140))}</div>
              </button>`
                    )
                    .join("")
                : `<div class="empty">${
                    state.structures.length
                      ? "No structures match your search."
                      : "No structures yet. Add your first framework."
                  }</div>`
            }
          </div>
        </div>
        <div class="panel">
          ${selected ? structureDetailHTML(selected) : `<div class="empty">Select a structure to read it, or add a new one.</div>`}
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
        <div class="detail-actions">
          <button class="btn btn-sm" data-action="edit-structure" data-id="${esc(s.id)}">Edit</button>
          <button class="btn btn-sm btn-danger" data-action="delete-structure" data-id="${esc(s.id)}">Delete</button>
        </div>
      </div>
      <div class="detail-meta">
        Created ${esc(fmtDate(s.createdAt))} · Updated ${esc(fmtDate(s.updatedAt))}
      </div>
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

  function structureOptions(selectedId, placeholder) {
    return (
      `<option value="">${esc(placeholder)}</option>` +
      state.structures
        .slice()
        .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
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
    if (state.wb.mode === "A") return !!structureById(state.wb.structureId);
    return state.wb.referenceHeadline.trim().length > 0;
  }

  function generateHint() {
    return state.wb.mode === "A"
      ? "Select a structure and a topic."
      : "Enter a reference headline and select a topic.";
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
      if (structPrev) structPrev.innerHTML = structurePreviewHTML(structureById(state.wb.structureId));
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
      const s = structureById(wb.structureId);
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

  function structureForm(existing) {
    return `
      <div class="form-row">
        <label for="f-title">Title</label>
        <input type="text" id="f-title" value="${esc(existing ? existing.title : "")}" />
      </div>
      <div class="form-row">
        <label for="f-content">Structure / framework</label>
        <textarea id="f-content" rows="12">${esc(existing ? existing.content : "")}</textarea>
        <div class="hint">The framework itself — its steps, form, sequence, rules.</div>
      </div>
    `;
  }

  function openStructureForm(existing) {
    openModal(existing ? "Edit Structure" : "Add Structure", structureForm(existing), () => {
      const title = document.getElementById("f-title").value.trim();
      const content = document.getElementById("f-content").value;
      if (!title) {
        toast("Title is required.");
        document.getElementById("f-title").focus();
        return;
      }
      const list = Store.loadStructures();
      if (existing) {
        const idx = list.findIndex((s) => s.id === existing.id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], title, content, updatedAt: Store.now() };
        }
      } else {
        const rec = {
          id: Store.uid("structure"),
          title,
          content,
          createdAt: Store.now(),
          updatedAt: Store.now(),
        };
        list.push(rec);
        state.selectedStructureId = rec.id;
      }
      Store.saveStructures(list);
      reloadLibraries();
      closeModal();
      toast(existing ? "Structure updated." : "Structure added.");
      render();
    });
  }

  /* ---------------- deletes ---------------- */

  function deleteStructure(id) {
    const s = structureById(id);
    if (!s) return;
    if (!confirm(`Delete structure "${s.title || "(untitled)"}"? This cannot be undone.`)) return;
    const list = Store.loadStructures().filter((x) => x.id !== id);
    Store.saveStructures(list);
    if (state.selectedStructureId === id) state.selectedStructureId = null;
    if (state.wb.structureId === id) {
      state.wb.structureId = "";
      clearResults();
    }
    reloadLibraries();
    toast("Structure deleted.");
    render();
  }

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
      case "add-structure":
        openStructureForm(null);
        break;
      case "open-structure":
        state.selectedStructureId = id;
        renderStructures();
        break;
      case "edit-structure":
        openStructureForm(structureById(id));
        break;
      case "delete-structure":
        deleteStructure(id);
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
