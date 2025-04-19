import { useState } from 'react';
import { useLinks } from '../contexts/LinksContext';
import { useSettings } from '../contexts/SettingsContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AddLinkModal from './AddLinkModal';


export default function LinksContainer() {
  const { links, deleteLink, getCategories } = useLinks();
  const { settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!settings.showLinks) return null;

  const categories = getCategories();

  return (
    <div className="w-64 h-screen bg-[var(--bg-tertiary)] p-4 flex flex-col">
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 mb-4 bg-[var(--button-primary)] text-[var(--bg-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-lg flex items-center justify-center text-sm hover:bg-opacity-80"
      >
        <FiPlus size={14} className="mr-1" /> Add Link
      </button>

      <div className="flex-1 overflow-y-auto">
        {categories.map((category, index) => (
          <div key={category} className="mb-4">
            <h3 className="text-[var(--text-secondary)]  text-sm mb-2">{category}</h3>
            {links
              .filter(link => link.category === category)
              .map(link => (
                <div
                  key={link.id}
                  className="flex items-center justify-between group mb-1"
                >
                  <a
                    href={link.url}                   
                    className="text-[var(--text-primary)] hover:text-[var(--text-accent)] truncate"
                    style={{ fontSize: `${settings.linkSize}px` }}
                  >
                    {link.name}
                  </a>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="text-[var(--text-secondary)] hover:text-[var(--button-danger)] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            {index < categories.length - 1 && (
              <div className="h-px bg-[var(--border)] opacity-20 my-4"></div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && <AddLinkModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

