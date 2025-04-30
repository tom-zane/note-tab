import { useState, useEffect } from "react";
import { useNotes } from "../contexts/NotesContext";
import { useSettings } from "../contexts/SettingsContext";
import { FiPlus, FiSettings, FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import DeleteConfirmation from "./DeleteConfirmation";
import Tippy from "@tippyjs/react";

import PropTypes from "prop-types";

export default function Sidebar({ onOpenSettings }) {
  const { notes, activeNoteId, setActiveNoteId, addNote, deleteNote } = useNotes();
  const { settings } = useSettings();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleDeleteClick = (e, note) => {
    e.stopPropagation();
    setNoteToDelete(note);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

    useEffect(() => {
      console.log('KeyPress Listener Triggered');
      const handleKeyDown = (e) => {
        if (e.altKey && e.key.toLowerCase() === 'n') {
          console.log('Alt + N pressed');
          e.preventDefault();
          addNote();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
  

  return (
    <>
      <div className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-[var(--bg-primary)] flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <Tippy className="tooltip"  placement="right" content="Alt + N">
              <button
                onClick={addNote}
                className="flex-1 p-2 bg-[var(--button-primary)] text-[var(--bg-primary)] rounded-lg flex items-center justify-center hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] transition-colors text-sm">
                <FiPlus className="mr-2" /> New Note
              </button>
            </Tippy>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg">
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 scrollbar overflow-y-auto">
          {notes.map((note, index) => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-3 cursor-pointer flex justify-between items-center ${activeNoteId === note.id ? "bg-[var(--text-accent)] bg-opacity-20" : "hover:bg-[var(--bg-secondary)] hover:bg-opacity-50"}`}>
              {isCollapsed ? (
                <span className="w-full text-center text-[var(--text-primary)]">{index + 1}</span>
              ) : (
                <>
                  <h3 className={`font-mono  ${activeNoteId === note.id ? "text-[var(--bg-primary)]" : "text-[var(--text-primary)]"}  truncate`} style={{ fontSize: `${settings.sidebarSize}px` }}>
                    {note.note_title || "Untitled Note"}
                  </h3>
                  <button onClick={(e) => handleDeleteClick(e, note)} className="text-[var(--text-secondary)] hover:text-[var(--button-danger)] p-1 rounded">
                    <FiTrash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <button onClick={onOpenSettings} className={`m-4 p-2 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded-lg flex items-center justify-center hover:bg-opacity-80 transition-colors text-sm ${isCollapsed ? "px-2" : ""}`}>
          <FiSettings className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && "Settings"}
        </button>
      </div>

      {noteToDelete && <DeleteConfirmation noteTitle={noteToDelete.note_title} onConfirm={handleConfirmDelete} onCancel={() => setNoteToDelete(null)} />}
    </>
  );
}

Sidebar.propTypes = {
  onOpenSettings: PropTypes.func.isRequired,
};
