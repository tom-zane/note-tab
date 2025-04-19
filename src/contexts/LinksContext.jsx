import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 

const LinksContext = createContext();

export function LinksProvider({ children }) {
  const [links, setLinks] = useState(() => {
    const savedLinks = localStorage.getItem('links');
    return savedLinks ? JSON.parse(savedLinks) : [];
  });

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
  }, [links]);

  const addLink = (newLink) => {
    setLinks(prev => [...prev, { ...newLink, id: Date.now() }]);
  };

  const deleteLink = (id) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const getCategories = () => {
    return [...new Set(links.map(link => link.category))];
  };

  return (
    <LinksContext.Provider value={{
      links,
      setLinks,
      addLink,
      deleteLink,
      getCategories
    }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  return useContext(LinksContext);
}

LinksProvider.propTypes = {
  children: PropTypes.node.isRequired
};