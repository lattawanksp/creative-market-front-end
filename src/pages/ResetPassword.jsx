import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 

import bgDesktop from "../assets/images/t_pages_login_destop_bg.jpg"; 
import bgMobile from "../assets/images/t_pages_login_moble_bg.png"; 

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); 
  
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    if (token) {
      setTokenInput(token); 
    }
  }, [token]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    
    let newErrors = {};

    if (!tokenInput.trim()) newErrors.token = 'Please provide a reset token!';
    if (!newPassword) newErrors.newPassword = 'Password cannot be empty!';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters!';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:7777";
      const apiUrl = `${apiBaseUrl}/api/auth/reset-password`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          token: tokenInput, 
          password: newPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/login'); 
      }, 3000);

    } catch (err) {
      console.error("Reset Password Error:", err);
      setErrors({ token: err.message || 'Token ไม่ถูกต้อง หรือหมดอายุแล้ว' });
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
      <div className="scale-85 md:scale-75 relative z-10 bg-[#7b74c4]/60 backdrop-blur-md w-full max-w-[540px] h-auto min-h-[500px] md:min-h-[550px] rounded-[40px] shadow-2xl p-8 md:p-10 border border-white/20 mx-6 -translate-y-10 md:-translate-y-15">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h2>
        <p className="text-white/80 text-sm mb-6 text-left pl-2">
          กรุณากรอกรหัสผ่านใหม่ของคุณ ระบบจะทำการบันทึกเพื่อใช้ในการเข้าสู่ระบบครั้งต่อไป
        </p>
        
        <form onSubmit={handleResetPassword} className="space-y-4 text-left relative z-20">
          <div className={`relative transition-all duration-300 ${errors.token ? 'pb-5' : 'pb-0'}`}>
            <label className="block text-white text-[15px] font-medium mb-1 pl-4 opacity-90">Reset Token</label>
            <input 
              type="text" 
              placeholder="Paste your token here..." 
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.token ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
              value={tokenInput} 
              onChange={(e) => {
                setTokenInput(e.target.value);
                if (errors.token) setErrors({ ...errors, token: null });
              }} 
            />
            {errors.token && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm whitespace-nowrap">{errors.token}</p>}
          </div>

          <div className={`relative transition-all duration-300 ${errors.newPassword ? 'pb-5' : 'pb-0'}`}>
            <label className="block text-white text-[15px] font-medium mb-1 pl-4 opacity-90">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.newPassword ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
              value={newPassword} 
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors({ ...errors, newPassword: null });
              }} 
            />
            {errors.newPassword && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm whitespace-nowrap">{errors.newPassword}</p>}
          </div>

          <div className={`relative transition-all duration-300 ${errors.confirmPassword ? 'pb-5' : 'pb-0'}`}>
            <label className="block text-white text-[15px] font-medium mb-1 pl-4 opacity-90">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.confirmPassword ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
              value={confirmPassword} 
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }} 
            />
            {errors.confirmPassword && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm whitespace-nowrap">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-[#1e1a3d] hover:bg-[#2d2859] hover:brightness-150 text-white text-lg font-bold rounded-full shadow-xl transition-all active:scale-95 flex justify-center items-center"
          >
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#7b74c4] border border-white/20 p-8 rounded-[32px] w-full max-w-[400px] text-center shadow-2xl mx-4 animate-bounce">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-500/30">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Reset Successful!</h3>
            <p className="text-white/80 text-sm font-medium leading-relaxed">
              รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว<br/>กำลังพากลับไปหน้าเข้าสู่ระบบ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;