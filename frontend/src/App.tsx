import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Search, UserIcon, Mic, X, CrownIcon } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import Playlist from "./pages/Playlist";
import Home from "./components/Assets/HomeForm/Home";
import AllSongs from "./pages/AllSongs";
import AdminPage from "./Admin";
import Chat from "./pages/Chat";
import SearchResults from "./pages/SearchResults";
import { AudioProvider } from "./AudioContext";
import RequireAuth from "./routes/RequireAuth";
import LoginAdmin from "./pages/LoginAdmin";
import LoginUser from "./pages/LoginUser";
import UserMenu from "./components/UserMenu";
import UserProfile from "./pages/UserProfile";
import UserChangePass from "./pages/UserChangePass";
import ViewAlbum from "./pages/ViewAlbum";
import PremiumSignup from "./pages/PremiumSignup";

type MainLayoutProps = {
  children: React.ReactNode;
  setSearchQuery: (value: string) => void;
  searchQuery: string;
  setShowSleepTimer: React.Dispatch<React.SetStateAction<boolean>>;
  showSleepTimer: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: { id: number; username: string; email: string; created_at?: string; isPremium?: boolean } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{
      id: number;
      username: string;
      email: string;
      created_at?: string;
      isPremium?: boolean;
    } | null>
  >;
  isListening?: boolean;
  showMicOverlay?: boolean;
  toggleMicOverlay?: () => void;
  startListening?: () => void;
  stopListening?: () => void;
};

