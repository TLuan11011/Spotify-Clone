import React, { useState, useRef, useEffect } from "react";

interface PlayvideoProps {
    songId: number;
    onClose: () => void;
}

const Playvideo: React.FC<PlayvideoProps> = ({ songId, onClose }) => {
    const [songData, setSongData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchSongData = async () => {
        try {
            const baseUrl = "http://localhost:8000/";
            const response = await fetch(`${baseUrl}api/songs/${songId}/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            });

            if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const lyricsArray = data.lyrics
            ? data.lyrics.split(".").filter((line: string) => line.trim() !== "")
            : [];
            const processedLyrics = lyricsArray.map((line: string, index: number) => ({
            text: line.trim(),
            time: 0,
            }));

            setSongData({
            songUrl: data.song_url,
            lyrics: processedLyrics,
            });
        } catch (err: any) {
            console.error("API Error:", err.message);
            setError(err.message);
        }
        };

        fetchSongData();
    }, [songId]);

    const toggleFullScreen = () => {
        if (!modalRef.current) return;

        if (!isFullScreen) {
        modalRef.current.requestFullscreen();
        setIsFullScreen(true);
        } else {
        document.exitFullscreen();
        setIsFullScreen(false);
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => {
        document.removeEventListener("fullscreenchange", handleFullScreenChange);
        };
    }, []);

    if (!songData) {
        return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-[#121212] bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white">
            <p className="text-[#B3B3B3] text-center">Loading...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 font-sans">
        <div
            ref={modalRef}
            className="bg-[#121212] bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex transition-all duration-300"
        >
            {/* Video Player - Sử dụng controls mặc định */}
            <div className="w-1/2 p-6 flex flex-col">
            <div className="relative flex-1">
                <video
                ref={videoRef}
                src={`http://localhost:8000/audio/${songData.songUrl}`}
                className="h-full w-full object-cover rounded-xl border border-[#2A2A2A] shadow-lg"
                controls
                playsInline
                />
            </div>
            </div>

            {/* Lyrics */}
            <div className="w-1/2 p-8 flex flex-col text-white">
            <div className="flex justify-end items-center border-b border-[#2A2A2A] pb-3">
                <div className="flex space-x-4">
                <button
                    onClick={toggleFullScreen}
                    className="text-[#B3B3B3] hover:text-[#1DB954] transition-transform duration-300 transform hover:scale-110"
                >
                    {isFullScreen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4h4M4 16v4h4M16 4h4v4M16 20h4v-4"
                        />
                    </svg>
                    ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4h4M4 16v4h4M16 4h4v4M16 20h4v-4"
                        />
                    </svg>
                    )}
                </button>
                <button
                    onClick={onClose}
                    className="text-[#B3B3B3] hover:text-[#1DB954] transition-transform duration-300 transform hover:scale-110"
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                </div>
            </div>
            <div className="flex-1 max-h-96 overflow-y-auto my-6 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent">
                {songData.lyrics.length > 0 ? (
                songData.lyrics.map((line: any, index: number) => (
                    <div
                    key={index}
                    className="text-center my-5 text-lg tracking-wide text-white"
                    >
                    {line.text}
                    </div>
                ))
                ) : (
                <div className="text-center my-5 text-lg tracking-wide text-[#B3B3B3]">
                    Lời bài hát chưa được cập nhật
                </div>
                )}
            </div>
            {error && (
                <p className="text-red-400 text-center text-sm mt-3">
                {error} (Using fallback data)
                </p>
            )}
            </div>
        </div>
        </div>
    );
    };

export default Playvideo;