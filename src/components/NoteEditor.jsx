import { useRef } from "react";
import { useNotes } from "../contexts/NotesContext";
import { useSettings } from "../contexts/SettingsContext";

import { IoCodeDownloadOutline } from "react-icons/io5";

export default function NoteEditor() {
  // Get active note and notes state from the notes context
  const { notes, activeNoteId, updateNote } = useNotes();
  // Get settings from the settings context
  const { settings } = useSettings();
  // Create a ref to the body textarea to focus it when the user presses enter in the title input
  const bodyRef = useRef(null);

  // Function to handle the keydown event in the title input
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Focus the body textarea when the user presses enter in the title input
      bodyRef.current?.focus();
    }
  };

  //* Function to handle file download
  const handleFileDownload = (title, body) => {
    const formattedText = `## ${title}\n================================================================================================\n \n${body}`;
    const blob = new Blob([formattedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_") || "download"}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Find the active note from the notes array
  const activeNote = notes.find((note) => note.id === activeNoteId);

  // If there is no active note, display a message
  if (!activeNote) {
    return <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">Select a note or create a new one</div>;
  }

  // Return the note editor component
  return (
    <div className="flex flex-col flex-1 p-6 pt-2 mt-2">
      {/* // Title input */}
      <div className="flex flex-row  justify-center items-center">
        {/*  // Title input */}
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNoteId, { title: e.target.value })}
          onKeyDown={handleTitleKeyDown}
          className="w-full bg-transparent border-none outline-none font-mono mb-4 text-[var(--text-primary)]"
          style={{ fontSize: `${settings.headerSize}px` }}
          placeholder="Note Title"
        />

        {/* Download Trigger Button  */}
        <button onClick={() => handleFileDownload(activeNote.title, activeNote.body)} className=" hover:bg-[var(--bg-primary)] p-2  rounded-md">
          <IoCodeDownloadOutline className="text-2xl" />
        </button>
      </div>
      {/* // Horizontal line separating the title and the body */}
      <div className="w-full h-px bg-[var(--border)] opacity-20 mb-4"></div>

      {/* // Body textarea */}
      <div className="flex gap-4 h-[calc(100vh-240px)]">
        <textarea
          ref={bodyRef}
          value={activeNote.body}
          onChange={(e) => updateNote(activeNoteId, { body: e.target.value })}
          className="flex-1 bg-transparent border-none outline-none font-mono resize-none text-[var(--text-primary)] scrollbar"
          style={{ fontSize: `${settings.bodySize}px` }}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
