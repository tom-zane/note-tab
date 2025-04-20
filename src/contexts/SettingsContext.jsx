import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';     

import { defaultTheme, themes, fonts, clockThemes, defaultSettings } from './../utils/themes';


const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('customThemes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('customThemes', JSON.stringify(customThemes));

    const activeTheme = settings.customTheme
      ? customThemes[settings.customTheme]
      : themes[settings.theme];

    const colors = activeTheme.colors;

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', colors.bg.primary);
    root.style.setProperty('--bg-secondary', colors.bg.secondary);
    root.style.setProperty('--bg-tertiary', colors.bg.tertiary);
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-accent', colors.text.accent);
    root.style.setProperty('--button-primary', colors.button.primary);
    root.style.setProperty('--button-secondary', colors.button.secondary);
    root.style.setProperty('--button-danger', colors.button.danger);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--overlay', colors.overlay);
    root.style.setProperty('--font-family', fonts[settings.font]);

    document.body.style.backgroundColor = colors.bg.primary;
    document.body.style.color = colors.text.primary;
    document.body.style.fontFamily = fonts[settings.font];
  }, [settings, customThemes]);

  const addCustomTheme = (theme) => {
    setCustomThemes(prev => ({
      ...prev,
      [theme.name]: theme
    }));
  };

  const deleteCustomTheme = (themeName) => {
    if (settings.customTheme === themeName) {
      setSettings(prev => ({ ...prev, theme: 'dark', customTheme: null }));
    }
    setCustomThemes(prev => {
      const newThemes = { ...prev };
      delete newThemes[themeName];
      return newThemes;
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings: setSettings,
      themes,
      customThemes,
      addCustomTheme,
      
      deleteCustomTheme,
      clockThemes,
      fonts,
      defaultTheme
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};