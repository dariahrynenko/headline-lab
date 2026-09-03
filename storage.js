/* Persistence layer — localStorage only, no backend.
 *
 * Keys:
 *   hl.structures  -> JSON array of Structure objects
 *   hl.topics      -> JSON array of Topic objects
 *
 * Every write persists the whole array back. Callers mutate the array they get
 * from load*(), then call save*(). Existing records are never touched unless the
 * caller changes them.
 *
 * Data survives page refresh and browser restart. It is per-browser and
 * per-device only — use Export / Import JSON to move it elsewhere.
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

  /* ---------- Topics ---------- */

  function loadTopics() {
    let list = readArray(K_TOPICS);
    if (list === null) {
      // First run: seed from seed-topics.js and persist once.
      const seeds = (window.SEED_TOPICS || []).map((t) => ({
        id: t.id || uid("topic"),
        name: t.name || "",
        description: t.description || "",
        pains: Array.isArray(t.pains) ? t.pains.slice() : [],
        seed: true,
        createdAt: now(),
        updatedAt: now(),
      }));
      writeArray(K_TOPICS, seeds);
      list = seeds;
    }
    return list;
  }

  function saveTopics(list) {
    return writeArray(K_TOPICS, list);
  }

  /* ---------- Export / Import ---------- */

  function exportAll() {
    return {
      app: "headline-lab",
      version: 1,
      exportedAt: new Date().toISOString(),
      structures: loadStructures(),
      topics: loadTopics(),
    };
  }

  /* Import modes:
   *   "merge"   - add records with unseen ids, update records with matching ids
   *   "replace" - overwrite both libraries with the file's contents
   * Returns a summary object for the UI.
   */
  function importAll(data, mode) {
    if (!data || typeof data !== "object") throw new Error("File is not valid JSON.");
    const incomingStructures = Array.isArray(data.structures) ? data.structures : [];
    const incomingTopics = Array.isArray(data.topics) ? data.topics : [];

    if (mode === "replace") {
      saveStructures(incomingStructures);
      saveTopics(incomingTopics);
      return {
        mode,
        structures: incomingStructures.length,
        topics: incomingTopics.length,
      };
    }

    // merge
    const structures = loadStructures();
    const topics = loadTopics();
    let sAdded = 0,
      sUpdated = 0,
      tAdded = 0,
      tUpdated = 0;

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
    for (const inc of incomingTopics) {
      if (!inc || !inc.id) continue;
      const idx = topics.findIndex((x) => x.id === inc.id);
      if (idx === -1) {
        topics.push(inc);
        tAdded++;
      } else {
        topics[idx] = inc;
        tUpdated++;
      }
    }
    saveStructures(structures);
    saveTopics(topics);
    return { mode: "merge", sAdded, sUpdated, tAdded, tUpdated };
  }

  return {
    uid,
    now,
    loadStructures,
    saveStructures,
    loadTopics,
    saveTopics,
    exportAll,
    importAll,
  };
})();
