//*  ============================================================================================================
//* Default theme ===============================================================================================

export const defaultTheme = {
    name: 'Dark',
    colors: {
      bg: {
        primary: '#2c2e31',
        secondary: '#252729',
        tertiary: '#1f2123'
      },
      text: {
        primary: '#d1d0c5',
        secondary: '#646669',
        accent: '#e2b714'
      },
      button: {
        primary: '#e2b714',
        secondary: '#646669',
        danger: '#ca4754'
      },
      border: '#646669',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  };

//*  ==============================================================================================================
//*  Themes =======================================================================================================
export const themes = {
  light: {
    name: 'Light',
    colors: {
      bg: {
        primary: '#ffffff',
        secondary: '#f5f5f5',
        tertiary: '#ebebeb'
      },
      text: {
        primary: '#2c2e31',
        secondary: '#646669',
        accent: '#e2b714'
      },
      button: {
        primary: '#e2b714',
        secondary: '#646669',
        danger: '#ca4754'
      },
      border: '#646669',
      overlay: 'rgba(0, 0, 0, 0.1)'
    }
  },
  dark: defaultTheme,
  monokai: {
    name: 'Monokai',
    colors: {
      bg: {
        primary: '#272822',
        secondary: '#22231e',
        tertiary: '#1d1e19'
      },
      text: {
        primary: '#f8f8f2',
        secondary: '#75715e',
        accent: '#e6db74'
      },
      button: {
        primary: '#e6db74',
        secondary: '#75715e',
        danger: '#f92672'
      },
      border: '#75715e',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },
  nord: {
    name: 'Nord',
    colors: {
      bg: {
        primary: '#2e3440',
        secondary: '#292e39',
        tertiary: '#242933'
      },
      text: {
        primary: '#d8dee9',
        secondary: '#4c566a',
        accent: '#88c0d0'
      },
      button: {
        primary: '#88c0d0',
        secondary: '#4c566a',
        danger: '#bf616a'
      },
      border: '#4c566a',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },
  dracula: {
    name: 'Dracula',
    colors: {
      bg: {
        primary: '#282a36',
        secondary: '#242631',
        tertiary: '#1f212c'
      },
      text: {
        primary: '#f8f8f2',
        secondary: '#6272a4',
        accent: '#ff79c6'
      },
      button: {
        primary: '#ff79c6',
        secondary: '#6272a4',
        danger: '#ff5555'
      },
      border: '#6272a4',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },
  github: {
    name: 'GitHub',
    colors: {
      bg: {
        primary: '#0d1117',
        secondary: '#0a0c10',
        tertiary: '#06070a'
      },
      text: {
        primary: '#c9d1d9',
        secondary: '#8b949e',
        accent: '#58a6ff'
      },
      button: {
        primary: '#58a6ff',
        secondary: '#30363d',
        danger: '#f85149'
      },
      border: '#30363d',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },
  solarizedLight: {
    name: 'Solarized Light',
    colors: {
      bg: {
        primary: '#fdf6e3',
        secondary: '#eee8d5',
        tertiary: '#e1dbcd'
      },
      text: {
        primary: '#586e75',
        secondary: '#657b83',
        accent: '#268bd2'
      },
      button: {
        primary: '#268bd2',
        secondary: '#d3cfc4',
        danger: '#dc322f'
      },
      border: '#ccc6b6',
      overlay: 'rgba(0, 0, 0, 0.05)'
    }
  },
  nordLight: {
    name: 'Nord Light',
    colors: {
      bg: {
        primary: '#eceff4',
        secondary: '#e5e9f0',
        tertiary: '#d8dee9'
      },
      text: {
        primary: '#2e3440',
        secondary: '#4c566a',
        accent: '#5e81ac'
      },
      button: {
        primary: '#5e81ac',
        secondary: '#d8dee9',
        danger: '#bf616a'
      },
      border: '#d1d5db',
      overlay: 'rgba(0, 0, 0, 0.05)'
    }
  },
  midnightNeon: {
    name: 'Midnight Neon',
    colors: {
      bg: {
        primary: '#0b0f1a',
        secondary: '#131a26',
        tertiary: '#1a2332',
        quaternary: '#202c3a'
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
        accent: '#00ffff',
        subtle: '#38bdf8'
      },
      button: {
        primary: '#00ffff',
        secondary: '#1e293b',
        danger: '#f43f5e',
        success: '#34d399'
      },
      border: '#334155',
      overlay: 'rgba(0, 255, 255, 0.1)'
    }
  }
  ,
  blushLight: {
    name: 'Blush Light',
    colors: {
      bg: {
        primary: '#fffafa',
        secondary: '#fef2f2',
        tertiary: '#fce7f3',
        quaternary: '#f3e8ff'
      },
      text: {
        primary: '#4b5563',
        secondary: '#6b7280',
        accent: '#ec4899',
        subtle: '#d946ef'
      },
      button: {
        primary: '#ec4899',
        secondary: '#f9a8d4',
        danger: '#ef4444',
        success: '#10b981'
      },
      border: '#e5e7eb',
      overlay: 'rgba(0, 0, 0, 0.03)'
    }
  }
  ,
  frostbyte: {
    name: 'Frostbyte',
    colors: {
      bg: {
        primary: '#f8fafc',
        secondary: '#e2e8f0',
        tertiary: '#cbd5e1',
        quaternary: '#94a3b8'
      },
      text: {
        primary: '#1e293b',
        secondary: '#334155',
        accent: '#0ea5e9',
        subtle: '#0284c7'
      },
      button: {
        primary: '#0ea5e9',
        secondary: '#cbd5e1',
        danger: '#ef4444',
        success: '#22c55e'
      },
      border: '#cbd5e1',
      overlay: 'rgba(0, 0, 0, 0.05)'
    }
  }
  ,
  abyss: {
    name: 'Abyss',
    colors: {
      bg: {
        primary: '#0c0a09',
        secondary: '#1f1e1d',
        tertiary: '#2a2a2a',
        quaternary: '#373737'
      },
      text: {
        primary: '#f4f4f5',
        secondary: '#a1a1aa',
        accent: '#38bdf8',
        subtle: '#0ea5e9'
      },
      button: {
        primary: '#38bdf8',
        secondary: '#3f3f46',
        danger: '#f87171',
        success: '#4ade80'
      },
      border: '#52525b',
      overlay: 'rgba(255, 255, 255, 0.05)'
    }
  }
  ,
  solarized: {
    name: 'Solarized',
    colors: {
      bg: {
        primary: '#002b36',
        secondary: '#001f27',
        tertiary: '#00171c'
      },
      text: {
        primary: '#839496',
        secondary: '#586e75',
        accent: '#b58900'
      },
      button: {
        primary: '#b58900',
        secondary: '#586e75',
        danger: '#dc322f'
      },
      border: '#586e75',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  },
  gruvbox: {
    name: 'Gruvbox',
    colors: {
      bg: {
        primary: '#282828',
        secondary: '#1d2021',
        tertiary: '#141617'
      },
      text: {
        primary: '#ebdbb2',
        secondary: '#928374',
        accent: '#fe8019'
      },
      button: {
        primary: '#fe8019',
        secondary: '#504945',
        danger: '#fb4934'
      },
      border: '#504945',
      overlay: 'rgba(0, 0, 0, 0.5)'
    }
  }
};

//*  ==============================================================================================================
//*  Clock Themes =================================================================================================
export const clockThemes= {
    minimal: 'Minimal',
    digital: 'Digital',
    analog: 'Analog',
    modern: 'Modern',
    retro: 'Retro'
};

//*  ==============================================================================================================
//*  Fonts ========================================================================================================

export const fonts = {
    'JetBrains Mono': "'JetBrains Mono', monospace",
    'Fira Code': "'Fira Code', monospace",
    'Source Code Pro': "'Source Code Pro', monospace",
    'IBM Plex Mono': "'IBM Plex Mono', monospace",
    'Space Mono': "'Space Mono', monospace"
};

//*  ==============================================================================================================
//*  Default Settings =============================================================================================

export const defaultSettings = {
    headerSize: 20,
    bodySize: 14,
    clockSize: 24,
    sidebarSize: 13,
    linkSize: 13,
    theme: 'dark',
    customTheme: null,
    font: 'JetBrains Mono',
    showSeconds: true,
    showLinks: true,
    showClock: true,
    showRadio: true,
    clockTheme: 'minimal'
};