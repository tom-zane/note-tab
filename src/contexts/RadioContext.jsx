import { useState, useEffect, useRef, createContext, useContext } from "react";
import PropTypes from "prop-types";

import "tailwindcss/tailwind.css";

// const YT_SCRIPT_SRC = "https://www.youtube.com/iframe_api";
const YT_SCRIPT_SRC = "/radio.js";
const FALLBACK_THUMB = "https://placehold.co/150x150";

const defaultStations = [
  { name: "Synthwave", genre: "lofi", url: "https://www.youtube.com/watch?v=4xDzrJKXOOY" },
  { name: "Coffee", genre: "lofi", url: "https://www.youtube.com/watch?v=N_7cSl2oq3o" },
  { name: "Jazz", genre: "lofi", url: "https://www.youtube.com/watch?v=HuFYqnbVbzY" },
  { name: "Medivial", genre: "lofi", url: "https://www.youtube.com/watch?v=IxPANmjPaek" },
  { name: "Halo", genre: "lofi", url: "https://www.youtube.com/watch?v=HuFYqnbVbzY" },
  { name: "FlashFM", genre: "Pop", url: "https://www.youtube.com/watch?v=vqBbPH0aVXY" },
];

const RadioContext = createContext();

export const useRadio = () => useContext(RadioContext);

const parseStation = (s) => {
  const match = s.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  const vid = match ? match[1] : "";
  return {
    ...s,
    vid,
    thumb: vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : FALLBACK_THUMB,
  };
};

export function RadioProvider({ children }) {
  const [stations, setStations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);

  // Parse station data
  const parseStation = (s) => {
    const match = s.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    const vid = match ? match[1] : "";
    return {
      ...s,
      vid,
      thumb: vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : FALLBACK_THUMB,
    };
  };
  // get stations from localStorage
  useEffect(() => {
    const loadStationsFromStorage = () => {
      try {
        const storedData = localStorage.getItem("radioStations");
        const parsedStored = JSON.parse(storedData);

        if (Array.isArray(parsedStored) && parsedStored.length > 0) {
          const parsed = parsedStored.map(parseStation);
          setStations(parsed);
        } else {
          throw new Error("No valid stations in localStorage");
        }
      } catch (e) {
        const parsedDefaults = defaultStations.map(parseStation);
        setStations(parsedDefaults);
        localStorage.setItem("radioStations", JSON.stringify(defaultStations));
      }
    };

    loadStationsFromStorage();
  }, []);

  // Set stations in localStorage
  // useEffect(() => {
  //     console.log('Saving stations to localStorage:', stations.map(({ name, genre, url }) => ({ name, genre, url })));
  //     localStorage.setItem('radioStations', JSON.stringify(stations.map(({ name, genre, url }) => ({ name, genre, url }))));
  // }, [stations]);

  //? Set up YouTube player ========================================================================
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = YT_SCRIPT_SRC;
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, [stations]);

  // Initialize YouTube player
  function initPlayer() {
    if (ytPlayer.current) return;
    ytPlayer.current = new window.YT.Player(playerRef.current, {
      height: 0,
      width: 0,
      playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1 },
      events: {
        onReady: () => ytPlayer.current.setVolume(volume),
        onStateChange: (e) => {
          if ([window.YT.PlayerState.ENDED, window.YT.PlayerState.UNPLAYABLE].includes(e.data)) {
            nextStation();
          }
        },
        onError: () => nextStation(),
      },
    });
  }

  // Set volume
  useEffect(() => {
    if (ytPlayer.current?.setVolume) {
      ytPlayer.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = YT_SCRIPT_SRC;
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, [stations]);

  function initPlayer() {
    if (ytPlayer.current) return;
    ytPlayer.current = new window.YT.Player(playerRef.current, {
      height: 0,
      width: 0,
      playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1 },
      events: {
        onReady: () => ytPlayer.current.setVolume(volume),
        onStateChange: (e) => {
          if ([window.YT.PlayerState.ENDED, window.YT.PlayerState.UNPLAYABLE].includes(e.data)) {
            nextStation();
          }
        },
        onError: () => nextStation(),
      },
    });
  }

  useEffect(() => {
    if (ytPlayer.current?.setVolume) {
      ytPlayer.current.setVolume(volume);
    }
  }, [volume]);

  const playStation = (i) => {
    if (!stations[i] || !ytPlayer.current?.loadVideoById) return;
    ytPlayer.current.loadVideoById({ videoId: stations[i].vid });
    setCurrentIndex(i);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!ytPlayer.current) return;
    if (isPlaying) {
      ytPlayer.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playStation(currentIndex);
    }
  };

  const nextStation = () => playStation((currentIndex + 1) % stations.length);
  const prevStation = () => playStation((currentIndex - 1 + stations.length) % stations.length);
  const shuffleStation = () => playStation(Math.floor(Math.random() * stations.length));

  const saveStations = () => {
    //   console.log("Saving stations to localStorage:", stations.map(({ name, genre, url }) => ({ name, genre, url })));
    localStorage.setItem("radioStations", JSON.stringify(stations.map(({ name, genre, url }) => ({ name, genre, url }))));
  };

  const addStation = (name, genre, url) => {
    console.log("addStation", name, genre, url);
    if (name === "" || genre === "" || url === "") {
      console.error("Missing fields");
      return 0;
    }
    if (name.trim() === "" || genre.trim() === "" || url.trim() === "") {
      console.error("Missing fields 3");
      return 0;
    }

    setStations((prev) => [...prev, parseStation({ name, genre, url })]);
    saveStations();
  };

  const deleteStation = (index) => {
    console.log("deleteStation", index, currentIndex);
    if (index === currentIndex) {
      setCurrentIndex(0);
    }
    setStations((prev) => {
      const newStations = prev.filter((_, i) => i !== index);
      console.log("deleteStation > prev", prev);
      console.log("deleteStation > newStations", newStations);
      //   hacky solution,fix it later
      localStorage.setItem("radioStations", JSON.stringify(newStations));
      return newStations;
    });
    console.log("Updated stations", stations);
  };

  return (
    <RadioContext.Provider
      value={{
        stations,
        setStations,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIsPlaying,
        playStation,
        togglePlay,
        nextStation,
        prevStation,
        shuffleStation,
        volume,
        setVolume,
        saveStations,
        addStation,
        deleteStation,
        playerRef,
      }}>
      {children}
    </RadioContext.Provider>
  );
}

RadioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
