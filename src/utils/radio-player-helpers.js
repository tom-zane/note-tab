
import * as jdenticon from "jdenticon";



// Constants
const HABITS_KEY = "offline-user-listening-habits";
const DB_NAME = "radio-cache";
const STORE = "tracks";
const THUMB_STORE = "thumbs";

const MANUAL_KEY = "radio-manual-downloads";

//=============== CACHE MANAGEMENT BASED ON LISTENING HABITS ===========================
// IndexedDB helpers for offline caching of radio tracks based on listening habits
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedTrack(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
  });
}

export async function cacheTrack(id, blob) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(blob, id);
}

export async function deleteTrack(id) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
}

// ========================================
export function generateFallbackThumb(id) {
  const svg = jdenticon.toSvg(id, 500);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


//? User Downloads ============================================
export function loadManualDownloads() {
  try {
    return JSON.parse(localStorage.getItem(MANUAL_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveManualDownloads(data) {
  localStorage.setItem(MANUAL_KEY, JSON.stringify(data));
}

//? cache clear
export async function clearRadioCache() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase("radio-cache");
    req.onsuccess = () => resolve();
    req.onerror = () => reject();
  });
}

/* ===================== THUMB CACHE ===================== */

export async function getCachedThumb(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(THUMB_STORE, "readonly");
    const req = tx.objectStore(THUMB_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
  });
}

export async function cacheThumb(id, blob) {
  const db = await openDB();
  const tx = db.transaction(THUMB_STORE, "readwrite");
  tx.objectStore(THUMB_STORE).put(blob, id);
}

export async function preloadThumbnails(stations) {
  for (const s of stations) {
    if (!s.thumb) continue;

    const cached = await getCachedThumb(s.id);
    if (cached) continue;

    console.log("[THUMB] downloading", s.id);

    try {
      const res = await fetch(s.thumb);
      const blob = await res.blob();
      await cacheThumb(s.id, blob);
    } catch {
      console.warn("[THUMB] failed", s.id);
    }
  }
}

// ===================================================================================

export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
// ===================================================================================

/**
 * song_name-genre.mp3
 * → { title: "Song Name", genre: "genre" }
 */
export function parseTrackMeta(filename = "") {
  const base = filename.replace(/\.mp3$/i, "");
  const [rawName, rawGenre = "unknown"] = base.split("-");

  return {
    title: toTitleCase(rawName.replace(/_/g, " ")),
    genre: rawGenre.toLowerCase(),
  };
}
// ===================================================================================
// ===================================================================================

export function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
// ===================================================================================
// ===================================================================================

export function parseNameAndGenre(filename = "") {
  const base = filename.replace(/\.mp3$/i, "");
  const [rawName, rawGenre = "unknown"] = base.split("-");
  return {
    name: toCamelCase(rawName.replace(/_/g, " ")),
    genre: rawGenre.toLowerCase(),
  };
}
// ===================================================================================
// ===================================================================================

export function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY)) || {};
  } catch {
    return {};
  }
}
// ===================================================================================
// ===================================================================================

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}
// ===================================================================================
export function getTopFiveFromHabits() {
  const habits = loadHabits();

  return Object.entries(habits)
    .sort((a, b) => b[1].totalMs - a[1].totalMs)
    .slice(0, 5)
    .map(([id]) => id);
}
// ===================================================================================

export async function enforceOfflineCache(stations) {
  const topFive = getTopFiveFromHabits();
  const manualDownloads = loadManualDownloads();

  for (const s of stations) {
    const cached = await getCachedTrack(s.id);

    if (topFive.includes(s.id)) {
      if (!cached) {
        console.log("[CACHE] downloading", s.id);
        const res = await fetch(s.url);
        const blob = await res.blob();
        await cacheTrack(s.id, blob);
      }
    } else {
      if (cached && !manualDownloads[s.id] && !topFive.includes(s.id)) {
        console.log("[CACHE] evicting", s.id);
        await deleteTrack(s.id);
      }
    }
  }
}

// ===================================================================================

export function commitListening(id, startedAt) {
  if (!id || !startedAt) return;

  const delta = Date.now() - startedAt;
  if (delta <= 0) return;

  const habits = loadHabits();

  habits[id] ??= { totalMs: 0, lastPlayed: 0 };
  habits[id].totalMs += delta;
  habits[id].lastPlayed = Date.now();

  saveHabits(habits);

  console.log("[HABITS]", id, `+${Math.round(delta / 1000)}s`, `total=${Math.round(habits[id].totalMs / 1000)}s`);
}
