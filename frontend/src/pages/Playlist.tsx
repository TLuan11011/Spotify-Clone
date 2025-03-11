import { useParams } from "react-router-dom";
import {
  PlayIcon,
  HeartIcon,
  Menu,
  Clock3Icon,
  Trash2Icon,
  PlusCircleIcon,
} from "lucide-react";
import { useState } from "react";

interface PlaylistProps {
  setCurrentSong: (song: { title: string; artist: string; cover: string }) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ setCurrentSong }) => {
  const { id } = useParams();

  // Mock data ban đầu cho playlist
  const initialPlaylist = {
    id: parseInt(id || "0"),
    title:
      id === "1"
        ? "Chill Vibes"
        : id === "2"
        ? "Workout Mix"
        : id === "3"
        ? "Study Session"
        : "Party Anthems",
    description: "A collection of relaxing tunes to unwind and chill",
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    songs: [
      {
        id: 1,
        title: "Calm Waters",
        artist: "Serene Sound",
        album: "Ocean Waves",
        duration: "3:45",
        cover:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        id: 2,
        title: "Mountain Air",
        artist: "Nature Sounds",
        album: "Wilderness",
        duration: "4:20",
        cover:
          "https://images.unsplash.com/photo-1598387993211-5c4c0fda1248?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80",
      },
      {
        id: 3,
        title: "Gentle Rain",
        artist: "Ambient Melody",
        album: "Rainfall",
        duration: "5:12",
        cover:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
      {
        id: 4,
        title: "Sunset Horizon",
        artist: "Chill Wave",
        album: "Evening Glow",
        duration: "3:58",
        cover:
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      },
      {
        id: 5,
        title: "Starry Night",
        artist: "Dream Sounds",
        album: "Night Sky",
        duration: "4:35",
        cover:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      },
    ],
  };

  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho menu hiển thị chức năng của playlist
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  // State cho chỉnh sửa tiêu đề playlist
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(playlist.title);
  // State cho hộp thoại xác nhận xóa playlist
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  // Nếu playlist bị xóa, hiển thị thông báo
  if (!playlist) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">Playlist đã bị xóa.</p>
      </div>
    );
  }

  // Mock danh sách bài hát có thể thêm (trong thực tế sẽ lấy từ API)
  const availableSongs = [
    {
      id: 6,
      title: "New Day",
      artist: "Fresh Beats",
      album: "Morning Light",
      duration: "3:20",
      cover:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 7,
      title: "Echoes",
      artist: "Sound Wave",
      album: "Reflections",
      duration: "4:10",
      cover:
        "https://images.unsplash.com/photo-1511379936541-3b73d289c3b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  // Xóa bài hát khỏi playlist
  const handleDeleteSong = (songId: number) => {
    const updatedSongs = playlist.songs.filter((song) => song.id !== songId);
    setPlaylist({ ...playlist, songs: updatedSongs });
  };

  // Phát bài hát
  const handlePlaySong = (song: {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: string;
    cover: string;
  }) => {
    setCurrentSong({
      title: song.title,
      artist: song.artist,
      cover: song.cover,
    });
  };

  // Thêm bài hát vào playlist
  const handleAddSong = (song: {
    id: number;
    title: string;
    artist: string;
    album: string;
    duration: string;
    cover: string;
  }) => {
    if (!playlist.songs.some((s) => s.id === song.id)) {
      setPlaylist({ ...playlist, songs: [...playlist.songs, song] });
    }
    setIsAddFormVisible(false);
    setSearchTerm("");
  };

  // Tìm kiếm bài hát
  const filteredSongs = availableSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý đổi tên playlist
  const handleRenamePlaylist = () => {
    setPlaylist({ ...playlist, title: newTitle });
    setIsEditingTitle(false);
    setIsMenuVisible(false);
  };

  // Khi nhấn "Xóa playlist" trong menu, mở hộp thoại xác nhận
  const handleOpenDeleteConfirm = () => {
    setIsMenuVisible(false);
    setIsDeleteConfirmVisible(true);
  };

  // Xác nhận xóa playlist
  const handleConfirmDeletePlaylist = () => {
    alert("Playlist đã được xóa!");
    setIsDeleteConfirmVisible(false);
  };

  return (
    <div className="p-6 relative">
      {/* Header với relative để định vị menu */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={playlist.cover}
          alt={playlist.title}
          className="w-48 h-48 object-cover rounded-lg shadow-md"
        />
        <div className="relative flex-1">
          {/* Nút 3 gạch đặt ở góc trên bên phải */}
          <button
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-800"
            onClick={() => setIsMenuVisible(!isMenuVisible)}
          >
            <Menu size={18} />
          </button>
          {/* Menu chức năng */}
          {isMenuVisible && (
            <div className="absolute top-6 right-0 bg-white shadow-lg rounded-md py-2 w-40 z-10">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setIsEditingTitle(true);
                  setIsMenuVisible(false);
                }}
              >
                Đổi tên playlist
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleOpenDeleteConfirm}
              >
                Xóa playlist
              </button>
            </div>
          )}

          {/* Hiển thị tiêu đề playlist, nếu đang chỉnh sửa thì hiển thị input */}
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
                  setNewTitle(playlist.title);
                }}
              >
                Hủy
              </button>
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
          )}
          <p className="text-gray-600 mb-4">{playlist.description}</p>
          <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
          <div className="mt-4 flex items-center gap-3">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 hover:bg-gray-700">
              <PlayIcon size={18} />
              Play All
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full flex items-center gap-2 hover:bg-gray-300"
              onClick={() => setIsAddFormVisible(true)}
            >
              <PlusCircleIcon size={18} />
              Add Song
            </button>
          </div>
        </div>
      </div>

      {/* Form thêm bài hát */}
      {isAddFormVisible && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Add a Song</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a song..."
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredSongs.map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddSong(song)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{song.title}</div>
                    <div className="text-xs text-gray-500">{song.artist}</div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <PlusCircleIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => setIsAddFormVisible(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Danh sách bài hát */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
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
          <tbody className="divide-y divide-gray-100">
            {playlist.songs.map((song, index) => (
              <tr
                key={song.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="h-10 w-10 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {song.title}
                      </div>
                      <div className="text-sm text-gray-500">{song.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {song.album}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {song.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-800">
                      <HeartIcon size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-800">
                      {/* Nút này có thể giữ nguyên nếu muốn */}
                      <Menu size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click trên row
                        handleDeleteSong(song.id);
                      }}
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa playlist */}
      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa playlist</h3>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa playlist này không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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