import { FiBold, FiItalic, FiList, FiCheckSquare, FiLink, FiCode } from "react-icons/fi";
import { TbBlockquote } from "react-icons/tb";

import Tippy from '@tippyjs/react';

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

      <Tippy className="tooltip" content="Bullet List | Ctrl + Shift + 8 ">
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("bulletList") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
        <FiList size={16} />
      </button>
      </Tippy>

      <Tippy className="tooltip" content="Check List | Ctrl + Shift + 8 ">
      <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("taskList") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
        <FiCheckSquare size={16} />
      </button>
      </Tippy>

      <Tippy className="tooltip" content="Blockquote | Ctrl + Shift + 8 ">
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-[var(--bg-primary)] transition-colors ${editor.isActive("blockquote") ? "text-[var(--text-accent)]" : "text-[var(--text-primary)]"}`}>
          <TbBlockquote size={16} />
        </button>
      </Tippy>
    </div>
  );
}

<Tippy content="Blockquote | Ctrl + Shift + 8 "></Tippy>;
