import { FiX } from "react-icons/fi";

import { TbCancel } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function DeleteConfirmation({ onConfirm, onCancel, noteTitle }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-96 text-[var(--text-primary)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-mono">Delete Note</h2>
          <button onClick={onCancel} className="text-[#646669] hover:text-[#d1d0c5]">
            <FiX size={24} />
          </button>
        </div>

        <p className="mb-6">Are you sure you want to delete "{noteTitle}"? This action cannot be undone.</p>

        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-4 py-2 flex flex-row justify-center items-center rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
            <TbCancel size={16} className="mr-2" />
            <span className="">Cancel</span>
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md flex flex-row justify-center items-center bg-[#ca4754] text-white hover:bg-opacity-80">
            <RiDeleteBin6Line size={16} className="mr-2" />
            <span> Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
