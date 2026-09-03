/* Hardcoded canonical Scene structure library.
 *
 * Empty for now — no scene structures have been defined yet.
 *
 * Shared, read-only data. Loaded by storage.js on every call (never from
 * localStorage), exactly like seed-structures.js. When canonical scene
 * structures are added, each entry follows the same shape as a headline
 * structure:
 *
 *   { id: "seed-scene-01", pattern: "…", example: "…" }
 *
 * storage.js derives `title` and `content` from pattern/example and sets
 * `seed: true`, so the existing Structures list/detail UI renders scenes with
 * no further architecture changes.
 */
window.SEED_SCENES = [];
