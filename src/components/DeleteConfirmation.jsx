import { FiX } from 'react-icons/fi';

export default function DeleteConfirmation({ onConfirm, onCancel, noteTitle }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2c2e31] rounded-lg p-6 w-96 text-[#d1d0c5]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono">Delete Note</h2>
          <button onClick={onCancel} className="text-[#646669] hover:text-[#d1d0c5]">
            <FiX size={24} />
          </button>
        </div>
        
        <p className="mb-6">
          Are you sure you want to delete "{noteTitle}"? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-[#646669] text-[#d1d0c5] hover:bg-opacity-80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-[#ca4754] text-white hover:bg-opacity-80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}