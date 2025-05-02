import { useState } from "react";

// Contexts
import { NotesProvider } from "./contexts/NotesContext";
import { SettingsProvider } from "./contexts/SettingsContext";
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


function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPomodoroModalOpen, setIsPomodoroModalOpen] = useState(false);

  return (
    <SettingsProvider>
      <RadioProvider>
        <NotesProvider>
          <LinksProvider>
            <div className="flex h-screen bg-[var(--bg-primary)]">
              <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
              <div className="flex-1 bg-[var(--bg-secondary)]">
                {/* clock and radio */}
                <div className="flex flex-row w-full h-[15%] px-4 justify-between items-center ">
                  <Clock />
                  <PomodoroTimer />
                  <RadioPlayer />
                </div>
                {/* Note Editor */}
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
                <PomodoroModal onClose={() => setIsPomodoroModalOpen(false)} />
              )}
            </div>
          </LinksProvider>
        </NotesProvider>
      </RadioProvider>
    </SettingsProvider>
  );
}

export default App;
