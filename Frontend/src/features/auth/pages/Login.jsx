import React, { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/**
 * Premium Login Page — Snitch Clothing Platform
 * Desktop-first split layout with responsive collapse to single column on mobile.
 * Theme: Aurelian Noir — Golden Yellow (#F59E0B) on Deep Dark (#0D0D0D).
 */
const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("LOGIN PAYLOAD:", formData);
      const user = await handleLogin(formData);
      if(user.role == "buyer"){
        navigate("/");
      } else if (user.role == "seller"){
        navigate("/seller/dashboard")
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] font-['Inter'] relative overflow-hidden flex flex-col lg:flex-row">

      {/* ── Ambient background glows ── */}
      <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-[#F59E0B]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[40%] h-[40%] bg-[#F59E0B]/3 blur-[120px] rounded-full pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════════════
          LEFT PANEL — Brand / Hero (hidden on mobile, visible on lg+)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative items-center justify-center overflow-hidden">

        {/* Large golden accent circle */}
        <div className="absolute w-[500px] h-[500px] xl:w-[600px] xl:h-[600px] rounded-full bg-[#F59E0B]/[0.04] border border-[#F59E0B]/10" />
        <div className="absolute w-[300px] h-[300px] xl:w-[380px] xl:h-[380px] rounded-full bg-[#F59E0B]/[0.06] border border-[#F59E0B]/[0.08]" />

        {/* Brand content */}
        <div className="relative z-10 px-16 xl:px-24 max-w-xl">
          <div className="mb-10">
            <h1 className="text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              SNITCH
            </h1>
            <div className="w-16 h-1 bg-[#F59E0B] mt-4 rounded-full" />
          </div>

          <p className="text-white/60 text-lg xl:text-xl font-light leading-relaxed mb-12">
            Welcome back to the elite. Premium fashion curated for your unique style journey.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-10 text-[#D8C3AD]/30">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-[#F59E0B]">50K+</span>
              <span className="text-[10px] tracking-[0.15em] uppercase mt-1">Styles</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-[#F59E0B]">1M+</span>
              <span className="text-[10px] tracking-[0.15em] uppercase mt-1">Customers</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-semibold text-[#F59E0B]">4.8★</span>
              <span className="text-[10px] tracking-[0.15em] uppercase mt-1">Rating</span>
            </div>
          </div>
        </div>

        {/* Vertical separator line */}
        <div className="absolute right-0 top-[15%] h-[70%] w-[1px] bg-gradient-to-b from-transparent via-[#F59E0B]/15 to-transparent" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
          ════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-20">
        <div className="w-full max-w-md lg:max-w-lg">

          {/* Mobile-only brand header (hidden on desktop) */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white">SNITCH</h1>
            <div className="w-10 h-0.5 bg-[#F59E0B] mx-auto mt-3 rounded-full" />
          </div>

          {/* Form card */}
          <div className="bg-[#1C1B1B]/30 backdrop-blur-2xl border border-white/[0.04] rounded-3xl lg:rounded-[2rem] p-8 sm:p-10 lg:p-12 xl:p-14 relative overflow-hidden shadow-2xl">
            
            {/* Top reflective edge */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />

            <div className="relative z-10">
              {/* Header */}
              <header className="mb-10 lg:mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light tracking-tight text-white mb-3 leading-tight">
                  Welcome <span className="font-semibold text-[#F59E0B]">Back</span>
                </h2>
                <p className="text-[#D8C3AD]/40 text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase">
                  Sign in to your Snitch account
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
                <div className="space-y-5 lg:space-y-6">

                  {/* Email */}
                  <div className="border-b border-[#534434]/25 focus-within:border-[#F59E0B] transition-all duration-500">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full bg-transparent py-3.5 lg:py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-base lg:text-lg font-light tracking-wide"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Password */}
                  <div className="border-b border-[#534434]/25 focus-within:border-[#F59E0B] transition-all duration-500">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full bg-transparent py-3.5 lg:py-4 text-white placeholder-[#D8C3AD]/20 outline-none text-base lg:text-lg font-light tracking-wide"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 lg:pt-6">
                  <button
                    type="submit"
                    className="w-full overflow-hidden relative group bg-[#F59E0B] text-[#472A00] py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg tracking-[0.1em] uppercase hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all duration-300"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <ContinueWithGoogle />
                </div>

                {/* Footer */}
                <footer className="text-center pt-2">
                  <p className="text-[#D8C3AD]/25 text-[10px] lg:text-xs tracking-widest font-light">
                    FORGOT YOUR PASSWORD?{" "}
                    <span className="text-[#F59E0B]/40 hover:text-[#F59E0B] cursor-pointer transition-colors duration-300">
                      RESET HERE
                    </span>
                  </p>
                </footer>
              </form>
            </div>
          </div>

          {/* Register link below card */}
          <p className="text-center mt-8 text-[#D8C3AD]/30 text-sm font-light">
            Don't have an account?{" "}
            <span 
                onClick={() => navigate("/register")}
                className="text-[#F59E0B]/70 hover:text-[#F59E0B] cursor-pointer transition-colors duration-300 font-medium"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
