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

  // Mock data
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
    ],
  };

  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Phát bài hát
  const handlePlaySong = (song: { title: string; artist: string; cover: string }) => {
    setCurrentSong({
      title: song.title,
      artist: song.artist,
      cover: song.cover,
    });
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="flex items-center gap-6 mb-8">
        <img
          src={playlist.cover}
          alt={playlist.title}
          className="w-48 h-48 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 text-green-500">{playlist.title}</h1>
          <p className="text-gray-400 mb-4">{playlist.description}</p>
          <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
          <button className="mt-4 px-6 py-2 bg-green-500 text-black font-bold rounded-full flex items-center gap-2 hover:bg-green-400">
            <PlayIcon size={18} />
            Play All
          </button>
        </div>
      </div>
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Album</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                <Clock3Icon size={14} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {playlist.songs.map((song, index) => (
              <tr key={song.id} className="hover:bg-gray-800 cursor-pointer" onClick={() => handlePlaySong(song)}>
                <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                <td className="px-6 py-4 text-white font-medium">{song.title}</td>
                <td className="px-6 py-4 text-gray-400">{song.album}</td>
                <td className="px-6 py-4 text-gray-400">{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Playlist;