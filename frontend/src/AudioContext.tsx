// import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

// // Định nghĩa type Song
// type Song = {
//   id: number;
//   name: string;
//   artist: string;
//   album: string | null;
//   duration: number;
//   song_url: string;
//   image_url: string;
// };

// // Định nghĩa type cho AudioContext
// type AudioContextType = {
//   currentSong: Song | null;
//   handlePlaySong: (song: Song) => void;
//   isPlaying: boolean;
//   togglePlayPause: () => void;
//   playNext: () => void;
//   playPrevious: () => void;
//   seek: (time: number) => void;
//   currentTime: number;
//   duration: number;
//   setSongList: (songs: Song[]) => void; // Để lưu danh sách bài hát
// };

// // Tạo context
// const AudioContext = createContext<AudioContextType | undefined>(undefined);

// // Hook để sử dụng AudioContext
// export const useAudio = () => {
//   const context = useContext(AudioContext);
//   if (!context) {
//     throw new Error("useAudio must be used within an AudioProvider");
//   }
//   return context;
// };

// // AudioProvider component
// export const AudioProvider = ({ children }: { children: ReactNode }) => {
//   const [currentSong, setCurrentSong] = useState<Song | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [songList, setSongList] = useState<Song[]>([]); // Lưu danh sách bài hát
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   // Khởi tạo audio element khi component mount
//   useEffect(() => {
//     audioRef.current = new Audio();
//     audioRef.current.onended = () => {
//       setIsPlaying(false);
//       playNext(); // Tự động phát bài tiếp theo khi bài hiện tại kết thúc
//     };
//     audioRef.current.onerror = () => {
//       console.error("Error loading audio file");
//       setIsPlaying(false);
//     };
//     audioRef.current.ontimeupdate = () => {
//       if (audioRef.current) {
//         setCurrentTime(audioRef.current.currentTime);
//         setDuration(audioRef.current.duration || 0);
//       }
//     };
//     audioRef.current.onloadedmetadata = () => {
//       if (audioRef.current) {
//         setDuration(audioRef.current.duration || 0);
//       }
//     };
//     return () => {
//       audioRef.current?.pause();
//     };
//   }, []);

//   // Hàm phát bài hát
//   const handlePlaySong = (song: Song) => {
//     if (audioRef.current) {
//       // Nếu bài hát hiện tại giống bài hát được chọn, chỉ toggle play/pause
//       if (currentSong?.id === song.id && isPlaying) {
//         audioRef.current.pause();
//         setIsPlaying(false);
//       } else if (currentSong?.id === song.id && !isPlaying) {
//         audioRef.current.play().then(() => {
//           setIsPlaying(true);
//         }).catch((error) => {
//           console.error("Error playing audio:", error);
//           setIsPlaying(false);
//         });
//       } else {
//         // Dừng bài hát hiện tại (nếu có)
//         audioRef.current.pause();
//         // Cập nhật bài hát mới
//         setCurrentSong(song);
//         const audioUrl = `http://127.0.0.1:8000${song.song_url}`;
//         audioRef.current.src = audioUrl;
//         console.log("Playing audio from:", audioUrl);
//         audioRef.current.play().then(() => {
//           setIsPlaying(true);
//         }).catch((error) => {
//           console.error("Error playing audio:", error);
//           setIsPlaying(false);
//         });
//       }
//     }
//   };

//   // Hàm toggle play/pause
//   const togglePlayPause = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         setIsPlaying(false);
//       } else {
//         audioRef.current.play().then(() => {
//           setIsPlaying(true);
//         }).catch((error) => {
//           console.error("Error playing audio:", error);
//         });
//       }
//     }
//   };

//   // Hàm phát bài tiếp theo
//   const playNext = () => {
//     if (!currentSong || songList.length === 0) return;
//     const currentIndex = songList.findIndex((song) => song.id === currentSong.id);
//     const nextIndex = (currentIndex + 1) % songList.length; // Quay lại bài đầu nếu đang ở bài cuối
//     const nextSong = songList[nextIndex];
//     handlePlaySong(nextSong);
//   };

//   // Hàm phát bài trước đó
//   const playPrevious = () => {
//     if (!currentSong || songList.length === 0) return;
//     const currentIndex = songList.findIndex((song) => song.id === currentSong.id);
//     const prevIndex = (currentIndex - 1 + songList.length) % songList.length; // Quay lại bài cuối nếu đang ở bài đầu
//     const prevSong = songList[prevIndex];
//     handlePlaySong(prevSong);
//   };

//   // Hàm tua thời gian
//   const seek = (time: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = time;
//       setCurrentTime(time);
//     }
//   };

//   return (
//     <AudioContext.Provider
//       value={{
//         currentSong,
//         handlePlaySong,
//         isPlaying,
//         togglePlayPause,
//         playNext,
//         playPrevious,
//         seek,
//         currentTime,
//         duration,
//         setSongList,
//       }}
//     >
//       {children}
//     </AudioContext.Provider>
//   );
// };

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

type Song = {
  id: number;
  name: string;
  artist: string;
  album: string | null;
  duration: number;
  song_url: string;
  image_url: string;
};

type AudioContextType = {
  currentSong: Song | null;
  handlePlaySong: (song: Song) => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  currentTime: number;
  duration: number;
  setSongList: (songs: Song[]) => void;
  songList: Song[];
  playbackHistory: Song[];
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songList, setSongList] = useState<Song[]>([]);
  const [playbackHistory, setPlaybackHistory] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.onended = () => {
      setIsPlaying(false);
      playNext();
    };
    audio.onerror = () => {
      console.error("Error loading audio file:", audio.src);
      setIsPlaying(false);
      setCurrentSong(null);
      alert("Không thể tải bài hát. Vui lòng thử bài khác.");
    };
    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const handlePlaySong = async (song: Song) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const audioUrl = `http://127.0.0.1:8000${song.song_url}`;

    try {
      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          await audio.play();
          setIsPlaying(true);
        }
      } else {
        audio.pause();
        setCurrentSong(song);
        setPlaybackHistory((prev) => [...prev, song].slice(-10)); // Lưu lịch sử, giới hạn 10 bài
        audio.src = audioUrl;
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      alert("Lỗi khi phát bài hát. Vui lòng thử lại.");
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !currentSong) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!currentSong || songList.length === 0) return;
    const currentIndex = songList.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songList.length;
    handlePlaySong(songList[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || songList.length === 0) return;
    const currentIndex = songList.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
    handlePlaySong(songList[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        handlePlaySong,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrevious,
        seek,
        currentTime,
        duration,
        setSongList,
        songList,
        playbackHistory,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};