import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get user ID from localStorage
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

    useEffect(() => {
        if (!userId) {
            navigate("/login");
        }
    }, [userId, navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        // Client-side validation
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError("Vui lòng điền đầy đủ các trường mật khẩu.");
            setIsLoading(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setIsLoading(false);
            return;
        }
        if (newPassword.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
            setIsLoading(false);
            return;
        }

        try {
            console.log("Sending password update request:", { current_password: currentPassword, new_password: newPassword });
            await axios.post(
                `http://localhost:8000/api/change-password/${userId}/`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_new_password: confirmNewPassword, // Backend ignores this
                }
            );
            setSuccess("Đổi mật khẩu thành công!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            localStorage.removeItem("user");
            navigate("/login");

        } catch (err: any) {
            console.error("Password update error:", err.response?.data);
            const errorMessage =
                err.response?.data?.error ||
                "Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="p-6 bg-[#121212] text-white min-h-screen">
            <div className="max-w-4xl mx-auto bg-[#181818] p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#282828] text-white border border-[#383838] rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] transition-all"
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#282828] text-white border border-[#383838] rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] transition-all"
                            placeholder="Nhập mật khẩu mới"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#282828] text-white border border-[#383838] rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] transition-all"
                            placeholder="Xác nhận mật khẩu mới"
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 py-3 bg-[#1DB954] text-black font-semibold rounded-full hover:bg-[#1ED760] transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? "Đang lưu..." : "Lưu"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCurrentPassword("");
                                setNewPassword("");
                                setConfirmNewPassword("");
                                setError(null);
                                setSuccess(null);
                            }}
                            className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-500 transition-all"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserChangePassword;