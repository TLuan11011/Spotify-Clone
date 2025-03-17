import React from "react";
import { PlayIcon } from "lucide-react";

interface HomeProps {
  setCurrentSong: (song: { id: number; title: string; artist: string; cover: string }) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentSong }) => {
  const recentlyPlayed = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title: "As It Was",
      artist: "Harry Styles",
      cover: "https://images.unsplash.com/photo-1598387993211-5c4c0fda1248?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    },
    {
      id: 3,
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 4,
      title: "Bad Habits",
      artist: "Ed Sheeran",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    },
  ];

  const recommendedPlaylists = [
    {
      id: 1,
      title: "Chill Vibes",
      description: "Relax and unwind with these smooth tracks",
      cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title: "Workout Mix",
      description: "High energy tracks to fuel your fitness",
      cover: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80",
    },
    {
      id: 3,
      title: "Focus & Study",
      description: "Concentration-enhancing instrumentals",
      cover: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  const handlePlaySong = (song: { id: number; title: string; artist: string; cover: string }) => {
    setCurrentSong(song);
  };

  return (
    <div className="space-y-8 bg-[#121212] text-white p-6">
      <section>
        <h2 className="text-3xl font-bold mb-4">Welcome back</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="bg-[#181818] rounded-lg p-4 transition-all hover:bg-[#282828] cursor-pointer"
              onClick={() => handlePlaySong(song)}
            >
              <div className="relative group">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md mb-3"
                />
                <button className="absolute bottom-3 right-3 h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon size={24} />
                </button>
              </div>
              <h3 className="font-medium text-md">{song.title}</h3>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Recommended Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedPlaylists.map((playlist) => (
            <div key={playlist.id} className="bg-[#181818] rounded-lg overflow-hidden hover:bg-[#282828] transition-all">
              <img src={playlist.cover} alt={playlist.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-medium text-lg">{playlist.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{playlist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
