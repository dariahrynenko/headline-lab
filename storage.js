/* Persistence layer.
 *
 * Structures  -> localStorage key "hl.structures", per-browser user data.
 * Topics      -> canonical shared library defined in seed-topics.js. NOT stored
 *                per-browser: every load returns the current seed-topics.js
 *                definitions, so updating that file and redeploying updates
 *                every user. Topics are read-only in the UI.
 *
 * Structure writes persist the whole array back. Callers mutate the array they
 * get from loadStructures(), then call saveStructures().
 *
 * Structure data survives page refresh and browser restart. It is per-browser
 * and per-device only — use Export / Import JSON to move it elsewhere.
 */

window.Store = (function () {
  const K_STRUCTURES = "hl.structures";
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

  /* ---------- Structures ---------- */

  function loadStructures() {
    return readArray(K_STRUCTURES) || [];
  }

  function saveStructures(list) {
    return writeArray(K_STRUCTURES, list);
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

  function exportAll() {
    return {
      app: "headline-lab",
      version: 1,
      exportedAt: new Date().toISOString(),
      structures: loadStructures(),
    };
  }

  /* Import affects the Structures library only. Topics are canonical shared data
   * from seed-topics.js and are never written from an import file.
   *   "merge"   - add structures with unseen ids, update ones with matching ids
   *   "replace" - overwrite the Structures library with the file's contents
   * Returns a summary object for the UI.
   */
  function importAll(data, mode) {
    if (!data || typeof data !== "object") throw new Error("File is not valid JSON.");
    const incomingStructures = Array.isArray(data.structures) ? data.structures : [];

    if (mode === "replace") {
      saveStructures(incomingStructures);
      return { mode, structures: incomingStructures.length };
    }

    // merge
    const structures = loadStructures();
    let sAdded = 0,
      sUpdated = 0;

    for (const inc of incomingStructures) {
      if (!inc || !inc.id) continue;
      const idx = structures.findIndex((x) => x.id === inc.id);
      if (idx === -1) {
        structures.push(inc);
        sAdded++;
      } else {
        structures[idx] = inc;
        sUpdated++;
      }
    }
    saveStructures(structures);
    return { mode: "merge", sAdded, sUpdated };
  }

  return {
    uid,
    now,
    loadStructures,
    saveStructures,
    loadTopics,
    exportAll,
    importAll,
  };
})();
