import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Search } from "lucide-react"; // Import icon tìm kiếm từ lucide-react
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";

import Playlist from "./components/Assets/Playlist";
import Home from "./components/Assets/HomeForm/Home";
import LovedSongs from "./components/Assets/LovedSongs";
import Chat from "./components/Assets/Chat";
import Login from "./components/Assets/LoginForm/LoginForm";
import SleepTimer from "./components/SleepTimer";

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
  const [currentSong, setCurrentSong] = useState({
    title: "No song playing",
    artist: "",
    cover: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  });

  return (
    <Router>
      <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
        {isLoggedIn ? (
          <>
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <header className="h-16 flex items-center justify-between px-6 bg-[#181818] border-b border-[#282828]">
                {/* Thanh tìm kiếm */}
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="What do you want to play?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#282828] text-white rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                {/* Các nút bên phải */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowSleepTimer(!showSleepTimer)}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Sleep Timer
                  </button>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-1.5 text-sm bg-gray-700 rounded-full hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </header>

              {/* Main Content */}
              <main className="flex-1 bg-[#121212] overflow-y-auto p-6">
                <Routes>
                  <Route path="/" element={<Home setCurrentSong={setCurrentSong} />} />
                  <Route path="/playlist/:id" element={<Playlist setCurrentSong={setCurrentSong} />} />
                  <Route path="/loved" element={<LovedSongs setCurrentSong={setCurrentSong} />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>

              {/* Music Player */}
              <MusicPlayer currentSong={currentSong} />
            </div>

            {/* Sleep Timer Popup */}
            {showSleepTimer && <SleepTimer onClose={() => setShowSleepTimer(false)} />}
          </>
        ) : (
          <Routes>
            <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}
