// import { createContext, useContext, useState } from "react";

// interface Song {
//   cover: string;
//   title: string;
//   artist: string;
//   audioUrl: string;
// }

// interface AudioContextType {
//   currentSong: Song | null;
//   handlePlaySong: (song: Song) => void;
// }

// const AudioContext = createContext<AudioContextType | undefined>(undefined);

// import { ReactNode } from "react";

// export const AudioProvider = ({ children }: { children: ReactNode }) => {
//   const [currentSong, setCurrentSong] = useState<Song | null>(null);

//   const handlePlaySong = (song: Song) => {
//     setCurrentSong(song);
//   };

//   return (
//     <AudioContext.Provider value={{ currentSong, handlePlaySong }}>
//       {children}
//     </AudioContext.Provider>
//   );
// };

// export const useAudio = () => {
//   const context = useContext(AudioContext);
//   if (!context) {
//     throw new Error("useAudio must be used within an AudioProvider");
//   }
//   return context;
// };

import { createContext, useContext, useState } from "react";

interface Song {
  cover: string;
  title: string;
  artist: string;
  audioUrl: string;
}

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  handlePlaySong: (song: Song) => void;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

import { ReactNode } from "react";

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true); // Bật phát nhạc khi chọn bài hát mới
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ currentSong, isPlaying, handlePlaySong, togglePlay }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
