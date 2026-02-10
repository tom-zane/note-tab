import ColorThief from "colorthief";

/* =====================================================================
   STORAGE KEYS (LOCALSTORAGE — SMALL DATA ONLY)
   ===================================================================== */

const ACTIVE_WALLPAPER_KEY = "glass-active-wallpaper";
const WALLPAPER_DIM_KEY = "glass-wallpaper-dim";
const ACCENT_CACHE_KEY = "glass-wallpaper-accent";

/* =====================================================================
   INDEXED DB CONFIG (LARGE DATA)
   ===================================================================== */

const DB_NAME = "notetab-wallpapers";
const DB_VERSION = 1;
const STORE_NAME = "wallpapers";

/* =====================================================================
   DEFAULT WALLPAPER
   ===================================================================== */

// Built-in fallback wallpaper (never removable)
export const DEFAULT_WALLPAPER = {
  id: "default",
  name: "Default",
  dataUrl: "/assets/default-background.jpg",
};

/* =====================================================================
   INDEXED DB CORE
   ===================================================================== */

// Open (or create) IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/* =====================================================================
   WALLPAPER STORAGE (INDEXED DB)
   ===================================================================== */

// Load all wallpapers from IndexedDB
export async function loadWallpapers() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();

    req.onsuccess = () => {
      resolve([DEFAULT_WALLPAPER, ...req.result]);
    };

    req.onerror = () => {
      resolve([DEFAULT_WALLPAPER]);
    };
  });
}

// Save wallpaper (Blob-backed)
export async function saveWallpaper({ id, name, blob }) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({
      id,
      name,
      blob,
      createdAt: Date.now(),
    });

    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

// Delete wallpaper by id
export async function deleteWallpaper(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

// Get single wallpaper as object URL
export async function getWallpaperUrl(id) {
  if (id === "default") return DEFAULT_WALLPAPER.dataUrl;

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);

    req.onsuccess = () => {
      if (!req.result) return resolve(null);
      resolve(URL.createObjectURL(req.result.blob));
    };

    req.onerror = () => reject(null);
  });
}

/* =====================================================================
   ACTIVE WALLPAPER SELECTION
   ===================================================================== */

// Get currently selected wallpaper id
export function getActiveWallpaperId() {
  return localStorage.getItem(ACTIVE_WALLPAPER_KEY) || "default";
}

// Persist selected wallpaper id
export function setActiveWallpaperId(id) {
  localStorage.setItem(ACTIVE_WALLPAPER_KEY, id);
}

/* =====================================================================
   WALLPAPER DIM (GLASS OVERLAY CONTROL)
   ===================================================================== */

// Read wallpaper dim percentage (0–60)
export function getWallpaperDim() {
  const v = Number(localStorage.getItem(WALLPAPER_DIM_KEY));
  return Number.isFinite(v) ? v : 20;
}

// Persist wallpaper dim percentage
export function setWallpaperDim(value) {
  localStorage.setItem(WALLPAPER_DIM_KEY, value);
}

/* =====================================================================
   ACCENT COLOR CACHE
   ===================================================================== */

// Get cached accent color for a wallpaper
export function getCachedAccent(id) {
  try {
    return JSON.parse(localStorage.getItem(ACCENT_CACHE_KEY))?.[id] || null;
  } catch {
    return null;
  }
}

// Cache accent color for a wallpaper
export function setCachedAccent(id, color) {
  const map = JSON.parse(localStorage.getItem(ACCENT_CACHE_KEY)) || {};
  map[id] = color;
  localStorage.setItem(ACCENT_CACHE_KEY, JSON.stringify(map));
}

/* =====================================================================
   ACCENT COLOR EXTRACTION (GLASS SAFE)
   ===================================================================== */

// Get accent color (cached + softened)
export async function getWallpaperAccent(wallpaperId, imageUrl) {
  const cached = getCachedAccent(wallpaperId);
  if (cached) return cached;

  try {
    const color = await extractAndSoftenAccent(imageUrl);
    setCachedAccent(wallpaperId, color);
    return color;
  } catch {
    const fallback = "rgb(77, 208, 225)";
    setCachedAccent(wallpaperId, fallback);
    return fallback;
  }
}

/* =====================================================================
   INTERNAL COLOR UTILITIES
   ===================================================================== */

// Extract dominant color and soften for glass UI
function extractAndSoftenAccent(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (!imageUrl.startsWith("data:") && !imageUrl.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      try {
        const thief = new ColorThief();
        const raw = thief.getColor(img);
        const softened = softenColor(raw);
        resolve(`rgb(${softened.join(",")})`);
      } catch {
        reject();
      }
    };

    img.onerror = reject;
    img.src = imageUrl;
  });
}

// Blend extracted color with white for readability
function softenColor([r, g, b]) {
  const mix = 0.6;
  return [
    Math.round(r * mix + 255 * (1 - mix)),
    Math.round(g * mix + 255 * (1 - mix)),
    Math.round(b * mix + 255 * (1 - mix)),
  ];
}
