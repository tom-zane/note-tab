import { useState } from 'react';
import { useLinks } from '../../contexts/LinksContext';
import { FiX } from 'react-icons/fi';

export default function AddLinkModal({ onClose }) {
  const { addLink, getCategories } = useLinks();
  const [formData, setFormData] = useState({
    category: '',
    url: '',
    name: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);

  const existingCategories = getCategories();

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = isNewCategory ? newCategory : formData.category;
    if (category && formData.url && formData.name) {
      addLink({ ...formData, category });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-96 text-[var(--text-primary)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono">Add New Link</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono mb-2">Category</label>
            {!isNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
                >
                  <option value="">Select Category</option>
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsNewCategory(true)}
                  className="px-3 py-2 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded hover:bg-opacity-80"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setIsNewCategory(false)}
                  className="px-3 py-2 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded hover:bg-opacity-80"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">Link URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
              className="w-full p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
              required
            />
          </div>

          <div>
            <label className="block font-mono mb-2">Link Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My Link"
              className="w-full p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[var(--button-secondary)] text-[var(--text-primary)] hover:bg-opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--button-primary)] text-[var(--bg-primary)] hover:bg-opacity-80"
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}