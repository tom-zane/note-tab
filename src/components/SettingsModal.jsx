import { useState } from "react";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";

// icons
import { FiX, FiSave, FiDownload, FiUpload } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import { MdEmail, MdDelete } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

// Contexts
import { useSettings } from "../contexts/SettingsContext";
import { useNotes } from "../contexts/NotesContext";
import { useLinks } from "../contexts/LinksContext";
import { useRadio } from "./../contexts/RadioContext";

export default function SettingsModal({ onClose }) {
  // Radio Setting States
  const [isStationListOpen, setIsStationListOpen] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const { addStation, deleteStation } = useRadio();

  const { settings, updateSettings, themes, clockThemes, fonts } = useSettings();
  const { notes, setNotes, setActiveNoteId } = useNotes();
  const { links, setLinks } = useLinks();

  const [tempSettings, setTempSettings] = useState(settings);
  const [password, setPassword] = useState("");
  const [importPassword, setImportPassword] = useState("");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return "None";
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Moderate";
    return "Strong";
  };

  const getPasswordStrengthClass = (password) => {
    const strength = getPasswordStrength(password);
    if (strength === "Weak") return "text-red-500";
    if (strength === "Moderate") return "text-yellow-500";
    if (strength === "Strong") return "text-green-500";
    return "text-[var(--text-secondary)]";
  };

  const handleSave = () => {
    updateSettings(tempSettings);
    onClose();
  };

  const handleChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  //? User Settings Export ///////////////////////////////////////////////////////////////////

  const handleExport = () => {
    console.log("handleExport", notes, settings);

    const data = {
      settings: tempSettings,
      notes: notes,
      activeNoteId: 0,
      links: links,
    };

    const jsonStr = JSON.stringify(data);
    const encrypted = password ? CryptoJS.AES.encrypt(jsonStr, password).toString() : jsonStr;

    const blob = new Blob([encrypted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportDialog(false);
    setPassword("");
  };

  //? User Settings Import ///////////////////////////////////////////////////////////////////
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let data;

        try {
          try {
            const decrypted = CryptoJS.AES.decrypt(content, importPassword).toString(CryptoJS.enc.Utf8);
            data = JSON.parse(decrypted);
          } catch {
            data = JSON.parse(content); // Fallback to unencrypted JSON
          }
        } catch {
          alert("⛔⛔INVAILD FILE or WRONG PASSWORD⛔⛔");
          console.error("Invalid file or wrong password");
          setShowImportDialog(false);
          setImportPassword("");
        }

        // Setting Imported Data ===================
        if (data.settings) {
          updateSettings(data.settings);
          setTempSettings(data.settings);
        }

        if (data.links) {
          setLinks(data.links);
        }

        if (data.notes) {
          setNotes(data.notes);
        }

        if (data.activeNoteId) {
          setActiveNoteId(data.activeNoteId);
        }
        // ===================================
        setShowImportDialog(false);
        setImportPassword("");
      } catch (error) {
        alert("Invalid file or wrong password");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  //  ==========================================================================
  //  ==========================================================================

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center z-40 ">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-mono text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* ======================================================================================== */}
          {/* Theme Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Theme</h2>
          {/* Theme Setting - Theme Selection  */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Theme</label>
            <select value={tempSettings.theme} onChange={(e) => handleChange("theme", e.target.value)} className="p-1.5 text-sm rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]">
              {Object.entries(themes).map(([key, theme]) => (
                <option key={key} value={key}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* ======================================================================================== */}
          {/* Font Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Text</h2>
          {/* Font Settings - Font Selection */}

          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Font Family</label>
            <select value={tempSettings.font} onChange={(e) => handleChange("font", e.target.value)} className="p-1.5 text-sm rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]">
              {Object.keys(fonts).map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          {/* Font Settings -  Header Size Selection */}

          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Header Text Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="16"
                max="48"
                value={tempSettings.headerSize}
                onChange={(e) => handleChange("headerSize", Number(e.target.value))}
                className="flex-1 [&::-webkit-slider-thumb]:bg-[var(--text-accent)] [&::-webkit-slider-runnable-track]:bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:border-[var(--text-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--text-accent) 0%, var(--text-accent) ${((tempSettings.headerSize - 16) * 100) / 32}%, var(--bg-tertiary) ${((tempSettings.headerSize - 16) * 100) / 32}%, var(--bg-tertiary) 100%)`,
                }}
              />
              <span className="font-mono text-sm text-[var(--text-primary)] w-12">{tempSettings.headerSize}px</span>
            </div>
          </div>
          {/* Font Settings -  Body Size Selection */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Body Text Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                value={tempSettings.bodySize}
                onChange={(e) => handleChange("bodySize", Number(e.target.value))}
                className="flex-1 [&::-webkit-slider-thumb]:bg-[var(--text-accent)] [&::-webkit-slider-runnable-track]:bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:border-[var(--text-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--text-accent) 0%, var(--text-accent) ${((tempSettings.bodySize - 12) * 100) / 12}%, var(--bg-tertiary) ${((tempSettings.bodySize - 12) * 100) / 12}%, var(--bg-tertiary) 100%)`,
                }}
              />
              <span className="font-mono text-sm text-[var(--text-primary)] w-12">{tempSettings.bodySize}px</span>
            </div>
          </div>

          {/* Font Settings -  Sidebar Size Selection */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Sidebar Text Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="20"
                value={tempSettings.sidebarSize}
                onChange={(e) => handleChange("sidebarSize", Number(e.target.value))}
                className="flex-1 [&::-webkit-slider-thumb]:bg-[var(--text-accent)] [&::-webkit-slider-runnable-track]:bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:border-[var(--text-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--text-accent) 0%, var(--text-accent) ${((tempSettings.sidebarSize - 12) * 100) / 8}%, var(--bg-tertiary) ${((tempSettings.sidebarSize - 12) * 100) / 8}%, var(--bg-tertiary) 100%)`,
                }}
              />
              <span className="font-mono text-sm text-[var(--text-primary)] w-12">{tempSettings.sidebarSize}px</span>
            </div>
          </div>

          {/* ======================================================================================== */}
          {/* Radio Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Radio</h2>
          <div className="grid grid-cols-2 gap-3 items-center ">
            <label className="font-mono text-sm text-[var(--text-primary)]">Show Radio</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={tempSettings.showRadio} onChange={() => handleChange("showRadio", true)} name="showRadio" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Show</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={!tempSettings.showRadio} onChange={() => handleChange("showRadio", false)} name="showRadio" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Hide</span>
              </label>
            </div>
          </div>

          {/* Radio Settings - List Stations / Delete Stations */}
          <div className="grid grid-cols-2 gap-3 items-start">
            <label className="font-mono text-sm text-[var(--text-primary)]">Available Stations</label>

            <div className="flex flex-col ">
              {isStationListOpen && (
                <div className="flex max-h-32 overflow-x-clip overflow-y-scroll scrollbar flex-col p-2 bg-[var(--bg-secondary)] rounded-md">
                  {Array.from(JSON.parse(localStorage.getItem("radioStations"))).map((station, i) => {
                    return (
                      <div key={station.name}  className="flex w-full py-1 border-b-[1px] border-b-[var(--border)] items-center justify-between  ">
                        <span className="text-xs w-[80%] truncate" value={station.url}>
                          {i + 1}. {station.genre} | {station.name}
                        </span>
                        <button onClick={() => deleteStation(i)} className="text-lg  py-1 flex items-center justify-center w-[15%] text-white rounded-sm  cursor-pointer hover:bg-[#cb4335] bg-[#e74c3c]">
                        < RiDeleteBinLine />
                        </button>
                      </div>
                    );
                  })}
                  {Array.from(JSON.parse(localStorage.getItem("radioStations"))).length === 0 && <span className="text-xs text-[var(--text-secondary)]">No Stations Added</span>}
                </div>
              )}
            </div>
          </div>
          {/* Radio Settings - Add New Station */}
          <div className="grid grid-cols-2 gap-3 items-start">
            <label className="font-mono text-sm text-[var(--text-primary)]">Add New Station</label>

            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full outline-none border-[1px] border-[var(--border)] mb-1 p-1 bg-[var(--bg-secondary)] rounded placeholder-gray-400 text-[var(--text-primary)]"
              />
              <input
                type="text"
                placeholder="Genre"
                value={genreInput}
                onChange={(e) => setGenreInput(e.target.value)}
                className="w-full border-[1px] border-[var(--border)] outline-none mb-1 p-1 bg-[var(--bg-secondary)] rounded placeholder-gray-400 text-[var(--text-primary)]"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full border-[1px] border-[var(--border)] outline-none mb-2 p-1 bg-[var(--bg-secondary)] rounded placeholder-gray-400 text-[var(--text-primary)]"
              />
              <button onClick={() => addStation(nameInput, genreInput, urlInput)} className="w-full py-1 bg-[var(--button-primary)] hover:bg-[var(--button-secondary)]  rounded text-[var(--bg-primary)] hover:text-[var(--text-primary)] text-sm">
                Save Station
              </button>
            </div>
          </div>

          {/* ======================================================================================== */}
          {/* Clock Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Clock</h2>
          {/* Clock Settings - Clock Theme */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Clock Theme</label>
            <select value={tempSettings.clockTheme} onChange={(e) => handleChange("clockTheme", e.target.value)} className="p-1.5 text-sm rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-primary)]">
              {Object.entries(clockThemes).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Clock Settings - Show Clock */}
          <div className="grid grid-cols-2 gap-3 items-center ">
            <label className="font-mono text-sm text-[var(--text-primary)]">Show Clock</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={tempSettings.showClock} onChange={() => handleChange("showClock", true)} name="showClock" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Show</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={!tempSettings.showClock} onChange={() => handleChange("showClock", false)} name="showClock" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Hide</span>
              </label>
            </div>
          </div>

          {/*? Clock Settings - Show Seconds */}

          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Show Seconds</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={tempSettings.showSeconds} onChange={() => handleChange("showSeconds", true)} name="showSeconds" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Show</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={!tempSettings.showSeconds} onChange={() => handleChange("showSeconds", false)} name="showSeconds" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Hide</span>
              </label>
            </div>
          </div>

          {/* Clock Setting - Clock Size */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Clock Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="14"
                max="32"
                value={tempSettings.clockSize}
                onChange={(e) => handleChange("clockSize", Number(e.target.value))}
                className="flex-1 [&::-webkit-slider-thumb]:bg-[var(--text-accent)] [&::-webkit-slider-runnable-track]:bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:border-[var(--text-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--text-accent) 0%, var(--text-accent) ${((tempSettings.clockSize - 14) * 100) / 18}%, var(--bg-tertiary) ${((tempSettings.clockSize - 14) * 100) / 18}%, var(--bg-tertiary) 100%)`,
                }}
              />
              <span className="font-mono text-sm text-[var(--text-primary)] w-12">{tempSettings.clockSize}px</span>
            </div>
          </div>

          {/* ======================================================================================== */}
          {/* Links Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Links</h2>
          {/* Links Setting - Links Visibility */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Show Links Sidebar</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={tempSettings.showLinks} onChange={() => handleChange("showLinks", true)} name="showLinks" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Show</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" checked={!tempSettings.showLinks} onChange={() => handleChange("showLinks", false)} name="showLinks" className="accent-[var(--text-accent)]" />
                <span className="text-sm text-[var(--text-primary)]">Hide</span>
              </label>
            </div>
          </div>

          {/* Links Setting - Links Size */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <label className="font-mono text-sm text-[var(--text-primary)]">Links Text Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="20"
                value={tempSettings.linkSize}
                onChange={(e) => handleChange("linkSize", Number(e.target.value))}
                className="flex-1 [&::-webkit-slider-thumb]:bg-[var(--text-accent)] [&::-webkit-slider-runnable-track]:bg-[var(--bg-tertiary)] [&::-webkit-slider-thumb]:border-[var(--text-accent)]"
                style={{
                  background: `linear-gradient(to right, var(--text-accent) 0%, var(--text-accent) ${((tempSettings.linkSize - 12) * 100) / 8}%, var(--bg-tertiary) ${((tempSettings.linkSize - 12) * 100) / 8}%, var(--bg-tertiary) 100%)`,
                }}
              />
              <span className="font-mono text-sm text-[var(--text-primary)] w-12">{tempSettings.linkSize}px</span>
            </div>
          </div>

          {/* ======================================================================================== */}
          {/* Backup Settings Header */}
          <h2 className="mb-2 font-semibold text-xl border-b-2 border-b-[var(--border)]">Backup/Restore</h2>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setShowExportDialog(prev => !prev)} className="px-4 py-2 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded-lg flex items-center gap-2 hover:bg-opacity-80">
              <FiDownload size={14} /> Export Settings
            </button>
            <button onClick={() => setShowImportDialog(prev => !prev)} className="px-4 py-2 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded-lg flex items-center gap-2 hover:bg-opacity-80">
              <FiUpload size={14} /> Import Settings
            </button>
          </div>

          {/* Backup/Restore Setting - Export */}
          {showExportDialog && (
            <div className="mb-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
              <h3 className="text-md font-mono text-[var(--text-primary)] mb-3">Export Settings</h3>

              <span className="text-[var(--text-warning)] font-bold">⚠ Warning:</span>
              <input
                type="password"
                placeholder="Password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-3 mt-3 rounded border bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]"
              />
              {/* Password Strength Indicator ======== */}
              <div className="text-sm text-[var(--text-secondary)] mt-1">
                Password Strength: <span className={`font-bold ${getPasswordStrengthClass(password)}`}>{getPasswordStrength(password)}</span>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowExportDialog(false)} className="px-3 py-1.5 bg-[var(--button-secondary)] text-[var(--text-primary)] rounded">
                  Cancel
                </button>
                <button onClick={handleExport} className="px-3 py-1.5 bg-[var(--button-primary)] text-[var(--bg-primary)] rounded">
                  Export
                </button>
              </div>
            </div>
          )}

          {/* Backup/Restore Setting - Import */}
          {showImportDialog && (
            <div className="mb-6 p-4 bg-[var(--bg-tertiary)] rounded-lg">
              <h3 className="text-sm font-mono text-[var(--text-primary)] mb-3">Import Settings</h3>
              <p>Please enter File Password before you upload the file.</p>
              <input
                type="password"
                placeholder="Password (if encrypted)"
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
                className="w-full p-2 mb-3 rounded border bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)]"
              />
              {/*  */}
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center  hover:bg-[var(--bg-primary)] bg-[var(--bg-secondary)]  text-[var(--text-primary)] border-dashed border-[var(--button-primary)] border-2 rounded-xl p-8 text-center cursor-pointer transition ">
                <svg className="w-12 h-12 text-[var(--text-secondary)] mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4h.01M12 16v4" />
                </svg>
                <p className="text-[var(--text-secondary)]">
                  <span className="font-medium text-[var(--text-primary)]">Click to upload</span>
                </p>
              </label>
              <input type="file" id="file-upload" accept=".json" onChange={handleImport} className="hidden" />

              <div className="flex justify-end">
                <button onClick={() => setShowImportDialog(false)} className="px-3 py-1.5 bg-[var(--button-secondary)] text-[var(--text-primary)] hover:bg-[var(--button-primary)] mt-4 rounded">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================================== */}
        {/* Contact Me  Header */}
        <h2 className="my-4 font-semibold text-xl border-b-2 border-b-[var(--border)]">Contact/Feedback</h2>
        <p className=" text-sm text-[var(--text-secondary)]">If you have any questions, feature requests, or feedback, please don't hesitate to reach out.</p>
        {/* Contact Me - WhatsApp */}

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/916006209674"
          className="px-4 flex flex-row w-full  py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] mt-4 rounded">
          <IoLogoWhatsapp className="mr-1.5" size={24} /> WhatsApp
        </a>

        {/* Contact Me - Telegram */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://t.me/arubk744"
          className="px-4 flex flex-row w-full  py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] mt-4 rounded">
          <FaTelegram className="mr-1.5" size={24} /> Telegram
        </a>
        {/* Contact Me - Buy Me A Coffee */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://buymeacoffee.com/aryan744"
          className="px-4 flex flex-row w-full  py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] mt-4 rounded">
          <SiBuymeacoffee className="mr-1.5" size={24} /> Fund my crippling Heroin Addiction /s
        </a>
        {/* Contact Me - Email */}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="mailto:arubk744@gmail.com"
          className="px-4 flex flex-row w-full  py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] mt-4 rounded">
          <MdEmail className="mr-1.5" size={24} /> Email Me - arubk744@gmail.com
        </a>

        {/* =============================================================================================== */}
        {/* =============================================================================================== */}
        {/* SAVE SETTINGS */}
        <div className="flex justify-end mt-6">
          <button onClick={handleSave} className="px-6 py-3 text-sm bg-[var(--button-primary)] text-[var(--bg-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-secondary)] rounded-lg flex items-center hover:bg-opacity-80">
            <FiSave className="mr-1.5" size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

SettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
