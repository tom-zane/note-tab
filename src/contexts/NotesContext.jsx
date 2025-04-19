import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [activeNoteId, setActiveNoteId] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Set first note as active when notes change or on initial load
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      body: '',
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes[0]?.id || null);
    }
  };

  return (
    <NotesContext.Provider value={{
      notes,
      setNotes,
      activeNoteId,
      setActiveNoteId,
      addNote,
      updateNote,
      deleteNote
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

NotesProvider.propTypes = {
  children: PropTypes.node.isRequired
};