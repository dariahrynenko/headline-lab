/* Persistence layer.
 *
 * Structures -> canonical shared library defined in seed-structures.js.
 * Scenes     -> canonical shared library defined in seed-scenes.js (empty for now).
 * Topics     -> canonical shared library defined in seed-topics.js.
 *
 * None is stored per-browser: every load returns the current seed file's
 * definitions, so updating a seed file and redeploying updates every user.
 * All are read-only in the UI. Any legacy per-browser copy from older
 * versions is purged on load. Export produces a snapshot; there is nothing to
 * import into.
 */

window.Store = (function () {
  const K_STRUCTURES = "hl.structures";
  const K_SCENES = "hl.scenes";
  const K_TOPICS = "hl.topics";

  function readArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      console.error(`Store: could not parse ${key}`, e);
      return null;
    }
  }

  function writeArray(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
      return true;
    } catch (e) {
      console.error(`Store: could not write ${key}`, e);
      alert(
        "Could not save to local storage. Your browser may be full or in private mode. " +
          "Export your data to be safe."
      );
      return false;
    }
  }

  function now() {
    return Date.now();
  }

  function uid(prefix) {
    if (window.crypto && crypto.randomUUID) return prefix + "-" + crypto.randomUUID();
    return prefix + "-" + now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ---------- Structures (canonical, read-only) ---------- */

  // Structures come straight from seed-structures.js on every call — never from
  // localStorage. `title` and `content` are derived from pattern/example so the
  // existing list, detail, and generator UI keep working unchanged.
  function loadStructures() {
    try {
      localStorage.removeItem(K_STRUCTURES);
    } catch (e) {
      /* ignore */
    }
    return (window.SEED_STRUCTURES || []).map((s) => normalizeStructure(s, "structure"));
  }

  /* ---------- Scenes (canonical, read-only) ---------- */

  // Scene structures come straight from seed-scenes.js on every call — same
  // model and normalization as loadStructures(). Empty until canonical scene
  // structures are added to seed-scenes.js.
  function loadScenes() {
    try {
      localStorage.removeItem(K_SCENES);
    } catch (e) {
      /* ignore */
    }
    return (window.SEED_SCENES || []).map((s) => normalizeStructure(s, "scene"));
  }

  // Shared normalization for headline structures and scene structures: derives
  // `title` / `content` from pattern / example (each overridable) so the
  // existing list, detail, and generator UI keep working unchanged.
  function normalizeStructure(s, idPrefix) {
    const pattern = s.pattern || "";
    const example = s.example || "";
    return {
      id: s.id || uid(idPrefix),
      type: s.type || (idPrefix === "scene" ? "scene" : "headline"),
      pattern,
      example,
      title: s.title || pattern,
      content: s.content || "Pattern:\n" + pattern + "\n\nWinning example:\n" + example,
      seed: true,
    };
  }

  /* ---------- Topics (canonical, read-only) ---------- */

  // Topics come straight from seed-topics.js on every call — never from
  // localStorage. This guarantees every user sees the same set and that a
  // redeployed seed-topics.js reaches everyone. Any legacy per-browser copy
  // written by older versions is purged here.
  function loadTopics() {
    try {
      localStorage.removeItem(K_TOPICS);
    } catch (e) {
      /* ignore */
    }
    return (window.SEED_TOPICS || []).map((t) => ({
      id: t.id || uid("topic"),
      name: t.name || "",
      description: t.description || "",
      pains: Array.isArray(t.pains) ? t.pains.slice() : [],
      reframe: t.reframe || "",
      seed: true,
    }));
  }

  /* ---------- Export / Import ---------- */

  // A read-only snapshot of the canonical libraries.
  function exportAll() {
    return {
      app: "headline-lab",
      version: 1,
      exportedAt: new Date().toISOString(),
      structures: loadStructures(),
      scenes: loadScenes(),
      topics: loadTopics(),
    };
  }

  // Structures, Scenes and Topics are canonical shared data. Nothing to import.
  function importAll() {
    throw new Error(
      "The Structure, Scene and Topic libraries are shared and read-only — there is nothing to import."
    );
  }

  return {
    uid,
    now,
    loadStructures,
    loadScenes,
    loadTopics,
    exportAll,
    importAll,
  };
})();
