import { useState, useEffect, useRef } from "react";
import { useRadio } from "../../contexts/RadioContext";
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineStepBackward, AiOutlineStepForward, AiOutlineSwap, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import "tailwindcss/tailwind.css";

import { FaVolumeDown, FaVolumeMute, FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import { useSettings } from "../../contexts/SettingsContext";

export default function RadioPlayer() {
  // Context
  const { stations, currentIndex, isPlaying, togglePlay, nextStation, prevStation, shuffleStation, volume, setVolume, playerRef } = useRadio();
  const { settings } = useSettings();

  // JSX
  return (
    <div className={`w-3xl   flex-col justify-center items-center ${settings.showRadio === false ? "hidden" : "flex" }   px-6 py-2  bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-md`}>
      {stations && stations.length !== 0 ? (
        <>
          <div className="flex items-center flex-row  space-x-4">
            {/* Thumbnail =============================================================== */}
            <div className="relative">
              <div ref={playerRef} className="hidden"></div>
              <img src={stations[currentIndex]?.thumb} alt="thumbnail" className="w-20 h-15 object-cover rounded-md" onError={(e) => (e.target.src = FALLBACK_THUMB)} />
            </div>

            <div className="flex-1  ">
              {/* Station Info ================================ */}
              <span className="flex flex-row w-full justify-between items-center">
                <h2 className="text-sm mr-2 text-[var(--text-primary)] font-semibold mb-1">{stations[currentIndex]?.name}</h2>
                <p className="text-xs text-[var(--text-secondary)]">{stations[currentIndex]?.genre}</p>
              </span>
              {/* Media Controls ====================== */}
              <div className="flex items-center flex-row space-x-4 ">
                <button onClick={prevStation} className="text-xl rounded-md p-1  hover:bg-[var(--bg-tertiary)]">
                  <AiOutlineStepBackward />
                </button>
                <button onClick={togglePlay} className="text-3xl bg-[var(--button-primary)] text-[var(--bg-primary)] rounded-full hover:bg-[var(--button-secondary)] hover:text-[var(--text-primary)]">
                  {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                </button>
                <button onClick={nextStation} className="text-xl rounded-md p-1  hover:bg-[var(--bg-tertiary)]">
                  <AiOutlineStepForward />
                </button>
                <button onClick={shuffleStation} className="text-xl rounded-md p-1  hover:bg-[var(--bg-tertiary)]">
                  <AiOutlineSwap />
                </button>
              </div>
            </div>
          </div>
          {/*? Volume Slider =========================================================== */}
          <div className="flex mt-1 flex-row w-full justify-center items-center">
            {/* Icon ====================*/}
            <span className="text-sm mr-2 cursor-pointer" onClick={() => setVolume(0)}>
              {volume === 0 ? <FaVolumeMute /> : null}
              {volume > 0 && volume < 50 ? <FaVolumeDown /> : null}
              {volume >= 50 ? <FaVolumeUp /> : null}
            </span>

            {/* Input Slider =============*/}
            <input
              type="range"
              style={{ "--val": volume }}
              onInput={(e) => "this.style.setProperty('--val', this.value)"}
              className=" w-full   appearance-none bg-transparent ios-slider"
              value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              id="range"
            />
            {/* Volume Value =============*/}
            <span className="text-xs ml-2">{volume}</span>
          </div>{" "}
        </>
      ) : (
        <div className="flex items-start justify-start flex-col p-2">
          <span className="text-sm ">No Station Available</span>
          <span className="text-sm ">Add One in Settings</span>
        </div>
      )}
    </div>
  );
}
