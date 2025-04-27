import { useEffect, useRef, useState } from "react";
import { useNotes } from "../contexts/NotesContext";
import { useSettings } from "../contexts/SettingsContext";

// tiptap editor import
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import OrderedList from "@tiptap/extension-ordered-list";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { jsPDF } from "jspdf";

import { IoCodeDownloadOutline } from "react-icons/io5";

import EditorMenuBar from "./EditorMenuBar";

import { downloadAsHTML, downloadAsTxt, downloadAsMarkdown } from "./../utils/downloadSingleFileHelper";

export default function NoteEditor() {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const { notes, activeNoteId, updateNote } = useNotes();
  const { settings } = useSettings();

  const bodyRef = useRef(null);
  // Find the active note from the notes array
  const activeNote = notes.find((note) => note.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      editor.commands.setContent(activeNote?.body);
    }
  }, [activeNoteId]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Blockquote,
      TaskList,
      HorizontalRule,
      OrderedList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: activeNote?.body || "",
    onUpdate: ({ editor }) => {
      if (activeNote) {
        updateNote(activeNoteId, { note_body: editor.getHTML() });
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none",
        style: `font-size: ${settings.bodySize}px`,
      },
    },
  });

  // ============================================================================
  // ============================================================================

  // Function to handle the keydown event in the title input
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Focus the body textarea when the user presses enter in the title input
      editor?.commands.focus()
    }
  };

  //* Function to handle file download
  const handleFileDownload = (fileType, noteTitle = activeNote.title, bodyHtml = editor.getHTML()) => {
    console.log("fileType", fileType);
    console.log("noteTitle", noteTitle);

    if (fileType === "txt") downloadAsTxt(bodyHtml, noteTitle);
    if (fileType === "html") downloadAsHTML(bodyHtml, noteTitle);
    if (fileType === "md") downloadAsMarkdown(bodyHtml, noteTitle);


    setShowDownloadMenu(false);
  };

  // If there is no active note, display a message
  if (!activeNote) {
    return <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">Select a note or create a new one</div>;
  }

  // Return the note editor component
  return (
    <div className="flex flex-col flex-1 p-1 px-4 ">
      <div className="flex flex-row relative justify-center items-center">
        {/*  Title input */}
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNoteId, { title: e.target.value })}
          onKeyDown={handleTitleKeyDown}
          className="w-full bg-transparent border-none outline-none font-mono  text-[var(--text-primary)]"
          style={{ fontSize: `${settings.headerSize}px` }}
          placeholder="Note Title"
        />

        {/* Download Trigger Button  */}
        <button onClick={() => setShowDownloadMenu((prev) => !prev)} className=" hover:bg-[var(--bg-primary)] p-2  rounded-md">
          <IoCodeDownloadOutline className="text-2xl" />
        </button>

        {/* // Download menu     */}
        {showDownloadMenu && (
          <div className="absolute top-10 z-20 right-0 w-fit flex flex-col mt-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-md shadow-lg" style={{ minWidth: "150px" }}>
       
            <button className="w-full text-left px-4 py-1 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]" onClick={() => handleFileDownload("txt")}>
              TXT
            </button>
            <button className="w-full text-left px-4 py-1 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]" onClick={() => handleFileDownload("md")}>
              Markdown
            </button>
            <button className="w-full text-left px-4 py-1 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]" onClick={() => handleFileDownload("html")}>
              {`HTML (Best)`}
            </button>
          </div>
        )}

        {/* ======================= */}
      </div>
      {/* // Horizontal line separating the title and the body */}
      <div className="w-full h-px bg-[var(--border)] opacity-20 mb-2"></div>

      {/* Editor */}
      <EditorMenuBar editor={editor} />
      <div className="flex-1 max-h-[calc(100vh-250px)] scrollbar overflow-y-auto px-4 pb-4">
        <div className="prose prose-invert max-w-none">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
