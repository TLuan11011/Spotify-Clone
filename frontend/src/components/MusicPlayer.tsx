import React, { useState, useEffect, useCallback, useRef} from "react";
import { useAudio } from "../AudioContext";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  RepeatIcon,
  ShuffleIcon,
  VolumeIcon,
  ClockIcon,
  MicIcon,
} from "lucide-react";
import SleepTimer from "./SleepTimer";
import LyricsModal from "./LyricsModal";
import Playvideo from "./Playvideo";

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
  const [originalSongList, setOriginalSongList] = useState<typeof songList>([]);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showLyric, setShowLyric] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Khởi tạo originalSongList khi songList thay đổi
  useEffect(() => {
    if (songList.length > 0 && originalSongList.length === 0) {
      setOriginalSongList(songList);
    }
  }, [songList, originalSongList]);

  // Lưu âm lượng vào localStorage và cập nhật audio (chỉ cho audio)
  useEffect(() => {
    if (currentSong?.song_url.endsWith(".mp4")) return;
    localStorage.setItem("volume", volume.toString());
    const audio = document.querySelector("audio");
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, currentSong]);

  // Xử lý khi bài hát kết thúc (chỉ cho audio)
  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio || currentSong?.song_url.endsWith(".mp4")) {
      return;
    }

    const handleEnded = () => {
      if (repeatMode === "one") {
        seek(0);
        audio.play().catch((err) => console.error("Error replaying song:", err));
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

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, repeatMode, songList, playNext, seek, togglePlayPause]);

  // Đếm ngược thời gian hẹn giờ
  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | null = null;
  //   if (timerRemaining !== null && timerRemaining > 0) {
  //     intervalId = setInterval(() => {
  //       setTimerRemaining((prev) => (prev !== null ? prev - 1 : prev));
  //     }, 1000);
  //   } else if (timerRemaining === 0) {
  //     togglePlayPause();
  //     setTimerRemaining(null);
  //   }
  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [timerRemaining, togglePlayPause]);

  useEffect(() => {
    if (timerRemaining !== null && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            togglePlayPause();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => {
      if (timerRef.current && timerRemaining === null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerRemaining, togglePlayPause]);

  const handleTimerSet = (minutes: number) => {
    setTimerRemaining(minutes * 60);
  };

  const handleTimerStop = () => {
    setTimerRemaining(null);
  };

  const handleShuffle = useCallback(() => {
    if (!isShuffled) {
      setOriginalSongList([...songList]);
      const shuffledList = [...songList].sort(() => Math.random() - 0.5);
      setSongList(shuffledList);
      setIsShuffled(true);
    } else {
      setSongList([...originalSongList]);
      setIsShuffled(false);
    }
  }, [isShuffled, songList, originalSongList, setSongList]);

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
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const formatTimer = (seconds: number | null) => {
    if (seconds === null) return "";
    return formatTime(seconds);
  };

  if (!currentSong) return null;

  if (currentSong.song_url.endsWith(".mp4")) {
    return (
      <Playvideo
        songId={currentSong.id}
        onClose={() => {
          togglePlayPause();
          playNext();
        }}
      />
    );
  }

  return (
    <div className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center text-white relative">
      {/* Thông tin bài hát */}
      <div className="w-1/4 flex items-center gap-3">
        <img
          src={currentSong.image_url || "/default-cover.png"}
          alt={currentSong.name}
          className="h-12 w-12 rounded object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/default-cover.png";
          }}
        />
        <div>
          <h4 className="text-sm font-medium truncate max-w-[150px]">
            {currentSong.name}
          </h4>
          <p className="text-xs text-gray-400 truncate max-w-[150px]">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Điều khiển phát nhạc */}
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
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 h-1 bg-[#282828] rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Điều khiển âm lượng và hẹn giờ */}
      <div className="w-1/4 flex justify-end items-center gap-2">
        <button
          onClick={() => setShowLyric(true)}
          className="text-gray-400 hover:text-white transition"
        >
          <MicIcon size={18} />
        </button>
        <button
          onClick={() => setShowSleepTimer(true)}
          className="text-gray-400 hover:text-white transition"
        >
          <ClockIcon size={18} />
        </button>
        {timerRemaining !== null && (
          <span className="text-xs text-gray-400">
            {formatTimer(timerRemaining)}
          </span>
        )}
        <div className="flex items-center gap-3">
          <VolumeIcon size={16} className="text-gray-400" />
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

      {showSleepTimer && (
        <SleepTimer
          onClose={() => setShowSleepTimer(false)}
          onTimerSet={handleTimerSet}
          onTimerStop={handleTimerStop}
        />
      )}

      {showLyric && (
        <LyricsModal
          songId={currentSong.id}
          onClose={() => setShowLyric(false)}
        />
      )}
    </div>
  );
};

export default MusicPlayer;