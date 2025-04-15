import { useParams, useNavigate } from "react-router-dom";
import {
  PlayIcon,
  Menu,
  Clock3Icon,
  Trash2Icon,
  PlusCircleIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAudio } from "../AudioContext";

type Song = {
  id: number;
  name: string;
  artist: string;
  album: string | null;
  duration: number;
  song_url: string;
  image_url: string;
};

interface Playlist {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  cover_image: string | null;
  description: string | null;
  status: number;
  songs: { song: Song }[];
}

const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handlePlaySong, setSongList } = useAudio();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/playlists/${id}/`);
        if (!response.ok) throw new Error("Không thể tải playlist.");
        const data = await response.json();
        setPlaylist(data);
        setNewTitle(data.name);
        setSongList(data.songs.map((item: { song: Song }) => item.song));
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải playlist.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableSongs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/songs/");
        if (!response.ok) throw new Error("Không thể tải danh sách bài hát.");
        const data = await response.json();
        setAvailableSongs(data);
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải danh sách bài hát.");
      }
    };

    fetchPlaylist();
    fetchAvailableSongs();
  }, [id, setSongList]);

  const handleDeleteSong = useCallback(
    async (songId: number) => {
      if (!playlist) return;
      try {
        const response = await fetch(
          `http://localhost:8000/api/playlist_songs/${id}/${songId}/`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Không thể xóa bài hát.");
        const updatedSongs = playlist.songs.filter((item) => item.song.id !== songId);
        setPlaylist({ ...playlist, songs: updatedSongs });
        setSongList(updatedSongs.map((item) => item.song));
      } catch (err) {
        setError("Đã xảy ra lỗi khi xóa bài hát.");
      }
    },
    [playlist, id, setSongList]
  );

  const handlePlaySongClick = useCallback(
    (song: Song) => {
      handlePlaySong(song);
    },
    [handlePlaySong]
  );

  const handleAddSong = useCallback(
    async (song: Song) => {
      if (!playlist || playlist.songs.some((item) => item.song.id === song.id)) {
        alert("Bài hát đã có trong playlist!");
        return;
      }
      try {
        const response = await fetch(`http://localhost:8000/api/playlist_songs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playlist_id: id, song_id: song.id }),
        });
        if (!response.ok) throw new Error("Không thể thêm bài hát.");
        const data = await response.json();
        const updatedSongs = [...playlist.songs, data];
        setPlaylist({ ...playlist, songs: updatedSongs });
        setSongList(updatedSongs.map((item) => item.song));
        setIsAddFormVisible(false);
      } catch (err) {
        setError("Đã xảy ra lỗi khi thêm bài hát.");
      }
    },
    [playlist, id, setSongList]
  );

  const handleRenamePlaylist = useCallback(async () => {
    if (!playlist || newTitle.trim() === "") return;
    try {
      const response = await fetch(`http://localhost:8000/api/playlists/update/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTitle.trim() }),
      });
      if (!response.ok) throw new Error("Không thể đổi tên playlist.");
      const data = await response.json();
      setPlaylist({ ...playlist, name: data.name });
      setIsEditingTitle(false);
      setIsMenuVisible(false);
    } catch (err) {
      setError("Đã xảy ra lỗi khi đổi tên playlist.");
    }
  }, [playlist, newTitle, id]);

  const handleConfirmDeletePlaylist = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/playlists/delete/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa playlist.");
      navigate("/");
    } catch (err) {
      setError("Đã xảy ra lỗi khi xóa playlist.");
    }
  }, [id, navigate]);

  const filteredSongs = availableSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-gray-400">Đang tải...</div>;
  if (!playlist) return <div className="p-6 text-gray-400">Không tìm thấy playlist.</div>;

  return (
    <div className="p-6 relative">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={playlist.cover_image || "https://via.placeholder.com/150"}
          alt={playlist.name}
          className="w-48 h-48 object-cover rounded-lg shadow-md"
        />
        <div className="relative flex-1">
          <button
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-800"
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          >
            <Menu size={18} />
          </button>
          {isMenuVisible && (
            <div className="absolute top-6 right-0 bg-[#282828] shadow-lg rounded-md py-2 w-40 z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#383838]"
                onClick={() => {
                  setIsEditingTitle(true);
                  setIsMenuVisible(false);
                }}
              >
                Đổi tên playlist
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#383838]"
                onClick={() => setIsDeleteConfirmVisible(true)}
              >
                Xóa playlist
              </button>
            </div>
          )}
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-3xl font-bold border border-gray-300 rounded px-2 py-1"
              />
              <button
                className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                onClick={handleRenamePlaylist}
              >
                Lưu
              </button>
              <button
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => {
                  setIsEditingTitle(false);
                  setNewTitle(playlist.name);
                }}
              >
                Hủy
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
          )}
          <p className="text-gray-600 mb-4">{playlist.description || "Không có mô tả"}</p>
          <p className="text-sm text-gray-500">{playlist.songs.length} bài hát</p>
          <div className="mt-4 flex items-center gap-3">
            <button
              className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 hover:bg-gray-700"
              onClick={() => playlist.songs[0] && handlePlaySongClick(playlist.songs[0].song)}
            >
              <PlayIcon size={18} />
              Phát tất cả
            </button>
            <button
              className="px-6 py-2 bg-[#1ED760] text-gray-800 rounded-full flex items-center gap-2 hover:bg-gray-300"
              onClick={() => setIsAddFormVisible(true)}
            >
              <PlusCircleIcon size={18} />
              Thêm bài hát
            </button>
          </div>
        </div>
      </div>
      {isAddFormVisible && (
        <div className="mb-6 bg-[#181818] p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Thêm bài hát</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài hát..."
            className="w-full px-3 py-2 mb-4 border border-[#282828] bg-[#282828] text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <ul className="max-h-48 overflow-y-auto divide-y divide-[#282828]">
            {filteredSongs.map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between p-2 hover:bg-[#282828] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={song.image_url ? `http://localhost:8000${song.image_url}` : "/default-cover.png"}
                    alt={song.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-300">{song.name}</div>
                    <div className="text-xs text-gray-500">{song.artist}</div>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-300"
                  onClick={() => handleAddSong(song)}
                >
                  <PlusCircleIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 text-sm text-gray-300 bg-[#282828] rounded-lg hover:bg-[#383838]"
            onClick={() => setIsAddFormVisible(false)}
          >
            Hủy
          </button>
        </div>
      )}
      <div className="bg-[#181818] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#282828] text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                #
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Album
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                <Clock3Icon size={14} />
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828]">
            {playlist.songs.map((item, index) => {
              const song = item.song;
              return (
                <tr
                  key={song.id}
                  className="bg-[#181818] hover:bg-[#282828] cursor-pointer"
                  onClick={() => handlePlaySongClick(song)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          song.image_url
                            ? `http://localhost:8000${song.image_url}`
                            : "/default-cover.png"
                        }
                        alt={song.name}
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-300">{song.name}</div>
                        <div className="text-sm text-gray-500">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {song.album || "Không có album"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(song.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSong(song.id);
                      }}
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#181818] p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-bold mb-4 text-gray-300">Xác nhận xóa playlist</h3>
            <p className="mb-4 text-gray-400">Bạn có chắc chắn muốn xóa playlist này không?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-[#282828] text-gray-300 rounded hover:bg-[#383838]"
                onClick={() => setIsDeleteConfirmVisible(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDeletePlaylist}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;