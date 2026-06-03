import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import bgDesktop from "../assets/images/t_pages_register_destop_bg.png";
import bgMobile from "../assets/images/t_pages_register_mobile_bg.png";
import imgRegisterDesktop from "../assets/images/t_pages_register_desktop_texi.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: ''
  });
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, userAnswer: '' });
  const [errors, setErrors] = useState({});

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ควบคุมสถานะ Loading

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1: n1, num2: n2, userAnswer: '' });
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userAnswer') {
      setCaptcha({ ...captcha, userAnswer: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Please enter your email!!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format (e.g. name@mail.com)";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password!!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!!";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match!!";
    }

    if (parseInt(captcha.userAnswer) !== captcha.num1 + captcha.num2) {
      newErrors.userAnswer = "Incorrect answer!!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // เริ่มโหลดและล็อคปุ่ม
    setIsLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

    try {
      const emailCheckRes = await fetch(`${API_URL}/api/users/check-email?email=${formData.email}`);
      const emailCheck = await emailCheckRes.json();
      
      if (emailCheck.exists) {
        setErrors({ ...errors, email: "Email already in use" });
        generateCaptcha(); // รีเฟรช CAPTCHA เมื่ออีเมลซ้ำ
        return;
      }

      const registerRes = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setErrors({ ...errors, email: registerData.message || 'Something went wrong' });
        generateCaptcha(); // รีเฟรช CAPTCHA เมื่อ Backend ส่ง Error แจ้งเตือนกลับมา
        return;
      }

      setIsSuccess(true);

    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ ...errors, email: "Failed to connect to the server" });
      generateCaptcha(); // รีเฟรช CAPTCHA เมื่อเชื่อมต่อเซิร์ฟเวอร์ไม่ได้
    } finally {
      // ปลดล็อคปุ่มเสมอ
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat md:bg-[url('/path-to-your-desktop-bg.png')] bg-[url('/path-to-your-mobile-bg.png')]">
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-500"
        style={{ 
          backgroundImage: `url(${windowWidth >= 768 ? bgDesktop : bgMobile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      />  

      <div className="scale-80 relative z-10 bg-[#8b84d7]/60 w-full max-w-[400px] md:max-w-[1096px] min-h-[500px] md:min-h-[688px] h-auto rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 mx-auto py-10 px-6 md:p-0">
        
        <div className="hidden md:block w-1/2 p-6">
          <img 
            src={imgRegisterDesktop} 
            alt="Taxi" 
            className="w-full h-full object-cover rounded-[30px]"
          />
        </div>

        <div className="w-full md:w-1/2 p-0 md:p-10 flex flex-col justify-center text-white">
          <h2 className="!text-[48px] !font-bold !text-center mb-8 md:mb-10 !text-[#ffffff] mx-auto mt-0 -translate-y-5 md:-translate-y-5">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="relative pb-2">
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email address!!" 
                disabled={isLoading}
                className={`w-full px-6 py-3 md:py-3.5 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.email ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm transition-all duration-300 mt-0 translate-y-2 md:translate-y-2 whitespace-nowrap leading-tight">{errors.email}</p>}
            </div>

            <div className="relative pb-2">
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                disabled={isLoading}
                className={`w-full px-6 py-3 md:py-3.5 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.password ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
                value={formData.password} 
                onChange={handleChange} 
              />
              {errors.password && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm transition-all duration-300 mt-0 translate-y-2 md:translate-y-2 whitespace-nowrap leading-tight ">{errors.password}</p>}
            </div>

            <div className="relative pb-2">
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Enter password confirmation" 
                disabled={isLoading}
                className={`w-full px-6 py-3 md:py-3.5 rounded-full bg-[#a9a4e4] placeholder-white/80 text-white border-2 outline-none focus:ring-4 focus:ring-white/50 text-sm shadow-lg ${errors.confirmPassword ? 'border-red-500' : 'border-white'} ${isLoading ? 'opacity-50' : ''}`}
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
              {errors.confirmPassword && <p className="absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm transition-all duration-300 mt-0 translate-y-2 md:translate-y-2 whitespace-nowrap leading-tight">{errors.confirmPassword}</p>}
            </div>

            <div className="relative pb-2">
              <div className={`flex items-center justify-center gap-3 bg-[#1e1a3d]/70 p-2.5 rounded-full border-2 ${errors.userAnswer ? 'border-red-500' : 'border-transparent'}`}>
                <span className="bg-[#1e1a3d] px-4 py-1 rounded-full font-bold text-sm">
                  {captcha.num1} + {captcha.num2} =
                </span>
                <input
                  type="number" name="userAnswer" placeholder="?"
                  disabled={isLoading}
                  className={`w-16 p-2 rounded-lg bg-white text-[#1e1a3d] text-center font-bold outline-none ${isLoading ? 'opacity-50' : ''}`}
                  value={captcha.userAnswer} onChange={handleChange}
                />
              </div>
              {errors.userAnswer && <p className=" absolute left-1/2 -translate-x-1/2 -bottom-1 z-20 px-3 py-0 text-[14px] font-bold text-red-600 bg-white rounded-md border border-red-200 shadow-sm transition-all duration-300 mt-0 translate-y-2 md:translate-y-2 whitespace-nowrap leading-tight ">{errors.userAnswer}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 mt-4 text-white text-xl font-bold rounded-full shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2 
                ${isLoading 
                  ? 'bg-[#1e1a3d]/50 cursor-not-allowed' 
                  : 'bg-[#1e1a3d] hover:bg-[#2d2859] hover:brightness-150' 
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Create an account'
              )}
            </button>
          </form>

          <p className="text-center text-xs md:text-sm mx-auto mt-0 translate-y-5 md:translate-y-2.5">
            Already have one? <Link to="/login" className="font-extrabold underline hover:text-white">Login</Link>
          </p>
        </div>
      </div>

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#7b74c4] border border-white/20 p-8 rounded-[32px] w-full max-w-[400px] text-center shadow-2xl mx-4 transform scale-100 transition-all duration-300">
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-500/30">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 -translate-y-3 md:-translate-y-3">
              Registration Successful!
            </h3>
            <p className="text-white/80 text-sm mb-6 -translate-y-3.5 md:-translate-y-3.5">
              Your account has been created successfully.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#1e1a3d] hover:bg-[#2d2859] hover:brightness-120 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 text-base"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Register;