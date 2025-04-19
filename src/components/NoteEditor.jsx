import { useRef } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useSettings } from '../contexts/SettingsContext';


export default function NoteEditor() {
  // Get active note and notes state from the notes context
  const { notes, activeNoteId, updateActiveNote } = useNotes();
  // Get settings from the settings context
  const { settings } = useSettings();
  // Create a ref to the body textarea to focus it when the user presses enter in the title input
  const bodyRef = useRef(null);

  // Function to handle the keydown event in the title input
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focus the body textarea when the user presses enter in the title input
      bodyRef.current?.focus();
    }
  };

  // Find the active note from the notes array
  const activeNote = notes.find((note) => note.id === activeNoteId);

  // If there is no active note, display a message
  if (!activeNote) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">
        Select a note or create a new one
      </div>
    );
  }

  // Return the note editor component
  return (
    <div className="flex flex-col flex-1 p-8 mt-12">
      {/* // Title input */}
      <input
        type="text"
        value={activeNote.title}
        onChange={(e) => updateActiveNote(activeNoteId, { title: e.target.value })}
        onKeyDown={handleTitleKeyDown}
        className="w-full bg-transparent border-none outline-none font-mono mb-4 text-[var(--text-primary)]"
        style={{ fontSize: `${settings.headerSize}px` }}
        placeholder="Note Title"
      />
      {/* // Horizontal line separating the title and the body */}
      <div className="w-full h-px bg-[var(--border)] opacity-20 mb-4"></div>

      {/* // Body textarea */}
      <div className="flex gap-4 h-[calc(100vh-240px)]">
        <textarea
          ref={bodyRef}
          value={activeNote.body}
          onChange={(e) => updateActiveNote(activeNoteId, { body: e.target.value })}
          className="flex-1 bg-transparent border-none outline-none font-mono resize-none text-[var(--text-primary)] scrollbar"
          style={{ fontSize: `${settings.bodySize}px` }}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
