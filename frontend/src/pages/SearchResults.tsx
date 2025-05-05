import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Clock3Icon, Download, PlayIcon } from "lucide-react";
import { useAudio } from "../AudioContext";
import { debounce } from "lodash";
import { useNavigate, useLocation } from "react-router-dom";

type Song = {
  id: number;
  name: string;
  artist: string;
  album: string | null;
  album_id: number;
  duration: number;
  song_url: string;
  image_url: string;
  premium: number;
};

const SearchResults: React.FC<{ query: string; searchTrigger?: boolean }> = ({
  query,
  searchTrigger,
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handlePlaySong, setSongList } = useAudio();
  const debounceRef = useRef<ReturnType<typeof debounce>>();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy trạng thái premium từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isPremiumUser = user?.isPremium === true;

  // Hàm tìm kiếm chính
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim() === "") {
      setSongs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Performing search with query:", searchQuery);
      const response = await axios.get("http://127.0.0.1:8000/api/songs/", {
        params: { search: searchQuery },
      });
      console.log("API response:", response.data);
      const data = response.data.map((song: any) => ({
        id: song.id,
        name: song.name || "Unknown Song",
        artist: song.artist_name || "Unknown Artist",
        album: song.album_name || null,
        album_id: song.album,
        duration: song.duration || 0,
        song_url: song.song_url || "",
        image_url: song.album_img
          ? `/Uploads/albums/${song.album_img}`
          : "/default-cover.png",
        premium: song.premium || 0,
      }));
      setSongs(data);
      setSongList(data);
    } catch (err) {
      setError("Không thể tải kết quả tìm kiếm.");
      console.error("Lỗi khi lấy kết quả tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo debounce
  useEffect(() => {
    debounceRef.current = debounce((searchQuery: string) => {
      performSearch(searchQuery);
    }, 300);

    return () => {
      debounceRef.current?.cancel();
    };
  }, []);

  // Xử lý khi query hoặc searchTrigger thay đổi
  useEffect(() => {
    if (query.trim() === "") {
      setSongs([]);
      return;
    }
    if (searchTrigger) {
      debounceRef.current?.cancel();
      performSearch(query); // Tìm kiếm ngay lập tức
    } else {
      debounceRef.current?.(query); // Tìm kiếm với debounce
    }
  }, [query, searchTrigger]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    if (song.premium === 1 && !isPremiumUser) {
      alert("Bạn cần tài khoản Premium để tải bài hát này.");
      return;
    }
    const songUrl = `http://localhost:8000/audio/${song.song_url}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", songUrl, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      const blob = xhr.response;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${song.name}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    xhr.onerror = () => {
      alert("Không thể tải bài hát này.");
    };
    xhr.send();
  };

  const handleNavigateToAlbum = (albumId: number) => {
    navigate(`/viewalbum/${albumId}`);
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Đang tìm kiếm...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Kết quả tìm kiếm cho "{query}"</h1>
      {songs.length === 0 && query.trim() !== "" ? (
        <p className="text-gray-400">Không tìm thấy bài hát nào.</p>
      ) : (
        <div className="bg-[#181818] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#282828] text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  #
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Album
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Clock3Icon size={14} />
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tải xuống
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {songs.map((song, index) => (
                <tr
                  key={song.id}
                  className="bg-[#181818] hover:bg-[#282828] cursor-pointer"
                  onClick={() => handlePlaySong(song)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative group flex-shrink-0">
                        <img
                          src={song.image_url}
                          alt={song.name}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayIcon size={16} className="text-green-500" />
                        </button>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <div className="text-sm font-medium text-gray-300">
                            {song.name}
                          </div>
                          {song.premium === 1 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (song.album) {
                        handleNavigateToAlbum(song.album_id);
                      }
                    }}
                  >
                    {song.album || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(song.duration)}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`p-1 rounded-full ${
                        song.premium === 1 && !isPremiumUser
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={(e) => handleDownload(e, song)}
                      disabled={song.premium === 1 && !isPremiumUser}
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchResults;