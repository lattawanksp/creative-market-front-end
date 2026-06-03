import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bgDesktop from "../assets/images/j-login-bg.jpg";
import bgMobile from "../assets/images/j-login-bg.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address!!");
      return;
    }

    setIsLoading(true);

    try {
      // ดึง URL จาก Environment Variable (หรือใช้ localhost เป็นตัวสำรอง)
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";
      const apiUrl = `${apiBaseUrl}/api/auth/forgot-password`;

      // ยิง API ไปที่ Backend
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการส่งข้อมูล");
      }

      setSuccessMessage(
        "ระบบได้ส่งลิงก์กู้คืนรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว กรุณาเช็คที่กล่องข้อความของคุณครับ"
      );
    } catch (err) {
      console.error("FAILED...", err);
      setError(err.message || "เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url(${windowWidth >= 768 ? bgDesktop : bgMobile})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="scale-90 md:scale-100 relative z-10 bg-[#7b74c4]/60 backdrop-blur-md w-full max-w-[540px] h-auto min-h-[300px] md:min-h-[300px] rounded-[40px] shadow-2xl p-8 md:p-10 text-center border border-white/20 mx-6 -translate-y-10 md:-translate-y-12">
        <h2 className="text-3xl font-bold text-white mb-6 -translate-y-0 md:-translate-y-2.5">
          Forgot Password
        </h2>

        {successMessage ? (
          <div className="scale-110 md:scale-110 text-left bg-green-500/20 border border-green-500/40 p-4 rounded-xl text-white space-y-4">
            <p className="text-sm font-medium">{successMessage}</p>
            <p className="text-sm text-white/70">
              *ไปเปิดอีเมลแล้วคลิกลิงก์เพื่อตั้งรหัสผ่านใหม่ได้เลยครับ
            </p>
          </div>
        ) : (
          <>
            <p className="text-white/80 text-sm mb-6 text-left pl-2 translate-y-5 md:translate-y-1.5">
              กรอกอีเมลของคุณ
              ระบบจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้ทางอีเมลจริงครับ
            </p>

            <form onSubmit={handleRequestToken} className="space-y-4 text-left">
              <label className="block text-white text-lg font-medium mb-1 pl-4 opacity-90 translate-y-7 md:translate-y-3.5">
                Enter your email
              </label>
              <div
                className={`relative transition-all duration-300 ${error ? "pb-5" : "pb-0"}`}
              >
                <input
                  type="email"
                  placeholder="name@mail.com"
                  disabled={isLoading}
                  className={`w-full px-6 py-3 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg translate-y-8 md:translate-y-5 ${error ? "border-red-500" : "border-white"} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                />
                {error && (
                  <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm whitespace-nowrap translate-y-15 md:translate-y-7.5">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-[#1e1a3d] hover:bg-[#2d2859] hover:brightness-150 text-white text-lg font-bold rounded-full shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 translate-y-7.5 md:translate-y-5"
              >
                {isLoading ? "กำลังส่งอีเมล..." : "Request Reset Link"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-sm text-white/90 translate-y-5 md:translate-y-2.5">
          <p>
            Remember your password?{" "}
            <span
              className="font-extrabold underline cursor-pointer hover:text-white "
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;