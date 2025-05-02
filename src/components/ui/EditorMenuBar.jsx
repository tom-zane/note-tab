import { FiBold, FiItalic, FiCheckSquare} from "react-icons/fi";
import{ MdOutlineInsertPageBreak } from "react-icons/md";
import { FaListUl, FaListOl } from "react-icons/fa";
import { TbBlockquote } from "react-icons/tb";

import { TbHighlightOff, TbHighlight } from "react-icons/tb";

import Tippy from "@tippyjs/react";

export default function EditorMenuBar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex gap-2 mb-4 p-2 rounded-lg bg-[var(--bg-tertiary)]">
      <Tippy className="tooltip" content="Bold | Ctrl+B ">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("bold") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <FiBold size={16} />
        </button>
      </Tippy>

      <Tippy className="tooltip" content="Italic | Ctrl+I ">
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("italic") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <FiItalic size={16} />
        </button>
      </Tippy>

      <Tippy className="tooltip" content="Unordered List | Ctrl+Shift+8 ">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("bulletList") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <FaListUl size={16} />
        </button>
      </Tippy>
      <Tippy className="tooltip" content="Ordered List | Ctrl+Shift+7 ">
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("bulletList") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <FaListOl size={16} />
        </button>
      </Tippy>

      <Tippy className="tooltip" content={`Check List | Type "[]" in Front `}>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("taskList") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <FiCheckSquare size={16} />
        </button>
      </Tippy>

      <Tippy className="tooltip" content="Blockquote | Ctrl+Shift+ B ">
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("blockquote") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <TbBlockquote size={16} />
        </button>
      </Tippy>
      <Tippy className="tooltip" content={`Line Break | Type "---" & Press Enter`}>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("blockquote") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <MdOutlineInsertPageBreak size={16} />
        
        </button>
      </Tippy>

      <Tippy className="tooltip" content="Highlight | Ctrl+Shift+H">
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("highlight") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <TbHighlight size={16} />
        </button>
      </Tippy>

      <Tippy className="tooltip" content="Orange">
        <button onClick={() => editor.chain().focus().toggleHighlight({color: "#F28C28"}).run()} className={`p-2 aspect-square rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("highlight", {color: "#F28C28"}) ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-tertiary)]"}`}>
          <span className="w-4 h-4 block rounded-full bg-[#F28C28]" ></span>
        </button>
      </Tippy>
      <Tippy className="tooltip" content="Green">
        <button onClick={() => editor.chain().focus().toggleHighlight({color: "#3AA655"}).run()} className={`p-2 aspect-square rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("highlight", {color: "#3AA655"}) ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-tertiary)]"}`}>
          <span className="w-4 h-4 block rounded-full bg-[#3AA655]" ></span>
        </button>
      </Tippy>
      <Tippy className="tooltip" content="Blue">
        <button onClick={() => editor.chain().focus().toggleHighlight({color: "#3A7CA5"}).run()} className={`p-2 aspect-square rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("highlight", {color: "#3A7CA5"}) ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-tertiary)]"}`}>
          <span className="w-4 h-4 block rounded-full bg-[#3A7CA5]" ></span>
        </button>
      </Tippy>
      <Tippy className="tooltip" content="Purple">
        <button onClick={() => editor.chain().focus().toggleHighlight({color: "#865FC5"}).run()} className={`p-2 aspect-square rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("highlight", {color: "#865FC5"}) ? "bg-[var(--bg-secondary)]" : "bg-[var(--bg-tertiary)]"}`}>
          <span className="w-4 h-4 block rounded-full bg-[#865FC5]" ></span>
        </button>
      </Tippy>
    </div>
  );
}

<Tippy content="Blockquote | Ctrl + Shift + 8 "></Tippy>;
