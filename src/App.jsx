import { useState } from 'react';
import { NotesProvider } from './contexts/NotesContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LinksProvider } from './contexts/LinksContext';
import {RadioProvider } from './contexts/RadioContext';

import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import Clock from './components/Clock';
import SettingsModal from './components/SettingsModal';
import LinksContainer from './components/LinksContainer';

import RadioPlayer from './components/RadioPlayer';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
          <RadioPlayer />

              </div>
              {/* Note Editor */}
              <NoteEditor />
            </div>
            <LinksContainer />
            {isSettingsOpen && (
              <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
          </div>
        </LinksProvider>
      </NotesProvider>
      </RadioProvider>
    </SettingsProvider>
  );
}

export default App;