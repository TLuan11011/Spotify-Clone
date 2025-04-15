// import React, { useState, useEffect } from "react";
// import { useAudio } from "../AudioContext"; // Import context
// import {
//   PlayIcon,
//   PauseIcon,
//   SkipBackIcon,
//   SkipForwardIcon,
//   RepeatIcon,
//   ShuffleIcon,
//   VolumeIcon,
// } from "lucide-react";

// const MusicPlayer: React.FC = () => {
//   const {
//     currentSong,
//     isPlaying,
//     togglePlayPause,
//     playNext,
//     playPrevious,
//     seek,
//     currentTime,
//     duration,
//     setSongList,
//     songList,
//   } = useAudio(); // Lấy các giá trị và hàm từ AudioContext

//   const [isShuffled, setIsShuffled] = useState(false); // Trạng thái xáo trộn
//   const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off"); // Trạng thái lặp lại: off, one (lặp 1 bài), all (lặp danh sách)
//   const [volume, setVolume] = useState(0.75); // Âm lượng

//   // Cập nhật âm lượng
//   useEffect(() => {
//     const audio = document.querySelector("audio");
//     if (audio) {
//       audio.volume = volume;
//     }
//   }, [volume]);

//   // Xử lý khi bài hát kết thúc
//   useEffect(() => {
//     const audio = document.querySelector("audio");
//     if (audio) {
//       audio.onended = () => {
//         if (repeatMode === "one") {
//           // Lặp lại bài hiện tại
//           seek(0);
//           audio.play();
//         } else if (repeatMode === "all") {
//           // Lặp lại danh sách
//           playNext();
//         } else {
//           // Không lặp, chuyển bài tiếp theo nếu không phải bài cuối
//           const currentIndex = songList.findIndex(
//             (song: { id: number | undefined; }) => song.id === currentSong?.id
//           );
//           if (currentIndex < songList.length - 1) {
//             playNext();
//           } else {
//             togglePlayPause(); // Dừng nếu là bài cuối
//           }
//         }
//       };
//     }
//   }, [currentSong, repeatMode, songList, playNext, seek, togglePlayPause]);

//   // Xử lý xáo trộn danh sách
//   const handleShuffle = () => {
//     if (!isShuffled) {
//       // Xáo trộn danh sách
//       const shuffledList = [...songList].sort(() => Math.random() - 0.5);
//       setSongList(shuffledList);
//     } else {
//       // Khôi phục danh sách gốc (cần lưu danh sách gốc trước khi xáo trộn)
//       // Ở đây tôi giả sử bạn có thể lấy lại danh sách gốc từ API
//       fetch("http://127.0.0.1:8000/api/songs/")
//         .then((response) => response.json())
//         .then((data) => setSongList(data));
//     }
//     setIsShuffled(!isShuffled);
//   };

//   // Xử lý lặp lại
//   const handleRepeat = () => {
//     if (repeatMode === "off") {
//       setRepeatMode("all");
//     } else if (repeatMode === "all") {
//       setRepeatMode("one");
//     } else {
//       setRepeatMode("off");
//     }
//   };

//   // Xử lý tua thời gian
//   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (duration) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const clickPosition = (e.clientX - rect.left) / rect.width;
//       const newTime = clickPosition * duration;
//       seek(newTime);
//     }
//   };

//   // Xử lý điều chỉnh âm lượng
//   const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const clickPosition = (e.clientX - rect.left) / rect.width;
//     const newVolume = Math.max(0, Math.min(1, clickPosition));
//     setVolume(newVolume);
//   };

//   // Định dạng thời gian
//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
//   };

//   if (!currentSong) return null; // Không hiển thị khi chưa chọn bài hát

//   return (
//     <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center text-white">
//       {/* Thông tin bài hát và ảnh */}
//       <div className="w-1/4 flex items-center gap-3">
//         <img
//           src={`http://127.0.0.1:8000${currentSong.image_url}`}
//           alt={currentSong.name}
//           className="h-12 w-12 rounded object-cover"
//         />
//         <div>
//           <h4 className="text-sm font-medium">{currentSong.name}</h4>
//           <p className="text-xs text-gray-400">{currentSong.artist}</p>
//         </div>
//       </div>

