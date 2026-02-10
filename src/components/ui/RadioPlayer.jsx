import { useEffect, useRef } from "react";
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineStepBackward, AiOutlineStepForward, AiOutlineSwap } from "react-icons/ai";
import { FaVolumeDown, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useRadio } from "../../contexts/RadioContext";

import {
  toTitleCase,
  getCachedThumb,
  cacheThumb,
  preloadThumbnails,
  parseTrackMeta,
  toCamelCase,
  parseNameAndGenre,
  enforceOfflineCache,
  commitListening,
  getTopFiveFromHabits,
  getCachedTrack, 
  generateFallbackThumb,
  loadHabits,
  saveHabits,
} from "./../../utils/radio-player-helpers";

export default function RadioPlayer() {
  const audioRef = useRef(null);
  const playStartedAt = useRef(null);
  const { current, stations, currentIndex, playing, volume, setVolume, togglePlay, nextStation, prevStation, shuffleStation, setPlaying, playIndex } = useRadio();

  // Enforce offline cache based on listening habits
  useEffect(() => {
    if (!stations.length) return;
    enforceOfflineCache(stations);
  }, [stations]);
  // Preload thumbnails for all stations for smoother UI experience
  useEffect(() => {
    if (!stations.length) return;
    preloadThumbnails(stations);
  }, [stations]);
  // player listening habits for "most played" station
  useEffect(() => {
    if (!current) return;

    // when switching tracks, commit previous one
    return () => {
      commitListening(current.id, playStartedAt.current);
      playStartedAt.current = null;
    };
  }, [current]);

  // when play/pause is toggled, commit listening time for current track
  useEffect(() => {
    if (!current) return;

    if (playing) {
      playStartedAt.current = Date.now();
      return;
    }

    commitListening(current.id, playStartedAt.current);
    playStartedAt.current = null;
  }, [playing]);

  // ===================================================================================
  // Load track from cache if available, otherwise stream. This runs on station change.
  useEffect(() => {
    if (!audioRef.current || !current) return;

    let revokedUrl = null;

    (async () => {
      const cached = await getCachedTrack(current.id);

      if (cached) {
        console.log("[AUDIO] cache hit", current.id);
        const objectUrl = URL.createObjectURL(cached);
        revokedUrl = objectUrl;
        audioRef.current.src = objectUrl;
      } else {
        console.log("[AUDIO] streaming", current.id);
        audioRef.current.src = current.url;
      }

      if (playing) {
        audioRef.current.play().catch(() => {});
      }
    })();

    return () => {
      if (revokedUrl) {
        URL.revokeObjectURL(revokedUrl);
      }
    };
  }, [current]);

  // Media Session API integration
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;

    const { title, genre } = parseTrackMeta(current.id);

    navigator.mediaSession.metadata = new MediaMetadata({
      title, // Song Name
      artist: genre, // genre shown as artist
      album: "NoteTab Radio",
      artwork: [
        {
          src: current.thumb || "/default-radio.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      setPlaying(true);
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      setPlaying(false);
    });

    navigator.mediaSession.setActionHandler("previoustrack", prevStation);
    navigator.mediaSession.setActionHandler("nexttrack", nextStation);
  }, [current]);

  // Update media session playback state
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
  }, [playing]);

  // Sync play/pause state to audio element
  useEffect(() => {
    if (!audioRef.current || !current) return;

    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing, current]);

  // Sync volume changes to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* AFTER hooks — safe early return */
  if (!current) return null;

  const { name, genre } = parseNameAndGenre(current.id);

  return (
    <div className="bg-[var(--bg-tertiary)] rounded-lg overflow-hidden min-w-[250px] w-[350px]">
      {/* AUDIO ENGINE */}
      <audio ref={audioRef} preload="auto" onEnded={nextStation} />

      {/* PLAYER ROW */}

      <div className="flex h-24">
        {/* THUMBNAIL — 40% */}
        <div className="w-[30%] aspect-square">
          <img src={current.thumb || generateFallbackThumb(current.id)} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="w-[70%]  flex flex-col justify-between">
          <div className=" px-4 py-2">
            {/* Title */}
            <div className="flex justify-between items-start">
              <h2 className="text-sm font-semibold leading-tight">{name}</h2>
              <span className="text-xs text-[var(--text-secondary)]">{genre}</span>
            </div>

            {/*================= Radio Controls =========================================*/}
            <div className="flex w-full items-center mt-2 justify-center ">
              <div className="flex     gap-3 items-center">
                <button className="text-xl" onClick={prevStation}>
                  <AiOutlineStepBackward />
                </button>

                <button onClick={togglePlay} className="text-3xl">
                  {playing ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                </button>

                <button className="text-xl" onClick={nextStation}>
                  <AiOutlineStepForward />
                </button>

                <button className="text-xl" onClick={shuffleStation}>
                  <AiOutlineSwap />
                </button>
              </div>
            </div>
          </div>
          {/*============================= Volume Controls ================================================ */}

          <div className="flex items-center px-2 py-1 gap-2 mb-2 ">
            <span onClick={() => setVolume(0)}>{volume === 0 ? <FaVolumeMute /> : volume < 0.5 ? <FaVolumeDown /> : <FaVolumeUp />}</span>

            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full" />
          </div>
        </div>
      </div>

      {/* VOLUME */}
    </div>
  );
}
