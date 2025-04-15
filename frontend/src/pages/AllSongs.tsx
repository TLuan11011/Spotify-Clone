import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PlayIcon, Clock3Icon, CircleEllipsis } from "lucide-react";
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

const AllSongs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { handlePlaySong, setSongList } = useAudio();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/songs/")
      .then((response) => {
        const data = response.data.map((song: any) => ({
          ...song,
          artist: song.artist_name,
        }));
        setSongs(data);
        setSongList(data);
      })
      .catch((error) => {
        console.error("Error fetching songs:", error);
        alert("Không thể tải danh sách bài hát.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setSongList]);

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) {
      handlePlaySong(songs[0]);
    }
  }, [songs, handlePlaySong]);

  if (loading) {
    return <div className="p-6 text-gray-400">Đang tải...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Songs</h1>
        </div>
        <button
          onClick={handlePlayAll}
          className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 hover:bg-gray-700"
        >
          <PlayIcon size={18} />
          Play All
        </button>
      </div>
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
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Clock3Icon size={14} />
              </th>
              <th
                style={{ width: "8%" }}
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Tải về
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828]">
            {songs.length > 0 ? (
              songs.map((song, index) => (
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
                      <img
                        src={`http://127.0.0.1:8000${song.image_url}`}
                        alt={song.name}
                        className="h-10 w-10 rounded object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-300">
                          {song.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {song.artist}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {song.album || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(song.duration)}
                  </td>
                  <td>
                    <button className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center items-center">
                      <CircleEllipsis />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có bài hát nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default AllSongs;
