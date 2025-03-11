import { NavLink } from "react-router-dom";
import { HomeIcon, ListMusicIcon, HeartIcon, MessageCircleIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "Hello" },
    { id: 2, name: "Workout Mix" },
    { id: 3, name: "Study Session" },
    { id: 4, name: "Party Anthems" },
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false); // State để hiển thị form
  const [newPlaylistName, setNewPlaylistName] = useState(""); // State để lưu tên playlist mới

  // Hàm xử lý khi nhấn nút "+"
  const handleAddPlaylistClick = () => {
    setIsFormVisible(true);
  };

  // Hàm xử lý khi submit form
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPlaylistName.trim() === "") return; // Không thêm nếu tên trống

    const newPlaylist = {
      id: playlists.length + 1, // Tạo ID mới (tạm thời, trong thực tế nên dùng UUID hoặc từ backend)
      name: newPlaylistName.trim(),
    };

    setPlaylists([...playlists, newPlaylist]); // Thêm playlist mới vào danh sách
    setNewPlaylistName(""); // Reset input
    setIsFormVisible(false); // Ẩn form
  };

  // Hàm xử lý khi hủy form
  const handleCancel = () => {
    setNewPlaylistName("");
    setIsFormVisible(false);
  };

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">MusicStream</h1>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
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
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <HeartIcon size={18} />
              Loved Songs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <MessageCircleIcon size={18} />
              Chat
            </NavLink>
          </li>
        </ul>
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Playlists
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleAddPlaylistClick}
            >
              <PlusCircleIcon size={16} />
            </button>
          </div>

          {/* Form thêm playlist mới */}
          {isFormVisible && (
            <div className="px-4 py-2">
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
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
                    `flex items-center px-4 py-2 text-sm rounded-lg ${
                      isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
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