import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';

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
    console.log('addNote triggered =====');
    console.log('uuid', uuidv4());
    const newNote = {
      id: uuidv4(),
      note_title: 'Untitled Note',
      note_body: '',
      date_created: new Date().toISOString()
    };
    console.log("🚀 ~ addNote ~ newNote:", newNote)
    

    setNotes(prevNotes => [newNote, ...prevNotes]);
    setActiveNoteId(newNote.id);
    console.log(notes, activeNoteId);
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