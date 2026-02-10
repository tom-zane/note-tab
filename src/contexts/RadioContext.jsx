import { createContext, useContext, useEffect, useState } from "react";

const RadioContext = createContext(null);
export const useRadio = () => useContext(RadioContext);

/* ---------- helpers ---------- */

/**
 * song_name-genre.mp3
 * → { name: "Song Name", genre: "genre" }
 */
function parseStationMeta(filename = "") {
  const base = filename.replace(/\.mp3$/i, "");
  const [rawName, rawGenre = "unknown"] = base.split("-");

  return {
    name: rawName
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase()),
    genre: rawGenre.toLowerCase(),
  };
}

/* ---------- provider ---------- */

export function RadioProvider({ children }) {
  const [stations, setStations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  /* Fetch playlist once */
  useEffect(() => {
    let cancelled = false;

    fetch("https://music-server.aryanue195035ece.workers.dev/playlist")
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;

        const parsed = data.tracks
          .filter(t => t.size > 0 && t.name.toLowerCase().endsWith(".mp3"))
          .map(t => {
            const meta = parseStationMeta(t.name);

            return {
              id: t.name,      // stable key
              url: t.url,
              thumb: t.thumb,
              name: meta.name,
              genre: meta.genre,
            };
          });

          console.log("[RADIO] fetched stations", parsed);
        setStations(parsed);
      })
      .catch(err => {
        console.error("[RADIO] playlist fetch failed", err);
        setStations([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Keep index valid if station list changes */
  useEffect(() => {
    if (currentIndex >= stations.length) {
      setCurrentIndex(0);
      setPlaying(false);
    }
  }, [stations, currentIndex]);

  /* ---------- controls ---------- */

  const playIndex = (i) => {
    if (!stations[i]) return;
    setCurrentIndex(i);
    setPlaying(true);
  };

  const nextStation = () => {
    if (!stations.length) return;
    playIndex((currentIndex + 1) % stations.length);
  };

  const prevStation = () => {
    if (!stations.length) return;
    playIndex((currentIndex - 1 + stations.length) % stations.length);
  };

  const shuffleStation = () => {
    if (!stations.length) return;
    playIndex(Math.floor(Math.random() * stations.length));
  };

  return (
    <RadioContext.Provider
      value={{
        /* data */
        stations,
        currentIndex,
        current: stations[currentIndex] || null,

        /* state */
        playing,
        volume,

        /* setters */
        setVolume,
        setPlaying,

        /* actions */
        togglePlay: () => setPlaying(p => !p),
        playIndex,
        nextStation,
        prevStation,
        shuffleStation,
      }}
    >
      {children}
    </RadioContext.Provider>
  );
}
