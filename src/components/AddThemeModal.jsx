import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { FiX } from 'react-icons/fi';

export default function AddThemeModal({ onClose }) {
  const { addCustomTheme, defaultTheme } = useSettings();
  const [theme, setTheme] = useState({
    name: '',
    colors: JSON.parse(JSON.stringify(defaultTheme.colors))
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (theme.name.trim()) {
      addCustomTheme(theme);
      onClose();
    }
  };

  const handleColorChange = (category, subCategory, value) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [category]: typeof prev.colors[category] === 'object'
          ? { ...prev.colors[category], [subCategory]: value }
          : value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-mono text-[var(--text-primary)]">Add Custom Theme</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-sm text-[var(--text-primary)] mb-2">Theme Name</label>
            <input
              type="text"
              value={theme.name}
              onChange={(e) => setTheme(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
              required
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-sm text-[var(--text-primary)]">Background Colors</h3>
            {Object.entries(theme.colors.bg).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="font-mono text-sm text-[var(--text-primary)] w-24">{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange('bg', key, e.target.value)}
                  className="w-16 h-8"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange('bg', key, e.target.value)}
                  className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-sm text-[var(--text-primary)]">Text Colors</h3>
            {Object.entries(theme.colors.text).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="font-mono text-sm text-[var(--text-primary)] w-24">{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange('text', key, e.target.value)}
                  className="w-16 h-8"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange('text', key, e.target.value)}
                  className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-sm text-[var(--text-primary)]">Button Colors</h3>
            {Object.entries(theme.colors.button).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="font-mono text-sm text-[var(--text-primary)] w-24">{key}</label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange('button', key, e.target.value)}
                  className="w-16 h-8"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange('button', key, e.target.value)}
                  className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-sm text-[var(--text-primary)]">Other Colors</h3>
            <div className="flex items-center gap-4">
              <label className="font-mono text-sm text-[var(--text-primary)] w-24">Border</label>
              <input
                type="color"
                value={theme.colors.border}
                onChange={(e) => handleColorChange('border', null, e.target.value)}
                className="w-16 h-8"
              />
              <input
                type="text"
                value={theme.colors.border}
                onChange={(e) => handleColorChange('border', null, e.target.value)}
                className="flex-1 p-2 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded bg-[var(--button-secondary)] text-[var(--text-primary)] hover:bg-opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm rounded bg-[var(--button-primary)] text-[var(--bg-primary)] hover:bg-opacity-80"
            >
              Add Theme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}