//       {/* Điều khiển phát nhạc */}
//       <div className="w-2/4 flex flex-col items-center">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={handleShuffle}
//             className={`${
//               isShuffled ? "text-green-500" : "text-gray-400"
//             } hover:text-white transition`}
//           >
//             <ShuffleIcon size={18} />
//           </button>
//           <button
//             onClick={playPrevious}
//             className="text-gray-400 hover:text-white transition"
//           >
//             <SkipBackIcon size={20} />
//           </button>
//           <button
//             onClick={togglePlayPause}
//             className="h-10 w-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:bg-[#1ed760] transition"
//           >
//             {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
//           </button>
//           <button
//             onClick={playNext}
//             className="text-gray-400 hover:text-white transition"
//           >
//             <SkipForwardIcon size={20} />
//           </button>
//           <button
//             onClick={handleRepeat}
//             className={`${
//               repeatMode !== "off" ? "text-green-500" : "text-gray-400"
//             } hover:text-white transition`}
//           >
//             <RepeatIcon size={18} />
//             {repeatMode === "one" && (
//               <span className="absolute text-xs -mt-2 ml-4 bg-green-500 rounded-full h-4 w-4 flex items-center justify-center">
//                 1
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Thanh tua thời gian */}
//         <div className="w-full mt-2 flex items-center gap-3">
//           <span className="text-xs text-gray-400">
//             {formatTime(currentTime)}
//           </span>
//           <div
//             className="flex-1 h-1 bg-[#282828] rounded-full cursor-pointer"
//             onClick={handleSeek}
//           >
//             <div
//               className="h-full bg-white rounded-full transition-all"
//               style={{ width: `${(currentTime / duration) * 100}%` }}
//             />
//           </div>
//           <span className="text-xs text-gray-400">{formatTime(duration)}</span>
//         </div>
//       </div>

//       {/* Điều khiển âm lượng */}
//       <div className="w-1/4 flex justify-end items-center gap-2">
//         <VolumeIcon size={18} className="text-gray-400" />
//         <div
//           className="w-24 h-1 bg-[#282828] rounded-full cursor-pointer"
//           onClick={handleVolumeChange}
//         >
//           <div
//             className="h-full bg-white rounded-full transition-all"
//             style={{ width: `${volume * 100}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MusicPlayer;

import React, { useState, useEffect, useCallback } from "react";
import { useAudio } from "../AudioContext";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RepeatIcon,
  ShuffleIcon,
  VolumeIcon,
} from "lucide-react";

const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    currentTime,
    duration,
    setSongList,
    songList,
  } = useAudio();

  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [volume, setVolume] = useState(() => {
    return Number(localStorage.getItem("volume")) || 0.75;
  });
  const [originalSongList, setOriginalSongList] = useState(songList);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
    const audio = document.querySelector("audio");
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = document.querySelector("audio");
    if (audio) {
      audio.onended = () => {
        if (repeatMode === "one") {
          seek(0);
          audio.play();
        } else if (repeatMode === "all") {
          playNext();
        } else {
          const currentIndex = songList.findIndex(
            (song) => song.id === currentSong?.id
          );
          if (currentIndex < songList.length - 1) {
            playNext();
          } else {
            togglePlayPause();
          }
        }
      };
    }
  }, [currentSong, repeatMode, songList, playNext, seek, togglePlayPause]);

  const handleShuffle = useCallback(() => {
    if (!isShuffled) {
      setOriginalSongList(songList);
      const shuffledList = [...songList].sort(() => Math.random() - 0.5);
      setSongList(shuffledList);
      setIsShuffled(true);
    } else {
      setSongList(originalSongList);
      setIsShuffled(false);
    }
  }, [isShuffled, songList, setSongList, originalSongList]);

  const handleRepeat = useCallback(() => {
    setRepeatMode((prev) =>
      prev === "off" ? "all" : prev === "all" ? "one" : "off"
    );
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        const newTime = clickPosition * duration;
        seek(newTime);
      }
    },
    [duration, seek]
  );

  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, clickPosition));
    setVolume(newVolume);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center text-white">
      <div className="w-1/4 flex items-center gap-3">
        <img
          src={`http://127.0.0.1:8000${currentSong.image_url}`}
          alt={currentSong.name}
          className="h-12 w-12 rounded object-cover"
        />
        <div>
          <h4 className="text-sm font-medium">{currentSong.name}</h4>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>
      </div>
      <div className="w-2/4 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleShuffle}
            className={`${
              isShuffled ? "text-green-500" : "text-gray-400"
            } hover:text-white transition`}
          >
            <ShuffleIcon size={18} />
          </button>
          <button
            onClick={playPrevious}
            className="text-gray-400 hover:text-white transition"
          >
            <SkipBackIcon size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="h-10 w-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:bg-[#1ed760] transition"
          >
            {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
          <button
            onClick={playNext}
            className="text-gray-400 hover:text-white transition"
          >
            <SkipForwardIcon size={20} />
          </button>
          <button
            onClick={handleRepeat}
            className={`${
              repeatMode !== "off" ? "text-green-500" : "text-gray-400"
            } hover:text-white transition relative`}
          >
            <RepeatIcon size={18} />
            {repeatMode === "one" && (
              <span className="absolute text-xs -mt-2 ml-4 bg-green-500 rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>
        <div className="w-full mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-[#282828] rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="w-1/4 flex justify-end items-center gap-2">
        <VolumeIcon size={18} className="text-gray-400" />
        <div
          className="w-24 h-1 bg-[#282828] rounded-full cursor-pointer"
          onClick={handleVolumeChange}
        >
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;