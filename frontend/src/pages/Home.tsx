import React, { useEffect, useState } from "react";
import { PlayIcon } from "lucide-react";
import axios from "axios";
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
  description: string | null;
  cover_image: string | null;
}

const Home: React.FC = () => {
  const { handlePlaySong } = useAudio();
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const songsResponse = await axios.get("http://127.0.0.1:8000/api/songs/");
        setRecentlyPlayed(songsResponse.data.slice(0, 4));

        const playlistsResponse = await axios.get("http://127.0.0.1:8000/api/playlists/");
        setRecommendedPlaylists(playlistsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400">Đang tải...</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-gray-100"
              onClick={() => handlePlaySong(song)}
            >
              <div className="relative group">
                <img
                  src={`http://127.0.0.1:8000${song.image_url}`}
                  alt={song.name}
                  className="w-full aspect-square object-cover rounded-md mb-3"
                />
                <button className="absolute bottom-3 right-3 h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon size={20} />
                </button>
              </div>
              <h3 className="font-medium text-sm">{song.name}</h3>
              <p className="text-xs text-gray-500">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedPlaylists.map((playlist) => (
            <div key={playlist.id} className="bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={playlist.cover_image || "https://via.placeholder.com/150"}
                alt={playlist.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium">{playlist.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{playlist.description || "Không có mô tả"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;