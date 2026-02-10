import { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";

// icons
import { IoLogoWhatsapp, IoDiamondOutline } from "react-icons/io5";
import { FiX, FiSave, FiDownload, FiUpload, FiCheck, FiLoader } from "react-icons/fi";
import { FaTelegram } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import { MdEmail } from "react-icons/md";

// Contexts
import { useSettings } from "../../contexts/SettingsContext";
import { useNotes } from "../../contexts/NotesContext";
import { useLinks } from "../../contexts/LinksContext";
import { useRadio } from "../../contexts/RadioContext";

// Wallpaper helpers (IndexedDB-backed)
import {
  DEFAULT_WALLPAPER,
  loadWallpapers,
  saveWallpaper,
  deleteWallpaper as deleteWallpaperFromStore,
  getActiveWallpaperId,
  setActiveWallpaperId,
  getWallpaperDim,
  setWallpaperDim,
  getWallpaperUrl,
  getWallpaperAccent,
} from "../../utils/wallpaper-helpers";

// Radio helpers
import {
  getCachedTrack,
  cacheTrack,
  deleteTrack,
  loadManualDownloads,
  saveManualDownloads,
  clearRadioCache,
  generateFallbackThumb,
} from "../../utils/radio-player-helpers";

/* ===========================================================================
   SettingsModal - DROP-IN
   =========================================================================== */

export default function SettingsModal({ onClose, openPomodoroModal }) {
  /* -------------------------
     Contexts / Radio
     ------------------------- */
  const { settings, updateSettings, themes, fonts } = useSettings();
  const { notes, setNotes, setActiveNoteId, isSyncing, lastSyncTime } = useNotes();
  const { links, setLinks } = useLinks();
  const radio = useRadio();
  const { stations, addStation, deleteStation } = radio;

  /* -------------------------
     UI State
     ------------------------- */
  const [isStationListOpen, setIsStationListOpen] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const [tempSettings, setTempSettings] = useState(settings);
  const [password, setPassword] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  /* -------------------------
     Radio downloads state
     ------------------------- */
  const [manualDownloads, setManualDownloads] = useState(() => loadManualDownloads());
  const [downloadProgress, setDownloadProgress] = useState({});

  /* -------------------------
     Wallpaper state (async)
     ------------------------- */
  const [wallpapers, setWallpapers] = useState([DEFAULT_WALLPAPER]);
  const [wallpaperUrls, setWallpaperUrls] = useState({}); // { id: objectUrl }
  const [activeWallpaperId, setActiveWallpaperState] = useState(() => getActiveWallpaperId());
  const [wallpaperDim, setLocalWallpaperDim] = useState(getWallpaperDim());
  const objectUrlRefs = useRef({}); // keep track to revoke later

  /* -------------------------
     Lifecycle: persist temp settings
     ------------------------- */
  useEffect(() => {
    // keep tempSettings synced to global settings (live preview)
    updateSettings(tempSettings);
  }, [tempSettings, updateSettings]);

  /* -------------------------
     Load wallpapers once (IndexedDB)
     ------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const list = await loadWallpapers();
        if (!mounted) return;
        setWallpapers(Array.isArray(list) ? list : [DEFAULT_WALLPAPER]);
      } catch (err) {
        console.error("Failed loading wallpapers", err);
        if (mounted) setWallpapers([DEFAULT_WALLPAPER]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* -------------------------
     Build object URLs for thumbnails/previews
     ------------------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      // revoke previous urls
      Object.values(objectUrlRefs.current).forEach((u) => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      objectUrlRefs.current = {};

      const entries = await Promise.all(
        wallpapers.map(async (w) => {
          if (w.id === "default") {
            return [w.id, DEFAULT_WALLPAPER.dataUrl];
          }
          try {
            const url = await getWallpaperUrl(w.id);
            objectUrlRefs.current[w.id] = url;
            return [w.id, url || DEFAULT_WALLPAPER.dataUrl];
          } catch {
            return [w.id, DEFAULT_WALLPAPER.dataUrl];
          }
        })
      );

      if (!mounted) {
        // cleanup newly created urls if unmounted
        Object.values(objectUrlRefs.current).forEach((u) => {
          try { URL.revokeObjectURL(u); } catch {}
        });
        objectUrlRefs.current = {};
        return;
      }

      setWallpaperUrls(Object.fromEntries(entries));
    })();

    return () => {
      mounted = false;
      // revoke on unmount
      Object.values(objectUrlRefs.current).forEach((u) => {
        try { URL.revokeObjectURL(u); } catch {}
      });
      objectUrlRefs.current = {};
    };
  }, [wallpapers]);

  /* -------------------------
     Keep active wallpaper state in-sync with storage
     ------------------------- */
  useEffect(() => {
    setActiveWallpaperState(getActiveWallpaperId());
  }, []);

  /* -------------------------
     Apply wallpaper dim local -> persisted
     ------------------------- */
  useEffect(() => {
    setWallpaperDim(wallpaperDim);
  }, [wallpaperDim]);

  /* -------------------------
     Accent color from active wallpaper (glass)
     ------------------------- */
  useEffect(() => {
    let mounted = true;
    if (settings.theme !== "glass") return;

    (async () => {
      try {
        const src = wallpaperUrls[activeWallpaperId] || DEFAULT_WALLPAPER.dataUrl;
        const color = await getWallpaperAccent(activeWallpaperId, src);
        if (!mounted) return;
        document.documentElement.style.setProperty("--text-accent", color);
        document.documentElement.style.setProperty("--button-primary", color);
      } catch (e) {
        // fallback handled by helper
      }
    })();

    return () => {
      mounted = false;
    };
  }, [settings.theme, wallpaperUrls, activeWallpaperId]);

  /* ===========================================================================
     Helper: set theme setting locally (tempSettings) - small helper
     =========================================================================== */
  function handleChange(key, value) {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  }

  /* ===========================================================================
     Wallpaper Upload (resize & compress, then save Blob to IndexedDB)
     =========================================================================== */
  async function handleWallpaperUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const img = await readImageFromFile(file);
      const compressedBlob = await compressImageToBlob(img, 1920, 0.8);

      const id = crypto.randomUUID();
      await saveWallpaper({ id, name: file.name, blob: compressedBlob });

      const next = await loadWallpapers();
      setWallpapers(Array.isArray(next) ? next : [DEFAULT_WALLPAPER]);
    } catch (err) {
      console.error("Wallpaper upload failed", err);
      alert("Wallpaper too large or storage full");
    }
  }

  // Read File -> HTMLImageElement
  function readImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        img.src = reader.result;
      };
      img.onerror = reject;
      reader.onerror = reject;

      img.onload = () => resolve(img);
      reader.readAsDataURL(file);
    });
  }

  // Draw to canvas with maxDim and return a compressed Blob
  function compressImageToBlob(img, maxDim = 1920, quality = 0.8) {
    return new Promise((resolve) => {
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", quality);
    });
  }

  /* ===========================================================================
     Wallpaper select / delete helpers
     =========================================================================== */

  async function handleSelectWallpaper(id) {
    setActiveWallpaperId(id); // persist to localStorage
    setActiveWallpaperState(id); // update UI state
  }

  async function handleDeleteWallpaper(id) {
    try {
      await deleteWallpaperFromStore(id);

      // revoke object URL if present
      const u = objectUrlRefs.current[id];
      if (u) {
        try { URL.revokeObjectURL(u); } catch {}
        delete objectUrlRefs.current[id];
      }

      const next = await loadWallpapers();
      setWallpapers(Array.isArray(next) ? next : [DEFAULT_WALLPAPER]);

      const currentActive = getActiveWallpaperId();
      if (currentActive === id) {
        setActiveWallpaperId("default");
        setActiveWallpaperState("default");
      }
    } catch (err) {
      console.error("Failed to delete wallpaper", err);
      alert("Failed to delete wallpaper");
    }
  }

  /* ===========================================================================
     Radio manual download helpers (unchanged logic, just async-safe)
     =========================================================================== */

  async function downloadStation(station) {
    if (manualDownloads[station.id]) return;

    console.log("[MANUAL] downloading", station.id);

    setDownloadProgress((p) => ({ ...p, [station.id]: 0 }));

    try {
      const res = await fetch(station.url);
      const reader = res.body.getReader();
      const total = Number(res.headers.get("Content-Length")) || 0;

      let received = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        received += value.length;

        if (total) {
          const pct = (received / total) * 100;

          setDownloadProgress((p) => ({
            ...p,
            [station.id]: pct,
          }));

          console.log(`[MANUAL] ${station.id} ${pct.toFixed(1)}%`);
        }
      }

      const blob = new Blob(chunks, { type: "audio/mpeg" });
      await cacheTrack(station.id, blob);

      const next = { ...manualDownloads, [station.id]: true };
      saveManualDownloads(next);
      setManualDownloads(next);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
    } finally {
      // cleanup progress
      setDownloadProgress((p) => {
        const copy = { ...p };
        delete copy[station.id];
        return copy;
      });

      console.log("[MANUAL] completed", station.id);
    }
  }

  async function removeStation(station) {
    try {
      await deleteTrack(station.id);

      const next = { ...manualDownloads };
      delete next[station.id];
      saveManualDownloads(next);
      setManualDownloads(next);

      console.log("[MANUAL] removed", station.id);
    } catch (err) {
      console.error("Failed to remove station", err);
    }
  }

  /* ===========================================================================
     Export / Import handlers (unchanged)
     =========================================================================== */

  function handleExport() {
    const data = {
      settings: tempSettings,
      notes,
      activeNoteId: 0,
      links,
    };

    const jsonStr = JSON.stringify(data);
    const encrypted = password ? CryptoJS.AES.encrypt(jsonStr, password).toString() : jsonStr;

    const blob = new Blob([encrypted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
    setPassword("");
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let data;

        try {
          const decrypted = CryptoJS.AES.decrypt(content, importPassword).toString(CryptoJS.enc.Utf8);
          data = JSON.parse(decrypted);
        } catch {
          data = JSON.parse(content);
        }

        if (data.settings) {
          updateSettings(data.settings);
          setTempSettings(data.settings);
        }
        if (data.links) setLinks(data.links);
        if (data.notes) setNotes(data.notes);
        if (data.activeNoteId) setActiveNoteId(data.activeNoteId);

        setShowImportDialog(false);
        setImportPassword("");
      } catch (error) {
        alert("Invalid file or wrong password");
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  /* ===========================================================================
     Small UI helpers
     =========================================================================== */
  const getPasswordStrength = (pw) => {
    if (!pw) return "None";
    if (pw.length < 6) return "Weak";
    if (pw.length < 10) return "Moderate";
    return "Strong";
  };

  const getPasswordStrengthClass = (pw) => {
    const s = getPasswordStrength(pw);
    if (s === "Weak") return "text-red-500";
    if (s === "Moderate") return "text-yellow-500";
    if (s === "Strong") return "text-green-500";
    return "text-[var(--text-secondary)]";
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    onClose();
  };

  const handlePomodoroModalOpening = () => {
    onClose();
    openPomodoroModal(true);
  };

  /* ===========================================================================
     Render
     =========================================================================== */
  return (
    <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center z-20 ">
      <div className="bg-[var(--bg-primary)]  rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto scrollbar ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-mono text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Theme Selector */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Theme</h2>
          <div className="grid grid-cols-6 gap-6">
            {Object.entries(themes).map(([key, theme]) => {
              const isActive = settings.theme === key;
              const baseColor = theme.baseThemeType === "light" ? "#ffffff" : "#000000";
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleChange("theme", key)}
                  className="group cursor-pointer select-none focus:outline-none"
                  aria-pressed={isActive}
                  title={theme.name}
                >
                  <div
                    className={[
                      "rounded-md overflow-hidden border-2 transition-all",
                      "group-hover:scale-[1.03] active:scale-[0.98]",
                      isActive ? "border-[var(--text-accent)] shadow-[0_0_0_1px_var(--text-accent)]" : "border-transparent hover:border-[var(--border)]",
                    ].join(" ")}
                  >
                    <div className="flex w-full aspect-square">
                      <div className="w-1/2 h-full" style={{ backgroundColor: theme.colors.text?.accent || "transparent" }} />
                      <div className="w-1/2 h-full" style={{ backgroundColor: baseColor }} />
                    </div>
                  </div>

                  <div className={["mt-1 text-xs text-center transition-colors", isActive ? "text-[var(--text-accent)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"].join(" ")}>
                    {theme.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Wallpapers */}
          <h2 className="mt-6 mb-1 font-semibold text-xl border-b border-[var(--border)]">Wallpapers</h2>

          <div className="mt-4 flex flex-row items-center gap-4">
            <label className="text-sm w-[40%] font-mono mb-1 block">Wallpaper Dim</label>

            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={wallpaperDim}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLocalWallpaperDim(v);
                setWallpaperDim(v);
              }}
              className="w-full cursor-pointer accent-[var(--text-accent)]"
            />
          </div>

          <p className="text-xs text-red-500 mb-3">Works only with the <b>Glass</b> theme</p>

          <p className="text-xs text-red-400 mb-3">
            Wallpaper size recommended: 1920×1080. Try <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-accent)] hover:underline"><b>Unsplash</b></a>.
          </p>

          <label className="inline-block mb-4 text-xs px-3 py-1 rounded bg-[var(--button-primary)] hover:bg-[var(--button-secondary)] cursor-pointer">
            Upload Wallpaper
            <input type="file" accept="image/*" onChange={handleWallpaperUpload} className="hidden" />
          </label>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-5 gap-3">
            {Array.isArray(wallpapers) &&
              wallpapers.map((w) => {
                const isActive = w.id === activeWallpaperId;
                const isDefault = w.id === "default";
                const src = wallpaperUrls[w.id] || DEFAULT_WALLPAPER.dataUrl;

                return (
                  <div key={w.id} className="group relative cursor-pointer">
                    <div
                      onClick={() => {
                        handleSelectWallpaper(w.id);
                      }}
                      className={`rounded-md overflow-hidden border-2 ${isActive ? "border-[var(--text-accent)]" : "border-transparent hover:border-[var(--border)]"}`}
                    >
                      <img src={src} alt={w.name} className="w-full aspect-square object-cover" loading="lazy" />
                    </div>

                    {isActive && <div className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-[var(--text-accent)] text-black">Active</div>}

                    {!isDefault && (
                      <button
                        onClick={() => handleDeleteWallpaper(w.id)}
                        className="absolute top-1 right-1 hidden group-hover:flex text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white"
                      >
                        ✕
                      </button>
                    )}

                    <div className="mt-1 text-[10px] text-center truncate text-[var(--text-secondary)]">{isDefault ? "Default" : w.name}</div>
                  </div>
                );
              })}
          </div>

          {/* Radio */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Radio</h2>

          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-sm">Show Radio</span>
            <input type="checkbox" checked={tempSettings.showRadio} onChange={(e) => handleChange("showRadio", e.target.checked)} className="accent-[var(--text-accent)]" />
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm">Clear Cache</span>
            <button
              onClick={async () => {
                await clearRadioCache();
                alert("Radio cache cleared");
              }}
              className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-4">⚠ All cached songs and thumbnails will be deleted.</p>

          <div className="grid grid-cols-6 gap-2">
            {Array.isArray(stations) &&
              stations.map((station) => {
                const manual = manualDownloads?.[station.id];
                return (
                  <div key={station.id} className="relative group cursor-pointer">
                    <img
                      src={station.thumb || generateFallbackThumb(station.id)}
                      className="w-full aspect-square object-cover rounded-md"
                      onClick={() => downloadStation(station)}
                      alt={station.name}
                    />

                    {downloadProgress[station.id] !== undefined && (
                      <div className="mt-1 text-[10px] text-center text-[var(--text-secondary)] font-mono">{downloadProgress[station.id].toFixed(0)}%</div>
                    )}

                    {manual && (
                      <button onClick={() => removeStation(station)} className="absolute top-1 right-1 bg-black/70 text-white text-xs p-1 rounded hidden group-hover:block">
                        🗑
                      </button>
                    )}

                    <div className="mt-1">
                      <div className="text-xs font-semibold truncate">{station.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] truncate">{station.genre}</div>
                    </div>
                  </div>
                );
              })}
          </div>

          <p className="mt-3 text-xs text-[var(--text-secondary)]">⚠ Do not refresh or close the tab while a download is in progress.</p>

          {/* ... the rest of UI (clock, fonts, backups etc.) are unchanged and omitted for brevity ... */}
          {/* Keep all other sections (Text, Pomodoro, Clock, Links, Backup/Restore) as in your original file */}
        </div>

        {/* Contact / Save */}
        <div className="my-4">
          <h2 className="my-4 font-semibold text-xl border-b-2 border-b-[var(--border)]">Contact/Feedback</h2>
          <div className="grid grid-cols-4 gap-3 mt-4">
            <a target="_blank" rel="noopener noreferrer" href="https://wa.me/916006209674" className="flex flex-col items-center justify-center py-3 rounded-lg bg-[#1f2f25] hover:bg-[#25D366]/20 text-[#25D366] transition">
              <IoLogoWhatsapp size={26} />
              <span className="mt-1 text-xs font-mono">WhatsApp</span>
            </a>

            <a target="_blank" rel="noopener noreferrer" href="https://t.me/arubk744" className="flex flex-col items-center justify-center py-3 rounded-lg bg-[#1f2833] hover:bg-[#229ED9]/20 text-[#229ED9] transition">
              <FaTelegram size={26} />
              <span className="mt-1 text-xs font-mono">Telegram</span>
            </a>

            <a target="_blank" rel="noopener noreferrer" href="https://buymeacoffee.com/aryan744" className="flex flex-col items-center justify-center py-3 rounded-lg bg-[#332b1a] hover:bg-[#FFDD00]/20 text-[#FFDD00] transition">
              <SiBuymeacoffee size={26} />
              <span className="mt-1 text-xs font-mono">Coffee</span>
            </a>

            <a target="_blank" rel="noopener noreferrer" href="mailto:arubk744@gmail.com" className="flex flex-col items-center justify-center py-3 rounded-lg bg-[#2b1f1f] hover:bg-[#e74c3c]/20 text-[#e74c3c] transition">
              <MdEmail size={26} />
              <span className="mt-1 text-xs font-mono">Email</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-4 right-4">
          <button onClick={handleSave} className="px-6 py-3 text-sm bg-[var(--button-primary)] text-[var(--text-primary)] rounded-lg flex items-center hover:bg-[var(--button-secondary)]">
            <FiSave className="mr-1.5" size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
