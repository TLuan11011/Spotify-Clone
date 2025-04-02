// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { PlayIcon, Clock3Icon } from "lucide-react";
// // import getSong from '../services/api.js'

// // export default function AllSongs() {

// //   const [songs, setSongs] = useState<Song[]>([]);

// //   useEffect(() => {
// //     axios
// //       .get("http://127.0.0.1:8000/api/songs/")
// //       .then((response) => {
// //         console.log("API response:", response.data); // Debugging log
// //         setSongs(response.data);
// //       })
// //       .catch((error) => {
// //         console.error("Error fetching data: ", error);
// //       });
// //   }, []);

// //   return (
// //     <div>
// //       <div className="flex items-center justify-between mb-8">
// //         <div>
// //           <h1 className="text-3xl font-bold mb-2">All Songs</h1>
// //         </div>
// //         <button className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 hover:bg-gray-700">
// //           <PlayIcon size={18} />
// //           Play All
// //         </button>
// //       </div>
// //       <div className="bg-gray-800 rounded-lg overflow-hidden">
// //         <table className="w-full">
// //           <thead className="bg-black text-left">
// //             <tr>
// //               <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
// //                 #
// //               </th>
// //               <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Title
// //               </th>
// //               <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Artist
// //               </th>
// //               <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Album
// //               </th>
// //               <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 <Clock3Icon size={14} />
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="divide-y divide-gray-100">
// //             {songs.map((song, index) => (
// //               <tr key={song.id}>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {index + 1}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {song.title}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {song.artist}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {song.album}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {song.duration}
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }


import { useEffect, useState } from "react";
import axios from "axios";
import { PlayIcon, Clock3Icon, HardDriveDownload } from "lucide-react";
import { useAudio } from "../AudioContext"; // Import context

//ĐỊnh nghĩa cho SongSong
type Song = {
  id: number;
  name: string;
  artist: string;
  album: string | null;  // Có thể null
  duration: number;
  cover: string;         // Add missing property
  title: string;         // Add missing property
  audioUrl: string;      // Add missing property
};

export default function AllSongs() {
  const [songs, setSongs] = useState<Song[]>([]); // Bỏ kiểu dữ liệu TypeScript
  const { handlePlaySong } = useAudio();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/songs/")  // Kiểm tra URL API có đúng không
      .then((response) => {
        console.log("API response:", response.data); // Debugging log
        setSongs(response.data);
        console.log("Hien ra song ne: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Songs</h1>
        </div>
        <button className="px-6 py-2 bg-gray-800 text-white rounded-full flex items-center gap-2 hover:bg-gray-700">
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
                Artist
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Album
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Clock3Icon size={14} />
              </th>
              <th 
                style={{ width: "8%"}}
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {song.name} {/* Đổi từ song.title thành song.name */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {song.artist}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {song.album || "N/A"} {/* Xử lý trường hợp album có thể rỗng */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(song.duration)}
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center items-center">
                    <HardDriveDownload size={16} className="hover:bg-[#121212]"/>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No songs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Hàm chuyển đổi thời gian từ giây sang phút:giây (ví dụ: 240s -> 4:00)
function formatDuration(seconds:number): String {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { PlayIcon, Clock3Icon } from "lucide-react";
// import { useAudio } from "../AudioContext";

// type Song = {
//   id: number;
//   title: string;
//   artist: string;
//   album: string | null;
//   duration: number;
//   cover: string;
//   audioUrl: string;
// };

// export default function AllSongs() {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const { handlePlaySong } = useAudio();

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/songs/")
//       .then((response) => setSongs(response.data))
//       .catch((error) => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">All Songs</h1>
//       <div className="bg-[#181818] rounded-lg overflow-hidden">
//         <table className="w-full">
//           <tbody>
//             {songs.map((song, index) => (
//               <tr key={song.id} className="hover:bg-[#282828] cursor-pointer" onClick={() => handlePlaySong(song)}>
//                 <td className="px-6 py-4">{index + 1}</td>
//                 <td className="px-6 py-4">{song.title}</td>
//                 <td className="px-6 py-4">{song.artist}</td>
//                 <td className="px-6 py-4">{formatDuration(song.duration)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function formatDuration(seconds: number): string {
//   return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
// }
