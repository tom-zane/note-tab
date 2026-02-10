import { useState, useEffect } from "react";

// Contexts
import { NotesProvider } from "./contexts/NotesContext";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { LinksProvider } from "./contexts/LinksContext";
import { RadioProvider } from "./contexts/RadioContext";

// Components
import Sidebar from "./components/ui/Sidebar";
import NoteEditor from "./components/ui/NoteEditor";
import Clock from "./components/ui/Clock";
import LinksContainer from "./components/ui/LinksContainer";
import RadioPlayer from "./components/ui/RadioPlayer";
import PomodoroTimer from "./components/ui/PomodoroTimer";

// Modals
import SettingsModal from "./components/modals/SettingsModal";
import PomodoroModal from "./components/modals/PomodoroModal";

// Wallpaper helpers
import {
  DEFAULT_WALLPAPER,
  loadWallpapers,
  getActiveWallpaperId,
  getWallpaperDim,
  getWallpaperUrl,
  getWallpaperAccent,
} from "./utils/wallpaper-helpers";

/* ---------- Inner App (needs SettingsContext) ---------- */

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPomodoroModalOpen, setIsPomodoroModalOpen] = useState(false);

  const [wallpapers, setWallpapers] = useState([DEFAULT_WALLPAPER]);
  const [wallpaperUrl, setWallpaperUrl] = useState(DEFAULT_WALLPAPER.dataUrl);

  const { settings } = useSettings();
  const isGlass = settings.theme === "glass";

  const dim = getWallpaperDim();
  const activeId = getActiveWallpaperId();

  /* ================= LOAD WALLPAPERS ================= */

  useEffect(() => {
    let alive = true;

    loadWallpapers().then((list) => {
      if (!alive) return;
      setWallpapers(list);
    });

    return () => {
      alive = false;
    };
  }, []);

  /* ================= LOAD ACTIVE WALLPAPER URL ================= */

  useEffect(() => {
    let alive = true;

    getWallpaperUrl(activeId).then((url) => {
      if (!alive) return;
      if (url) setWallpaperUrl(url);
      else setWallpaperUrl(DEFAULT_WALLPAPER.dataUrl);
    });

    return () => {
      alive = false;
    };
  }, [activeId]);

  const activeWallpaper =
    wallpapers.find((w) => w.id === activeId) || DEFAULT_WALLPAPER;

  /* ================= APPLY ACCENT COLOR ================= */

  useEffect(() => {
    if (!isGlass) return;

    getWallpaperAccent(activeWallpaper.id, wallpaperUrl).then((color) => {
      document.documentElement.style.setProperty("--text-accent", color);
      document.documentElement.style.setProperty("--button-primary", color);
    });
  }, [isGlass, activeWallpaper.id, wallpaperUrl]);

  /* ================= ROOT STYLE ================= */

  const rootStyle = isGlass
    ? {
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,${dim / 100}),
            rgba(0,0,0,${dim / 100})
          ),
          url(${wallpaperUrl})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <RadioProvider>
      <NotesProvider>
        <LinksProvider>
          <div className="flex h-screen object-fit" style={rootStyle}>
            <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

            <div className="flex-1 bg-[var(--bg-secondary)]">
              <div className="flex flex-row w-full h-[20%] py-1 px-4 justify-between items-center">
                <Clock />
                <PomodoroTimer />
                <RadioPlayer />
              </div>

              <NoteEditor />
            </div>

            <LinksContainer />

            {isSettingsOpen && (
              <SettingsModal
                openPomodoroModal={setIsPomodoroModalOpen}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}

            {isPomodoroModalOpen && (
              <PomodoroModal
                onClose={() => setIsPomodoroModalOpen(false)}
              />
            )}
          </div>
        </LinksProvider>
      </NotesProvider>
    </RadioProvider>
  );
}

/* ---------- Root ---------- */

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
