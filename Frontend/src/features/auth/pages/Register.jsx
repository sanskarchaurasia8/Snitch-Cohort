import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";

/**
 * Premium Registration Page
 * Designed with Aurelian Noir theme: Golden Yellow accents on Deep Dark background.
 * Focuses on minimalism, ample breathing space, and high-end glassmorphism.
 */
const Register = () => {
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(formData);
      // Success handling is usually managed within the hook or via navigation
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 font-['Inter'] relative overflow-hidden">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#F59E0B]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/3 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Main Registration Card */}
      <div className="w-full max-w-lg bg-[#1C1B1B]/40 backdrop-blur-3xl border border-white/5 p-10 md:p-14 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        {/* Subtle top reflective edge */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
        
        <div className="relative z-10">
          <header className="mb-14 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-4">
              Begin your <span className="font-semibold text-[#F59E0B]">Journey</span>
            </h2>
            <p className="text-[#D8C3AD]/50 text-xs md:text-sm font-medium tracking-[0.2em] uppercase">
              Exclusive Access to Snitch Premium
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="group border-b border-[#534434]/30 focus-within:border-[#F59E0B] transition-all duration-500">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full bg-transparent py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-lg font-light tracking-wide lg:text-xl"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Contact Number Field */}
              <div className="group border-b border-[#534434]/30 focus-within:border-[#F59E0B] transition-all duration-500">
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  required
                  placeholder="Contact Number"
                  className="w-full bg-transparent py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-lg font-light tracking-wide lg:text-xl"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              {/* Email Address Field */}
              <div className="group border-b border-[#534434]/30 focus-within:border-[#F59E0B] transition-all duration-500">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-transparent py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-lg font-light tracking-wide lg:text-xl"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="group border-b border-[#534434]/30 focus-within:border-[#F59E0B] transition-all duration-500">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full bg-transparent py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-lg font-light tracking-wide lg:text-xl"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* isSeller Lifestyle Toggle */}
              <div className="flex items-center justify-between py-6 group">
                <div className="flex flex-col">
                  <span className="text-white/90 text-base font-medium tracking-wide">Are you a seller?</span>
                  <span className="text-[#D8C3AD]/40 text-xs">Register as a business partner</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    name="isSeller"
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isSeller}
                    onChange={handleChange}
                  />
                  <div className="w-14 h-7 bg-white/5 rounded-full border border-white/5 peer peer-focus:ring-1 peer-focus:ring-[#F59E0B]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-[#D8C3AD]/40 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B] peer-checked:after:bg-white animate-all duration-300"></div>
                </label>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                className="w-full overflow-hidden relative group bg-[#F59E0B] text-[#472A00] py-5 rounded-2xl font-bold text-lg tracking-[0.1em] uppercase hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all duration-300"
              >
                <span className="relative z-10">Create Account</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
            
            <footer className="text-center">
              <p className="text-[#D8C3AD]/30 text-xs tracking-widest font-light">
                BY PROCEEDING, YOU AGREE TO OUR <span className="text-[#F59E0B]/50 hover:text-[#F59E0B] cursor-pointer transition-colors duration-300">PRIVACY POLICY</span>
              </p>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;