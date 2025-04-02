// import React, { useState, useEffect, useRef } from "react";
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
//   const { currentSong } = useAudio(); // Lấy bài hát từ Context
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [volume, setVolume] = useState(0.75);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const audioRef = useRef<HTMLAudioElement>(null);

//   useEffect(() => {
//     if (currentSong && audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.src = currentSong.audioUrl;
//       audioRef.current.volume = volume;

//       const updateMetadata = () => setDuration(audioRef.current?.duration || 0);
//       const updateProgress = () => {
//         setCurrentTime(audioRef.current!.currentTime);
//         setProgress(
//           (audioRef.current!.currentTime / audioRef.current!.duration) * 100
//         );
//       };

//       audioRef.current.addEventListener("loadedmetadata", updateMetadata);
//       audioRef.current.addEventListener("timeupdate", updateProgress);

//       if (isPlaying) {
//         audioRef.current.play();
//       }

//       return () => {
//         audioRef.current?.removeEventListener("timeupdate", updateProgress);
//         audioRef.current?.removeEventListener("loadedmetadata", updateMetadata);
//       };
//     }
//   }, [currentSong]);

//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
//   };

//   if (!currentSong) return null; // Không hiển thị khi chưa chọn bài hát

//   return (
//     <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center text-white">
//       <div className="w-1/4 flex items-center gap-3">
//         <img
//           src={currentSong.cover}
//           alt={currentSong.title}
//           className="h-12 w-12 rounded object-cover"
//         />
//         <div>
//           <h4 className="text-sm font-medium">{currentSong.title}</h4>
//           <p className="text-xs text-gray-400">{currentSong.artist}</p>
//         </div>
//       </div>

//       <div className="w-2/4 flex flex-col items-center">
//         <div className="flex items-center gap-4">
//           <button className="text-gray-400 hover:text-white transition">
//             <ShuffleIcon size={18} />
//           </button>
//           <button className="text-gray-400 hover:text-white transition">
//             <SkipBackIcon size={20} />
//           </button>
//           <button
//             className="h-10 w-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:bg-[#1ed760] transition"
//             onClick={togglePlay}
//           >
//             {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
//           </button>
//           <button className="text-gray-400 hover:text-white transition">
//             <SkipForwardIcon size={20} />
//           </button>
//           <button className="text-gray-400 hover:text-white transition">
//             <RepeatIcon size={18} />
//           </button>
//         </div>

//         <div className="w-full mt-2 flex items-center gap-3">
//           <span className="text-xs text-gray-400">
//             {formatTime(currentTime)}
//           </span>
//           <div
//             className="flex-1 h-1 bg-[#282828] rounded-full cursor-pointer"
//             onClick={(e) => {
//               if (audioRef.current) {
//                 const rect = e.currentTarget.getBoundingClientRect();
//                 const clickPosition = (e.clientX - rect.left) / rect.width;
//                 const newTime = clickPosition * duration;
//                 audioRef.current.currentTime = newTime;
//                 setCurrentTime(newTime);
//                 setProgress(clickPosition * 100);
//               }
//             }}
//           >
//             <div
//               className="h-full bg-white rounded-full transition-all"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <span className="text-xs text-gray-400">{formatTime(duration)}</span>
//         </div>
//       </div>

//       <div className="w-1/4 flex justify-end items-center gap-2">
//         <VolumeIcon size={18} className="text-gray-400" />
//         <div
//           className="w-24 h-1 bg-[#282828] rounded-full cursor-pointer"
//           onClick={(e) => {
//             if (audioRef.current) {
//               const rect = e.currentTarget.getBoundingClientRect();
//               const clickPosition = (e.clientX - rect.left) / rect.width;
//               const newVolume = Math.max(0, Math.min(1, clickPosition));
//               setVolume(newVolume);
//               audioRef.current.volume = newVolume;
//             }
//           }}
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


import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "../AudioContext"; // Import context
import {
  PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon,
  RepeatIcon, ShuffleIcon, VolumeIcon
} from "lucide-react";

const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay } = useAudio();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    audio.pause();
    audio.src = currentSong.audioUrl;
    audio.volume = volume;
    audio.load();

    const updateMetadata = () => setDuration(audio.duration || 0);
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("loadedmetadata", updateMetadata);
    audio.addEventListener("timeupdate", updateProgress);

    if (isPlaying) {
      audio.play();
    }

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateMetadata);
    };
  }, [currentSong, isPlaying]);

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    togglePlay();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center text-white">
      <audio ref={audioRef} />
      <div className="w-1/4 flex items-center gap-3">
        <img src={currentSong.cover} alt={currentSong.title} className="h-12 w-12 rounded object-cover" />
        <div>
          <h4 className="text-sm font-medium">{currentSong.title}</h4>
          <p className="text-xs text-gray-400">{currentSong.artist}</p>
        </div>
      </div>
      <div className="w-2/4 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleTogglePlay} className="h-10 w-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center hover:bg-[#1ed760] transition">
            {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
        </div>
        <div className="w-full mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-[#282828] rounded-full cursor-pointer">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
