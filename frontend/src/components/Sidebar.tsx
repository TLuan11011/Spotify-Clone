import { NavLink } from "react-router-dom";
import { HomeIcon, ListMusicIcon, HeartIcon, MessageCircleIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Hello" },
    { id: 2, name: "Workout Mix" },
    { id: 3, name: "Study Session" },
    { id: 4, name: "Party Anthems" },
  ]);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleAddPlaylistClick = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPlaylistName.trim() === "") return;

    const newPlaylist = {
      id: playlists.length + 1,
      name: newPlaylistName.trim(),
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setIsFormVisible(false);
  };

  const handleCancel = () => {
    setNewPlaylistName("");
    setIsFormVisible(false);
  };

  return (
    <div className="w-64 h-full bg-[#121212] border-r border-gray-900 flex flex-col text-gray-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Spotify</h1>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                  isActive ? "bg-[#1db954] text-black" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <HomeIcon size={18} />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/loved"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                  isActive ? "bg-[#1db954] text-black" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <HeartIcon size={18} />
              Loved Songs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all_songs"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
                  isActive ? "bg-[#1db954] text-black" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <MessageCircleIcon size={18} />
              All Songs
            </NavLink>
          </li>
        </ul>

        <div className="mt-8">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Playlists</h3>
            <button className="text-gray-400 hover:text-white" onClick={handleAddPlaylistClick}>
              <PlusCircleIcon size={16} />
            </button>
          </div>

          {isFormVisible && (
            <div className="px-4 py-2">
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 text-sm bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954]"
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1 text-sm text-black bg-[#1db954] rounded-lg hover:bg-green-500">
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <ul className="mt-2 space-y-1">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <NavLink
                  to={`/playlist/${playlist.id}`}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm rounded-lg transition ${
                      isActive ? "bg-[#1db954] text-black" : "hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <ListMusicIcon size={16} className="mr-3 flex-shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
