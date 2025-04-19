import { useState } from 'react';
import { NotesProvider } from './contexts/NotesContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { LinksProvider } from './contexts/LinksContext';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import Clock from './components/Clock';
import SettingsModal from './components/SettingsModal';
import LinksContainer from './components/LinksContainer';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <SettingsProvider>
      <NotesProvider>
        <LinksProvider>
          <div className="flex h-screen bg-[var(--bg-primary)]">
            <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
            <div className="flex-1 bg-[var(--bg-secondary)]">
              <NoteEditor />
            </div>
            <LinksContainer />
            <Clock />
            {isSettingsOpen && (
              <SettingsModal onClose={() => setIsSettingsOpen(false)} />
            )}
          </div>
        </LinksProvider>
      </NotesProvider>
    </SettingsProvider>
  );
}

export default App;