function MainLayout({
  children,
  setSearchQuery,
  searchQuery,
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isListening,
  showMicOverlay,
  toggleMicOverlay,
  startListening,
  stopListening,
}: MainLayoutProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}&trigger=true`);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      <Sidebar isLoggedIn={isLoggedIn} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-[#181818] border-b border-[#282828] z-10">
          <div className="relative w-72 flex items-center">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Bạn muốn nghe gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-10 pr-10 py-2 bg-[#282828] text-white rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-gray-500"
            />
            {toggleMicOverlay && (
              <button
                onClick={toggleMicOverlay}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  isListening ? "bg-red-500" : "bg-gray-500"
                }`}
                title={isListening ? "Dừng ghi âm" : "Tìm kiếm bằng giọng nói"}
              >
                <Mic size={18} className="text-white" />
              </button>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                {isLoggedIn && user ? (
                  <div
                    className="user-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <div
                      className="avatar"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: user.isPremium
                          ? 'linear-gradient(135deg, #ffd700, #ffaa00)'
                          : 'linear-gradient(135deg, #6e8efb, #a777e3)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        boxShadow: user.isPremium ? '0 0 8px rgba(255, 215, 0, 0.5)' : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {user.isPremium && (
                        <div
                          className="premium-glow"
                          style={{
                            position: 'absolute',
                            inset: '-2px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3), transparent)',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                      )}
                      <span style={{ position: 'relative', zIndex: 10 }}>
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                      {user.isPremium && (
                        <CrownIcon
                          size={18}
                          color="gold"
                          className="crown-icon"
                          style={{
                            filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6))',
                            transform: 'scale(1)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      )}
                  </div>
                ) : (
                  <div
                    className="guest-container"
                    style={{
                      padding: '6px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <UserIcon
                      size={22}
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                      }}
                    />
                  </div>
                )}
                <style>
                  {`
                    @keyframes pulse {
                      0% { transform: scale(1); opacity: 0.8; }
                      50% { transform: scale(1.2); opacity: 0.4; }
                      100% { transform: scale(1); opacity: 0.8; }
                    }

                    .user-container:hover {
                      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
                      transform: translateY(-2px);
                      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
                    }

                    .crown-icon:hover {
                      transform: scale(1.2);
                    }

                    .guest-container:hover {
                      background: rgba(255, 255, 255, 0.15);
                      transform: scale(1.1);
                    }
                  `}
                </style>
              </div>
            </button>
              {showUserMenu && (
                <UserMenu
                  isLoggedIn={isLoggedIn}
                  user={user}
                  setIsLoggedIn={setIsLoggedIn}
                  setUser={setUser}
                  onClose={() => setShowUserMenu(false)}
                />
              )}
          </div>
        </header>
        <main className="flex-1 bg-[#121212] overflow-y-auto p-0">
          {children}
        </main>
        {showMicOverlay && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-lg p-6 w-80 shadow-lg relative">
              <button
                onClick={stopListening}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                title="Đóng"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium mb-4">
                  {isListening ? "Đang nghe..." : "Nhấn để nói"}
                </p>
                <button
                  onClick={startListening}
                  className={`p-4 rounded-full transition-colors ${
                    isListening
                      ? "bg-[#1DB954] opacity-90"
                      : "bg-[#1DB954] hover:opacity-90"
                  }`}
                  title={isListening ? "Đang thu âm" : "Bắt đầu thu âm"}
                >
                  <Mic size={24} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        <MusicPlayer />
      </div>
    </div>
  );
}

function AppContent({
  setSearchQuery,
  searchQuery,
  setShowSleepTimer,
  showSleepTimer,
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
}: Omit<MainLayoutProps, "children" | "isListening" | "showMicOverlay" | "toggleMicOverlay" | "startListening" | "stopListening">) {
  const [isListening, setIsListening] = useState(false);
  const [showMicOverlay, setShowMicOverlay] = useState(false);
  const navigate = useNavigate();

  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const normalizeTranscript = (text: string): string => {
    return text
      .replace(/[.,!?]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  };

  useEffect(() => {
    if (recognition) {
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        console.log("Raw transcript:", transcript);
        const normalizedTranscript = normalizeTranscript(transcript);
        console.log("Normalized transcript:", normalizedTranscript);
        setSearchQuery(normalizedTranscript);
        navigate(`/search?query=${encodeURIComponent(normalizedTranscript)}&trigger=true`);
        setIsListening(false);
        setShowMicOverlay(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setShowMicOverlay(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setShowMicOverlay(false);
      };
    }
  }, [recognition, navigate, setSearchQuery]);

  const toggleMicOverlay = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setShowMicOverlay(false);
      } else {
        setShowMicOverlay(true);
      }
    } else {
      alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.");
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
    setIsListening(false);
    setShowMicOverlay(false);
  };

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />
      <Route
        path="/login"
        element={
          <LoginUser
            setIsLoggedIn={setIsLoggedIn}
            onLogin={(_email, _password, userData) => {
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            }}
          />
        }
      />
      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route
        path="*"
        element={
          <MainLayout
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            setShowSleepTimer={setShowSleepTimer}
            showSleepTimer={showSleepTimer}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            user={user}
            setUser={setUser}
            isListening={isListening}
            showMicOverlay={showMicOverlay}
            toggleMicOverlay={toggleMicOverlay}
            startListening={startListening}
            stopListening={stopListening}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playlist/:id" element={<Playlist />} />
              <Route path="/all_songs" element={<AllSongs />} />
              <Route path="/viewalbum/:id" element={<ViewAlbum />} />
              <Route path="/chat" element={<Chat />} />
              <Route
                path="/search"
                element={
                  <SearchResults
                    query={new URLSearchParams(window.location.search).get("query") || ""}
                    searchTrigger={new URLSearchParams(window.location.search).get("trigger") === "true"}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <UserProfile user={user} setUser={setUser} />
                  </RequireAuth>
                }
              />
              <Route
                path="/changepass"
                element={
                  <RequireAuth>
                    <UserChangePass />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />

              <Route
                path="/premium"
                element={
                  <RequireAuth>
                    <PremiumSignup user={user} setUser={setUser} />
                  </RequireAuth>
                }
              />
              <Route
                path="/premium/vnpay_return"
                element={<PremiumSignup user={user} setUser={setUser} />}
              />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

export function App() {
  const [showSleepTimer, setShowSleepTimer] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
    created_at?: string;
    isPremium?: boolean;
  } | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <AudioProvider>
      <Router>
        <AppContent
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          setShowSleepTimer={setShowSleepTimer}
          showSleepTimer={showSleepTimer}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          setUser={setUser}
        />
      </Router>
    </AudioProvider>
  );
}