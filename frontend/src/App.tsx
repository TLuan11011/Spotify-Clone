import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Search } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import Playlist from "./pages/Playlist";
import Home from "./components/Assets/HomeForm/Home";
import SleepTimer from "./components/SleepTimer";
import AllSongs from "./pages/AllSongs";
import AdminPage from "./Admin";
import Chat from "./pages/Chat"
import { AudioProvider } from "./AudioContext";
import RequireAuth from "./routes/RequireAuth";
import LoginAdmin from "./pages/LoginAdmin";
import LoginUser from "./pages/LoginUser";

type MainLayoutProps = {
  children: React.ReactNode;
  setSearchQuery: (value: string) => void;
  searchQuery: string;
  setShowSleepTimer: React.Dispatch<React.SetStateAction<boolean>>;
  showSleepTimer: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: { id: number; username: string; email: string } | null;
};

function MainLayout({
  children,
  setSearchQuery,
  searchQuery,
  setShowSleepTimer,
  showSleepTimer,
  isLoggedIn,
  setIsLoggedIn,
  user,
}: MainLayoutProps) {
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      <Sidebar isLoggedIn={isLoggedIn} user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-[#181818] border-b border-[#282828]">
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#282828] text-white rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSleepTimer((prev: boolean) => !prev)}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sleep Timer
            </button>
            <button
              onClick={handleAuthAction}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        </header>
        <main className="flex-1 bg-[#121212] overflow-y-auto p-6">
          {children}
        </main>
        <MusicPlayer />
      </div>
      {showSleepTimer && <SleepTimer onClose={() => setShowSleepTimer(false)} />}
    </div>
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
  } | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <AudioProvider>
      <Router>
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
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/playlist/:id" element={<Playlist />} />
                  <Route path="/all_songs" element={<AllSongs />} />
                  <Route path="/chat" element={<Chat/>}/>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AudioProvider>
  );
}